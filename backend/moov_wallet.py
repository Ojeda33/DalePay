"""
DalePay Puerto Rico - Real Money Digital Wallet & POS System
Moov Financial Integration for Real Banking & Payments
"""

import os
import logging
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import asyncio
import json

# Moov Financial SDK
try:
    from moovio_sdk import MoovSDK
    from moovio_sdk.models import Transfer, Account, PaymentMethod
    MOOV_AVAILABLE = True
except ImportError as e:
    print(f"Moov SDK not available: {e}")
    MOOV_AVAILABLE = False

from fastapi import HTTPException
from pydantic import BaseModel
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

class MoovConfig:
    """Moov Financial configuration for real banking"""
    
    def __init__(self):
        self.public_key = os.getenv('MOOV_PUBLIC_KEY')
        self.secret_key = os.getenv('MOOV_SECRET_KEY')
        self.environment = os.getenv('MOOV_ENVIRONMENT', 'sandbox')
        
        # Encryption
        self.encryption_key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
        self.cipher_suite = Fernet(self.encryption_key.encode() if isinstance(self.encryption_key, str) else self.encryption_key)
        
        # Business settings
        self.company_name = os.getenv('COMPANY_NAME', 'DalePay Puerto Rico LLC')
        self.founder_wallet_id = os.getenv('FOUNDER_WALLET_ID', '')
        
        # Fee structure
        self.merchant_fee_percent = float(os.getenv('MERCHANT_POS_FEE_PERCENT', '0.015'))
        self.merchant_fee_fixed = float(os.getenv('MERCHANT_POS_FEE_FIXED', '0.25'))
        
        # Setup Moov client
        if self.public_key and self.secret_key and MOOV_AVAILABLE:
            self.setup_moov_client()
        else:
            logger.warning("Moov credentials not found or SDK not available. Real banking features will be limited.")
            self.moov_client = None
    
    def setup_moov_client(self):
        """Initialize Moov SDK client"""
        try:
            self.moov_client = MoovSDK(
                public_key=self.public_key,
                secret_key=self.secret_key,
                environment=self.environment
            )
            logger.info(f"Moov client initialized for {self.environment} environment")
        except Exception as e:
            logger.error(f"Failed to initialize Moov client: {e}")
            self.moov_client = None

class DigitalWallet(BaseModel):
    """Digital wallet model"""
    wallet_id: str
    user_id: str
    balance: float
    currency: str = "USD"
    status: str = "active"
    linked_accounts: List[str] = []
    
class BankAccount(BaseModel):
    """Bank account model"""
    account_id: str
    user_id: str
    bank_name: str
    account_type: str
    routing_number: str
    account_number_last_4: str
    is_verified: bool = False
    
class PaymentRequest(BaseModel):
    """Payment request model"""
    from_wallet_id: str
    to_wallet_id: Optional[str] = None
    to_phone: Optional[str] = None
    to_email: Optional[str] = None
    amount: float
    description: str
    payment_type: str = "instant"  # instant, standard
    
class MerchantPayment(BaseModel):
    """Merchant POS payment model"""
    merchant_id: str
    customer_wallet_id: str
    amount: float
    tip_amount: float = 0.0
    description: str
    items: List[Dict] = []

class DalePayWallet:
    """DalePay Puerto Rico Wallet Service - Real Money Processing"""
    
    def __init__(self, config: MoovConfig, db):
        self.config = config
        self.db = db
        
    def encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.config.cipher_suite.encrypt(data.encode()).decode()
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.config.cipher_suite.decrypt(encrypted_data.encode()).decode()
    
    async def create_digital_wallet(self, user_id: str, user_data: Dict) -> Dict[str, Any]:
        """Create a real digital wallet with Moov"""
        if not self.config.moov_client:
            raise HTTPException(
                status_code=501,
                detail="Real wallet service not configured. Please set up Moov API credentials."
            )
        
        try:
            # Create Moov account for the user
            account_data = {
                "accountType": "individual",
                "profile": {
                    "individual": {
                        "name": {
                            "firstName": user_data.get("first_name", ""),
                            "lastName": user_data.get("last_name", "")
                        },
                        "email": user_data.get("email", ""),
                        "phone": {
                            "number": user_data.get("phone", ""),
                            "countryCode": "1"
                        }
                    }
                }
            }
            
            moov_account = await self.config.moov_client.accounts.create(account_data)
            
            # Create wallet record
            wallet = {
                "wallet_id": str(uuid.uuid4()),
                "user_id": user_id,
                "moov_account_id": moov_account.accountID,
                "balance": 0.0,
                "currency": "USD",
                "status": "active",
                "linked_accounts": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            await self.db.wallets.insert_one(wallet)
            
            # Log wallet creation for compliance
            await self.log_compliance_action({
                "user_id": user_id,
                "action": "wallet_created",
                "wallet_id": wallet["wallet_id"],
                "moov_account_id": moov_account.accountID,
                "timestamp": datetime.utcnow()
            })
            
            return {
                "wallet_id": wallet["wallet_id"],
                "moov_account_id": moov_account.accountID,
                "balance": 0.0,
                "status": "active"
            }
            
        except Exception as e:
            logger.error(f"Error creating wallet: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create wallet: {str(e)}")
    
    async def link_bank_account(self, user_id: str, bank_data: Dict) -> Dict[str, Any]:
        """Link real bank account via Moov"""
        if not self.config.moov_client:
            raise HTTPException(status_code=501, detail="Banking service not configured")
        
        try:
            # Get user's wallet
            wallet = await self.db.wallets.find_one({"user_id": user_id})
            if not wallet:
                raise HTTPException(status_code=404, detail="Wallet not found")
            
            # Create bank account with Moov
            bank_account_data = {
                "account": {
                    "accountNumber": bank_data["account_number"],
                    "routingNumber": bank_data["routing_number"]
                },
                "bankAccountType": bank_data.get("account_type", "checking"),
                "holderName": bank_data["account_holder_name"]
            }
            
            moov_bank_account = await self.config.moov_client.bank_accounts.link(
                wallet["moov_account_id"],
                bank_account_data
            )
            
            # Store encrypted bank account info
            bank_record = {
                "account_id": str(uuid.uuid4()),
                "user_id": user_id,
                "moov_bank_id": moov_bank_account.bankAccountID,
                "bank_name": bank_data.get("bank_name", "Unknown Bank"),
                "account_type": bank_data.get("account_type", "checking"),
                "account_holder_name": bank_data["account_holder_name"],
                "routing_number": self.encrypt_data(bank_data["routing_number"]),
                "account_number_last_4": bank_data["account_number"][-4:],
                "encrypted_account_number": self.encrypt_data(bank_data["account_number"]),
                "is_verified": True,  # Moov handles verification
                "linked_at": datetime.utcnow()
            }
            
            await self.db.bank_accounts.insert_one(bank_record)
            
            # Update wallet with linked account
            await self.db.wallets.update_one(
                {"user_id": user_id},
                {"$push": {"linked_accounts": bank_record["account_id"]}}
            )
            
            # Log bank linking for compliance
            await self.log_compliance_action({
                "user_id": user_id,
                "action": "bank_account_linked",
                "bank_name": bank_data.get("bank_name", "Unknown"),
                "account_type": bank_data.get("account_type", "checking"),
                "timestamp": datetime.utcnow()
            })
            
            return {
                "account_id": bank_record["account_id"],
                "bank_name": bank_record["bank_name"],
                "account_type": bank_record["account_type"],
                "last_4": bank_record["account_number_last_4"],
                "status": "linked"
            }
            
        except Exception as e:
            logger.error(f"Error linking bank account: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to link bank account: {str(e)}")
    
    async def get_wallet_balance(self, user_id: str) -> float:
        """Get real wallet balance from Moov"""
        try:
            wallet = await self.db.wallets.find_one({"user_id": user_id})
            if not wallet:
                return 0.0
            
            if not self.config.moov_client:
                return wallet.get("balance", 0.0)
            
            # Get real balance from Moov
            moov_balance = await self.config.moov_client.accounts.get_balance(
                wallet["moov_account_id"]
            )
            
            real_balance = float(moov_balance.amount) / 100  # Moov uses cents
            
            # Update local balance record
            await self.db.wallets.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "balance": real_balance,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return real_balance
            
        except Exception as e:
            logger.error(f"Error getting wallet balance: {e}")
            # Return stored balance if Moov is unavailable
            wallet = await self.db.wallets.find_one({"user_id": user_id})
            return wallet.get("balance", 0.0) if wallet else 0.0
    
    async def send_money(self, payment_request: PaymentRequest, sender_id: str) -> Dict[str, Any]:
        """Send real money via Moov"""
        if not self.config.moov_client:
            raise HTTPException(status_code=501, detail="Money transfer service not configured")
        
        try:
            # Get sender wallet
            sender_wallet = await self.db.wallets.find_one({"user_id": sender_id})
            if not sender_wallet:
                raise HTTPException(status_code=404, detail="Sender wallet not found")
            
            # Find recipient wallet
            recipient_wallet = None
            if payment_request.to_wallet_id:
                recipient_wallet = await self.db.wallets.find_one({"wallet_id": payment_request.to_wallet_id})
            elif payment_request.to_email:
                user = await self.db.users.find_one({"email": payment_request.to_email})
                if user:
                    recipient_wallet = await self.db.wallets.find_one({"user_id": user["id"]})
            elif payment_request.to_phone:
                user = await self.db.users.find_one({"phone": payment_request.to_phone})
                if user:
                    recipient_wallet = await self.db.wallets.find_one({"user_id": user["id"]})
            
            if not recipient_wallet:
                raise HTTPException(status_code=404, detail="Recipient not found")
            
            # Check sufficient balance
            sender_balance = await self.get_wallet_balance(sender_id)
            fee = payment_request.amount * 0.015 if payment_request.payment_type == "instant" else 0.0
            total_cost = payment_request.amount + fee
            
            if total_cost > sender_balance:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            # Create transfer with Moov
            transfer_data = {
                "source": {
                    "accountID": sender_wallet["moov_account_id"]
                },
                "destination": {
                    "accountID": recipient_wallet["moov_account_id"]
                },
                "amount": {
                    "currency": "USD",
                    "value": int(payment_request.amount * 100)  # Convert to cents
                },
                "description": payment_request.description
            }
            
            moov_transfer = await self.config.moov_client.transfers.create(transfer_data)
            
            # Record transaction
            transaction = {
                "transaction_id": str(uuid.uuid4()),
                "moov_transfer_id": moov_transfer.transferID,
                "from_user_id": sender_id,
                "to_user_id": recipient_wallet["user_id"],
                "amount": payment_request.amount,
                "fee": fee,
                "total_amount": total_cost,
                "description": payment_request.description,
                "payment_type": payment_request.payment_type,
                "status": "processing",
                "created_at": datetime.utcnow()
            }
            
            await self.db.transactions.insert_one(transaction)
            
            # Log for compliance
            await self.log_compliance_action({
                "user_id": sender_id,
                "action": "money_sent",
                "amount": payment_request.amount,
                "recipient_id": recipient_wallet["user_id"],
                "transaction_id": transaction["transaction_id"],
                "timestamp": datetime.utcnow()
            })
            
            return {
                "transaction_id": transaction["transaction_id"],
                "status": "processing",
                "amount": payment_request.amount,
                "fee": fee,
                "estimated_completion": "instant" if payment_request.payment_type == "instant" else "1-3 business days"
            }
            
        except Exception as e:
            logger.error(f"Error sending money: {e}")
            raise HTTPException(status_code=500, detail=f"Transfer failed: {str(e)}")
    
    async def process_merchant_payment(self, payment: MerchantPayment) -> Dict[str, Any]:
        """Process POS payment and collect merchant fees"""
        if not self.config.moov_client:
            raise HTTPException(status_code=501, detail="POS payment service not configured")
        
        try:
            # Get customer and merchant wallets
            customer_wallet = await self.db.wallets.find_one({"wallet_id": payment.customer_wallet_id})
            merchant_wallet = await self.db.wallets.find_one({"user_id": payment.merchant_id})
            
            if not customer_wallet or not merchant_wallet:
                raise HTTPException(status_code=404, detail="Wallet not found")
            
            # Calculate amounts
            total_amount = payment.amount + payment.tip_amount
            merchant_fee = (payment.amount * self.config.merchant_fee_percent) + self.config.merchant_fee_fixed
            merchant_receives = total_amount - merchant_fee
            
            # Check customer balance
            customer_balance = await self.get_wallet_balance(customer_wallet["user_id"])
            if total_amount > customer_balance:
                raise HTTPException(status_code=400, detail="Insufficient funds")
            
            # Create transfer to merchant
            transfer_data = {
                "source": {
                    "accountID": customer_wallet["moov_account_id"]
                },
                "destination": {
                    "accountID": merchant_wallet["moov_account_id"]
                },
                "amount": {
                    "currency": "USD",
                    "value": int(merchant_receives * 100)  # Convert to cents
                },
                "description": f"POS Payment: {payment.description}"
            }
            
            moov_transfer = await self.config.moov_client.transfers.create(transfer_data)
            
            # Transfer fee to founder wallet (if configured)
            if self.config.founder_wallet_id and merchant_fee > 0:
                founder_wallet = await self.db.wallets.find_one({"wallet_id": self.config.founder_wallet_id})
                if founder_wallet:
                    fee_transfer_data = {
                        "source": {
                            "accountID": customer_wallet["moov_account_id"]
                        },
                        "destination": {
                            "accountID": founder_wallet["moov_account_id"]
                        },
                        "amount": {
                            "currency": "USD",
                            "value": int(merchant_fee * 100)
                        },
                        "description": "DalePay Merchant Fee"
                    }
                    
                    await self.config.moov_client.transfers.create(fee_transfer_data)
            
            # Record POS transaction
            pos_transaction = {
                "transaction_id": str(uuid.uuid4()),
                "moov_transfer_id": moov_transfer.transferID,
                "customer_id": customer_wallet["user_id"],
                "merchant_id": payment.merchant_id,
                "amount": payment.amount,
                "tip_amount": payment.tip_amount,
                "total_amount": total_amount,
                "merchant_fee": merchant_fee,
                "merchant_receives": merchant_receives,
                "description": payment.description,
                "items": payment.items,
                "payment_method": "dalepay_wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            }
            
            await self.db.pos_transactions.insert_one(pos_transaction)
            
            # Log for compliance
            await self.log_compliance_action({
                "customer_id": customer_wallet["user_id"],
                "merchant_id": payment.merchant_id,
                "action": "pos_payment",
                "amount": total_amount,
                "fee_collected": merchant_fee,
                "transaction_id": pos_transaction["transaction_id"],
                "timestamp": datetime.utcnow()
            })
            
            return {
                "transaction_id": pos_transaction["transaction_id"],
                "status": "completed",
                "amount_paid": total_amount,
                "merchant_received": merchant_receives,
                "fee_charged": merchant_fee,
                "receipt_id": pos_transaction["transaction_id"]
            }
            
        except Exception as e:
            logger.error(f"Error processing POS payment: {e}")
            raise HTTPException(status_code=500, detail=f"Payment failed: {str(e)}")
    
    async def get_linked_accounts(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's linked bank accounts"""
        try:
            accounts = await self.db.bank_accounts.find({"user_id": user_id}).to_list(100)
            
            # Remove sensitive data
            safe_accounts = []
            for account in accounts:
                safe_account = {
                    "account_id": account["account_id"],
                    "bank_name": account["bank_name"],
                    "account_type": account["account_type"],
                    "last_4": account["account_number_last_4"],
                    "is_verified": account["is_verified"],
                    "linked_at": account["linked_at"]
                }
                safe_accounts.append(safe_account)
            
            return safe_accounts
            
        except Exception as e:
            logger.error(f"Error getting linked accounts: {e}")
            return []
    
    async def delete_linked_account(self, user_id: str, account_id: str) -> bool:
        """Delete a linked bank account"""
        try:
            # Remove from database
            result = await self.db.bank_accounts.delete_one({
                "user_id": user_id,
                "account_id": account_id
            })
            
            if result.deleted_count > 0:
                # Remove from wallet's linked accounts
                await self.db.wallets.update_one(
                    {"user_id": user_id},
                    {"$pull": {"linked_accounts": account_id}}
                )
                
                # Log for compliance
                await self.log_compliance_action({
                    "user_id": user_id,
                    "action": "bank_account_removed",
                    "account_id": account_id,
                    "timestamp": datetime.utcnow()
                })
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting linked account: {e}")
            return False
    
    async def log_compliance_action(self, action_data: Dict[str, Any]):
        """Log action for FinCEN compliance"""
        try:
            compliance_log = {
                **action_data,
                "logged_at": datetime.utcnow(),
                "system": "dalepay_puerto_rico"
            }
            await self.db.compliance_logs.insert_one(compliance_log)
        except Exception as e:
            logger.error(f"Error logging compliance action: {e}")

# Initialize the wallet service
moov_config = MoovConfig()

def get_dalepay_wallet(db):
    """Get DalePay wallet service instance"""
    return DalePayWallet(moov_config, db)