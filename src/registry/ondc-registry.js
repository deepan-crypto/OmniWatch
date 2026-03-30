const { v4: uuidv4 } = require("uuid");

class ONDCRegistry {
  constructor() {
    // In-memory registry for live deals
    // In production, this would be a real ONDC network connection
    this.activeDeals = [];
    this.dealHistory = [];
  }

  addDeal(dealData) {
    const deal = {
      id: uuidv4(),
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour validity
      status: "active",
      ...dealData,
    };

    this.activeDeals.push(deal);
    this.dealHistory.push({ ...deal, action: "created" });

    console.log(`[ONDC] Deal created: ${deal.itemName} by ${deal.merchantName}`);
    return deal;
  }

  getActiveDeals() {
    // Filter out expired deals
    const now = new Date();
    this.activeDeals = this.activeDeals.filter((deal) => deal.expiresAt > now && deal.status === "active");
    return this.activeDeals;
  }

  getDealById(dealId) {
    return this.activeDeals.find((deal) => deal.id === dealId);
  }

  completeDeal(dealId, transactionId) {
    const deal = this.getDealById(dealId);
    if (deal) {
      deal.status = "completed";
      deal.transactionId = transactionId;
      deal.completedAt = new Date();
      this.dealHistory.push({ ...deal, action: "completed" });
      console.log(`[ONDC] Deal completed: ${deal.id} via transaction ${transactionId}`);
      return deal;
    }
    return null;
  }

  expireDeal(dealId) {
    const deal = this.getDealById(dealId);
    if (deal) {
      deal.status = "expired";
      deal.expiredAt = new Date();
      this.dealHistory.push({ ...deal, action: "expired" });
      console.log(`[ONDC] Deal expired: ${deal.id}`);
    }
  }

  getDealsHistory() {
    return this.dealHistory;
  }

  // Filter deals by location, category, or criteria for Scout AI
  getFilteredDeals(filters = {}) {
    let results = this.getActiveDeals();

    if (filters.category) {
      results = results.filter((d) => d.category === filters.category);
    }

    if (filters.location) {
      results = results.filter((d) => d.location === filters.location);
    }

    if (filters.minDiscount) {
      results = results.filter((d) => d.discountPercentage >= filters.minDiscount);
    }

    return results;
  }
}

module.exports = new ONDCRegistry();
