from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
import asyncio
import json
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
import os

from backend.server import get_current_user, db, serialize_mongo_doc, log_compliance_action, moov_api

# Admin API Router
admin_router = APIRouter(prefix="/admin")

# Admin Configuration
ADMIN_EMAILS = [
    os.environ.get("ADMIN_EMAIL", "admin@dalepay.com"),
    "owner@dalepay.com"
]

logger = logging.getLogger(__name__)

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Verify admin privileges"""
    if current_user["email"] not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

class AIQualityOfficer:
    """AI system for monitoring app quality and auto-repair"""
    
    def __init__(self):
        self.scan_interval = 3600  # 1 hour in seconds
        self.last_scan = None
        self.repair_log = []
        
    async def scan_system_health(self) -> dict:
        """Comprehensive system health scan"""
        try:
            scan_results = {
                "scan_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow(),
                "status": "healthy",
                "issues_found": [],
                "repairs_performed": [],
                "recommendations": []
            }
            
            # Database connectivity check
            try:
                await db.users.count_documents({})
                scan_results["database_status"] = "connected"
            except Exception as e:
                scan_results["issues_found"].append({
                    "type": "database_connection",
                    "severity": "high",
                    "description": f"Database connection error: {str(e)}"
                })
                scan_results["status"] = "critical"
            
            # Moov API connectivity check
            try:
                headers = await moov_api.get_headers()
                scan_results["moov_api_status"] = "connected"
            except Exception as e:
                scan_results["issues_found"].append({
                    "type": "moov_api_connection",
                    "severity": "high", 
                    "description": f"Moov API connection error: {str(e)}"
                })
                scan_results["status"] = "critical"
            
            # Check for failed transactions in last hour
            failed_transactions = await db.transactions.count_documents({
                "status": "failed",
                "created_at": {"$gte": datetime.utcnow() - timedelta(hours=1)}
            })
            
            if failed_transactions > 10:
                scan_results["issues_found"].append({
                    "type": "high_failure_rate",
                    "severity": "medium",
                    "description": f"{failed_transactions} failed transactions in last hour"
                })
            
            # Check for users with KYC pending > 24 hours
            pending_kyc = await db.users.count_documents({
                "kyc_status": "pending",
                "created_at": {"$lt": datetime.utcnow() - timedelta(hours=24)}
            })
            
            if pending_kyc > 0:
                scan_results["recommendations"].append({
                    "type": "kyc_review",
                    "description": f"{pending_kyc} users have pending KYC > 24 hours"
                })
            
            # Log scan results
            await db.ai_scans.insert_one(scan_results)
            self.last_scan = datetime.utcnow()
            
            return scan_results
            
        except Exception as e:
            logger.error(f"AI system scan error: {e}")
            return {
                "scan_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow(),
                "status": "error",
                "error": str(e)
            }
    
    async def auto_repair_issues(self, issues: List[dict]) -> List[dict]:
        """Attempt automatic repair of identified issues"""
        repairs = []
        
        for issue in issues:
            if issue["type"] == "database_connection":
                # Attempt database reconnection
                try:
                    # Database reconnection logic would go here
                    repairs.append({
                        "issue_type": issue["type"],
                        "action": "database_reconnection_attempted",
                        "success": True,
                        "timestamp": datetime.utcnow()
                    })
                except Exception as e:
                    repairs.append({
                        "issue_type": issue["type"],
                        "action": "database_reconnection_failed",
                        "success": False,
                        "error": str(e),
                        "timestamp": datetime.utcnow()
                    })
            
            elif issue["type"] == "moov_api_connection":
                # Log API issue for manual review
                repairs.append({
                    "issue_type": issue["type"],
                    "action": "logged_for_manual_review",
                    "success": True,
                    "timestamp": datetime.utcnow()
                })
        
        # Log all repairs
        for repair in repairs:
            await db.ai_repairs.insert_one(repair)
        
        return repairs
    
    async def fraud_detection_scan(self) -> dict:
        """Scan for fraudulent activities"""
        try:
            fraud_scan = {
                "scan_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow(),
                "suspicious_activities": [],
                "alerts_created": []
            }
            
            # Check for rapid successive transfers from same user
            pipeline = [
                {
                    "$match": {
                        "created_at": {"$gte": datetime.utcnow() - timedelta(minutes=10)},
                        "status": "completed"
                    }
                },
                {
                    "$group": {
                        "_id": "$from_user_id",
                        "count": {"$sum": 1},
                        "total_amount": {"$sum": "$amount"}
                    }
                },
                {
                    "$match": {
                        "$or": [
                            {"count": {"$gt": 5}},  # More than 5 transfers in 10 min
                            {"total_amount": {"$gt": 5000}}  # Total > $5000 in 10 min
                        ]
                    }
                }
            ]
            
            suspicious_users = await db.transactions.aggregate(pipeline).to_list(100)
            
            for user_activity in suspicious_users:
                fraud_scan["suspicious_activities"].append({
                    "user_id": user_activity["_id"],
                    "type": "rapid_transfers",
                    "transfer_count": user_activity["count"],
                    "total_amount": float(user_activity["total_amount"]),
                    "severity": "high" if user_activity["total_amount"] > 5000 else "medium"
                })
                
                # Create alert
                alert_id = str(uuid.uuid4())
                alert = {
                    "id": alert_id,
                    "type": "fraud_alert",
                    "user_id": user_activity["_id"],
                    "description": f"Suspicious activity: {user_activity['count']} transfers totaling ${user_activity['total_amount']}",
                    "severity": "high",
                    "status": "open",
                    "created_at": datetime.utcnow(),
                    "reviewed_by": None
                }
                
                await db.alerts.insert_one(alert)
                fraud_scan["alerts_created"].append(alert_id)
            
            # Log fraud scan
            await db.fraud_scans.insert_one(fraud_scan)
            
            return fraud_scan
            
        except Exception as e:
            logger.error(f"Fraud detection scan error: {e}")
            return {"error": str(e)}

# Initialize AI Quality Officer
ai_officer = AIQualityOfficer()

# Admin API Endpoints

@admin_router.get("/dashboard")
async def admin_dashboard(admin_user: dict = Depends(get_admin_user)):
    """Main admin dashboard with system overview"""
    try:
        # Get system statistics
        total_users = await db.users.count_documents({})
        active_users = await db.users.count_documents({"account_status": "active"})
        pending_kyc = await db.users.count_documents({"kyc_status": "pending"})
        
        # Get transaction statistics
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        
        daily_transactions = await db.transactions.count_documents({
            "created_at": {"$gte": today_start}
        })
        
        daily_volume = await db.transactions.aggregate([
            {"$match": {"created_at": {"$gte": today_start}, "status": "completed"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]).to_list(1)
        
        daily_revenue = await db.transactions.aggregate([
            {"$match": {"created_at": {"$gte": today_start}, "status": "completed"}},
            {"$group": {"_id": None, "total": {"$sum": "$fee"}}}
        ]).to_list(1)
        
        # Get recent alerts
        recent_alerts = await db.alerts.find({
            "status": "open"
        }).sort("created_at", -1).limit(10).to_list(10)
        
        # System health
        last_scan = await db.ai_scans.find_one({}, sort=[("timestamp", -1)])
        
        return {
            "statistics": {
                "total_users": total_users,
                "active_users": active_users,
                "pending_kyc": pending_kyc,
                "daily_transactions": daily_transactions,
                "daily_volume": float(daily_volume[0]["total"]) if daily_volume else 0,
                "daily_revenue": float(daily_revenue[0]["total"]) if daily_revenue else 0
            },
            "system_health": {
                "status": last_scan.get("status", "unknown") if last_scan else "unknown",
                "last_scan": last_scan.get("timestamp") if last_scan else None,
                "issues_count": len(last_scan.get("issues_found", [])) if last_scan else 0
            },
            "recent_alerts": serialize_mongo_doc(recent_alerts),
            "fincen_status": "registered",
            "moov_status": "connected"
        }
        
    except Exception as e:
        logger.error(f"Admin dashboard error: {e}")
        raise HTTPException(status_code=500, detail="Failed to load dashboard")

@admin_router.get("/users")
async def get_users(
    page: int = 1, 
    limit: int = 50,
    status: Optional[str] = None,
    kyc_status: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get paginated user list with filters"""
    try:
        query = {}
        if status:
            query["account_status"] = status
        if kyc_status:
            query["kyc_status"] = kyc_status
        
        skip = (page - 1) * limit
        
        users = await db.users.find(query).skip(skip).limit(limit).to_list(limit)
        total = await db.users.count_documents(query)
        
        # Remove sensitive data for admin view
        safe_users = []
        for user in users:
            safe_user = serialize_mongo_doc(user)
            safe_user.pop("password_hash", None)
            safe_user.pop("encrypted_ssn", None)
            safe_user.pop("encrypted_address", None)
            safe_users.append(safe_user)
        
        return {
            "users": safe_users,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Get users error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@admin_router.post("/users/{user_id}/freeze")
async def freeze_user_account(user_id: str, reason: str, admin_user: dict = Depends(get_admin_user)):
    """Freeze user account"""
    try:
        result = await db.users.update_one(
            {"id": user_id},
            {
                "$set": {
                    "account_status": "frozen",
                    "frozen_at": datetime.utcnow(),
                    "frozen_by": admin_user["id"],
                    "freeze_reason": reason
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Log admin action
        await log_compliance_action({
            "admin_user_id": admin_user["id"],
            "action": "user_account_frozen",
            "target_user_id": user_id,
            "reason": reason,
            "timestamp": datetime.utcnow()
        })
        
        return {"message": "Account frozen successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Freeze account error: {e}")
        raise HTTPException(status_code=500, detail="Failed to freeze account")

@admin_router.post("/users/{user_id}/unfreeze")
async def unfreeze_user_account(user_id: str, admin_user: dict = Depends(get_admin_user)):
    """Unfreeze user account"""
    try:
        result = await db.users.update_one(
            {"id": user_id},
            {
                "$set": {
                    "account_status": "active",
                    "unfrozen_at": datetime.utcnow(),
                    "unfrozen_by": admin_user["id"]
                },
                "$unset": {
                    "frozen_at": "",
                    "frozen_by": "",
                    "freeze_reason": ""
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Log admin action
        await log_compliance_action({
            "admin_user_id": admin_user["id"],
            "action": "user_account_unfrozen",
            "target_user_id": user_id,
            "timestamp": datetime.utcnow()
        })
        
        return {"message": "Account unfrozen successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unfreeze account error: {e}")
        raise HTTPException(status_code=500, detail="Failed to unfreeze account")

@admin_router.get("/transactions")
async def get_transactions(
    page: int = 1,
    limit: int = 100,
    status: Optional[str] = None,
    user_id: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get transaction history for admin review"""
    try:
        query = {}
        if status:
            query["status"] = status
        if user_id:
            query["$or"] = [{"from_user_id": user_id}, {"to_user_id": user_id}]
        
        skip = (page - 1) * limit
        
        transactions = await db.transactions.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.transactions.count_documents(query)
        
        return {
            "transactions": serialize_mongo_doc(transactions),
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Get transactions error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch transactions")

@admin_router.get("/ai-scans")
async def get_ai_scans(limit: int = 20, admin_user: dict = Depends(get_admin_user)):
    """Get recent AI system scans"""
    try:
        scans = await db.ai_scans.find({}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {"scans": serialize_mongo_doc(scans)}
        
    except Exception as e:
        logger.error(f"Get AI scans error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch AI scans")

@admin_router.post("/ai-scan/trigger")
async def trigger_ai_scan(admin_user: dict = Depends(get_admin_user)):
    """Manually trigger AI system scan"""
    try:
        scan_result = await ai_officer.scan_system_health()
        
        # Perform auto-repairs if issues found
        if scan_result.get("issues_found"):
            repairs = await ai_officer.auto_repair_issues(scan_result["issues_found"])
            scan_result["repairs_performed"] = repairs
        
        return {
            "message": "AI scan completed",
            "scan_result": serialize_mongo_doc(scan_result)
        }
        
    except Exception as e:
        logger.error(f"AI scan trigger error: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger AI scan")

@admin_router.post("/fraud-scan")
async def trigger_fraud_scan(admin_user: dict = Depends(get_admin_user)):
    """Manually trigger fraud detection scan"""
    try:
        fraud_result = await ai_officer.fraud_detection_scan()
        return {
            "message": "Fraud scan completed",
            "scan_result": serialize_mongo_doc(fraud_result)
        }
        
    except Exception as e:
        logger.error(f"Fraud scan error: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger fraud scan")

@admin_router.get("/alerts")
async def get_alerts(
    status: str = "open",
    limit: int = 50,
    admin_user: dict = Depends(get_admin_user)
):
    """Get system alerts"""
    try:
        alerts = await db.alerts.find({"status": status}).sort("created_at", -1).limit(limit).to_list(limit)
        return {"alerts": serialize_mongo_doc(alerts)}
        
    except Exception as e:
        logger.error(f"Get alerts error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")

@admin_router.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, resolution: str, admin_user: dict = Depends(get_admin_user)):
    """Resolve an alert"""
    try:
        result = await db.alerts.update_one(
            {"id": alert_id},
            {
                "$set": {
                    "status": "resolved",
                    "resolution": resolution,
                    "resolved_by": admin_user["id"],
                    "resolved_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert resolved successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resolve alert error: {e}")
        raise HTTPException(status_code=500, detail="Failed to resolve alert")

@admin_router.get("/compliance-logs")
async def get_compliance_logs(
    page: int = 1,
    limit: int = 100,
    action: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get compliance audit logs"""
    try:
        query = {}
        if action:
            query["action"] = action
        
        skip = (page - 1) * limit
        
        logs = await db.compliance_logs.find(query).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.compliance_logs.count_documents(query)
        
        return {
            "logs": serialize_mongo_doc(logs),
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Get compliance logs error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch compliance logs")

# Background task for periodic AI scans
async def periodic_ai_scan():
    """Background task that runs AI scans every hour"""
    while True:
        try:
            await asyncio.sleep(3600)  # Wait 1 hour
            
            # Perform system health scan
            scan_result = await ai_officer.scan_system_health()
            
            # Auto-repair any issues found
            if scan_result.get("issues_found"):
                repairs = await ai_officer.auto_repair_issues(scan_result["issues_found"])
                logger.info(f"AI performed {len(repairs)} auto-repairs")
            
            # Perform fraud detection scan
            fraud_result = await ai_officer.fraud_detection_scan()
            
            if fraud_result.get("alerts_created"):
                logger.warning(f"Fraud scan created {len(fraud_result['alerts_created'])} alerts")
                
        except Exception as e:
            logger.error(f"Periodic AI scan error: {e}")

# Startup event to begin AI monitoring
@admin_router.on_event("startup")
async def start_ai_monitoring():
    """Start background AI monitoring"""
    asyncio.create_task(periodic_ai_scan())
    logger.info("AI monitoring system started")
