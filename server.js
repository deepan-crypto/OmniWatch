require("dotenv").config();
const express = require("express");
const cors = require("cors");
const VyaparAI = require("./src/agents/vyapar-ai");
const ScoutAI = require("./src/agents/scout-ai");
// const VyaparMonitor = require("./src/services/vyapar-monitor");  // REPLACED BY PYTHON VERSION
// const WeatherService = require("./src/services/weather-service");  // REPLACED BY PYTHON VERSION
const initVyaparRoutes = require("./src/routes/vyapar-routes");
const initScoutRoutes = require("./src/routes/scout-routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI agents
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn(
    "WARNING: GOOGLE_GEMINI_API_KEY not set. Set it in .env file for full functionality."
  );
  console.log("For now, starting in DEMO mode with placeholder responses.");
}

const vyaparAI = new VyaparAI(geminiApiKey);
const scoutAI = new ScoutAI(geminiApiKey);
// const vyaparMonitor = new VyaparMonitor(vyaparAI);  // REMOVED - Now using Python version

// Register test merchants
vyaparAI.registerMerchant("merchant_coimbatore_001", {
  name: "Coimbatore Spice House",
  location: "Coimbatore",
  category: "Indian Restaurant",
  inventory: [
    { id: "item_001", name: "Gobi Manchurian", quantity: 100, basePrice: 250, margin: 40 },
    { id: "item_002", name: "Biryani", quantity: 60, basePrice: 350, margin: 50 },
    { id: "item_003", name: "Dosa", quantity: 150, basePrice: 150, margin: 35 },
  ],
});

vyaparAI.registerMerchant("merchant_bangalore_001", {
  name: "Bangalore Brew Co",
  location: "Bangalore",
  category: "Cafe",
  inventory: [
    { id: "item_101", name: "Cappuccino", quantity: 200, basePrice: 150, margin: 45 },
    { id: "item_102", name: "Cold Brew", quantity: 120, basePrice: 180, margin: 50 },
  ],
});

// 🚀 AUTOMATED MONITORING NOW RUNS IN PYTHON (vyapar_monitor.py)
// The Python service uses APScheduler to run every 5 minutes
// Replaces old node-schedule implementation
console.log("\n✅ VYAPAR AI SETUP COMPLETE");
console.log("   → Python service (port 8000) handles automated monitoring");
console.log("   → Uses APScheduler instead of node-schedule");
console.log("   → Scheduled jobs trigger every 5 minutes\n");


// Routes
app.use("/api/vyapar", initVyaparRoutes(vyaparAI));
app.use("/api/scout", initScoutRoutes(scoutAI));

// 📊 MONITORING STATUS ENDPOINT
app.get("/api/vyapar/monitor/status", (req, res) => {
  const status = vyaparMonitor.getStatus();
  res.json({
    success: true,
    monitoring: status,
    message: "Vyapar AI Monitor Status",
  });
});

// ⏹️ STOP MONITORING
app.post("/api/vyapar/monitor/stop/:merchantId", (req, res) => {
  const { merchantId } = req.params;
  vyaparMonitor.stopMonitoringMerchant(merchantId);
  res.json({
    success: true,
    message: `Monitoring stopped for merchant: ${merchantId}`,
  });
});

// ▶️ START MONITORING
app.post("/api/vyapar/monitor/start/:merchantId", (req, res) => {
  const { merchantId } = req.params;
  const merchant = vyaparAI.merchants.get(merchantId);
  
  if (!merchant) {
    return res.status(404).json({ error: "Merchant not found" });
  }

  vyaparMonitor.startMonitoringMerchant(merchantId, merchant.name, WeatherService);
  res.json({
    success: true,
    message: `Monitoring started for merchant: ${merchant.name}`,
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    agents: {
      vyapar: "active",
      scout: "active",
    },
  });
});

// Root endpoint with API documentation
app.get("/", (req, res) => {
  res.json({
    name: "Paytm OmniMatch",
    version: "1.0.0",
    description: "Dual-Agent Local Commerce Ecosystem",
    endpoints: {
      vyapar: {
        description: "Merchant AI Agent for flash deals",
        endpoints: [
          { method: "POST", path: "/api/vyapar/merchant/register" },
          { method: "POST", path: "/api/vyapar/merchant/generate-deal" },
          { method: "GET", path: "/api/vyapar/deals/active" },
          { method: "GET", path: "/api/vyapar/deals/:dealId" },
          { method: "POST", path: "/api/vyapar/deals/:dealId/complete" },
          { method: "GET", path: "/api/vyapar/registry/history" },
        ],
      },
      scout: {
        description: "Consumer AI Agent for deal matching",
        endpoints: [
          { method: "POST", path: "/api/scout/session/create" },
          { method: "POST", path: "/api/scout/query" },
          { method: "POST", path: "/api/scout/chat" },
          { method: "GET", path: "/api/scout/session/:userId" },
          { method: "GET", path: "/api/scout/sessions/all" },
        ],
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.ENVIRONMENT === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        🚀 Paytm OmniMatch Server Started                   ║
║        Dual-Agent Local Commerce Ecosystem                 ║
╠════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                               ║
║  Environment: ${process.env.ENVIRONMENT || "development"}                            ║
║  Vyapar AI (Merchant Agent): Active                        ║
║  Scout AI (Consumer Agent): Active                         ║
║  ONDC Registry: Ready                                      ║
╠════════════════════════════════════════════════════════════╣
║  API Docs: http://localhost:${PORT}                         ║
║  Health: http://localhost:${PORT}/health                    ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
