import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaytmAdGenerator from './PaytmAdGenerator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaytmEnvironment() {
  const [activeAgent, setActiveAgent] = useState('vyapar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vyapar AI State
  const [proactiveAlert, setProactiveAlert] = useState(null);
  const [generatedDeal, setGeneratedDeal] = useState(null);
  const [paytmMetrics, setPaytmMetrics] = useState({
    currentTransactions: 15,
    historicalAverage: 45,
    dropPercentage: 66.7
  });
  const [contextData, setContextData] = useState({
    weather: 'rainy',
    footTraffic: 'low',
    hour: new Date().getHours(),
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
  });

  // Scout AI State
  const [consumerQuery, setConsumerQuery] = useState('I want spicy food near me');
  const [recommendations, setRecommendations] = useState(null);
  const [userId] = useState('user_' + Date.now());

  // ONDC Registry State
  const [activeDealcs, setActiveDealcs] = useState([]);

  // Mock inventory surplus
  const inventorySurplus = [
    { id: 'item_001', name: 'Masala Tea', category: 'beverages', price: 40, quantity: 75, margin: 25 },
    { id: 'item_002', name: 'Gobi Manchurian', category: 'food', price: 250, quantity: 95, margin: 40 },
    { id: 'item_003', name: 'Garlic Naan', category: 'bread', price: 60, quantity: 120, margin: 35 },
    { id: 'item_004', name: 'Chicken Biryani', category: 'rice', price: 350, quantity: 45, margin: 50 }
  ];

  // Fetch Active Dealcs
  useEffect(() => {
    if (activeAgent === 'registry') {
      fetchActiveDealcs();
    }
  }, [activeAgent]);

  const fetchActiveDealcs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/vyapar/deals/active`);
      setActiveDealcs(response.data.dealcs || []);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    }
  };

  // Vyapar AI: Generate Proactive Alert
  const handleProactiveAlert = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/api/vyapar/merchant/proactive-alert`, {
        merchantName: 'Coimbatore Spice House',
        paytmGatewayData: {
          currentTransactions: paytmMetrics.currentTransactions,
          historicalAverage: paytmMetrics.historicalAverage
        },
        realTimeContext: contextData,
        inventorySurplus
      });

      const alertData = response.data.result;
      setProactiveAlert(alertData);

      // Convert alert to deal format for canvas
      setGeneratedDeal({
        selected_item: alertData.selected_item,
        discount_offer: alertData.discount_offer,
        merchant_name: 'Coimbatore Spice House',
        background_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=paytm://upi/pay?pa=merchant@paytm'
      });
    } catch (err) {
      setError('Failed to generate proactive alert: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Scout AI: Query for Recommendations
  const handleScoutQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/api/scout/query`, {
        userId,
        query: consumerQuery
      });

      if (response.data.result.success) {
        setRecommendations(response.data.result.recommendation);
      } else {
        setError(response.data.result.message || 'No deals found');
      }
    } catch (err) {
      setError('Scout AI error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Paytm Header */}
      <div style={{ backgroundColor: '#002970', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>
          <span style={{ color: '#00BAF2' }}>Paytm</span> OmniMatch
        </h1>
        <p style={{ margin: '0', opacity: 0.9, fontSize: '14px' }}>
          🤖 Vyapar AI (Merchant) + 🔍 Scout AI (Consumer) + 📋 ONDC Registry
        </p>
      </div>

      {/* Agent Navigation */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { id: 'vyapar', label: '🤖 Vyapar AI (Merchant)', color: '#FF6B35' },
          { id: 'scout', label: '🔍 Scout AI (Consumer)', color: '#004E89' },
          { id: 'registry', label: '📋 ONDC Registry', color: '#00AA00' }
        ].map(agent => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeAgent === agent.id ? agent.color : '#f0f0f0',
              color: activeAgent === agent.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {agent.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* VYAPAR AI - Merchant Agent */}
        {activeAgent === 'vyapar' && (
          <div>
            <h2>📊 Vyapar AI - Merchant Dashboard</h2>
            <p style={{ color: '#666' }}>Monitor Paytm transactions and automatically generate flash deals when sales drop</p>

            {/* Sales Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Current Paytm Transactions</p>
                <h3 style={{ margin: '0', fontSize: '32px', color: '#FF6B35' }}>{paytmMetrics.currentTransactions}</h3>
                <input
                  type="number"
                  value={paytmMetrics.currentTransactions}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, currentTransactions: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Historical Average</p>
                <h3 style={{ margin: '0', fontSize: '32px', color: '#004E89' }}>{paytmMetrics.historicalAverage}</h3>
                <input
                  type="number"
                  value={paytmMetrics.historicalAverage}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, historicalAverage: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ backgroundColor: '#ffebee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Sales Drop %</p>
                <h3 style={{ margin: '0', fontSize: '32px', color: '#c62828' }}>
                  {((paytmMetrics.historicalAverage - paytmMetrics.currentTransactions) / paytmMetrics.historicalAverage * 100).toFixed(1)}%
                </h3>
              </div>
            </div>

            {/* Real-Time Context */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3>⚙️ Real-Time Context</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weather</label>
                  <select
                    value={contextData.weather}
                    onChange={(e) => setContextData({ ...contextData, weather: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="rainy">🌧️ Rainy</option>
                    <option value="clear">☀️ Clear</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="cold">❄️ Cold</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Foot Traffic</label>
                  <select
                    value={contextData.footTraffic}
                    onChange={(e) => setContextData({ ...contextData, footTraffic: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="low">📉 Low</option>
                    <option value="moderate">➡️ Moderate</option>
                    <option value="high">📈 High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trigger Alert Button */}
            <button
              onClick={handleProactiveAlert}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {loading ? '⏳ Analyzing...' : '🚨 Check for Sales Drop & Generate Alert'}
            </button>

            {/* Alert Display */}
            {proactiveAlert && (
              <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #FF6B35' }}>
                <h3 style={{ marginTop: '0', color: '#FF6B35' }}>📢 Vyapar AI Alert</h3>
                <p style={{ fontSize: '16px', fontStyle: 'italic', margin: '15px 0' }}>
                  "{proactiveAlert.notification_message}"
                </p>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                  <p><strong>Agent Reasoning:</strong></p>
                  <p style={{ fontSize: '14px', color: '#555' }}>{proactiveAlert.agent_reasoning}</p>
                </div>
                <p><strong>📦 Recommended Item:</strong> {proactiveAlert.selected_item}</p>
                <p><strong>💰 Discount Offer:</strong> {proactiveAlert.discount_offer}</p>
              </div>
            )}

            {/* Canvas Ad Generator */}
            {generatedDeal && (
              <div style={{ marginTop: '30px' }}>
                <h3>📱 Generated Promotional Asset</h3>
                <PaytmAdGenerator aiDealData={generatedDeal} />
              </div>
            )}
          </div>
        )}

        {/* SCOUT AI - Consumer Agent */}
        {activeAgent === 'scout' && (
          <div>
            <h2>🔍 Scout AI - Consumer Deal Finder</h2>
            <p style={{ color: '#666' }}>Describe what you're looking for, Scout AI finds the best deals nearby</p>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>What are you looking for?</label>
              <textarea
                value={consumerQuery}
                onChange={(e) => setConsumerQuery(e.target.value)}
                placeholder="e.g., I want spicy food near me, I'm in the mood for biryani..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontFamily: 'Arial'
                }}
              />
              <button
                onClick={handleScoutQuery}
                disabled={loading}
                style={{
                  marginTop: '10px',
                  padding: '12px 24px',
                  backgroundColor: '#004E89',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🔍 Searching...' : '🔍 Find Best Deals'}
              </button>
            </div>

            {recommendations && (
              <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', border: '2px solid #004E89' }}>
                <h3 style={{ marginTop: '0', color: '#004E89' }}>✨ Scout AI Recommendations</h3>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px' }}>
                  <p><strong>Merchant:</strong> {recommendations.merchant_name}</p>
                  <p><strong>Location:</strong> {recommendations.location}</p>
                  <p><strong>Item:</strong> {recommendations.item_name}</p>
                  <p><strong>Discount:</strong> {recommendations.discount}%</p>
                  <p><strong>Price:</strong> ₹{recommendations.final_price}</p>
                  <p><strong>Why this deal?</strong> {recommendations.reasoning}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONDC REGISTRY */}
        {activeAgent === 'registry' && (
          <div>
            <h2>📋 ONDC Registry - Active Dealcs</h2>
            <p style={{ color: '#666' }}>All flash deals currently live in the Open Network for Commerce</p>

            <button
              onClick={fetchActiveDealcs}
              style={{
                padding: '10px 20px',
                backgroundColor: '#00AA00',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              🔄 Refresh Dealcs
            </button>

            {activeDealcs.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
                No active dealcs yet. Generate one from Vyapar AI dashboard!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {activeDealcs.map((deal) => (
                  <div key={deal.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{deal.itemName}</h4>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                          {deal.merchantName} • {deal.location}
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                          <strong>₹{deal.finalPrice}</strong>
                          <span style={{ textDecoration: 'line-through', marginLeft: '10px', color: '#999' }}>₹{deal.originalPrice}</span>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {deal.discountPercentage}% OFF
                        </div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '5px', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
