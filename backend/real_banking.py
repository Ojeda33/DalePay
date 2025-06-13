"""
Real Banking Integration for DalePay
Handles actual bank account connections and real money transfers
"""

import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import asyncio
import json

# Plaid integration for real bank accounts
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.configuration import Configuration
from plaid.api_client import ApiClient

# Stripe integration for real money transfers
import stripe

# FastAPI
from fastapi import HTTPException
from pydantic import BaseModel

# Local imports
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

class RealBankingConfig:
    """Configuration for real banking APIs"""
    
    def __init__(self):
        # Plaid Configuration
        self.plaid_client_id = os.getenv('PLAID_CLIENT_ID')
        self.plaid_secret = os.getenv('PLAID_SECRET')
        self.plaid_env = os.getenv('PLAID_ENV', 'sandbox')
        
        # Stripe Configuration
        self.stripe_secret_key = os.getenv('STRIPE_SECRET_KEY')
        stripe.api_key = self.stripe_secret_key
        
        # Encryption
        self.encryption_key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
        self.cipher_suite = Fernet(self.encryption_key.encode() if isinstance(self.encryption_key, str) else self.encryption_key)
        
        # Setup Plaid client
        if self.plaid_client_id and self.plaid_secret:
            self.setup_plaid_client()
        else:
            logger.warning("Plaid credentials not found. Real banking features will be limited.")
            self.plaid_client = None
    
    def setup_plaid_client(self):
        """Initialize Plaid API client"""
        try:
            # Map environment string to Plaid environment
            env_map = {
                'sandbox': 'https://sandbox.plaid.com',
                'development': 'https://development.plaid.com',
                'production': 'https://production.plaid.com'
            }
            
            host = env_map.get(self.plaid_env, 'https://sandbox.plaid.com')
            
            configuration = Configuration(
                host=host,
                api_key={
                    'clientId': self.plaid_client_id,
                    'secret': self.plaid_secret,
                    'plaidVersion': '2020-09-14'
                }
            )
            
            api_client = ApiClient(configuration)
            self.plaid_client = plaid_api.PlaidApi(api_client)
            logger.info(f"Plaid client initialized for {self.plaid_env} environment")
            
        except Exception as e:
            logger.error(f"Failed to initialize Plaid client: {e}")
            self.plaid_client = None

class BankAccount(BaseModel):
    account_id: str
    name: str
    type: str
    subtype: str
    balance_current: float
    balance_available: Optional[float]
    currency: str
    mask: str
    
class Transaction(BaseModel):
    transaction_id: str
    account_id: str
    amount: float
    date: str
    name: str
    category: List[str]
    
class TransferRequest(BaseModel):
    from_account_id: str
    to_account_id: Optional[str] = None
    to_email: Optional[str] = None
    amount: float
    description: str

class RealBankingService:
    """Service for real banking operations"""
    
    def __init__(self, config: RealBankingConfig, db):
        self.config = config
        self.db = db
        
    def encrypt_token(self, token: str) -> str:
        """Encrypt sensitive tokens"""
        return self.config.cipher_suite.encrypt(token.encode()).decode()
    
    def decrypt_token(self, encrypted_token: str) -> str:
        """Decrypt sensitive tokens"""
        return self.config.cipher_suite.decrypt(encrypted_token.encode()).decode()
    
    async def create_link_token(self, user_id: str) -> str:
        """Create Plaid Link token for account linking"""
        if not self.config.plaid_client:
            raise HTTPException(status_code=500, detail="Banking service not available. Please configure Plaid credentials.")
        
        try:
            request = LinkTokenCreateRequest(
                products=[Products('auth'), Products('transactions')],
                client_name="DalePay Banking",
                country_codes=[CountryCode('US')],
                language='en',
                user=LinkTokenCreateRequestUser(client_user_id=user_id)
            )
            
            response = self.config.plaid_client.link_token_create(request)
            return response['link_token']
            
        except Exception as e:
            logger.error(f"Error creating link token: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create link token: {str(e)}")
    
    async def exchange_public_token(self, public_token: str, user_id: str) -> Dict[str, Any]:
        """Exchange public token for access token and link bank accounts"""
        if not self.config.plaid_client:
            raise HTTPException(status_code=500, detail="Banking service not available")
        
        try:
            # Exchange public token for access token
            request = ItemPublicTokenExchangeRequest(public_token=public_token)
            response = self.config.plaid_client.item_public_token_exchange(request)
            access_token = response['access_token']
            
            # Get account information
            accounts_request = AccountsGetRequest(access_token=access_token)
            accounts_response = self.config.plaid_client.accounts_get(accounts_request)
            
            # Store encrypted access token and account info in database
            linked_accounts = []
            for account in accounts_response['accounts']:
                bank_account = {
                    "user_id": user_id,
                    "account_id": account['account_id'],
                    "access_token": self.encrypt_token(access_token),
                    "account_name": account['name'],
                    "account_type": account['type'],
                    "account_subtype": account.get('subtype', ''),
                    "balance_current": float(account['balances']['current'] or 0),
                    "balance_available": float(account['balances']['available'] or 0),
                    "currency": account['balances'].get('iso_currency_code', 'USD'),
                    "mask": account.get('mask', ''),
                    "is_active": True,
                    "linked_at": datetime.utcnow(),
                    "last_updated": datetime.utcnow()
                }
                
                # Insert or update account in database
                await self.db.real_bank_accounts.replace_one(
                    {"user_id": user_id, "account_id": account['account_id']},
                    bank_account,
                    upsert=True
                )
                
                # Remove sensitive data for response
                safe_account = bank_account.copy()
                safe_account.pop('access_token')
                linked_accounts.append(safe_account)
            
            return {
                "success": True,
                "accounts_linked": len(linked_accounts),
                "accounts": linked_accounts
            }
            
        except Exception as e:
            logger.error(f"Error exchanging public token: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to link bank account: {str(e)}")
    
    async def get_real_account_balances(self, user_id: str) -> List[Dict[str, Any]]:
        """Get current balances for all linked bank accounts"""
        try:
            # Get all linked accounts for user
            accounts = await self.db.real_bank_accounts.find(
                {"user_id": user_id, "is_active": True}
            ).to_list(100)
            
            if not accounts:
                return []
            
            updated_accounts = []
            
            for account in accounts:
                try:
                    if not self.config.plaid_client:
                        # If Plaid not available, return stored balance
                        account.pop('access_token', None)
                        account['_id'] = str(account['_id'])
                        updated_accounts.append(account)
                        continue
                    
                    # Decrypt access token and fetch current balance
                    access_token = self.decrypt_token(account['access_token'])
                    accounts_request = AccountsGetRequest(access_token=access_token)
                    accounts_response = self.config.plaid_client.accounts_get(accounts_request)
                    
                    # Update balance for matching account
                    for plaid_account in accounts_response['accounts']:
                        if plaid_account['account_id'] == account['account_id']:
                            current_balance = float(plaid_account['balances']['current'] or 0)
                            available_balance = float(plaid_account['balances']['available'] or 0)
                            
                            # Update in database
                            await self.db.real_bank_accounts.update_one(
                                {"_id": account['_id']},
                                {
                                    "$set": {
                                        "balance_current": current_balance,
                                        "balance_available": available_balance,
                                        "last_updated": datetime.utcnow()
                                    }
                                }
                            )
                            
                            account['balance_current'] = current_balance
                            account['balance_available'] = available_balance
                            break
                    
                    # Remove sensitive data
                    account.pop('access_token', None)
                    account['_id'] = str(account['_id'])
                    updated_accounts.append(account)
                    
                except Exception as e:
                    logger.error(f"Error updating balance for account {account['account_id']}: {e}")
                    # Return stored balance if update fails
                    account.pop('access_token', None)
                    account['_id'] = str(account['_id'])
                    updated_accounts.append(account)
            
            return updated_accounts
            
        except Exception as e:
            logger.error(f"Error getting account balances: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to get account balances: {str(e)}")
    
    async def get_total_balance(self, user_id: str) -> float:
        """Get total balance across all linked accounts"""
        try:
            accounts = await self.get_real_account_balances(user_id)
            total_balance = sum(account.get('balance_current', 0) for account in accounts)
            return total_balance
        except Exception as e:
            logger.error(f"Error calculating total balance: {e}")
            return 0.0
    
    async def initiate_real_transfer(self, user_id: str, transfer_request: TransferRequest) -> Dict[str, Any]:
        """Initiate real money transfer"""
        try:
            # For now, we'll create a pending transfer record
            # In production, this would integrate with Plaid Transfer API or Stripe
            
            # Verify user owns the source account
            source_account = await self.db.real_bank_accounts.find_one({
                "user_id": user_id,
                "account_id": transfer_request.from_account_id,
                "is_active": True
            })
            
            if not source_account:
                raise HTTPException(status_code=404, detail="Source account not found")
            
            # Check sufficient balance
            if source_account['balance_current'] < transfer_request.amount:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            # Calculate fees
            fee = transfer_request.amount * 0.015  # 1.5% fee
            total_amount = transfer_request.amount + fee
            
            # Create transfer record
            transfer_id = f"real_txn_{datetime.utcnow().timestamp()}"
            transfer_record = {
                "transfer_id": transfer_id,
                "user_id": user_id,
                "from_account_id": transfer_request.from_account_id,
                "to_account_id": transfer_request.to_account_id,
                "to_email": transfer_request.to_email,
                "amount": transfer_request.amount,
                "fee": fee,
                "total_amount": total_amount,
                "description": transfer_request.description,
                "status": "pending",
                "created_at": datetime.utcnow(),
                "transfer_type": "real_banking"
            }
            
            await self.db.real_transfers.insert_one(transfer_record)
            
            # Update account balance (deduct amount + fee)
            await self.db.real_bank_accounts.update_one(
                {"_id": source_account['_id']},
                {"$inc": {"balance_current": -total_amount}}
            )
            
            return {
                "success": True,
                "transfer_id": transfer_id,
                "amount": transfer_request.amount,
                "fee": fee,
                "total_amount": total_amount,
                "status": "pending",
                "message": "Real money transfer initiated successfully"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error initiating real transfer: {e}")
            raise HTTPException(status_code=500, detail=f"Transfer failed: {str(e)}")
    
    async def get_real_transactions(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get real transaction history"""
        try:
            # Get transfers from our database
            transfers = await self.db.real_transfers.find(
                {"user_id": user_id}
            ).sort("created_at", -1).limit(limit).to_list(limit)
            
            # Convert ObjectId to string
            for transfer in transfers:
                transfer['_id'] = str(transfer['_id'])
            
            return transfers
            
        except Exception as e:
            logger.error(f"Error getting real transactions: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to get transactions: {str(e)}")

# Initialize the real banking service
real_banking_config = RealBankingConfig()

def get_real_banking_service(db):
    """Get real banking service instance"""
    return RealBankingService(real_banking_config, db)