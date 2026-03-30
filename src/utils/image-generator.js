const axios = require("axios");

class ImageGenerator {
  // Using Unsplash API (free tier, 50 requests/hour)
  // For production DALL-E, swap to OpenAI implementation
  static async generateAdImage(prompt) {
    try {
      // Extract keywords from prompt for search
      const keywords = this.extractKeywords(prompt);

      // Fallback to high-quality mock images for development
      const unsplashQueries = {
        biryani: "biryani rice",
        "gobi manchurian": "spicy food",
        coffee: "coffee cup",
        pizza: "pizza fresh",
        dosa: "dosa indian",
        burger: "burger food",
        default: "food restaurant",
      };

      const searchTerm = unsplashQueries[keywords[0]] || unsplashQueries.default;

      // Use a simple placeholder service for MVP
      // In production, integrate with DALL-E or Replicate
      const imageUrl = await this.getUnsplashImage(searchTerm);
      return imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      return this.getPlaceholderImage(prompt);
    }
  }

  static async getUnsplashImage(query) {
    try {
      // Using Unsplash's free API (no key needed for basic requests)
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: query,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          "Accept-Version": "v1",
        },
        timeout: 5000,
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].urls.regular;
      }
      return this.getPlaceholderImage(query);
    } catch (error) {
      console.warn("Unsplash API request failed, using placeholder:", error.message);
      return this.getPlaceholderImage(query);
    }
  }

  static getPlaceholderImage(prompt) {
    // Fallback placeholder service (works without API key)
    const keywords = this.extractKeywords(prompt);
    const keyword = keywords[0] || "food";
    return `https://via.placeholder.com/800x400?text=${encodeURIComponent(keyword + " deal")}`;
  }

  static extractKeywords(prompt) {
    const common = ["a", "the", "of", "in", "and", "or", "is", "photo", "cinematic"];
    const words = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => !common.includes(w) && w.length > 2);
    return words.slice(0, 3);
  }
}

module.exports = ImageGenerator;
