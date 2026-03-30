import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaytmWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId] = useState('user_' + Date.now());

  // Scout AI State
  const [scoutQuery, setScoutQuery] = useState('');
  const [scoutResult, setScoutResult] = useState(null);

  // Vyapar AI State
  const [vyaparMetrics, setVyaparMetrics] = useState({
    currentTransactions: 15,
    historicalAverage: 45
  });
  const [contextData, setContextData] = useState({
    weather: 'rainy',
    footTraffic: 'low'
  });
  const [vyaparResult, setVyaparResult] = useState(null);

  // ONDC Deals State
  const [dealcs, setDealcs] = useState([]);

  const inventorySurplus = [
    { id: 'item_001', name: 'Masala Tea', category: 'beverages', price: 40, quantity: 75, margin: 25 },
    { id: 'item_002', name: 'Gobi Manchurian', category: 'food', price: 250, quantity: 95, margin: 40 },
    { id: 'item_003', name: 'Garlic Naan', category: 'bread', price: 60, quantity: 120, margin: 35 },
    { id: 'item_004', name: 'Chicken Biryani', category: 'rice', price: 350, quantity: 45, margin: 50 }
  ];

  const handleScoutAI = async () => {
    if (!scoutQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/api/scout/query`, {
        userId,
        query: scoutQuery
      });
      if (response.data.result.success) {
        setScoutResult(response.data.result.recommendation);
      }
    } catch (err) {
      setError('Scout AI Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVyaparAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/api/vyapar/merchant/proactive-alert`, {
        merchantName: 'Coimbatore Spice House',
        paytmGatewayData: {
          currentTransactions: vyaparMetrics.currentTransactions,
          historicalAverage: vyaparMetrics.historicalAverage
        },
        realTimeContext: contextData,
        inventorySurplus
      });
      setVyaparResult(response.data.result);
    } catch (err) {
      setError('Vyapar AI Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleONDCDealcs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/vyapar/deals/active`);
      setDealcs(response.data.dealcs || []);
    } catch (err) {
      setError('ONDC Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#002970', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <span style={{ color: '#00BAF2' }}>Paytm</span>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => setActiveSection('home')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: activeSection === 'home' ? 'bold' : 'normal' }}>Scout AI</button>
          <button onClick={() => setActiveSection('vyapar')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: activeSection === 'vyapar' ? 'bold' : 'normal' }}>Vyapar AI</button>
          <button onClick={() => setActiveSection('ondc')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: activeSection === 'ondc' ? 'bold' : 'normal' }}>ONDC Registry</button>
          <button onClick={() => setActiveSection('about')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: activeSection === 'about' ? 'bold' : 'normal' }}>About</button>
        </nav>

        <button style={{ backgroundColor: '#00BAF2', color: '#002970', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign in
        </button>
      </header>

      {/* HOME - Scout AI */}
      {activeSection === 'home' && (
        <div>
          {/* Hero Section */}
          <section style={{ backgroundColor: '#e3f2fd', padding: '60px 24px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 12px 0', color: '#002970' }}>🔍 Scout AI</h1>
            <p style={{ fontSize: '18px', color: '#666', margin: '0 0 32px 0' }}>Find the best deals tailored just for you</p>

            <div style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <textarea
                  value={scoutQuery}
                  onChange={(e) => setScoutQuery(e.target.value)}
                  placeholder="What are you looking for? (e.g., spicy biryani, hot tea, cheap snacks)"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #00BAF2',
                    fontSize: '14px',
                    minHeight: '60px'
                  }}
                />
                <button
                  onClick={handleScoutAI}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#004E89',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {loading ? 'Searching...' : 'Find'}
                </button>
              </div>
            </div>

            {scoutResult && (
              <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#004E89' }}>✨ Perfect Match!</h3>
                <div style={{ textAlign: 'left' }}>
                  <p><strong>🏪 Merchant:</strong> {scoutResult.merchant_name}</p>
                  <p><strong>🍽️ Item:</strong> {scoutResult.item_name}</p>
                  <p><strong>💵 Price:</strong> ₹{scoutResult.final_price}</p>
                  <p><strong>📍 Location:</strong> {scoutResult.location}</p>
                  <p style={{ fontSize: '13px', color: '#666', marginTop: '12px' }}><strong>Why:</strong> {scoutResult.reasoning}</p>
                </div>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section style={{ padding: '60px 24px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', color: '#333' }}>Why Scout AI?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
              {[
                { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations based on your preferences' },
                { icon: '⚡', title: 'Real-time', desc: 'Get instant deal suggestions matching your needs' },
                { icon: '💰', title: 'Save More', desc: 'Find the best prices across all merchants' }
              ].map((feature, i) => (
                <div key={i} style={{ padding: '24px', backgroundColor: '#f5f5f5', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{feature.title}</h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* VYAPAR - Vyapar AI */}
      {activeSection === 'vyapar' && (
        <div>
          {/* Hero Section */}
          <section style={{ backgroundColor: '#fff3cd', padding: '60px 24px' }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 12px 0', color: '#FF6B35', textAlign: 'center' }}>💰 Vyapar AI</h1>
            <p style={{ fontSize: '18px', color: '#666', margin: '0 0 32px 0', textAlign: 'center' }}>Smart flash deals that recover lost revenue</p>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>Today's Transactions</label>
                  <input
                    type="number"
                    value={vyaparMetrics.currentTransactions}
                    onChange={(e) => setVyaparMetrics({ ...vyaparMetrics, currentTransactions: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #FF6B35', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>Historical Average</label>
                  <input
                    type="number"
                    value={vyaparMetrics.historicalAverage}
                    onChange={(e) => setVyaparMetrics({ ...vyaparMetrics, historicalAverage: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #FF6B35', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>🌦️ Weather</label>
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
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>👥 Foot Traffic</label>
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

              <button
                onClick={handleVyaparAI}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⏳ Analyzing...' : '🚨 Generate Flash Deal'}
              </button>
            </div>

            {vyaparResult && (
              <div style={{ maxWidth: '800px', margin: '24px auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid #FF6B35' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#FF6B35' }}>📢 Alert Generated</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontStyle: 'italic', color: '#333' }}>"{vyaparResult.notification_message}"</p>
                <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Agent Logic:</strong> {vyaparResult.agent_reasoning}</p>
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px' }}><strong>📦 Item:</strong> {vyaparResult.selected_item}</p>
                <p style={{ margin: '0', fontSize: '13px', color: '#00AA00', fontWeight: 'bold' }}><strong>💰 Offer:</strong> {vyaparResult.discount_offer}</p>
              </div>
            )}
          </section>

          {/* Features */}
          <section style={{ padding: '60px 24px', backgroundColor: '#f5f5f5' }}>
            <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', color: '#333' }}>Vyapar AI Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
              {[
                { icon: '📊', title: 'Real-time Monitoring', desc: 'Track Paytm transactions 24/7' },
                { icon: '🎯', title: 'Smart Discounts', desc: 'AI calculates optimal discount rates' },
                { icon: '📈', title: 'Revenue Recovery', desc: 'Recover lost sales instantly' }
              ].map((feature, i) => (
                <div key={i} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{feature.title}</h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ONDC - Live Registry */}
      {activeSection === 'ondc' && (
        <div>
          {/* Hero Section */}
          <section style={{ backgroundColor: '#e8f5e9', padding: '60px 24px' }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 12px 0', color: '#00AA00', textAlign: 'center' }}>📋 ONDC Registry</h1>
            <p style={{ fontSize: '18px', color: '#666', margin: '0 0 32px 0', textAlign: 'center' }}>All live flash deals across the network</p>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <button
                onClick={handleONDCDealcs}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#00AA00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {loading ? '⏳ Loading...' : '🔄 View Live Dealcs'}
              </button>
            </div>

            {dealcs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999' }}>No live dealcs yet</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {dealcs.map((deal) => (
                  <div key={deal.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: '0', fontSize: '16px', color: '#333', fontWeight: 'bold' }}>{deal.itemName}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>{deal.merchantName}</p>
                      </div>
                      <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {deal.discountPercentage}%<br/><span style={{ fontSize: '10px' }}>OFF</span>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#666' }}>Price</p>
                      <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        ₹{deal.finalPrice}
                        <span style={{ textDecoration: 'line-through', marginLeft: '8px', color: '#999', fontSize: '12px' }}>₹{deal.originalPrice}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ backgroundColor: '#e8f5e9', color: '#00AA00', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {deal.status}
                      </span>
                      <span style={{ color: '#999' }}>📍 {deal.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ABOUT */}
      {activeSection === 'about' && (
        <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '24px', color: '#333' }}>About Paytm OmniMatch</h1>

          <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '12px', border: '2px solid #004E89' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#004E89' }}>🔍 Scout AI</h3>
              <p style={{ margin: '0', color: '#555' }}>Consumer-facing AI agent that understands natural language queries and recommends the best deals from your local merchants. Powered by Google Gemini reasoning engine.</p>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '12px', border: '2px solid #FF6B35' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#FF6B35' }}>💰 Vyapar AI</h3>
              <p style={{ margin: '0', color: '#555' }}>Merchant-facing AI agent that monitors Paytm QR transaction volumes in real-time. When it detects a sales drop, it automatically analyzes weather and foot traffic to generate optimal flash deals that recover lost revenue.</p>
            </div>

            <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '12px', border: '2px solid #00AA00' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#00AA00' }}>📋 ONDC Registry</h3>
              <p style={{ margin: '0', color: '#555' }}>Open Network for Commerce registry that lists all live flash deals from merchants. Consumers can browse and discover deals across the entire local commerce ecosystem.</p>
            </div>
          </div>

          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>How It Works</h2>
          <ol style={{ lineHeight: '1.8', color: '#555' }}>
            <li><strong>Scout AI</strong> analyzes consumer preferences and matches them with available deals</li>
            <li><strong>Vyapar AI</strong> monitors merchant sales and proactively generates flash deals during low-traffic periods</li>
            <li><strong>ONDC Registry</strong> broadcasts all deals, making them discoverable across multiple platforms</li>
            <li>Consumers benefit from personalized recommendations; merchants recover lost revenue</li>
          </ol>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '8px', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#002970', color: 'white', padding: '40px 24px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ margin: '0 0 12px 0' }}>🚀 Paytm OmniMatch - AI-Powered Local Commerce Ecosystem</p>
        <p style={{ margin: '0', fontSize: '12px', opacity: 0.8' }}>Backend: Node.js + Express | AI: Python FastAPI + Gemini | Frontend: React + Vite</p>
      </footer>
    </div>
  );
}
