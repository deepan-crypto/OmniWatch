const axios = require("axios");

class AIClient {
  constructor(geminiApiKey) {
    // Note: geminiApiKey is passed but actual API calls go to Python backend
    this.pythonAiUrl = process.env.PYTHON_AI_URL || "http://localhost:8000";
    this.httpClient = axios.create({
      baseURL: this.pythonAiUrl,
      timeout: 30000,
    });
  }

  async generateMerchantStrategy(telemetry, merchantData) {
    try {
      const response = await this.httpClient.post("/api/ai/vyapar/generate-strategy", {
        merchantId: merchantData.id,
        merchantName: merchantData.name,
        telemetry: {
          footTraffic: telemetry.footTraffic || "normal",
          weather: telemetry.weather || "clear",
          salesVelocity: telemetry.salesVelocity || "normal",
          surplusItems: telemetry.surplusItems || [],
          hour: telemetry.hour || new Date().getHours(),
          dayOfWeek: telemetry.dayOfWeek || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()],
        },
        location: merchantData.location,
        category: merchantData.category,
      });

      return response.data.strategy;
    } catch (error) {
      console.error("[AIClient] Vyapar strategy generation failed:", error.message);
      throw new Error(`Vyapar AI unavailable: ${error.message}`);
    }
  }

  async matchConsumerWithDeal(userQuery, availableDeals) {
    try {
      const response = await this.httpClient.post("/api/ai/scout/match-deal", {
        userId: "consumer",
        userQuery,
        availableDealcs: availableDeals,
      });

      return response.data.match;
    } catch (error) {
      console.error("[AIClient] Scout matching failed:", error.message);
      throw new Error(`Scout AI unavailable: ${error.message}`);
    }
  }

  async validateImagePrompt(prompt) {
    try {
      const response = await this.httpClient.post("/api/pipeline/validate-image-prompt", {
        prompt,
      });

      return response.data.refined;
    } catch (error) {
      console.error("[AIClient] Image prompt validation failed:", error.message);
      throw new Error(`Image pipeline unavailable: ${error.message}`);
    }
  }

  async healthCheck() {
    try {
      const response = await this.httpClient.get("/health");
      return response.data;
    } catch (error) {
      console.error("[AIClient] Health check failed:", error.message);
      return { status: "unhealthy", error: error.message };
    }
  }
}

module.exports = AIClient;
