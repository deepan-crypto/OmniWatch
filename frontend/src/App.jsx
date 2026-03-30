import React, { useState } from 'react';
import './App.css';
import MerchantDashboard from './MerchantDashboard';
import ScoutUI from './ScoutUI';
import PaytmEnvironment from './PaytmEnvironment';

function App() {
  const [activeTab, setActiveTab] = useState('paytm');

  return (
    <div className="app">
      <div className="navbar">
        <div className="navbar-brand">
          <h1>💰 Paytm OmniMatch</h1>
          <p>Dual-Agent Local Commerce Ecosystem</p>
        </div>

        <div className="navbar-tabs">
          <button
            className={`tab-button ${activeTab === 'paytm' ? 'active' : ''}`}
            onClick={() => setActiveTab('paytm')}
          >
            📱 Paytm Environment
          </button>
          <button
            className={`tab-button ${activeTab === 'scout' ? 'active' : ''}`}
            onClick={() => setActiveTab('scout')}
          >
            🔍 Scout AI (Consumer)
          </button>
          <button
            className={`tab-button ${activeTab === 'vyapar' ? 'active' : ''}`}
            onClick={() => setActiveTab('vyapar')}
          >
            📊 Vyapar AI (Merchant)
          </button>
        </div>
      </div>

      <main className="main-content">
        {activeTab === 'paytm' && <PaytmEnvironment />}
        {activeTab === 'scout' && <ScoutUI />}
        {activeTab === 'vyapar' && <MerchantDashboard />}
      </main>

      <footer className="app-footer">
        <p>
          Build with 🚀 for Fortune '26 Hackathon | Backend: Node.js + Express | AI: Python FastAPI + Gemini
        </p>
        <p>
          API Docs: <a href="http://localhost:5000" target="_blank" rel="noreferrer">Node.js API</a> | 
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer"> Python AI Docs</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
