import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaytmWebsite() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId] = useState('user_' + Date.now());
  const [scoutQuery, setScoutQuery] = useState('');
  const [scoutResult, setScoutResult] = useState(null);

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

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', backgroundColor: '#fff', color: '#333' }}>
      {/* HEADER */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '12px 32px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 'bold', color: '#002970' }}>
            <span>Paytm</span>
            <span style={{ fontSize: '16px' }}>❤️</span>
            <span style={{ fontSize: '12px', color: '#666' }}>UPI</span>
          </div>

          {/* Navigation Dropdowns */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, marginLeft: '48px' }}>
            {['Recharge & Bills', 'Ticket Booking', 'Payments & Services', 'Paytm for Business', 'Company'].map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {item}
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', color: '#002970', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>
              ⬇️ Download App
            </button>
            <button style={{ backgroundColor: '#002970', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '24px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        {/* Section Title */}
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', margin: '32px 0 24px 0' }}>Recharges & Bill Payments</h2>

        {/* 6 Service Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: '🔌', label: 'Mobile\nRecharge' },
            { icon: '📡', label: 'DTH\nRecharge' },
            { icon: '🚗', label: 'FastTag\nRecharge' },
            { icon: '💡', label: 'Electricity\nBill' },
            { icon: '🏦', label: 'Loan EMI\nPayment' },
            { icon: '⋮', label: 'View All\nProducts' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #e8e8e8',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', whiteSpace: 'pre-line' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* PROMO SECTION - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          {/* Left: Cashback Promo */}
          <div style={{ backgroundColor: '#fff9e6', padding: '24px', borderRadius: '12px', border: '1px solid #ffe8a8', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '36px' }}>🎉</div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>Do Mobile Recharge and Win ₹100 cashback.</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666' }}>Promo: TAKEITALL</p>
              <button style={{ backgroundColor: 'white', color: '#002970', border: '2px solid #002970', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                Recharge Now →
              </button>
            </div>
          </div>

          {/* Center: Broadband Promo */}
          <div style={{ backgroundColor: '#f0f8ff', padding: '24px', borderRadius: '12px', border: '1px solid #d0e8ff', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '36px' }}>📶</div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>Broadband Recharge</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666' }}>Bill due? Pay now & get rewarded</p>
              <button style={{ backgroundColor: 'white', color: '#002970', border: '2px solid #002970', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                Pay Now →
              </button>
            </div>
          </div>

          {/* Right: UPI Statement Box */}
          <div style={{ backgroundColor: '#a8d8ff', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#003d7a' }}>Get UPI Statement in Excel/PDF</h3>
              <p style={{ margin: '0', fontSize: '12px', color: '#003d7a' }}>Track all your expenses. Only on Paytm.</p>
            </div>
            <button style={{ backgroundColor: '#002970', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', marginTop: '12px', width: 'fit-content' }}>
              Download Paytm App
            </button>
          </div>
        </div>

        {/* FEATURE CARDS - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {[
            { bg: '#fff4e6', title: 'Swipe left to keep it hush', desc: 'Hide your past payments with a left swipe', btn: 'Download App Now →' },
            { bg: '#f0f8ff', title: 'Expense tracking made smarter!', desc: 'Now, download your statement in Excel/PDF format', btn: 'Download App Now →' },
            { bg: '#e6f5ff', title: 'We do the math, you do the spending.', desc: 'Check total balance of all your linked bank accounts', btn: 'Download App Now →' }
          ].map((card, idx) => (
            <div key={idx} style={{ backgroundColor: card.bg, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{card.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>{card.desc}</p>
              </div>
              <button style={{ backgroundColor: '#002970', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' }}>
                {card.btn}
              </button>
            </div>
          ))}
        </div>

        {/* TRAVEL SECTION */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { icon: '✈️', label: 'Flights' },
              { icon: '🚌', label: 'Bus' },
              { icon: '🚂', label: 'Trains' },
              { icon: '🌍', label: 'Intl. Flights' }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SCOUT AI SECTION */}
        <div style={{ backgroundColor: '#e3f2fd', padding: '40px 32px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#002970', margin: '0 0 16px 0' }}>🔍 Find Best Deals with AI</h2>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px 0' }}>Powered by Scout AI - Get personalized recommendations</p>
          
          <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
            <textarea
              value={scoutQuery}
              onChange={(e) => setScoutQuery(e.target.value)}
              placeholder="What are you looking for? (e.g., hot tea, biryani, coffee)"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #00BAF2',
                fontSize: '14px',
                minHeight: '50px',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleScoutAI}
              disabled={loading}
              style={{
                padding: '12px 32px',
                backgroundColor: '#004E89',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? 'Searching...' : 'Find Deals'}
            </button>
          </div>

          {scoutResult && (
            <div style={{ marginTop: '24px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'left', display: 'inline-block', maxWidth: '400px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#004E89' }}>✨ Found for you!</h4>
              <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>🏪 {scoutResult.merchant_name}</strong></p>
              <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>🍽️ {scoutResult.item_name}</strong></p>
              <p style={{ margin: '6px 0', fontSize: '13px', color: '#00AA00', fontWeight: 'bold' }}>💵 ₹{scoutResult.final_price}</p>
              <p style={{ margin: '6px 0', fontSize: '12px', color: '#666' }}>{scoutResult.reasoning}</p>
            </div>
          )}
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '8px', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {error}
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#f9f9f9', borderTop: '1px solid #e0e0e0', padding: '40px 32px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', color: '#999', fontSize: '12px' }}>
          <p>© 2026 Paytm OmniMatch - AI-Powered Local Commerce Ecosystem</p>
          <p>Scout AI for consumers | Vyapar AI for merchants | ONDC Registry for discovery</p>
        </div>
      </footer>
    </div>
  );
}
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
        <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>Backend: Node.js + Express | AI: Python FastAPI + Gemini | Frontend: React + Vite</p>
      </footer>
    </div>
  );
}
