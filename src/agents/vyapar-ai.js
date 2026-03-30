const AIClient = require("../utils/ai-client");
const ImageGenerator = require("../utils/image-generator");
const QRCodeGenerator = require("../utils/qr-generator");
const ONDCRegistry = require("../registry/ondc-registry");

class VyaparAI {
  constructor(geminiApiKey) {
    this.aiClient = new AIClient(geminiApiKey);
    this.merchants = new Map();
  }

  registerMerchant(merchantId, merchantData) {
    this.merchants.set(merchantId, {
      id: merchantId,
      name: merchantData.name,
      location: merchantData.location,
      category: merchantData.category,
      inventory: merchantData.inventory || [],
      ...merchantData,
    });
    console.log(`[Vyapar AI] Merchant registered: ${merchantData.name}`);
  }

  async processVyaparTelemetry(merchantId, telemetry) {
    const merchant = this.merchants.get(merchantId);
    if (!merchant) {
      throw new Error(`Merchant ${merchantId} not found`);
    }

    console.log(`[Vyapar AI] Processing telemetry for ${merchant.name}`);

    // Step 1: Call Python AI backend to analyze telemetry and generate strategy
    const strategy = await this.aiClient.generateMerchantStrategy(
      {
        ...telemetry,
        surplusItems: merchant.inventory.filter((item) => item.quantity > 50),
      },
      merchant
    );

    // Step 2: Generate ad image based on AI's image prompt
    const imageUrl = await ImageGenerator.generateAdImage(strategy.imagePrompt);

    // Step 3: Generate QR code
    const qrCodeDataUrl = await QRCodeGenerator.generateQRCode(
      merchantId,
      "https://paytm.com/pay"
    );

    // Step 4: Create deal object
    const deal = {
      merchantId,
      merchantName: merchant.name,
      location: merchant.location,
      category: merchant.category,
      itemName: strategy.itemName,
      originalPrice: strategy.currentPrice,
      discountPercentage: strategy.discountPercentage,
      finalPrice: strategy.finalPrice,
      reasoning: strategy.reasoning,
      imageUrl,
      qrCode: qrCodeDataUrl,
      telemetryTrigger: telemetry.weather || telemetry.salesVelocity,
      createdBy: "VyaparAI",
    };

    // Step 5: Push to ONDC Registry
    const registeredDeal = ONDCRegistry.addDeal(deal);

    console.log(`[Vyapar AI] Flash deal generated and registered: ${deal.itemName}`);

    return registeredDeal;
  }

  async generateFlashDeal(merchantId, customTelemetry = {}) {
    // Helper method for testing/manual triggers
    const defaultTelemetry = {
      footTraffic: "low",
      weather: "rainy",
      salesVelocity: "declining",
      hour: new Date().getHours(),
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()],
    };

    return this.processVyaparTelemetry(merchantId, {
      ...defaultTelemetry,
      ...customTelemetry,
    });
  }

  analyzeSalesDrop(currentTransactions, historicalAverage) {
    const dropPercentage = ((historicalAverage - currentTransactions) / historicalAverage) * 100;
    const isSevere = dropPercentage > 30;
    return { dropPercentage, isSevere };
  }

  selectBestItemForPromotion(inventorySurplus, realTimeContext) {
    if (!inventorySurplus || inventorySurplus.length === 0) {
      return null;
    }

    // Score items based on context (weather, time, traffic patterns)
    const scoredItems = inventorySurplus.map((item) => {
      let score = item.quantity; // Higher quantity = higher priority

      // Weather-based scoring
      if (realTimeContext.weather === "rainy" && item.category === "beverages") {
        score *= 1.5; // Hot drinks in rainy weather
      }
      if (realTimeContext.weather === "hot" && item.category === "cold_drinks") {
        score *= 1.5;
      }

      // Time-based scoring
      const hour = realTimeContext.hour || new Date().getHours();
      if (hour >= 12 && hour < 14 && item.category === "food") {
        score *= 1.3; // Lunch time
      }

      // Traffic-based scoring
      if (realTimeContext.footTraffic === "low" && item.margin > 30) {
        score *= 1.4; // Higher margin items when traffic is low
      }

      return { ...item, score };
    });

    // Return the highest-scored item
    return scoredItems.sort((a, b) => b.score - a.score)[0];
  }

  generateDiscountOffer(item, urgency = "moderate") {
    const baseDiscount = Math.floor(item.margin * 0.6); // Offer 60% of margin as discount
    
    if (urgency === "critical") {
      return {
        discountPercentage: Math.min(baseDiscount + 10, 50),
        offerText: `Flat ₹${Math.round(item.price * (baseDiscount + 10) / 100)} OFF`,
      };
    }
    
    return {
      discountPercentage: baseDiscount,
      offerText: `Flat ₹${Math.round(item.price * baseDiscount / 100)} OFF`,
    };
  }

  generateDALLEPrompt(item, weather, merchantName) {
    const basePrompt = `High-quality promotional food photography for ${item.name} at ${merchantName} restaurant. `;
    const contextualDesc = {
      rainy: "Warm, cozy lighting, soft ambiance perfect for indoor dining",
      hot: "Fresh, cool presentation with ice and condensation, bright daylight",
      cold: "Warm, appetizing steam, rich golden tones",
      clear: "Natural sunlight, vibrant colors, appetizing presentation",
    };

    const description = contextualDesc[weather] || "Professional restaurant lighting";
    
    return (
      basePrompt +
      description +
      ". " +
      item.name +
      " as the main focus. Mouth-watering presentation. " +
      "Professional food photography, cinematic lighting, 4k. Text-free, no words, no text, clean empty space in the center."
    );
  }

  generateProactiveAlert(paytmGatewayData, realTimeContext, inventorySurplus, merchantName) {
    // Analyze the sales drop
    const { dropPercentage, isSevere } = this.analyzeSalesDrop(
      paytmGatewayData.currentTransactions,
      paytmGatewayData.historicalAverage
    );

    // Select best item
    const selectedItem = this.selectBestItemForPromotion(inventorySurplus, realTimeContext);

    if (!selectedItem) {
      return {
        error: "No surplus items available for promotion",
        status: "failed",
      };
    }

    // Generate discount
    const discountInfo = this.generateDiscountOffer(
      selectedItem,
      isSevere ? "critical" : "moderate"
    );

    // Generate reasoning
    const weatherReason = {
      rainy: "customers are avoiding going out due to rain",
      hot: "foot traffic is lower during peak heat hours",
      cold: "fewer people are venturing outside in cold weather",
      clear: "unexpected low sales despite good weather",
    };

    const agentReasoning =
      `Detected a ${dropPercentage.toFixed(1)}% drop in Paytm transactions. ` +
      `${weatherReason[realTimeContext.weather] || "sales patterns show a decline"}. ` +
      `${selectedItem.name} has high inventory surplus (${selectedItem.quantity} units). ` +
      `Offering ${discountInfo.offerText} to drive quick conversions and recover revenue.`;

    // Generate notification message
    const notificationMessage =
      `👋 Hey! I noticed your Paytm scans are down ${dropPercentage.toFixed(1)}% today. ` +
      `${realTimeContext.weather === "rainy" ? "The rain might be keeping customers away." : ""} ` +
      `Let me help! I'm suggesting a flash deal on ${selectedItem.name}: ${discountInfo.offerText}. ` +
      `This should attract customers back. Ready to launch? 🚀`;

    // Generate DALL-E prompt
    const dallePrompt = this.generateDALLEPrompt(
      selectedItem,
      realTimeContext.weather,
      merchantName
    );

    // Return the required JSON format
    return {
      notification_message: notificationMessage,
      agent_reasoning: agentReasoning,
      selected_item: selectedItem.name,
      discount_offer: discountInfo.offerText,
      dalle_background_prompt: dallePrompt,
    };
  }
}

module.exports = VyaparAI;
