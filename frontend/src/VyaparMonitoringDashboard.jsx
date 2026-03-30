import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VyaparMonitoringDashboard() {
  const [monitoring, setMonitoring] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch monitoring status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/vyapar/monitor/status`);
      setMonitoring(response.data.monitoring);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchStatus();
    if (!autoRefresh) return;

    const interval = setInterval(fetchStatus, 30 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleStartMonitoring = async (merchantId) => {
    try {
      await axios.post(`${API_BASE}/api/vyapar/monitor/start/${merchantId}`);
      fetchStatus();
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  };

  const handleStopMonitoring = async (merchantId) => {
    try {
      await axios.post(`${API_BASE}/api/vyapar/monitor/stop/${merchantId}`);
      fetchStatus();
    } catch (error) {
      console.error('Error stopping monitoring:', error);
    }
  };

  if (!monitoring) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button onClick={fetchStatus} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Load Monitoring Status
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: '0', fontSize: '28px', color: '#333' }}>🤖 Vyapar AI Automated Monitoring</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh (30s)</span>
          </label>
          <button
            onClick={fetchStatus}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #004E89' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>STATUS</p>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#004E89' }}>
            {monitoring.isMonitoring ? '🟢 ACTIVE' : '🔴 INACTIVE'}
          </p>
        </div>

        <div style={{ backgroundColor: '#fff3cd', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #FF6B35' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>MERCHANTS MONITORED</p>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#FF6B35' }}>
            {monitoring.activeMonitors}
          </p>
        </div>

        <div style={{ backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #00AA00' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>LAST UPDATE</p>
          <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#00AA00' }}>
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ddd' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>📊 How Automated Monitoring Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '14px' }}>
          <div>
            <strong style={{ color: '#004E89' }}>1. Track</strong><br/>
            Every 5 minutes, monitors transaction volume
          </div>
          <div>
            <strong style={{ color: '#FF6B35' }}>2. Analyze</strong><br/>
            Calculates sales drop percentage
          </div>
          <div>
            <strong style={{ color: '#00AA00' }}>3. Trigger</strong><br/>
            If drop &gt; 30%, activates AI
          </div>
          <div>
            <strong style={{ color: '#002970' }}>4. Generate</strong><br/>
            Creates flash deal automatically
          </div>
        </div>
      </div>

      {/* Merchants Monitoring Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <h3 style={{ padding: '16px', margin: '0', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          👥 Monitored Merchants
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', collapseBorder: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Merchant
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Current
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Average
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Last Alert
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {monitoring.merchants.map((merchant, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                    {merchant.merchantName}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#FF6B35', fontWeight: 'bold' }}>
                    {merchant.currentTransactions} txns
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#004E89' }}>
                    {merchant.averageTransactions}
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                    {merchant.lastAlert === 'None' ? '—' : merchant.lastAlert}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: merchant.isMonitoring ? '#d4edda' : '#f8d7da',
                        color: merchant.isMonitoring ? '#155724' : '#856404'
                      }}
                    >
                      {merchant.isMonitoring ? '🟢 Monitoring' : '⏸️ Paused'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {merchant.isMonitoring ? (
                      <button
                        onClick={() => handleStopMonitoring(merchant.merchantId)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartMonitoring(merchant.merchantId)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Start
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Benefits */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '2px solid #00AA00' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#00AA00' }}>✨ Benefits of Automated Pipeline</h3>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
          <li><strong>No Manual Intervention</strong> - System detects drops automatically 24/7</li>
          <li><strong>Real-time Response</strong> - Generates flash deals within 5 minutes of drop detection</li>
          <li><strong>Context-Aware</strong> - Considers weather, foot traffic, time of day automatically</li>
          <li><strong>Revenue Recovery</strong> - Prevents revenue loss by proactive discounting</li>
          <li><strong>Scalable</strong> - Monitor unlimited merchants with zero overhead per merchant</li>
        </ul>
      </div>
    </div>
  );
}
