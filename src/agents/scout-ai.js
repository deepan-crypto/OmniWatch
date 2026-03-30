const AIClient = require("../utils/ai-client");
const ONDCRegistry = require("../registry/ondc-registry");

class ScoutAI {
  constructor(geminiApiKey) {
    this.aiClient = new AIClient(geminiApiKey);
    this.userSessions = new Map();
  }

  createUserSession(userId) {
    this.userSessions.set(userId, {
      userId,
      createdAt: new Date(),
      queries: [],
      recommendations: [],
    });
    return userId;
  }

  async matchUserWithDeal(userId, userQuery, filters = {}) {
    // Step 1: Get available deals from ONDC Registry
    const availableDeals = ONDCRegistry.getFilteredDeals(filters);

    if (availableDeals.length === 0) {
      console.log(`[Scout AI] No deals available for query: "${userQuery}"`);
      return {
        success: false,
        message: "No matching deals available in your area right now",
        recommendations: [],
      };
    }

    console.log(`[Scout AI] Found ${availableDeals.length} deals for matching`);

    // Step 2: Call Gemini AI to find best match
    const matchResult = await this.aiClient.matchConsumerWithDeal(userQuery, availableDeals);

    if (matchResult.selectedDealIndex < 0 || matchResult.selectedDealIndex >= availableDeals.length) {
      return {
        success: false,
        message: "Could not find an optimal match",
        recommendations: [],
      };
    }

    const selectedDeal = availableDeals[matchResult.selectedDealIndex];

    // Step 3: Enrich recommendation with deal details
    const recommendation = {
      dealId: selectedDeal.id,
      itemName: selectedDeal.itemName,
      merchantName: selectedDeal.merchantName,
      location: selectedDeal.location,
      originalPrice: selectedDeal.originalPrice,
      finalPrice: selectedDeal.finalPrice,
      discountPercentage: selectedDeal.discountPercentage,
      imageUrl: selectedDeal.imageUrl,
      qrCode: selectedDeal.qrCode,
      scoutRecommendation: matchResult.recommendation,
      scoutReasoning: matchResult.reasoning,
      actionSuggestion: matchResult.actionSuggestion,
    };

    // Step 4: Track session
    if (this.userSessions.has(userId)) {
      const session = this.userSessions.get(userId);
      session.queries.push(userQuery);
      session.recommendations.push({
        query: userQuery,
        dealId: selectedDeal.id,
        timestamp: new Date(),
      });
    }

    console.log(
      `[Scout AI] Matched user "${userId}" with deal: ${selectedDeal.itemName} from ${selectedDeal.merchantName}`
    );

    return {
      success: true,
      recommendation,
      allAvailableDeals: availableDeals.map((d) => ({
        id: d.id,
        itemName: d.itemName,
        merchantName: d.merchantName,
        finalPrice: d.finalPrice,
        discountPercentage: d.discountPercentage,
      })),
    };
  }

  async processConversation(userId, userMessage) {
    // Natural conversation flow for Scout AI
    try {
      // Create session if doesn't exist
      if (!this.userSessions.has(userId)) {
        this.createUserSession(userId);
      }

      // Use the message as a search query
      const result = await this.matchUserWithDeal(userId, userMessage);

      return result;
    } catch (error) {
      console.error("[Scout AI] Conversation error:", error);
      return {
        success: false,
        message: "Sorry, I couldn't process your request. Please try again.",
        error: error.message,
      };
    }
  }

  getUserSession(userId) {
    return this.userSessions.get(userId);
  }

  getAllSessions() {
    return Array.from(this.userSessions.values());
  }
}

module.exports = ScoutAI;
