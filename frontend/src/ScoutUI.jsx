import React, { useState } from 'react';
import axios from 'axios';

const ScoutUI = () => {
  const [userId, setUserId] = useState('user_' + Date.now());
  const [userQuery, setUserQuery] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const response = await axios.post(`${API_BASE}/api/scout/query`, {
        userId,
        query: userQuery,
      });

      if (response.data.result.success) {
        setRecommendations(response.data.result.recommendation);
      } else {
        setError(response.data.result.message || 'No matching deals found');
      }
    } catch (err) {
      setError('Failed to process your request. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scout-container">
      <h1>🔍 Scout AI - Find Your Perfect Deal</h1>

      <form onSubmit={handleQuerySubmit} className="query-form">
        <div className="form-group">
          <label htmlFor="query">What are you looking for?</label>
          <input
            id="query"
            type="text"
            placeholder="E.g., 'I'm hungry for spicy food', 'Coffee near me', 'Rainy day comfort food'"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="input-query"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-search">
          {loading ? 'Searching...' : 'Find Deal'}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {recommendations && (
        <div className="recommendation-card">
          <h2>✨ Scout's Recommendation</h2>

          <div className="recommendation-header">
            <h3>{recommendations.itemName}</h3>
            <div className="discount-badge">
              {recommendations.discountPercentage}% OFF
            </div>
          </div>

          <div className="recommendation-details">
            <p className="merchant-info">
              📍 <strong>{recommendations.merchantName}</strong> in {recommendations.location}
            </p>

            <p className="scout-says">
              💬 "{recommendations.scoutRecommendation}"
            </p>

            <p className="reasoning">
              <strong>Why this deal?</strong> {recommendations.scoutReasoning}
            </p>

            <div className="price-section">
              <div className="price-item">
                <span>Original Price:</span>
                <span className="price-original">₹{recommendations.originalPrice}</span>
              </div>
              <div className="price-item highlight">
                <span>Your Price:</span>
                <span className="price-final">₹{recommendations.finalPrice}</span>
              </div>
              <div className="savings">
                You Save: ₹{(recommendations.originalPrice - recommendations.finalPrice).toFixed(2)}
              </div>
            </div>

            <div className="ad-image">
              {recommendations.imageUrl && (
                <img src={recommendations.imageUrl} alt={recommendations.itemName} />
              )}
            </div>

            <div className="qr-section">
              {recommendations.qrCode && (
                <div>
                  <p>Scan to Pay:</p>
                  <img src={recommendations.qrCode} alt="Payment QR Code" className="qr-code" />
                </div>
              )}
            </div>

            <div className="actions">
              <button className="btn btn-primary">Scan QR Code</button>
              <button className="btn btn-secondary">Pay with Paytm Wallet</button>
              <button className="btn btn-outline" onClick={() => setRecommendations(null)}>
                Find Another Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutUI;
