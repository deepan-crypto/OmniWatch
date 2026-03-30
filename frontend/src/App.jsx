import React, { useState } from 'react';
import './App.css';
import PaytmWebsite from './PaytmWebsite';
import PaytmEnvironment from './PaytmEnvironment';
import VyaparMonitoringDashboard from './VyaparMonitoringDashboard';

function App() {
  const [view, setView] = useState('website'); // 'website', 'mini-app', or 'monitor'

  return (
    <div className="app" style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
      {/* View Toggle (Top Right) */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setView('website')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'website' ? '#002970' : '#ddd',
            color: view === 'website' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px'
          }}
        >
          Website
        </button>
        <button
          onClick={() => setView('mini-app')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'mini-app' ? '#002970' : '#ddd',
            color: view === 'mini-app' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px'
          }}
        >
          Mini App
        </button>
        <button
          onClick={() => setView('monitor')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'monitor' ? '#FF6B35' : '#ddd',
            color: view === 'monitor' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px'
          }}
        >
          🤖 Monitor
        </button>
      </div>

      {view === 'website' && (
        <PaytmWebsite />
      )}
      {view === 'mini-app' && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '50px' }}>
          <PaytmEnvironment />
        </div>
      )}
      {view === 'monitor' && (
        <VyaparMonitoringDashboard />
      )}
    </div>
  );
}

export default App;
