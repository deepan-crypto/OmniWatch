import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasAdGenerator from './CanvasAdGenerator';

const MerchantDashboard = () => {
  const [merchantId, setMerchantId] = useState('merchant_coimbatore_001');
  const [telemetry, setTelemetry] = useState({
    weather: 'rainy',
    footTraffic: 'low',
    salesVelocity: 'declining',
  });
  const [generatedDeal, setGeneratedDeal] = useState(null);
  const [activeDealcs, setActiveDealcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchActiveDealcs();
  }, []);

  const fetchActiveDealcs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/vyapar/deals/active`);
      setActiveDealcs(response.data.dealcs || []);
    } catch (err) {
      console.error('Failed to fetch active dealcs:', err);
    }
  };

  const handleGenerateDeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/api/vyapar/merchant/generate-deal`, {
        merchantId,
        telemetry,
      });

      if (response.data.success) {
        setGeneratedDeal(response.data.deal);
        fetchActiveDealcs(); // Refresh the list
      } else {
        setError('Failed to generate deal');
      }
    } catch (err) {
      setError('Backend not available. Make sure Node.js server is running on port 5000 and Python AI backend on port 8000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTelemetryChange = (e) => {
    const { name, value } = e.target;
    setTelemetry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="merchant-dashboard">
      <div className="dashboard-header">
        <h1>📊 Vyapar AI - Merchant Dashboard</h1>
        <p>AI-powered flash deal generation based on real-time telemetry</p>
      </div>

      <div className="dashboard-content">
        {/* Telemetry Input Section */}
        <section className="telemetry-section">
          <h2>📡 Current Business Telemetry</h2>
          <form onSubmit={handleGenerateDeal} className="telemetry-form">
            <div className="form-group">
              <label htmlFor="weather">Weather Condition</label>
              <select
                id="weather"
                name="weather"
                value={telemetry.weather}
                onChange={handleTelemetryChange}
              >
                <option value="clear">☀️ Clear</option>
                <option value="rainy">🌧️ Rainy</option>
                <option value="hot">🔥 Hot</option>
                <option value="cold">❄️ Cold</option>
                <option value="cloudy">☁️ Cloudy</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="footTraffic">Foot Traffic</label>
              <select
                id="footTraffic"
                name="footTraffic"
                value={telemetry.footTraffic}
                onChange={handleTelemetryChange}
              >
                <option value="high">📈 High</option>
                <option value="moderate">➡️ Moderate</option>
                <option value="low">📉 Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salesVelocity">Sales Velocity</label>
              <select
                id="salesVelocity"
                name="salesVelocity"
                value={telemetry.salesVelocity}
                onChange={handleTelemetryChange}
              >
                <option value="increasing">📊 Increasing</option>
                <option value="normal">➡️ Normal</option>
                <option value="declining">📉 Declining</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-large">
              {loading ? '⏳ Generating Deal...' : '🚀 Generate Flash Deal'}
            </button>
          </form>

          {error && <div className="alert alert-error">{error}</div>}
        </section>

        {/* Generated Deal Display */}
        {generatedDeal && (
          <section className="generated-deal-section">
            <h2>✨ Generated Flash Deal</h2>
            <div className="deal-info">
              <div className="deal-card">
                <h3>{generatedDeal.itemName}</h3>
                <p className="reasoning">{generatedDeal.reasoning}</p>

                <div className="deal-metrics">
                  <div className="metric">
                    <span className="label">Original Price:</span>
                    <span className="value">₹{generatedDeal.originalPrice}</span>
                  </div>
                  <div className="metric">
                    <span className="label">Discount:</span>
                    <span className="value">{generatedDeal.discountPercentage}%</span>
                  </div>
                  <div className="metric highlight">
                    <span className="label">Final Price:</span>
                    <span className="value">₹{generatedDeal.finalPrice}</span>
                  </div>
                </div>

                <div className="status-info">
                  <p>
                    <strong>Deal ID:</strong> {generatedDeal.id}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className="status-badge">{generatedDeal.status}</span>
                  </p>
                  <p>
                    <strong>Expires:</strong> {new Date(generatedDeal.expiresAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <CanvasAdGenerator deal={generatedDeal} />
            </div>
          </section>
        )}

        {/* Active Dealcs List */}
        <section className="active-dealcs-section">
          <h2>📋 Active Dealcs in ONDC Registry</h2>
          <button onClick={fetchActiveDealcs} className="btn btn-secondary">
            🔄 Refresh
          </button>

          {activeDealcs.length === 0 ? (
            <p className="empty-state">No active dealcs yet. Generate one to get started!</p>
          ) : (
            <div className="dealcs-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Merchant</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDealcs.map((deal) => (
                    <tr key={deal.id}>
                      <td>{deal.itemName}</td>
                      <td>{deal.merchantName}</td>
                      <td>{deal.location}</td>
                      <td>₹{deal.finalPrice}</td>
                      <td>{deal.discountPercentage}%</td>
                      <td>
                        <span className={`status-badge status-${deal.status}`}>
                          {deal.status}
                        </span>
                      </td>
                      <td>{new Date(deal.expiresAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MerchantDashboard;
