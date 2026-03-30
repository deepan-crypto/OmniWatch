# Vyapar AI Automated Pipeline

## Overview
The **Vyapar AI Automated Pipeline** transforms merchant AI from manual trigger-based to fully autonomous, 24/7 transaction monitoring with proactive flash deal generation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   VYAPAR AI SYSTEM                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  NODE.JS BACKEND (Server.js)                                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    VyaparMonitor Service                       │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  Every 5 minutes (Node-Schedule):                       │  │  │
│  │  │                                                         │  │  │
│  │  │  1. Check Current Transactions                         │  │  │
│  │  │     └─> Simulate real-time Paytm QR data              │  │  │
│  │  │                                                         │  │  │
│  │  │  2. Calculate Sales Drop                              │  │  │
│  │  │     └─> Compare: Current vs Historical Average        │  │  │
│  │  │                                                         │  │  │
│  │  │  3. Analyze Drop Severity                             │  │  │
│  │  │     └─> If drop > 30% → SEVERE ALERT                │  │  │
│  │  │                                                         │  │  │
│  │  │  4. Trigger Vyapar AI                                 │  │  │
│  │  │     └─> generateProactiveAlert()                      │  │  │
│  │  │                                                         │  │  │
│  │  │  5. Get Real-time Context                             │  │  │
│  │  │     ├─> Weather Service (time-based)                 │  │  │
│  │  │     ├─> Foot Traffic Simulation (hour-based)         │  │  │
│  │  │     └─> Inventory Surplus Analysis                   │  │  │
│  │  │                                                         │  │  │
│  │  │  6. AI Decision Making                                │  │  │
│  │  │     ├─> Score items by weather impact                │  │  │
│  │  │     ├─> Score by foot traffic urgency               │  │  │
│  │  │     ├─> Calculate optimal discount                   │  │  │
│  │  │     └─> Generate DALL-E image prompt                │  │  │
│  │  │                                                         │  │  │
│  │  │  7. Register Deal in ONDC                             │  │  │
│  │  │     └─> Add to ONDC Registry with 30-min expiry      │  │  │
│  │  │                                                         │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                  │  │
│  │  Supported APIs:                                                │  │
│  │  - GET /api/vyapar/monitor/status    → Real-time metrics      │  │
│  │  - POST /api/vyapar/monitor/start    → Start monitoring       │  │
│  │  - POST /api/vyapar/monitor/stop     → Pause monitoring       │  │
│  │                                                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                                             │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │           VyaparMonitoringDashboard Component                  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  📊 Real-time Monitoring Status Display                 │  │  │
│  │  │  ├─ Active/Inactive Status                             │  │  │
│  │  │  ├─ Merchants Being Monitored Count                    │  │  │
│  │  │  ├─ Per-Merchant Metrics Table                         │  │  │
│  │  │  │   ├─ Current Transactions                           │  │  │
│  │  │  │   ├─ Historical Average                             │  │  │
│  │  │  │   ├─ Last Alert Timestamp                           │  │  │
│  │  │  │   └─ Start/Stop Controls                            │  │  │
│  │  │  └─ Auto-refresh every 30 seconds                      │  │  │
│  │  │                                                         │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  DATA SOURCES                                                        │
│  ├─ Paytm QR Transactions (Simulated for now)                       │
│  ├─ Weather Service (Time-based patterns)                            │
│  ├─ Foot Traffic Simulation (Hour-based rush hours)                 │
│  └─ Merchant Inventory (Registered in Vyapar AI)                    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. **VyaparMonitor (src/services/vyapar-monitor.js)**
The core scheduling and monitoring service.

**Key Methods:**
- `startMonitoringMerchant(merchantId, merchantName, weatherService)`
  - Registers a merchant for continuous monitoring
  - Starts 5-minute interval checks using node-schedule
  
- `checkAndTriggerAlert(merchantId, weatherService)`
  - Simulates real-time transaction data
  - Calculates sales drop percentage
  - Triggers alert if drop > 30%
  - (In production: connects to Paytm webhook)

- `triggerProactiveAlert(merchantId, currentTx, avgTx, weatherService)`
  - Calls Vyapar AI to analyze situation
  - Gathers real-time context (weather, traffic, inventory)
  - Generates flash deal automatically
  - Registers deal in ONDC

### 2. **Weather Service (src/services/weather-service.js)**
Provides context-aware weather data.

**Features:**
- Time-based weather patterns (morning, afternoon, evening, night)
- Weather impact scoring (rainy = 1.8x for hot beverages)
- Demand surge prediction based on weather + time
- 10-minute caching to avoid redundant calls

### 3. **Frontend Dashboard (frontend/src/VyaparMonitoringDashboard.jsx)**
Real-time visualization of monitoring status.

**Displays:**
- Current monitoring status (Active/Inactive)
- Number of merchants being monitored
- Per-merchant metrics (current txns, average, last alert)
- Start/Stop controls for each merchant
- Auto-refresh every 30 seconds

---

## How It Works: Step-by-Step

### Scenario: Sales Drop Detection

```
⏰ T=0 minutes
├─ System running, monitoring "Coimbatore Spice House"
├─ Historical average: 45 transactions per 5-min window
└─ Current window: 15 transactions

📊 T=5 minutes
├─ Check triggered by scheduler
├─ Current transactions: 15
├─ Historical average: 45
├─ Drop calculation: (45 - 15) / 45 = 66.7%
├─ Severity: SEVERE (> 30%)
└─ ✅ Condition met → Proceed to alert

🤖 T=5 minutes 30 seconds
├─ Call Vyapar AI Agent
├─ Gather context:
│  ├─ Weather: "Rainy" (time-based, 14:30 - afternoon)
│  ├─ Foot Traffic: "Low" (hour-based simulation)
│  └─ Inventory: [Manchurian (100), Biryani (60), Dosa (150)]
│
├─ AI Scoring (multiplier = weather × traffic × margin):
│  ├─ Manchurian: 1.8 (rainy ×1.8) × 1.4 (low traffic) × 40% margin = HIGH SCORE
│  ├─ Biryani: 1.0 (normal) × 1.4 × 50% margin = MEDIUM SCORE
│  └─ Dosa: 1.0 × 1.4 × 35% margin = MEDIUM SCORE
│
├─ Decision: Select "Gobi Manchurian" (highest score)
├─ Discount: 60% × 40% (margin) + 10% (urgency) = 34% OFF
└─ Output: "🌧️ Rainy weather boost! Gobi Manchurian 34% OFF"

📋 T=6 minutes
├─ Register deal in ONDC Registry:
│  ├─ Item: "Gobi Manchurian"
│  ├─ Original: ₹250
│  ├─ Discount: 34%
│  ├─ Final: ₹165
│  ├─ Status: "ACTIVE"
│  └─ Expires: In 30 minutes
│
├─ Dashboard updates:
│  ├─ Show "Last Alert: 14:35"
│  ├─ Display generated deal
│  └─ Highlight merchant in monitoring table
│
└─ Consumer Apps Notified:
   ├─ Scout AI queries ONDC
   ├─ Recommends deal to matching consumers
   └─ "Found: Gobi Manchurian @ Spice House - Save ₹85!"

⏰ T=10 minutes
├─ Next check triggered
├─ (Re-check transaction volume)
└─ (Process repeats...)
```

---

## Configuration

### Monitoring Frequency
- **Current:** Every 5 minutes
- **To change:** Edit `VyaparMonitor` line: `schedule.scheduleJob('*/{MINUTES} * * * *', ...)`

### Alert Threshold
- **Current:** > 30% sales drop
- **To change:** Edit line: `if (isSevere && ...)`

### Deal Expiry
- **Current:** 30 minutes
- **To change:** Edit line: `expiresAt: new Date(Date.now() + 30 * 60 * 1000)`

### Alert Cooldown
- **Current:** 15 minutes between consecutive alerts
- **To change:** Edit line: `lastAlert && Date.now() - merchantData.lastAlert > 15 * 60 * 1000`

---

## API Endpoints

### 1. **Get Monitoring Status**
```bash
GET /api/vyapar/monitor/status

Response:
{
  "success": true,
  "monitoring": {
    "isMonitoring": true,
    "activeMonitors": 2,
    "merchants": [
      {
        "merchantId": "merchant_coimbatore_001",
        "merchantName": "Coimbatore Spice House",
        "currentTransactions": 18,
        "averageTransactions": 45,
        "lastAlert": "2026-03-30 14:35:22",
        "isMonitoring": true
      },
      { ... }
    ]
  }
}
```

### 2. **Start Monitoring a Merchant**
```bash
POST /api/vyapar/monitor/start/{merchantId}

Response:
{
  "success": true,
  "message": "Monitoring started for merchant: Coimbatore Spice House"
}
```

### 3. **Stop Monitoring a Merchant**
```bash
POST /api/vyapar/monitor/stop/{merchantId}

Response:
{
  "success": true,
  "message": "Monitoring stopped for merchant: merchant_coimbatore_001"
}
```

---

## Production Deployment Considerations

### 1. **Replace Simulated Data**
Currently, transaction data is simulated. For production:

```javascript
// Instead of:
const currentTransactions = Math.floor(Math.random() * 50) + 5;

// Use Paytm Webhook:
app.post('/webhook/paytm-transaction', (req, res) => {
  const { merchantId, transactionData } = req.body;
  recordTransaction(merchantId, transactionData);
  // Webhook updates monitoring system in real-time
});
```

### 2. **Real Weather Integration**
```javascript
// Instead of time-based patterns, use real API:
const response = await fetch(`https://api.openweathermap.org/...`);
const weather = await response.json();
```

### 3. **Real Foot Traffic Data**
```javascript
// Connect to:
// - Google Foot Traffic API
// - Sensor data from store
// - Phone density analytics
```

### 4. **Database for Metrics**
Store transaction history in database instead of memory:
```javascript
// Current (Memory):
transactionHistory: []

// Production (Database):
await db.transactions.insertOne({
  merchantId, timestamp, count
});
```

### 5. **Distributed Monitoring**
Use a message queue for scaling:
```javascript
// Publish to Redis/RabbitMQ:
queue.publish('monitoring:check', { merchantId });

// Multiple workers consume and process
```

---

## Testing the Pipeline

### 1. **Launch Monitoring Dashboard**
- Click "🤖 Monitor" button in App
- You'll see merchants and real-time metrics

### 2. **Watch Automatic Alerts**
- System checks every 5 minutes
- When a "severe drop" is simulated, you'll see:
  - "Last Alert" timestamp updated
  - "🟢 Monitoring" status highlighted
  - Console logs showing alert details

### 3. **Manually Trigger Check** (Optional)
```bash
curl -X POST http://localhost:5000/api/vyapar/monitor/start/merchant_coimbatore_001
```

### 4. **View Generated Deals**
- Switch to "Website" view
- Go to "ONDC Registry" tab
- Click "View Live Dealcs"
- See auto-generated deals from monitoring

---

## Comparison: Manual vs Automated

| Aspect | Manual (Before) | Automated (Now) |
|--------|-----------------|-----------------|
| **Trigger** | User clicks button | Scheduler every 5 min |
| **Data Input** | Manual form fields | Auto-gathered system |
| **Decision Making** | User decides | AI agent decides |
| **Response Time** | Minutes to hours | 5 minutes |
| **24/7 Coverage** | ❌ No | ✅ Yes |
| **Scalability** | ~10 merchants max | Unlimited merchants |
| **Context Awareness** | Limited | Weather + traffic + inventory |
| **Revenue Recovery** | Reactive | Proactive |

---

## Key Metrics to Monitor

1. **Alert Frequency** - How often severe drops detected
2. **Alert Response Time** - How fast deal is generated
3. **Deal Conversion** - % of auto-generated deals purchased
4. **Revenue Recovery** - Impact on revenue during low-traffic periods
5. **System Uptime** - Monitor task reliability

---

## Next Steps

1. ✅ **Current State:** Fully automated monitoring with simulated data
2. 🔄 **Next Phase:** Connect real Paytm QR webhook for live transaction data
3. 🌍 **Phase 3:** Integrate real weather and foot traffic APIs
4. 📊 **Phase 4:** Add analytics dashboard and reporting
5. 🚀 **Phase 5:** Deploy to production with distributed workers

