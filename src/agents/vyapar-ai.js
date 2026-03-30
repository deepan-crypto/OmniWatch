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
}

module.exports = VyaparAI;
