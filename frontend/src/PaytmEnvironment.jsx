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
    <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
      {/* Paytm Header Bar */}
      <div style={{ backgroundColor: '#002970', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0', fontSize: '20px' }}>
          <span style={{ color: '#00BAF2' }}>Paytm</span>
        </h2>
        <div style={{ fontSize: '12px', color: '#ccc' }}>ONDC Enabled</div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
        {[
          { mode: 'home', label: '🏠 Home', color: '#002970' },
          { mode: 'scout', label: '🔍 Deals', color: '#004E89' },
          { mode: 'vyapar', label: '💰 Business', color: '#FF6B35' },
          { mode: 'deals', label: '📋 Live', color: '#00AA00' },
          { mode: 'profile', label: '👤 Profile', color: '#666' }
        ].map(item => (
          <button
            key={item.mode}
            onClick={() => setUserMode(item.mode)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: userMode === item.mode ? item.color : '#999',
              fontSize: '12px',
              fontWeight: userMode === item.mode ? 'bold' : 'normal',
              cursor: 'pointer',
              borderTop: userMode === item.mode ? `3px solid ${item.color}` : 'none'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ paddingBottom: '80px', paddingTop: '16px' }}>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', margin: '12px 16px', borderRadius: '6px', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* HOME PAGE */}
        {userMode === 'home' && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>Welcome, User 👋</h3>
            
            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div
                onClick={() => setUserMode('scout')}
                style={{
                  backgroundColor: '#e3f2fd',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid #004E89'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#004E89' }}>Find Deals</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Via Scout AI</div>
              </div>

              <div
                onClick={() => setUserMode('vyapar')}
                style={{
                  backgroundColor: '#fff3cd',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid #FF6B35'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💰</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF6B35' }}>My Business</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Vyapar AI</div>
              </div>
            </div>

            {/* Featured Dealcs */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>Featured Offers 🎉</h4>
            <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '6px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
              <button onClick={() => { setUserMode('deals'); fetchActiveDealcs(); }} style={{ backgroundColor: '#002970', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                View All Live Deals
              </button>
            </div>
          </div>
        )}

        {/* SCOUT AI - CONSUMER */}
        {userMode === 'scout' && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#004E89' }}>🔍 Scout AI - Find Deals</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666' }}>Tell Scout AI what you're looking for</p>

            <textarea
              value={consumerQuery}
              onChange={(e) => setConsumerQuery(e.target.value)}
              placeholder="e.g., Spicy biryani near me, hot tea during rain..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #00BAF2',
                fontFamily: 'Arial',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />

            <button
              onClick={handleScoutQuery}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#004E89',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                marginTop: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? '🔍 Searching...' : '🔍 Find Best Deals'}
            </button>

            {recommendations && (
              <div style={{ backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '6px', marginTop: '16px', border: '2px solid #004E89' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#004E89', fontSize: '13px' }}>✨ Perfect Match!</h4>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>🏪 {recommendations.merchant_name}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>🍽️ {recommendations.item_name}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>💵 ₹{recommendations.final_price}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>💬 {recommendations.reasoning}</p>
              </div>
            )}
          </div>
        )}

        {/* VYAPAR AI - MERCHANT */}
        {userMode === 'vyapar' && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#FF6B35' }}>📊 Vyapar AI - My Business</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#666' }}>Monitor sales & auto-generate flash deals</p>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>Current Paytm</p>
                <input
                  type="number"
                  value={paytmMetrics.currentTransactions}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, currentTransactions: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '6px', marginTop: '4px', textAlign: 'center', fontSize: '12px' }}
                />
              </div>
              <div style={{ backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>Historical Avg</p>
                <input
                  type="number"
                  value={paytmMetrics.historicalAverage}
                  onChange={(e) => setPaytmMetrics({ ...paytmMetrics, historicalAverage: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '6px', marginTop: '4px', textAlign: 'center', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Context */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Weather</label>
                <select
                  value={contextData.weather}
                  onChange={(e) => setContextData({ ...contextData, weather: e.target.value })}
                  style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="clear">☀️ Clear</option>
                  <option value="hot">🔥 Hot</option>
                  <option value="cold">❄️ Cold</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Foot Traffic</label>
                <select
                  value={contextData.footTraffic}
                  onChange={(e) => setContextData({ ...contextData, footTraffic: e.target.value })}
                  style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="low">📉 Low</option>
                  <option value="moderate">➡️ Moderate</option>
                  <option value="high">📈 High</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleProactiveAlert}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                marginBottom: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? '⏳ Analyzing...' : '🚨 Generate Flash Deal'}
            </button>

            {proactiveAlert && (
              <div style={{ backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', border: '2px solid #FF6B35' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontStyle: 'italic', color: '#333' }}>
                  "{proactiveAlert.notification_message}"
                </p>
                <p style={{ margin: '6px 0', fontSize: '11px', color: '#666' }}>
                  <strong>Item:</strong> {proactiveAlert.selected_item}
                </p>
                <p style={{ margin: '6px 0', fontSize: '11px', color: '#666' }}>
                  <strong>Offer:</strong> {proactiveAlert.discount_offer}
                </p>
              </div>
            )}

            {generatedDeal && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>📱 Your Ad Asset</h4>
                <PaytmAdGenerator aiDealData={generatedDeal} />
              </div>
            )}
          </div>
        )}

        {/* LIVE DEALS - ONDC REGISTRY */}
        {userMode === 'deals' && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#00AA00' }}>📋 Live ONDC Dealcs</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666' }}>All available flash deals</p>

            <button
              onClick={fetchActiveDealcs}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#00AA00',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              🔄 Refresh
            </button>

            {filteredDealcs.length === 0 ? (
              <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '6px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                No live deals yet
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredDealcs.map((deal) => (
                  <div key={deal.id} style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h5 style={{ margin: '0', fontSize: '13px', color: '#333' }}>{deal.itemName}</h5>
                        <p style={{ margin: '2px 0', fontSize: '11px', color: '#666' }}>{deal.merchantName}</p>
                      </div>
                      <div style={{ backgroundColor: '#FF6B35', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {deal.discountPercentage}% OFF
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#333' }}>
                      <strong>₹{deal.finalPrice}</strong> <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: '8px' }}>₹{deal.originalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {userMode === 'profile' && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>👤 My Profile</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
              <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>User {userId.slice(-5)}</p>
              <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>Premium Member</p>
              <button
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#002970',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
