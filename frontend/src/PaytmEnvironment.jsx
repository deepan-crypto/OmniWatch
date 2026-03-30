import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaytmAdGenerator from './PaytmAdGenerator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaytmEnvironment() {
  const [userMode, setUserMode] = useState('home'); // home, scout, vyapar, deals, profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Vyapar AI State
  const [proactiveAlert, setProactiveAlert] = useState(null);
  const [generatedDeal, setGeneratedDeal] = useState(null);
  const [paytmMetrics, setPaytmMetrics] = useState({
    currentTransactions: 15,
    historicalAverage: 45
  });
  const [contextData, setContextData] = useState({
    weather: 'rainy',
    footTraffic: 'low',
    hour: new Date().getHours()
  });

  // Scout AI State
  const [consumerQuery, setConsumerQuery] = useState('I want spicy food near me');
  const [recommendations, setRecommendations] = useState(null);
  const [userId] = useState('user_' + Date.now());

  // ONDC Registry State
  const [activeDealcs, setActiveDealcs] = useState([]);
  const [filteredDealcs, setFilteredDealcs] = useState([]);

  // Mock inventory surplus
  const inventorySurplus = [
    { id: 'item_001', name: 'Masala Tea', category: 'beverages', price: 40, quantity: 75, margin: 25 },
    { id: 'item_002', name: 'Gobi Manchurian', category: 'food', price: 250, quantity: 95, margin: 40 },
    { id: 'item_003', name: 'Garlic Naan', category: 'bread', price: 60, quantity: 120, margin: 35 },
    { id: 'item_004', name: 'Chicken Biryani', category: 'rice', price: 350, quantity: 45, margin: 50 }
  ];

  useEffect(() => {
    if (userMode === 'deals') {
      fetchActiveDealcs();
    }
  }, [userMode]);

  const fetchActiveDealcs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/vyapar/deals/active`);
      setActiveDealcs(response.data.dealcs || []);
      setFilteredDealcs(response.data.dealcs || []);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    }
  };

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
      setGeneratedDeal({
        selected_item: alertData.selected_item,
        discount_offer: alertData.discount_offer,
        merchant_name: 'Coimbatore Spice House',
        background_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=paytm://upi/pay?pa=merchant@paytm'
      });
    } catch (err) {
      setError('Failed to generate alert: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
      {/* Paytm Header Bar */}
      <div style={{ backgroundColor: '#002970', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #00BAF2' }}>
        <h2 style={{ margin: '0', fontSize: '28px' }}>
          <span style={{ color: '#00BAF2' }}>Paytm</span> OmniMatch
        </h2>
        <div style={{ fontSize: '14px', color: '#ccc' }}>🤖 Vyapar AI + 🔍 Scout AI + 📋 ONDC</div>
      </div>

      {/* Horizontal Navigation */}
      <div style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '0', overflowX: 'auto' }}>
        {[
          { mode: 'home', label: '🏠 Home', color: '#002970' },
          { mode: 'scout', label: '🔍 Find Deals (Scout AI)', color: '#004E89' },
          { mode: 'vyapar', label: '💰 My Business (Vyapar AI)', color: '#FF6B35' },
          { mode: 'deals', label: '📋 Live Dealcs (ONDC)', color: '#00AA00' },
          { mode: 'profile', label: '👤 Profile', color: '#666' }
        ].map(item => (
          <button
            key={item.mode}
            onClick={() => setUserMode(item.mode)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '14px 16px',
              backgroundColor: userMode === item.mode ? item.color : 'white',
              color: userMode === item.mode ? 'white' : '#333',
              fontSize: '13px',
              fontWeight: userMode === item.mode ? 'bold' : 'normal',
              cursor: 'pointer',
              border: 'none',
              borderBottom: userMode === item.mode ? `4px solid ${item.color}` : '1px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '24px', minHeight: 'calc(100vh - 140px)' }}>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', margin: '12px 16px', borderRadius: '6px', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* HOME PAGE */}
        {userMode === 'home' && (
          <div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#333' }}>Welcome back, User 👋</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>Discover deals powered by AI agents</p>
            
            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div
                onClick={() => setUserMode('scout')}
                style={{
                  backgroundColor: '#e3f2fd',
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid #004E89',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#004E89', marginBottom: '4px' }}>Scout AI</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Find personalized deals based on what you want</div>
              </div>

              <div
                onClick={() => setUserMode('vyapar')}
                style={{
                  backgroundColor: '#fff3cd',
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid #FF6B35',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '4px' }}>Vyapar AI</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Manage your business & auto-generate flash deals</div>
              </div>

              <div
                onClick={() => { setUserMode('deals'); fetchActiveDealcs(); }}
                style={{
                  backgroundColor: '#e8f5e9',
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid #00AA00',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00AA00', marginBottom: '4px' }}>ONDC Registry</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Browse all live deals from merchants</div>
              </div>
            </div>

            {/* Info Section */}
            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>How it works 🚀</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>1️⃣</div>
                  <p style={{ margin: '0', fontSize: '12px' }}><strong>Scout AI</strong> analyzes your preferences and finds the best deals near you</p>
                </div>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>2️⃣</div>
                  <p style={{ margin: '0', fontSize: '12px' }}><strong>Vyapar AI</strong> monitors merchant sales and auto-generates flash deals when traffic drops</p>
                </div>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>3️⃣</div>
                  <p style={{ margin: '0', fontSize: '12px' }}><strong>ONDC Registry</strong> lists all live deals across the network</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCOUT AI - CONSUMER */}
        {userMode === 'scout' && (
          <div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#004E89' }}>🔍 Scout AI - Smart Deal Finder</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>Tell Scout AI what you're in the mood for, and it will find the best matching deals</p>

            <div style={{ backgroundColor: '#e3f2fd', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #004E89' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>What are you looking for?</label>
              <textarea
                value={consumerQuery}
                onChange={(e) => setConsumerQuery(e.target.value)}
                placeholder="e.g., 'Spicy biryani near me', 'Hot tea during rain', 'Cheap snacks for office'..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #004E89',
                  fontFamily: 'Arial',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />

              <button
                onClick={handleScoutQuery}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#004E89',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  marginTop: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '🔍 Searching with Scout AI...' : '🔍 Find Best Deals'}
              </button>
            </div>

            {recommendations && (
              <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '12px', border: '3px solid #004E89' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#004E89', fontSize: '18px' }}>✨ Perfect Match Found!</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>🏪 Merchant</p>
                    <p style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{recommendations.merchant_name}</p>
                    
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>📍 Location</p>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>{recommendations.location}</p>
                  </div>
                  
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>🍽️ Item</p>
                    <p style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{recommendations.item_name}</p>
                    
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>💵 Price</p>
                    <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#00AA00' }}>₹{recommendations.final_price}</p>
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>💬 Why this deal?</p>
                  <p style={{ margin: '0', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{recommendations.reasoning}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VYAPAR AI - MERCHANT */}
        {userMode === 'vyapar' && (
          <div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#FF6B35' }}>📊 Vyapar AI - Smart Business Manager</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>Monitor Paytm sales in real-time and let Vyapar AI auto-generate flash deals to recover lost revenue</p>

            {/* Info Section - How Weather & Foot Traffic Help */}
            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #FF6B35' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#FF6B35' }}>🔧 How Vyapar AI Uses Context Data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>🌧️ Weather</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#555' }}>
                    • Rainy? → Promote hot beverages/tea<br/>
                    • Hot? → Promote cold drinks<br/>
                    • Cold? → Promote warm food
                  </p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>👥 Foot Traffic</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#555' }}>
                    • Low traffic? → Deeper discounts<br/>
                    • Moderate? → Standard offers<br/>
                    • High? → Focus on high-margin items
                  </p>
                </div>
              </div>
            </div>

            {/* Sales Metrics */}
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>📱 Paytm Sales Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#fff9e6', padding: '16px', borderRadius: '8px', border: '1px solid #FF6B35' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666', fontWeight: 'bold' }}>TODAY'S TRANSACTIONS</p>
                <input
                  type="number"
                  value={paytmMetrics.currentTransactions}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, currentTransactions: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #FF6B35' }}
                />
              </div>
              <div style={{ backgroundColor: '#fff9e6', padding: '16px', borderRadius: '8px', border: '1px solid #FF6B35' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666', fontWeight: 'bold' }}>HISTORICAL AVERAGE</p>
                <input
                  type="number"
                  value={paytmMetrics.historicalAverage}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, historicalAverage: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #FF6B35' }}
                />
              </div>
              <div style={{ backgroundColor: '#ffebee', padding: '16px', borderRadius: '8px', border: '2px solid #c62828', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666', fontWeight: 'bold' }}>SALES DROP</p>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#c62828' }}>
                  {((paytmMetrics.historicalAverage - paytmMetrics.currentTransactions) / paytmMetrics.historicalAverage * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Context */}
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>⚙️ Real-Time Context</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>🌦️ Weather Condition</label>
                <select
                  value={contextData.weather}
                  onChange={(e) => setContextData({ ...contextData, weather: e.target.value })}
                  style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' }}
                >
                  <option value="rainy">🌧️ Rainy - Customers prefer hot drinks</option>
                  <option value="clear">☀️ Clear - Normal conditions</option>
                  <option value="hot">🔥 Hot - Demand for cold items</option>
                  <option value="cold">❄️ Cold - Warm food preferred</option>
                </select>
              </div>
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>👥 Foot Traffic</label>
                <select
                  value={contextData.footTraffic}
                  onChange={(e) => setContextData({ ...contextData, footTraffic: e.target.value })}
                  style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' }}
                >
                  <option value="low">📉 Low - Increase discounts to attract</option>
                  <option value="moderate">➡️ Moderate - Standard promotions</option>
                  <option value="high">📈 High - Focus on high-margin items</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleProactiveAlert}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                marginBottom: '20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '⏳ Vyapar AI is analyzing conditions...' : '🚨 Generate Flash Deal Now'}
            </button>

            {proactiveAlert && (
              <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '12px', border: '3px solid #FF6B35', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#FF6B35', fontSize: '16px' }}>📢 Vyapar AI Alert</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontStyle: 'italic', lineHeight: '1.6', color: '#333' }}>
                  "{proactiveAlert.notification_message}"
                </p>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Agent's Logic:</p>
                  <p style={{ margin: '0', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{proactiveAlert.agent_reasoning}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>📦 Item to Promote</p>
                    <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{proactiveAlert.selected_item}</p>
                  </div>
                  <div style={{ backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>💰 Offer</p>
                    <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#00AA00' }}>{proactiveAlert.discount_offer}</p>
                  </div>
                </div>
              </div>
            )}

            {generatedDeal && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>📱 Your Promotional Ad Asset</h3>
                <PaytmAdGenerator aiDealData={generatedDeal} />
              </div>
            )}
          </div>
        )}

        {/* LIVE DEALS - ONDC REGISTRY */}
        {userMode === 'deals' && (
          <div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#00AA00' }}>📋 Live ONDC Dealcs</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>All flash deals currently active in the Open Network for Commerce</p>

            <button
              onClick={fetchActiveDealcs}
              style={{
                padding: '12px 24px',
                backgroundColor: '#00AA00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              🔄 Refresh Live Dealcs
            </button>

            {filteredDealcs.length === 0 ? (
              <div style={{ backgroundColor: '#f0f0f0', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ margin: '0', fontSize: '14px', color: '#999' }}>No live deals yet. Generate one from Vyapar AI dashboard to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredDealcs.map((deal) => (
                  <div key={deal.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '2px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: '0', fontSize: '16px', color: '#333', fontWeight: 'bold' }}>{deal.itemName}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{deal.merchantName}</p>
                      </div>
                      <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                        {deal.discountPercentage}%<br/><span style={{ fontSize: '11px' }}>OFF</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>💵 Price</p>
                      <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        ₹{deal.finalPrice}
                        <span style={{ textDecoration: 'line-through', marginLeft: '8px', color: '#999', fontSize: '14px' }}>₹{deal.originalPrice}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', backgroundColor: '#e8f5e9', color: '#00AA00', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {deal.status}
                      </span>
                      <span style={{ fontSize: '11px', color: '#999' }}>📍 {deal.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {userMode === 'profile' && (
          <div>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '28px', color: '#333' }}>👤 My Profile</h2>
            
            <div style={{ backgroundColor: 'linear-gradient(135deg, #002970 0%, #004E89 100%)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', backgroundImage: 'linear-gradient(135deg, #002970 0%, #004E89 100%)' }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>👤</div>
              <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>User {userId.slice(-5)}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', opacity: 0.9 }}>Premium Member</p>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.7 }}>Member since March 2026</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>DEALS FOUND</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#002970' }}>12</p>
              </div>
              <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>SAVINGS</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#00AA00' }}>₹850</p>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#002970',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
