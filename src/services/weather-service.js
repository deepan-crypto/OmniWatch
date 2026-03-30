/**
 * Weather Service - Provides real-time weather data
 * In production, this would integrate with OpenWeatherMap or similar API
 */

class WeatherService {
  constructor() {
    this.weatherPatterns = {
      default: { condition: 'clear', temp: 28, humidity: 60 },
      morning: { condition: 'clear', temp: 22, humidity: 70 },
      afternoon: { condition: 'hot', temp: 35, humidity: 40 },
      evening: { condition: 'clear', temp: 28, humidity: 55 },
      night: { condition: 'clear', temp: 20, humidity: 65 },
    };
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Get weather data for a location
   * Simulates real-time data with periodicity
   */
  async getWeather(location) {
    const now = new Date();
    const hour = now.getHours();

    // Check cache
    const cacheKey = `${location}_${Math.floor(now.getTime() / this.cacheExpiry)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Determine time period and weather
    let timeOfDay = 'default';
    if (hour >= 6 && hour < 9) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'night';

    const baseWeather = this.weatherPatterns[timeOfDay];

    // Add randomness (30% chance of rain in afternoon)
    const weather = {
      ...baseWeather,
      condition:
        timeOfDay === 'afternoon' && Math.random() < 0.3 ? 'rainy' : baseWeather.condition,
      temp: baseWeather.temp + (Math.random() - 0.5) * 5,
      location,
      timestamp: new Date().toISOString(),
    };

    // Cache result
    this.cache.set(cacheKey, weather);
    return weather;
  }

  /**
   * Get weather impact on food preferences
   */
  getWeatherImpact(weather) {
    const impacts = {
      rainy: { category: 'hot_beverages', multiplier: 1.8, desc: 'Hot tea, coffee, soups' },
      hot: { category: 'cold_items', multiplier: 2.0, desc: 'Cold drinks, ice cream' },
      cold: { category: 'warm_food', multiplier: 1.5, desc: 'Hot food, warm items' },
      clear: { category: 'all', multiplier: 1.0, desc: 'Normal demand' },
    };

    return impacts[weather.condition] || impacts['clear'];
  }

  /**
   * Predict demand surge based on weather
   */
  predictDemandSurge(weather, hour) {
    const impact = this.getWeatherImpact(weather);
    let surge = impact.multiplier;

    // Peak hours
    if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20)) {
      surge *= 1.5; // 50% boost during meal times
    }

    return {
      expectedDemand: surge,
      reason: `${impact.desc} - ${weather.condition} weather, hour ${hour}`,
    };
  }

  /**
   * Clear cache (for testing)
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new WeatherService();
