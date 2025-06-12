"""
DalePay Compliance Module
FinCEN Registered Money Services Business
KYC, AML, and Regulatory Compliance
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from decimal import Decimal
import uuid
import json
import re
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

class ComplianceManager:
    """Manages all compliance operations for DalePay"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.kyc_levels = {
            "basic": {
                "daily_limit": Decimal("1000.00"),
                "monthly_limit": Decimal("5000.00"),
                "requirements": ["government_id", "basic_info"]
            },
            "enhanced": {
                "daily_limit": Decimal("5000.00"),
                "monthly_limit": Decimal("25000.00"),
                "requirements": ["government_id", "proof_of_address", "ssn_verification"]
            },
            "premium": {
                "daily_limit": Decimal("25000.00"),
                "monthly_limit": Decimal("100000.00"),
                "requirements": ["government_id", "proof_of_address", "ssn_verification", "income_verification"]
            }
        }
    
    async def verify_kyc_documents(self, user_id: str, documents: List[Dict]) -> Dict:
        """Verify KYC documents and update user status"""
        try:
            verification_result = {
                "user_id": user_id,
                "verification_id": str(uuid.uuid4()),
                "status": "pending",
                "level": "basic",
                "documents_verified": [],
                "documents_pending": [],
                "issues": [],
                "verified_at": None,
                "expires_at": None
            }
            
            for document in documents:
                doc_type = document.get("type")
                doc_status = await self._verify_document(document)
                
                if doc_status["valid"]:
                    verification_result["documents_verified"].append({
                        "type": doc_type,
                        "verified_at": datetime.utcnow(),
                        "confidence_score": doc_status.get("confidence", 0.95)
                    })
                else:
                    verification_result["documents_pending"].append({
                        "type": doc_type,
                        "reason": doc_status.get("reason", "Document verification failed"),
                        "required_actions": doc_status.get("required_actions", [])
                    })
                    verification_result["issues"].append(doc_status.get("reason"))
            
            # Determine verification level based on documents
            verified_docs = [doc["type"] for doc in verification_result["documents_verified"]]
            
            if all(req in verified_docs for req in self.kyc_levels["premium"]["requirements"]):
                verification_result["level"] = "premium"
                verification_result["status"] = "approved"
            elif all(req in verified_docs for req in self.kyc_levels["enhanced"]["requirements"]):
                verification_result["level"] = "enhanced"
                verification_result["status"] = "approved"
            elif all(req in verified_docs for req in self.kyc_levels["basic"]["requirements"]):
                verification_result["level"] = "basic"
                verification_result["status"] = "approved"
            else:
                verification_result["status"] = "pending"
            
            if verification_result["status"] == "approved":
                verification_result["verified_at"] = datetime.utcnow()
                verification_result["expires_at"] = datetime.utcnow() + timedelta(days=365)
                
                # Update user record
                await self.db.users.update_one(
                    {"id": user_id},
                    {
                        "$set": {
                            "kyc_status": "approved",
                            "kyc_level": verification_result["level"],
                            "kyc_verified_at": verification_result["verified_at"],
                            "daily_limit": float(self.kyc_levels[verification_result["level"]]["daily_limit"]),
                            "monthly_limit": float(self.kyc_levels[verification_result["level"]]["monthly_limit"])
                        }
                    }
                )
            
            # Store verification record
            await self.db.kyc_verifications.insert_one(verification_result)
            
            # Log compliance action
            await self._log_compliance_action({
                "user_id": user_id,
                "action": "kyc_verification_completed",
                "result": verification_result["status"],
                "level": verification_result["level"],
                "timestamp": datetime.utcnow()
            })
            
            return verification_result
            
        except Exception as e:
            logger.error(f"KYC verification error: {e}")
            return {"status": "error", "message": str(e)}
    
    async def _verify_document(self, document: Dict) -> Dict:
        """Verify individual document (simulation for production integration)"""
        doc_type = document.get("type")
        doc_data = document.get("data", {})
        
        # In production, this would integrate with ID verification services
        # For now, we'll simulate verification based on document completeness
        
        if doc_type == "government_id":
            required_fields = ["id_number", "expiry_date", "name", "address"]
            if all(field in doc_data for field in required_fields):
                return {
                    "valid": True,
                    "confidence": 0.95,
                    "verified_fields": required_fields
                }
            else:
                missing = [field for field in required_fields if field not in doc_data]
                return {
                    "valid": False,
                    "reason": f"Missing required fields: {', '.join(missing)}",
                    "required_actions": [f"Provide {field}" for field in missing]
                }
        
        elif doc_type == "proof_of_address":
            if "address" in doc_data and "issue_date" in doc_data:
                return {"valid": True, "confidence": 0.90}
            return {"valid": False, "reason": "Invalid address document"}
        
        elif doc_type == "ssn_verification":
            if "ssn_last_4" in doc_data and len(doc_data["ssn_last_4"]) == 4:
                return {"valid": True, "confidence": 0.95}
            return {"valid": False, "reason": "Invalid SSN format"}
        
        else:
            return {"valid": False, "reason": "Unsupported document type"}
    
    async def aml_screening(self, user_data: Dict, transaction_data: Optional[Dict] = None) -> Dict:
        """Comprehensive AML screening"""
        try:
            screening_result = {
                "screening_id": str(uuid.uuid4()),
                "user_id": user_data.get("id"),
                "screening_type": "transaction" if transaction_data else "user_onboarding",
                "timestamp": datetime.utcnow(),
                "risk_level": "low",
                "status": "clear",
                "flags": [],
                "sanctions_check": "clear",
                "pep_check": "clear",
                "adverse_media_check": "clear",
                "recommendations": []
            }
            
            # Check user against sanctions lists (simulated)
            sanctions_result = await self._check_sanctions_list(user_data)
            screening_result["sanctions_check"] = sanctions_result["status"]
            if sanctions_result["status"] != "clear":
                screening_result["flags"].append("sanctions_match")
                screening_result["risk_level"] = "high"
                screening_result["status"] = "blocked"
            
            # PEP (Politically Exposed Person) check
            pep_result = await self._check_pep_list(user_data)
            screening_result["pep_check"] = pep_result["status"]
            if pep_result["status"] == "match":
                screening_result["flags"].append("pep_match")
                screening_result["risk_level"] = "medium"
                screening_result["recommendations"].append("enhanced_due_diligence")
            
            # Transaction-specific checks
            if transaction_data:
                transaction_flags = await self._check_transaction_patterns(user_data["id"], transaction_data)
                screening_result["flags"].extend(transaction_flags)
                
                # High-value transaction check
                if transaction_data.get("amount", 0) > 10000:
                    screening_result["flags"].append("high_value_transaction")
                    screening_result["recommendations"].append("manual_review")
                
                # Velocity checks
                velocity_flags = await self._check_velocity_patterns(user_data["id"], transaction_data)
                screening_result["flags"].extend(velocity_flags)
            
            # Set final risk level
            if len(screening_result["flags"]) > 3:
                screening_result["risk_level"] = "high"
            elif len(screening_result["flags"]) > 1:
                screening_result["risk_level"] = "medium"
            
            # Store screening result
            await self.db.aml_screenings.insert_one(screening_result)
            
            # Create alert if high risk
            if screening_result["risk_level"] == "high":
                await self._create_alert({
                    "type": "aml_high_risk",
                    "user_id": user_data["id"],
                    "description": f"High-risk AML screening: {', '.join(screening_result['flags'])}",
                    "severity": "high",
                    "data": screening_result
                })
            
            return screening_result
            
        except Exception as e:
            logger.error(f"AML screening error: {e}")
            return {"status": "error", "message": str(e)}
    
    async def _check_sanctions_list(self, user_data: Dict) -> Dict:
        """Check user against sanctions lists"""
        # In production, this would check against OFAC SDN, EU sanctions, etc.
        # For simulation, we'll check against a mock list
        
        name = user_data.get("full_name", "").lower()
        
        # Mock sanctions check (in production, use real API)
        sanctions_names = ["john doe", "jane smith"]  # Mock sanctioned names
        
        if any(sanctioned in name for sanctioned in sanctions_names):
            return {"status": "match", "list": "OFAC_SDN", "confidence": 0.95}
        
        return {"status": "clear"}
    
    async def _check_pep_list(self, user_data: Dict) -> Dict:
        """Check if user is a Politically Exposed Person"""
        # In production, this would check against PEP databases
        name = user_data.get("full_name", "").lower()
        
        # Mock PEP check
        if "governor" in name or "mayor" in name or "senator" in name:
            return {"status": "match", "confidence": 0.80}
        
        return {"status": "clear"}
    
    async def _check_transaction_patterns(self, user_id: str, transaction_data: Dict) -> List[str]:
        """Check for suspicious transaction patterns"""
        flags = []
        
        # Check for round number amounts (potential structuring)
        amount = transaction_data.get("amount", 0)
        if amount > 0 and amount % 1000 == 0:
            flags.append("round_amount")
        
        # Check for frequent same-amount transactions
        same_amount_count = await self.db.transactions.count_documents({
            "from_user_id": user_id,
            "amount": amount,
            "created_at": {"$gte": datetime.utcnow() - timedelta(days=7)},
            "status": "completed"
        })
        
        if same_amount_count >= 3:
            flags.append("repeated_amounts")
        
        return flags
    
    async def _check_velocity_patterns(self, user_id: str, transaction_data: Dict) -> List[str]:
        """Check transaction velocity patterns"""
        flags = []
        
        # Check transactions in last hour
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_count = await self.db.transactions.count_documents({
            "from_user_id": user_id,
            "created_at": {"$gte": hour_ago},
            "status": "completed"
        })
        
        if recent_count > 5:
            flags.append("high_velocity")
        
        # Check total amount in last 24 hours
        day_ago = datetime.utcnow() - timedelta(days=1)
        daily_pipeline = [
            {
                "$match": {
                    "from_user_id": user_id,
                    "created_at": {"$gte": day_ago},
                    "status": "completed"
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$amount"}
                }
            }
        ]
        
        daily_total = await self.db.transactions.aggregate(daily_pipeline).to_list(1)
        if daily_total and daily_total[0]["total"] > 10000:
            flags.append("high_daily_volume")
        
        return flags
    
    async def _create_alert(self, alert_data: Dict):
        """Create compliance alert"""
        alert = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow(),
            "status": "open",
            "reviewed_by": None,
            "resolved_at": None,
            **alert_data
        }
        
        await self.db.alerts.insert_one(alert)
        logger.warning(f"Compliance alert created: {alert['type']} for user {alert.get('user_id')}")
    
    async def _log_compliance_action(self, action_data: Dict):
        """Log compliance action for audit trail"""
        try:
            action_data["id"] = str(uuid.uuid4())
            await self.db.compliance_logs.insert_one(action_data)
        except Exception as e:
            logger.error(f"Error logging compliance action: {e}")
    
    async def generate_sar_report(self, user_id: str, transaction_ids: List[str]) -> Dict:
        """Generate Suspicious Activity Report (SAR)"""
        try:
            # Get user and transaction data
            user = await self.db.users.find_one({"id": user_id})
            transactions = await self.db.transactions.find({"id": {"$in": transaction_ids}}).to_list(100)
            
            sar_data = {
                "sar_id": str(uuid.uuid4()),
                "filing_date": datetime.utcnow(),
                "subject_type": "individual",
                "filer_info": {
                    "name": "DalePay Financial Services",
                    "fincen_id": "31000123456789",  # Your FinCEN ID
                    "address": "San Juan, Puerto Rico"
                },
                "subject_info": {
                    "name": user["full_name"],
                    "address": "Encrypted",  # Use decrypted address in production
                    "phone": user["phone"],
                    "identification": f"SSN: ***-**-{user.get('ssn_last_4', 'XXXX')}"
                },
                "suspicious_activity": {
                    "activity_type": "Unusual transaction patterns",
                    "total_amount": sum(t["amount"] for t in transactions),
                    "transaction_count": len(transactions),
                    "date_range": {
                        "start": min(t["created_at"] for t in transactions),
                        "end": max(t["created_at"] for t in transactions)
                    }
                },
                "narrative": self._generate_sar_narrative(user, transactions),
                "status": "draft"
            }
            
            # Store SAR
            await self.db.sar_reports.insert_one(sar_data)
            
            # Log SAR generation
            await self._log_compliance_action({
                "action": "sar_generated",
                "sar_id": sar_data["sar_id"],
                "user_id": user_id,
                "transaction_count": len(transaction_ids),
                "timestamp": datetime.utcnow()
            })
            
            return sar_data
            
        except Exception as e:
            logger.error(f"SAR generation error: {e}")
            return {"status": "error", "message": str(e)}
    
    def _generate_sar_narrative(self, user: Dict, transactions: List[Dict]) -> str:
        """Generate narrative for SAR report"""
        total_amount = sum(t["amount"] for t in transactions)
        narrative = f"""
        Subject {user['full_name']} conducted {len(transactions)} transactions totaling ${total_amount:,.2f} 
        over a period that exhibited unusual patterns inconsistent with normal customer behavior.
        
        The transactions were flagged by our automated monitoring system for:
        - High velocity of transactions
        - Unusual amount patterns
        - Potential structuring activities
        
        Further investigation revealed patterns consistent with suspicious activity requiring SAR filing.
        """
        return narrative.strip()

class FraudDetectionEngine:
    """Advanced fraud detection for DalePay"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.risk_scoring_weights = {
            "velocity": 0.3,
            "amount_patterns": 0.25,
            "device_patterns": 0.2,
            "behavioral": 0.15,
            "time_patterns": 0.1
        }
    
    async def analyze_transaction(self, user_id: str, transaction_data: Dict) -> Dict:
        """Real-time fraud analysis for transactions"""
        try:
            fraud_score = 0.0
            risk_factors = []
            
            # Velocity analysis
            velocity_score = await self._analyze_velocity(user_id, transaction_data)
            fraud_score += velocity_score * self.risk_scoring_weights["velocity"]
            if velocity_score > 0.7:
                risk_factors.append("high_velocity")
            
            # Amount pattern analysis
            amount_score = await self._analyze_amount_patterns(user_id, transaction_data)
            fraud_score += amount_score * self.risk_scoring_weights["amount_patterns"]
            if amount_score > 0.6:
                risk_factors.append("suspicious_amounts")
            
            # Time pattern analysis
            time_score = await self._analyze_time_patterns(user_id, transaction_data)
            fraud_score += time_score * self.risk_scoring_weights["time_patterns"]
            if time_score > 0.5:
                risk_factors.append("unusual_timing")
            
            # Determine risk level
            if fraud_score > 0.8:
                risk_level = "high"
                recommendation = "block_transaction"
            elif fraud_score > 0.6:
                risk_level = "medium"
                recommendation = "manual_review"
            elif fraud_score > 0.3:
                risk_level = "low"
                recommendation = "monitor"
            else:
                risk_level = "minimal"
                recommendation = "approve"
            
            fraud_analysis = {
                "analysis_id": str(uuid.uuid4()),
                "user_id": user_id,
                "fraud_score": fraud_score,
                "risk_level": risk_level,
                "risk_factors": risk_factors,
                "recommendation": recommendation,
                "timestamp": datetime.utcnow(),
                "transaction_data": transaction_data
            }
            
            # Store analysis
            await self.db.fraud_analyses.insert_one(fraud_analysis)
            
            # Create alert for high-risk transactions
            if risk_level in ["high", "medium"]:
                await self._create_fraud_alert(fraud_analysis)
            
            return fraud_analysis
            
        except Exception as e:
            logger.error(f"Fraud analysis error: {e}")
            return {"risk_level": "high", "recommendation": "manual_review", "error": str(e)}
    
    async def _analyze_velocity(self, user_id: str, transaction_data: Dict) -> float:
        """Analyze transaction velocity patterns"""
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        
        # Count transactions in last hour
        recent_count = await self.db.transactions.count_documents({
            "from_user_id": user_id,
            "created_at": {"$gte": hour_ago}
        })
        
        # Normal velocity threshold
        if recent_count > 10:
            return 1.0  # Maximum risk
        elif recent_count > 5:
            return 0.7
        elif recent_count > 3:
            return 0.4
        else:
            return 0.1
    
    async def _analyze_amount_patterns(self, user_id: str, transaction_data: Dict) -> float:
        """Analyze suspicious amount patterns"""
        amount = transaction_data.get("amount", 0)
        risk_score = 0.0
        
        # Check for round amounts (potential structuring)
        if amount > 0 and amount % 1000 == 0:
            risk_score += 0.3
        
        # Check for amounts just under reporting thresholds
        if 9500 <= amount <= 9999:
            risk_score += 0.8  # High risk for structuring
        
        # Check for repeated exact amounts
        week_ago = datetime.utcnow() - timedelta(days=7)
        same_amount_count = await self.db.transactions.count_documents({
            "from_user_id": user_id,
            "amount": amount,
            "created_at": {"$gte": week_ago}
        })
        
        if same_amount_count >= 3:
            risk_score += 0.5
        
        return min(risk_score, 1.0)
    
    async def _analyze_time_patterns(self, user_id: str, transaction_data: Dict) -> float:
        """Analyze unusual timing patterns"""
        current_hour = datetime.utcnow().hour
        
        # Transactions during unusual hours (late night/early morning)
        if current_hour < 6 or current_hour > 23:
            return 0.6
        
        # Weekend transactions (higher risk for business accounts)
        if datetime.utcnow().weekday() >= 5:
            return 0.3
        
        return 0.1
    
    async def _create_fraud_alert(self, fraud_analysis: Dict):
        """Create fraud alert"""
        alert = {
            "id": str(uuid.uuid4()),
            "type": "fraud_alert",
            "user_id": fraud_analysis["user_id"],
            "description": f"Fraud score: {fraud_analysis['fraud_score']:.2f} - {', '.join(fraud_analysis['risk_factors'])}",
            "severity": "high" if fraud_analysis["risk_level"] == "high" else "medium",
            "status": "open",
            "created_at": datetime.utcnow(),
            "data": fraud_analysis
        }
        
        await self.db.alerts.insert_one(alert)
        logger.warning(f"Fraud alert created for user {fraud_analysis['user_id']}")
