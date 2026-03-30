const schedule = require('node-schedule');
const VyaparAI = require('../agents/vyapar-ai');
const ONDCRegistry = require('../registry/ondc-registry');

class VyaparMonitor {
  constructor(vyaparAI) {
    this.vyaparAI = vyaparAI;
    this.merchants = new Map(); // Store merchant telemetry history
    this.isMonitoring = false;
    this.monitoringJobs = new Map();
  }

  /**
   * Start monitoring a merchant's transaction volume
   * Runs every 5 minutes to check for sales drops
   */
  startMonitoringMerchant(merchantId, merchantName, weatherService) {
    if (this.monitoringJobs.has(merchantId)) {
      console.log(`[Vyapar Monitor] Already monitoring ${merchantName}`);
      return;
    }

    // Initialize telemetry history
    if (!this.merchants.has(merchantId)) {
      this.merchants.set(merchantId, {
        merchantName,
        transactionHistory: [],
        averageTransactions: 0,
        lastAlert: null,
      });
    }

    // Schedule monitoring every 5 minutes
    const job = schedule.scheduleJob(`*/${5} * * * *`, async () => {
      try {
        await this.checkAndTriggerAlert(merchantId, weatherService);
      } catch (error) {
        console.error(`[Vyapar Monitor] Error monitoring ${merchantName}:`, error.message);
      }
    });

    this.monitoringJobs.set(merchantId, job);
    console.log(`[Vyapar Monitor] ✅ Started monitoring: ${merchantName}`);
  }

  /**
   * Stop monitoring a specific merchant
   */
  stopMonitoringMerchant(merchantId) {
    if (this.monitoringJobs.has(merchantId)) {
      const job = this.monitoringJobs.get(merchantId);
      job.cancel();
      this.monitoringJobs.delete(merchantId);
      console.log(`[Vyapar Monitor] ⏹️ Stopped monitoring merchant: ${merchantId}`);
    }
  }

  /**
   * Check if merchant's sales dropped and trigger alert automatically
   */
  async checkAndTriggerAlert(merchantId, weatherService) {
    const merchantData = this.merchants.get(merchantId);
    if (!merchantData) return;

    // Simulate real-time transaction data (in production, would come from Paytm webhook)
    const currentTransactions = Math.floor(Math.random() * 50) + 5; // 5-55 transactions
    merchantData.transactionHistory.push({
      timestamp: new Date(),
      count: currentTransactions,
    });

    // Keep only last 12 data points (1 hour of 5-minute intervals)
    if (merchantData.transactionHistory.length > 12) {
      merchantData.transactionHistory.shift();
    }

    // Calculate average
    const recentTransactions = merchantData.transactionHistory.map((t) => t.count);
    const historicalAverage = Math.floor(
      recentTransactions.reduce((a, b) => a + b, 0) / recentTransactions.length
    );
    merchantData.averageTransactions = historicalAverage;

    // Analyze sales drop
    const { dropPercentage, isSevere } = this.vyaparAI.analyzeSalesDrop(
      currentTransactions,
      historicalAverage
    );

    console.log(
      `[Vyapar Monitor] ${merchantData.merchantName}: Current=${currentTransactions}, Avg=${historicalAverage}, Drop=${dropPercentage.toFixed(1)}%`
    );

    // Trigger alert if drop is severe (>30%)
    if (isSevere && (!merchantData.lastAlert || Date.now() - merchantData.lastAlert > 15 * 60 * 1000)) {
      console.log(
        `[Vyapar Monitor] 🚨 SEVERE DROP DETECTED for ${merchantData.merchantName}! Drop: ${dropPercentage.toFixed(1)}%`
      );

      await this.triggerProactiveAlert(merchantId, currentTransactions, historicalAverage, weatherService);
      merchantData.lastAlert = Date.now();
    }
  }

  /**
   * Automatically trigger Vyapar AI to generate flash deal
   */
  async triggerProactiveAlert(merchantId, currentTransactions, historicalAverage, weatherService) {
    try {
      // Get merchant data
      const merchant = this.vyaparAI.merchants.get(merchantId);
      if (!merchant) return;

      // Get real-time weather
      const weather = await weatherService.getWeather(merchant.location);

      // Simulate foot traffic
      const footTraffic = this.simulateFootTraffic();

      // Prepare inventory surplus
      const inventorySurplus = merchant.inventory
        .filter((item) => item.quantity > 50)
        .map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          margin: item.margin || 30,
        }));

      if (inventorySurplus.length === 0) {
        console.log(`[Vyapar Monitor] No surplus inventory for ${merchant.name}`);
        return;
      }

      // Generate flash deal
      const alert = await this.vyaparAI.generateProactiveAlert(
        {
          currentTransactions,
          historicalAverage,
        },
        {
          weather: weather.condition,
          footTraffic,
          hour: new Date().getHours(),
          dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()],
        },
        inventorySurplus,
        merchant.name
      );

      console.log(
        `[Vyapar Monitor] ✅ Alert Generated: "${alert.notification_message}" - Item: ${alert.selected_item}`
      );

      // Store alert in registry
      const deal = {
        id: `deal_${merchantId}_${Date.now()}`,
        merchantId,
        merchantName: merchant.name,
        location: merchant.location,
        itemName: alert.selected_item,
        discountPercentage: parseInt(alert.discount_offer.split('%')[0]),
        status: 'active',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
        reasoning: alert.agent_reasoning,
        notification: alert.notification_message,
      };

      ONDCRegistry.addDeal(deal);
      console.log(`[Vyapar Monitor] 📋 Deal registered in ONDC`);

      return deal;
    } catch (error) {
      console.error(`[Vyapar Monitor] Error triggering alert:`, error.message);
    }
  }

  /**
   * Simulate foot traffic (in production, would come from sensors/analytics)
   */
  simulateFootTraffic() {
    const hour = new Date().getHours();
    const trafficMap = {
      // Peak hours: 12-14 (lunch), 18-20 (dinner)
      8: 'low',
      9: 'low',
      10: 'moderate',
      11: 'moderate',
      12: 'high',
      13: 'high',
      14: 'moderate',
      15: 'low',
      16: 'low',
      17: 'moderate',
      18: 'high',
      19: 'high',
      20: 'moderate',
      21: 'low',
      22: 'low',
    };
    return trafficMap[hour] || 'low';
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    const merchants = Array.from(this.merchants.entries()).map(([id, data]) => ({
      merchantId: id,
      merchantName: data.merchantName,
      currentTransactions: data.transactionHistory[data.transactionHistory.length - 1]?.count || 0,
      averageTransactions: data.averageTransactions,
      lastAlert: data.lastAlert ? new Date(data.lastAlert).toLocaleString() : 'None',
      isMonitoring: this.monitoringJobs.has(id),
    }));

    return {
      isMonitoring: this.isMonitoring,
      activeMonitors: this.monitoringJobs.size,
      merchants,
    };
  }

  /**
   * Stop all monitoring
   */
  stopAllMonitoring() {
    this.monitoringJobs.forEach((job) => job.cancel());
    this.monitoringJobs.clear();
    console.log(`[Vyapar Monitor] ⏹️ All monitoring stopped`);
  }
}

module.exports = VyaparMonitor;