import { useState } from 'react';
import { useBets } from '../hooks/useBets';

export default function Portfolio({ user, walletBalance, onBack }) {
  const [selectedTab, setSelectedTab] = useState('active');
  const { bets, stats, loading, error, refetch } = useBets(user?.walletAddress);

  const activePositions = bets.filter(b => b.status === 'active');
  const closedPositions = bets.filter(b => b.status !== 'active');

  const accuracyTrend = [
    { week: 'W1', accuracy: 45 },
    { week: 'W2', accuracy: 52 },
    { week: 'W3', accuracy: 48 },
    { week: 'W4', accuracy: 61 },
    { week: 'W5', accuracy: 58 },
    { week: 'W6', accuracy: stats.total > 0 ? Math.round((bets.filter(b => b.status === 'won').length / stats.total) * 100) : 0 },
  ];
  const maxAccuracy = Math.max(...accuracyTrend.map(t => t.accuracy));
  const accuracy = stats.total > 0
    ? Math.round((bets.filter(b => b.status === 'won').length / stats.total) * 100)
    : 0;

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h1 style={{ color: '#ffd700' }}>My Portfolio</h1>
        <div className="header-spacer" />
      </div>

      <div className="wallet-status">
        <div className="status-item">
          <span className="status-label">Balance</span>
          <span className="status-value">{walletBalance.toFixed(2)} cUSD</span>
        </div>
        <div className="status-item">
          <span className="status-label">Total Staked</span>
          <span className="status-value staked">{stats.totalStaked?.toFixed(2) ?? '0.00'} cUSD</span>
        </div>
        <div className="status-item">
          <span className="status-label">P&amp;L</span>
          <span className="status-value" style={{ color: (stats.pnl ?? 0) >= 0 ? '#34d399' : '#f87171' }}>
            {(stats.pnl ?? 0) >= 0 ? '+' : ''}{stats.pnl?.toFixed(2) ?? '0.00'} cUSD
          </span>
        </div>
      </div>

      <div className="performance-section">
        <h3>Performance</h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>Loading bets...</div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: 16, color: '#f87171' }}>
            {error} <button className="btn-secondary" style={{ width: 'auto', padding: '6px 16px', marginLeft: 8 }} onClick={refetch}>Retry</button>
          </div>
        )}

        {!loading && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🎯</span>
                <span className="stat-label">Accuracy</span>
                <span className="stat-value animate">{accuracy}%</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Winnings</span>
                <span className="stat-value animate">{stats.totalWon?.toFixed(2) ?? '0.00'} cUSD</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <span className="stat-label">Positions</span>
                <span className="stat-value animate">{stats.total ?? 0}</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">Active</span>
                <span className="stat-value animate">{stats.active ?? 0}</span>
              </div>
            </div>

            <div className="accuracy-chart">
              <h4>Accuracy Trend (Last 6 Weeks)</h4>
              <div className="chart-bars">
                {accuracyTrend.map((item, idx) => (
                  <div key={idx} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(item.accuracy / maxAccuracy) * 100}%`,
                        backgroundColor: item.accuracy >= 50 ? '#10b981' : '#ef4444',
                      }}
                      title={`${item.accuracy}%`}
                    />
                    <span className="chart-label">{item.week}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="positions-section">
        <div className="tabs">
          <button className={`tab ${selectedTab === 'active' ? 'active' : ''}`} onClick={() => setSelectedTab('active')}>
            Active ({activePositions.length})
          </button>
          <button className={`tab ${selectedTab === 'closed' ? 'active' : ''}`} onClick={() => setSelectedTab('closed')}>
            Closed ({closedPositions.length})
          </button>
        </div>

        {selectedTab === 'active' && (
          <div className="positions-list">
            {activePositions.length > 0 ? activePositions.map(bet => (
              <div key={bet.id} className="position-card active-position">
                <div className="position-header">
                  <h4>{bet.marketTitle}</h4>
                  <span className={`prediction-badge ${bet.outcome}`}>{bet.outcome?.toUpperCase()}</span>
                </div>
                <div className="position-details">
                  <div className="detail">
                    <span className="label">Wagered</span>
                    <span className="value">{bet.amount?.toFixed(2)} cUSD</span>
                  </div>
                  <div className="detail">
                    <span className="label">Odds</span>
                    <span className="value">{bet.odds?.toFixed(2)}x</span>
                  </div>
                  <div className="detail">
                    <span className="label">To Win</span>
                    <span className="value winner">{bet.potentialWin?.toFixed(2)} cUSD</span>
                  </div>
                </div>
                <div className="position-time">📅 {new Date(bet.timestamp).toLocaleString()}</div>
              </div>
            )) : (
              <div className="empty-state">
                <p>No active positions. Start by discovering markets! 🎯</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'closed' && (
          <div className="positions-list">
            {closedPositions.length > 0 ? closedPositions.map(bet => (
              <div key={bet.id} className={`position-card closed-position ${bet.status}`}>
                <div className="position-header">
                  <h4>{bet.marketTitle}</h4>
                  <span className={`result-badge ${bet.status === 'won' ? '' : 'lost'}`}>
                    {bet.status === 'won' ? '✓ WON' : '✗ LOST'}
                  </span>
                </div>
                <div className="position-details">
                  <div className="detail">
                    <span className="label">Wagered</span>
                    <span className="value">{bet.amount?.toFixed(2)} cUSD</span>
                  </div>
                  <div className="detail">
                    <span className="label">Result</span>
                    <span className={`value ${bet.status === 'won' ? 'won' : 'lost'}`}>
                      {bet.status === 'won' ? `+${bet.profit?.toFixed(2)}` : `-${bet.amount?.toFixed(2)}`} cUSD
                    </span>
                  </div>
                </div>
                <div className="position-time">📅 {new Date(bet.timestamp).toLocaleString()}</div>
              </div>
            )) : (
              <div className="empty-state"><p>No closed positions yet.</p></div>
            )}
          </div>
        )}
      </div>

      <div className="withdraw-section">
        <h3>Repatriate Funds</h3>
        <p className="withdraw-hint">Transfer your cUSD back to your bank account in one tap.</p>
        <button className="btn-primary btn-lg btn-withdraw">Withdraw to Bank</button>
      </div>
    </div>
  );
}
