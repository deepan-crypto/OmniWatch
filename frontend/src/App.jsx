import React from 'react';
import './App.css';
import PaytmEnvironment from './PaytmEnvironment';

function App() {
  return (
    <div className="app" style={{ margin: 0, padding: 0, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}>
      <PaytmEnvironment />
    </div>
  );
}

export default App;
