"""
Vyapar Monitor - Python Implementation using APScheduler
Replaces Node.js node-schedule with APScheduler
Monitors merchants for sales drops every 5 minutes and triggers AI alerts
"""

import os
import asyncio
import logging
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import requests
from typing import Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [Vyapar Monitor] %(message)s'
)
logger = logging.getLogger(__name__)

# Node.js backend URL
NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")

class VyaparMonitor:
    """
    Monitors merchant sales and automatically triggers alerts every 5 minutes
    Uses APScheduler instead of node-schedule
    """
    
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.merchants: Dict[str, dict] = {}  # Store merchant telemetry history
        self.monitoring_jobs: Dict[str, any] = {}  # Store job IDs
        self.is_running = False
        
    def start(self):
        """Start the APScheduler"""
        if not self.is_running:
            self.scheduler.start()
            self.is_running = True
            logger.info("✅ VyaparMonitor scheduler started")
    
    def stop(self):
        """Stop the APScheduler"""
        if self.is_running:
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("⏹️ VyaparMonitor scheduler stopped")
    
    def start_monitoring_merchant(self, merchant_id: str, merchant_name: str):
        """
        Start monitoring a merchant - runs every 5 minutes
        Equivalent to: schedule.scheduleJob(`*\/5 * * * *`, callback)
        """
        if merchant_id in self.monitoring_jobs:
            logger.info(f"Already monitoring {merchant_name}")
            return
        
        # Initialize telemetry history
        if merchant_id not in self.merchants:
            self.merchants[merchant_id] = {
                "merchant_name": merchant_name,
                "transaction_history": [],
                "average_transactions": 0,
                "last_alert": None,
            }
        
        # Schedule job to run every 5 minutes using cron trigger
        job = self.scheduler.add_job(
            func=self._check_and_trigger_alert,
            trigger=CronTrigger(minute="*/5"),
            args=(merchant_id,),
            id=f"monitor_{merchant_id}",
            name=f"Monitor {merchant_name}",
            replace_existing=True
        )
        
        self.monitoring_jobs[merchant_id] = job
        logger.info(f"✅ Started monitoring: {merchant_name}")
    
    def stop_monitoring_merchant(self, merchant_id: str):
        """Stop monitoring a specific merchant"""
        if merchant_id in self.monitoring_jobs:
            job = self.monitoring_jobs[merchant_id]
            self.scheduler.remove_job(job.id)
            del self.monitoring_jobs[merchant_id]
            logger.info(f"⏹️ Stopped monitoring merchant: {merchant_id}")
    
    def _check_and_trigger_alert(self, merchant_id: str):
        """
        Check if merchant's sales dropped and trigger alert automatically
        Called every 5 minutes by the scheduler
        """
        merchant_data = self.merchants.get(merchant_id)
        if not merchant_data:
            return
        
        # Simulate real-time transaction data
        import random
        current_transactions = random.randint(5, 55)
        
        merchant_data["transaction_history"].append({
            "timestamp": datetime.now().isoformat(),
            "count": current_transactions,
        })
        
        # Keep only last 12 data points (1 hour of 5-minute intervals)
        if len(merchant_data["transaction_history"]) > 12:
            merchant_data["transaction_history"].pop(0)
        
        # Calculate average
        recent_counts = [t["count"] for t in merchant_data["transaction_history"]]
        historical_average = sum(recent_counts) // len(recent_counts)
        merchant_data["average_transactions"] = historical_average
        
        # Calculate drop percentage
        if historical_average > 0:
            drop_percentage = ((historical_average - current_transactions) / historical_average) * 100
        else:
            drop_percentage = 0
        
        is_severe = drop_percentage > 30
        
        logger.info(
            f"{merchant_data['merchant_name']}: Current={current_transactions}, "
            f"Avg={historical_average}, Drop={drop_percentage:.1f}%"
        )
        
        # Trigger alert if drop is severe (>30%)
        now = datetime.now()
        last_alert = merchant_data.get("last_alert")
        alert_cooldown = 15 * 60  # 15 minutes in seconds
        
        if is_severe and (last_alert is None or (now - last_alert).total_seconds() > alert_cooldown):
            logger.warning(
                f"🚨 SEVERE DROP DETECTED for {merchant_data['merchant_name']}! "
                f"Drop: {drop_percentage:.1f}%"
            )
            self._trigger_proactive_alert(
                merchant_id, 
                current_transactions, 
                historical_average
            )
            merchant_data["last_alert"] = now
    
    def _trigger_proactive_alert(
        self, 
        merchant_id: str, 
        current_transactions: int, 
        historical_average: int
    ):
        """
        Trigger Node.js API to generate flash deal from sales drop
        Makes HTTP call to Node.js endpoint: POST /api/vyapar/merchant/proactive-alert
        """
        try:
            merchant_data = self.merchants[merchant_id]
            
            # Get merchant info from Node.js backend
            headers = {"Content-Type": "application/json"}
            
            # Prepare payload for Node.js backend
            payload = {
                "merchantName": merchant_data["merchant_name"],
                "paytmGatewayData": {
                    "currentTransactions": current_transactions,
                    "historicalAverage": historical_average,
                },
                "realTimeContext": {
                    "weather": "clear",
                    "trafficLevel": self._simulate_foot_traffic(),
                    "hour": datetime.now().hour,
                    "dayOfWeek": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][datetime.now().weekday()],
                },
                "inventorySurplus": 30,  # Example surplus items
            }
            
            # Call Node.js endpoint
            response = requests.post(
                f"{NODE_BACKEND_URL}/api/vyapar/merchant/proactive-alert",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                alert_data = result.get("result", {})
                logger.info(
                    f"✅ Alert Generated: \"{alert_data.get('notification_message')}\" - "
                    f"Item: {alert_data.get('selected_item')}"
                )
            else:
                logger.error(f"Failed to generate alert: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error triggering alert: {e}")
        except Exception as e:
            logger.error(f"Unexpected error in trigger_proactive_alert: {e}")
    
    def _simulate_foot_traffic(self) -> str:
        """Simulate foot traffic based on hour of day"""
        hour = datetime.now().hour
        traffic_map = {
            # Peak hours: 12-14 (lunch), 18-20 (dinner)
            8: "low",
            9: "low",
            10: "moderate",
            11: "moderate",
            12: "high",
            13: "high",
            14: "moderate",
            15: "low",
            16: "low",
            17: "moderate",
            18: "high",
            19: "high",
            20: "moderate",
            21: "low",
        }
        return traffic_map.get(hour, "low")
    
    def get_status(self) -> Dict:
        """Get current monitoring status"""
        return {
            "is_running": self.is_running,
            "merchants_monitored": len(self.monitoring_jobs),
            "active_jobs": list(self.monitoring_jobs.keys()),
            "merchant_data": self.merchants,
        }


# Global instance
vyapar_monitor = None

def init_vyapar_monitor(merchants_config: List[Dict] = None) -> VyaparMonitor:
    """
    Initialize and start the Vyapar Monitor
    
    Args:
        merchants_config: List of merchant configs to start monitoring
        Example: [
            {"id": "merchant_001", "name": "Coimbatore Spice House"},
            {"id": "merchant_002", "name": "Bangalore Brew Co"},
        ]
    """
    global vyapar_monitor
    
    vyapar_monitor = VyaparMonitor()
    vyapar_monitor.start()
    
    if merchants_config:
        for merchant in merchants_config:
            vyapar_monitor.start_monitoring_merchant(
                merchant.get("id"),
                merchant.get("name")
            )
    
    logger.info("\n✅ VYAPAR AI AUTOMATED PIPELINE STARTED (Python)")
    logger.info("   → Monitoring merchants every 5 minutes")
    logger.info("   → Auto-detects sales drops and generates deals\n")
    
    return vyapar_monitor

def get_vyapar_monitor() -> Optional[VyaparMonitor]:
    """Get the global VyaparMonitor instance"""
    return vyapar_monitor
