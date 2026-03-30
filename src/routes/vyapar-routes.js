const express = require("express");
const VyaparAI = require("../agents/vyapar-ai");
const ONDCRegistry = require("../registry/ondc-registry");

const router = express.Router();

function initVyaparRoutes(vyaparAI) {
  // Register a merchant
  router.post("/merchant/register", (req, res) => {
    try {
      const { merchantId, name, location, category, inventory } = req.body;

      if (!merchantId || !name || !location) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      vyaparAI.registerMerchant(merchantId, {
        name,
        location,
        category,
        inventory,
      });

      res.json({
        success: true,
        message: `Merchant ${name} registered successfully`,
        merchantId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Trigger flash deal generation based on telemetry
  router.post("/merchant/generate-deal", async (req, res) => {
    try {
      const { merchantId, telemetry } = req.body;

      if (!merchantId) {
        return res.status(400).json({ error: "merchantId is required" });
      }

      const deal = await vyaparAI.generateFlashDeal(merchantId, telemetry);

      res.json({
        success: true,
        message: "Flash deal generated and registered",
        deal,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get active deals from registry
  router.get("/deals/active", (req, res) => {
    try {
      const activeDeals = ONDCRegistry.getActiveDeals();
      res.json({
        success: true,
        dealCount: activeDeals.length,
        dealcs: activeDeals,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific deal by ID
  router.get("/deals/:dealId", (req, res) => {
    try {
      const deal = ONDCRegistry.getDealById(req.params.dealId);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      res.json({ success: true, deal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Complete a transaction
  router.post("/deals/:dealId/complete", (req, res) => {
    try {
      const { transactionId } = req.body;
      if (!transactionId) {
        return res.status(400).json({ error: "transactionId is required" });
      }

      const deal = ONDCRegistry.completeDeal(req.params.dealId, transactionId);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }

      res.json({
        success: true,
        message: "Deal completed successfully",
        deal,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get registry history
  router.get("/registry/history", (req, res) => {
    try {
      const history = ONDCRegistry.getDealsHistory();
      res.json({
        success: true,
        totalRecords: history.length,
        history: history.slice(-50), // Last 50 records
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proactive sales drop alert with flash deal recommendation
  router.post("/merchant/proactive-alert", (req, res) => {
    try {
      const { merchantName, paytmGatewayData, realTimeContext, inventorySurplus, merchantDescription } = req.body;

      if (!merchantName || !paytmGatewayData || !realTimeContext || !inventorySurplus) {
        return res.status(400).json({
          error: "Missing required fields: merchantName, paytmGatewayData, realTimeContext, inventorySurplus",
        });
      }

      // Validate paytmGatewayData
      if (!paytmGatewayData.currentTransactions || !paytmGatewayData.historicalAverage) {
        return res.status(400).json({
          error: "paytmGatewayData must contain currentTransactions and historicalAverage",
        });
      }

      const alertResponse = vyaparAI.generateProactiveAlert(
        paytmGatewayData,
        realTimeContext,
        inventorySurplus,
        merchantName,
        merchantDescription || null
      );

      res.json({
        success: true,
        message: "Proactive alert generated successfully",
        result: alertResponse,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = initVyaparRoutes;
