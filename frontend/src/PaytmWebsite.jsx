import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaytmWebsite() {
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

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, marginLeft: '48px' }}>
            {['Recharge & Bills', 'Ticket Booking', 'Payments & Services', 'Paytm for Business', 'Company'].map((item, idx) => (
              <button
                key={idx}
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
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', color: '#002970', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>
              
            </button>
            <button style={{ backgroundColor: '#002970', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '24px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            
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
                transition: 'all 0.3s'
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
