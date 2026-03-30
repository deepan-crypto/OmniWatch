const express = require("express");

const router = express.Router();

function initScoutRoutes(scoutAI) {
  // Create a user session
  router.post("/session/create", (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      scoutAI.createUserSession(userId);

      res.json({
        success: true,
        message: `Session created for user ${userId}`,
        userId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Query Scout AI with natural language
  router.post("/query", async (req, res) => {
    try {
      const { userId, query, filters } = req.body;

      if (!userId || !query) {
        return res.status(400).json({ error: "userId and query are required" });
      }

      const result = await scoutAI.matchUserWithDeal(userId, query, filters || {});

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Conversational endpoint
  router.post("/chat", async (req, res) => {
    try {
      const { userId, message } = req.body;

      if (!userId || !message) {
        return res.status(400).json({ error: "userId and message are required" });
      }

      const result = await scoutAI.processConversation(userId, message);

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user session history
  router.get("/session/:userId", (req, res) => {
    try {
      const session = scoutAI.getUserSession(req.params.userId);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({
        success: true,
        session,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all sessions (for analytics)
  router.get("/sessions/all", (req, res) => {
    try {
      const sessions = scoutAI.getAllSessions();

      res.json({
        success: true,
        totalSessions: sessions.length,
        sessions,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = initScoutRoutes;
