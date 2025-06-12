from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import hashlib
import hmac
import jwt
import httpx
import asyncio
from passlib.context import CryptContext
from passlib.hash import bcrypt
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="DalePay API", description="Puerto Rican Digital Wallet Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

# Moov API Configuration
MOOV_PUBLIC_KEY = "s4KFHo1bfzGS5O9x"
MOOV_SECRET_KEY = "7T7T2iBrSHD8jPlklkqkgjcYGDOLMUNh"
MOOV_BASE_URL = "https://api.moov.io"

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    moov_account_id: Optional[str] = None
    balance: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class MoneyTransfer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    to_user_id: str
    amount: float
    description: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    moov_transfer_id: Optional[str] = None

class Card(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    card_number_last4: str
    card_type: str
    expiry_month: int
    expiry_year: int
    cardholder_name: str
    moov_card_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Business(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    owner_user_id: str
    business_type: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    moov_account_id: Optional[str] = None
    qr_code: Optional[str] = None
    balance: float = 0.0
    total_revenue: float = 0.0
    monthly_revenue: float = 0.0
    total_transactions: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_approved: bool = False
    integrations: Dict[str, Any] = Field(default_factory=dict)  # Store integration settings

# Utility Functions
def serialize_mongo_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_mongo_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_mongo_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_mongo_doc(value)
            else:
                result[key] = value
        return result
    return doc

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Moov API Integration
async def create_moov_account(user_data: dict) -> str:
    """Create a Moov account for a new user"""
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {MOOV_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        moov_account_data = {
            "accountType": "individual",
            "profile": {
                "individual": {
                    "firstName": user_data["full_name"].split()[0],
                    "lastName": " ".join(user_data["full_name"].split()[1:]) if len(user_data["full_name"].split()) > 1 else "",
                    "email": user_data["email"]
                }
            }
        }
        
        try:
            response = await client.post(f"{MOOV_BASE_URL}/accounts", 
                                       json=moov_account_data, 
                                       headers=headers)
            if response.status_code == 201:
                return response.json()["accountID"]
            else:
                logging.error(f"Moov account creation failed: {response.text}")
                return None
        except Exception as e:
            logging.error(f"Error creating Moov account: {str(e)}")
            return None

async def get_moov_balance(account_id: str) -> float:
    """Get balance from Moov account"""
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {MOOV_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            response = await client.get(f"{MOOV_BASE_URL}/accounts/{account_id}/wallets", 
                                      headers=headers)
            if response.status_code == 200:
                wallets = response.json()
                # Return balance from first wallet or 0 if no wallets
                return float(wallets[0]["availableBalance"]["value"]) / 100 if wallets else 0.0
            else:
                logging.error(f"Moov balance fetch failed: {response.text}")
                return 0.0
        except Exception as e:
            logging.error(f"Error fetching Moov balance: {str(e)}")
            return 0.0

# API Routes
@api_router.post("/auth/create-account")
async def create_account(user_data: UserCreate):
    """Create new user account with Moov wallet"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create Moov account
    moov_account_id = await create_moov_account(user_data.dict())
    
    # Create user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        moov_account_id=moov_account_id
    )
    
    # Hash password and store user
    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user_data.password)
    
    result = await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.id}, 
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "moov_account_id": moov_account_id
        }
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    """User login"""
    user = await db.users.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": user["id"]}, 
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "moov_account_id": user.get("moov_account_id")
        }
    }

@api_router.get("/users/me")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    # Update balance from Moov
    if current_user.moov_account_id:
        current_balance = await get_moov_balance(current_user.moov_account_id)
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": {"balance": current_balance}}
        )
        current_user.balance = current_balance
    
    return current_user

@api_router.get("/users/{user_id}/balance")
async def get_user_balance(user_id: str, current_user: User = Depends(get_current_user)):
    """Get user balance from Moov"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user.moov_account_id:
        balance = await get_moov_balance(current_user.moov_account_id)
        # Update local balance
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"balance": balance}}
        )
        return {"balance": balance}
    
    return {"balance": 0.0}

@api_router.post("/transfers")
async def create_transfer(transfer_data: dict, current_user: User = Depends(get_current_user)):
    """Create money transfer between users"""
    to_user = await db.users.find_one({"email": transfer_data.get("to_email")})
    if not to_user:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    amount = float(transfer_data["amount"])
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    
    # Check balance
    current_balance = await get_moov_balance(current_user.moov_account_id)
    if current_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    # Create transfer record
    transfer = MoneyTransfer(
        from_user_id=current_user.id,
        to_user_id=to_user["id"],
        amount=amount,
        description=transfer_data.get("description", "")
    )
    
    # Store transfer
    await db.transfers.insert_one(transfer.dict())
    
    # Here you would integrate with Moov API for actual transfer
    # For now, we'll simulate the transfer
    transfer.status = "completed"
    
    return {"message": "Transfer successful", "transfer_id": transfer.id}

@api_router.get("/transfers")
async def get_user_transfers(current_user: User = Depends(get_current_user)):
    """Get user's transfer history"""
    transfers = await db.transfers.find({
        "$or": [
            {"from_user_id": current_user.id},
            {"to_user_id": current_user.id}
        ]
    }).to_list(100)
    
    return serialize_mongo_doc(transfers)

@api_router.post("/cards")
async def add_card(card_data: dict, current_user: User = Depends(get_current_user)):
    """Add credit/debit card"""
    card = Card(
        user_id=current_user.id,
        card_number_last4=card_data["card_number"][-4:],
        card_type=card_data["card_type"],
        expiry_month=card_data["expiry_month"],
        expiry_year=card_data["expiry_year"],
        cardholder_name=card_data["cardholder_name"]
    )
    
    await db.cards.insert_one(card.dict())
    return {"message": "Card added successfully", "card_id": card.id}

@api_router.get("/cards")
async def get_user_cards(current_user: User = Depends(get_current_user)):
    """Get user's cards"""
    cards = await db.cards.find({"user_id": current_user.id}).to_list(10)
    return serialize_mongo_doc(cards)

@api_router.post("/fund-account")
async def fund_account(fund_data: dict, current_user: User = Depends(get_current_user)):
    """Fund account using card"""
    amount = float(fund_data["amount"])
    card_id = fund_data["card_id"]
    
    # Verify card belongs to user
    card = await db.cards.find_one({"id": card_id, "user_id": current_user.id})
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Process card payment (2.9% fee)
    fee = amount * 0.029
    net_amount = amount - fee
    
    # Here you would integrate with Moov API for actual card processing
    # For now, we'll simulate the funding
    
    return {
        "message": "Account funded successfully",
        "amount": amount,
        "fee": fee,
        "net_amount": net_amount
    }

@api_router.post("/register-business")
async def register_business(business_data: dict, current_user: User = Depends(get_current_user)):
    """Register a business"""
    # Create Moov business account if needed
    moov_business_id = await create_moov_business_account(business_data, current_user)
    
    business = Business(
        name=business_data["name"],
        owner_user_id=current_user.id,
        business_type=business_data["business_type"],
        description=business_data.get("description", ""),
        address=business_data.get("address", ""),
        phone=business_data.get("phone", ""),
        website=business_data.get("website", ""),
        moov_account_id=moov_business_id,
        is_approved=True  # Auto-approve for demo
    )
    
    # Generate QR code for business
    business.qr_code = f"dalepay://pay/{business.id}"
    
    result = await db.businesses.insert_one(business.dict())
    
    return {
        "message": "Business registered successfully", 
        "business_id": business.id,
        "business": business.dict()
    }

async def create_moov_business_account(business_data: dict, user: User) -> str:
    """Create a Moov business account"""
    # For demo purposes, we'll simulate this
    # In production, this would call the actual Moov API
    import uuid
    return f"moov_business_{uuid.uuid4().hex[:8]}"

@api_router.get("/businesses")
async def get_user_businesses(current_user: User = Depends(get_current_user)):
    """Get user's businesses"""
    businesses = await db.businesses.find({"owner_user_id": current_user.id}).to_list(10)
    return serialize_mongo_doc(businesses)

@api_router.get("/businesses/{business_id}")
async def get_business_details(business_id: str, current_user: User = Depends(get_current_user)):
    """Get detailed business information"""
    business = await db.businesses.find_one({"id": business_id, "owner_user_id": current_user.id})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return serialize_mongo_doc(business)

@api_router.post("/businesses/{business_id}/integrations")
async def setup_business_integration(
    business_id: str, 
    integration_data: dict, 
    current_user: User = Depends(get_current_user)
):
    """Setup business integrations (Uber Eats, DoorDash, ATH Móvil)"""
    business = await db.businesses.find_one({"id": business_id, "owner_user_id": current_user.id})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    integration_type = integration_data["type"]  # uber_eats, doordash, ath_movil
    
    # Simulate integration setup
    integration_config = {
        "type": integration_type,
        "status": "active",
        "api_key": f"demo_{integration_type}_{uuid.uuid4().hex[:8]}",
        "webhook_url": f"https://api.dalepay.com/webhooks/{business_id}/{integration_type}",
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Update business integrations
    current_integrations = business.get("integrations", {})
    current_integrations[integration_type] = integration_config
    
    await db.businesses.update_one(
        {"id": business_id},
        {"$set": {"integrations": current_integrations}}
    )
    
    return {
        "message": f"{integration_type} integration setup successful",
        "integration": integration_config
    }

@api_router.get("/businesses/{business_id}/integrations")
async def get_business_integrations(business_id: str, current_user: User = Depends(get_current_user)):
    """Get business integrations"""
    business = await db.businesses.find_one({"id": business_id, "owner_user_id": current_user.id})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return business.get("integrations", {})

@api_router.post("/businesses/{business_id}/cashout")
async def business_cashout(
    business_id: str, 
    cashout_data: dict, 
    current_user: User = Depends(get_current_user)
):
    """Cash out business funds"""
    business = await db.businesses.find_one({"id": business_id, "owner_user_id": current_user.id})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    amount = float(cashout_data["amount"])
    cashout_method = cashout_data["method"]  # bank, card
    
    if amount > business["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient business funds")
    
    # Process cashout
    new_balance = business["balance"] - amount
    
    await db.businesses.update_one(
        {"id": business_id},
        {"$set": {"balance": new_balance}}
    )
    
    # Create cashout record
    cashout_record = {
        "id": str(uuid.uuid4()),
        "business_id": business_id,
        "amount": amount,
        "method": cashout_method,
        "status": "completed",
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db.business_cashouts.insert_one(cashout_record)
    
    return {
        "message": "Cashout successful",
        "cashout_id": cashout_record["id"],
        "new_balance": new_balance
    }

# Admin routes
@api_router.get("/admin/dashboard")
async def admin_dashboard(current_user: User = Depends(get_current_user)):
    """Admin dashboard data"""
    # Check if user is admin (simplified check)
    if current_user.email != "admin@dalepay.com":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    total_transfers = await db.transfers.count_documents({})
    total_businesses = await db.businesses.count_documents({})
    
    return {
        "total_users": total_users,
        "total_transfers": total_transfers,
        "total_businesses": total_businesses
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
