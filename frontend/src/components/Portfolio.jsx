import { useState } from 'react';

export default function Portfolio({ user, positions, walletBalance, onBack }) {
  const [selectedTab, setSelectedTab] = useState('active');

  const activePositions = positions.filter(p => p.status === 'active');
  const closedPositions = positions.filter(p => p.status === 'closed');

  const totalStaked = positions.reduce((sum, p) => sum + p.amount, 0);
  const totalPotentialValue = positions
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + parseFloat(p.potentialPayout), 0);
  
  const totalWinnings = positions
    .filter(p => p.status === 'closed' && p.result === 'won')
    .reduce((sum, p) => sum + parseFloat(p.potentialProfit), 0);

  const accuracy = positions.length > 0
    ? Math.round((positions.filter(p => p.result === 'won').length / positions.length) * 100)
    : 0;

  // Mock historical data for accuracy chart
  const accuracyTrend = [
    { week: 'W1', accuracy: 45 },
    { week: 'W2', accuracy: 52 },
    { week: 'W3', accuracy: 48 },
    { week: 'W4', accuracy: 61 },
    { week: 'W5', accuracy: 58 },
    { week: 'W6', accuracy: accuracy }
  ];

  const maxAccuracy = Math.max(...accuracyTrend.map(t => t.accuracy));

  return (
    <div className="portfolio">
      {/* Header */}
      <div className="portfolio-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h1 color="#ffd700">My Portfolio</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Wallet Status */}
      <div className="wallet-status">
        <div className="status-item">
          <span className="status-label">Current Balance</span>
          <span className="status-value">{walletBalance.toFixed(2)} cUSD</span>
        </div>
        <div className="status-item">
          <span className="status-label">Total Staked</span>
          <span className="status-value staked">{totalStaked.toFixed(2)} cUSD</span>
        </div>
        <div className="status-item">
          <span className="status-label">At Risk</span>
          <span className="status-value risk">{totalPotentialValue.toFixed(2)} cUSD</span>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="performance-section">
        <h3>Performance</h3>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Winnings</span>
            <span className="stat-value">{totalWinnings.toFixed(2)} cUSD</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-label">Positions</span>
            <span className="stat-value">{positions.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">Streak</span>
            <span className="stat-value">{positions.length > 0 ? '2W' : '-'}</span>
          </div>
        </div>

        {/* Accuracy Trend Chart */}
        <div className="accuracy-chart">
          <h4>Accuracy Trend (Last 6 Weeks)</h4>
          <div className="chart-bars">
            {accuracyTrend.map((item, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(item.accuracy / maxAccuracy) * 100}%`,
                    backgroundColor: item.accuracy >= 50 ? '#10b981' : '#ef4444'
                  }}
                  title={`${item.accuracy}%`}
                ></div>
                <span className="chart-label">{item.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positions Tabs */}
      <div className="positions-section">
        <div className="tabs">
          <button
            className={`tab ${selectedTab === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedTab('active')}
          >
            Active ({activePositions.length})
          </button>
          <button
            className={`tab ${selectedTab === 'closed' ? 'active' : ''}`}
            onClick={() => setSelectedTab('closed')}
          >
            Closed ({closedPositions.length})
          </button>
        </div>

        {selectedTab === 'active' && (
          <div className="positions-list">
            {activePositions.length > 0 ? (
              activePositions.map(position => (
                <div key={position.id} className="position-card active-position">
                  <div className="position-header">
                    <h4>{position.marketTitle}</h4>
                    <span className={`prediction-badge ${position.prediction}`}>
                      {position.prediction.toUpperCase()}
                    </span>
                  </div>

                  <div className="position-details">
                    <div className="detail">
                      <span className="label">Wagered</span>
                      <span className="value">{position.amount.toFixed(2)} cUSD</span>
                    </div>
                    <div className="detail">
                      <span className="label">Odds</span>
                      <span className="value">{position.odds.toFixed(2)}x</span>
                    </div>
                    <div className="detail">
                      <span className="label">Potential Payout</span>
                      <span className="value winner">{position.potentialPayout} cUSD</span>
                    </div>
                  </div>

                  <div className="position-time">
                    <span>📅 {position.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No active positions. Start by discovering markets! 🎯</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'closed' && (
          <div className="positions-list">
            {closedPositions.length > 0 ? (
              closedPositions.map(position => (
                <div key={position.id} className={`position-card closed-position ${position.result}`}>
                  <div className="position-header">
                    <h4>{position.marketTitle}</h4>
                    <span className={`result-badge ${position.result}`}>
                      {position.result === 'won' ? '✓ WON' : '✗ LOST'}
                    </span>
                  </div>

                  <div className="position-details">
                    <div className="detail">
                      <span className="label">Wagered</span>
                      <span className="value">{position.amount.toFixed(2)} cUSD</span>
                    </div>
                    <div className="detail">
                      <span className="label">Result</span>
                      <span className={`value ${position.result}`}>
                        {position.result === 'won' ? '+' : '-'}{Math.abs(position.potentialProfit)} cUSD
                      </span>
                    </div>
                  </div>

                  <div className="position-time">
                    <span>📅 {position.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No closed positions yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdraw Section */}
      <div className="withdraw-section">
        <h3>Repatriate Funds</h3>
        <p className="withdraw-hint">Transfer your cUSD back to your bank account in one tap.</p>
        <button className="btn-primary btn-lg btn-withdraw">
          Withdraw to Bank
        </button>
      </div>
    </div>
  );
}
