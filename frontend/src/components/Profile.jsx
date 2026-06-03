import { useState } from 'react';
import Icon from './Icon';

const TREND = [
  { week: 'W1', v: 45 }, { week: 'W2', v: 52 }, { week: 'W3', v: 48 },
  { week: 'W4', v: 61 }, { week: 'W5', v: 58 }, { week: 'W6', v: 0 },
];

export default function Profile({ user, positions, walletBalance, onBack }) {
  const [tab, setTab] = useState('active');

  const active = positions.filter(p => p.status === 'active');
  const closed = positions.filter(p => p.status === 'closed');

  const totalStaked   = positions.reduce((s, p) => s + p.amount, 0);
  const totalPotential = active.reduce((s, p) => s + parseFloat(p.potentialPayout || 0), 0);
  const totalWinnings  = closed.filter(p => p.result === 'won').reduce((s, p) => s + parseFloat(p.potentialProfit || 0), 0);
  const accuracy       = positions.length > 0 ? Math.round((positions.filter(p => p.result === 'won').length / positions.length) * 100) : 0;

  const trend = TREND.map((t, i) => ({ ...t, v: i === TREND.length - 1 ? accuracy : t.v }));
  const maxTrend = Math.max(...trend.map(t => t.v), 1);

  const shortAddr = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : '0x—';

  return (
    <div className="profile-page">
      {/* Top bar */}
      <div className="profile-topbar">
        <button className="prof-back-btn" onClick={onBack}>
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2 className="profile-topbar-title">My Profile</h2>
        <div className="prof-spacer" />
      </div>

      {/* User Identity card */}
      <div className="prof-identity glass-market">
        <div className="prof-avatar">
          <Icon name="user" size={36} color="#ffd700" />
        </div>
        <div className="prof-info">
          <span className="prof-username">{user?.username || 'Unknown'}</span>
          <span className="prof-addr">{shortAddr}</span>
        </div>
        <div className="prof-shield">
          <Icon name="shield" size={20} color="#10b981" />
          <span>Verified</span>
        </div>
      </div>

      {/* Balance card */}
      <div className="prof-balance-card glass-market">
        <div className="pbal-header">
          <Icon name="wallet" size={20} color="#ffd700" />
          <span className="pbal-label">Account Balance</span>
        </div>
        <div className="pbal-amount">{walletBalance.toFixed(2)} <span className="pbal-currency">cUSD</span></div>
        <div className="pbal-row">
          <div className="pbal-item">
            <span className="pbal-item-label">Total Staked</span>
            <span className="pbal-item-val staked">{totalStaked.toFixed(2)} cUSD</span>
          </div>
          <div className="pbal-divider" />
          <div className="pbal-item">
            <span className="pbal-item-label">At Risk</span>
            <span className="pbal-item-val risk">{totalPotential.toFixed(2)} cUSD</span>
          </div>
        </div>
        <button className="btn-primary pbal-withdraw-btn">
          <Icon name="wallet" size={16} color="#111" />
          Withdraw to Bank
        </button>
      </div>

      {/* Performance stats */}
      <div className="prof-section-title">
        <Icon name="chart" size={16} color="#ffd700" />
        <span>Performance</span>
      </div>
      <div className="stats-grid">
        {[
          { icon: 'target', label: 'Accuracy',  val: `${accuracy}%` },
          { icon: 'trophy', label: 'Winnings',   val: `${totalWinnings.toFixed(2)} cUSD` },
          { icon: 'standings', label: 'Positions', val: positions.length },
          { icon: 'bolt',   label: 'Streak',     val: positions.length > 0 ? '2W' : '—' },
        ].map((s, i) => (
          <div key={i} className="stat-card glass-market" style={{ animationDelay: `${i * 0.07}s` }}>
            <Icon name={s.icon} size={22} color="#ffd700" className="stat-svg-icon" />
            <span className="stat-label">{s.label}</span>
            <span className="stat-value animate">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Accuracy chart */}
      <div className="accuracy-chart glass-market">
        <h4>Accuracy Trend (Last 6 Weeks)</h4>
        <div className="chart-bars">
          {trend.map((t, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{
                  height: `${(t.v / maxTrend) * 100}%`,
                  background: t.v >= 50 ? 'linear-gradient(180deg,#10b981,#34d399)' : 'linear-gradient(180deg,#ef4444,#f87171)',
                }}
              />
              <span className="chart-label">{t.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Positions */}
      <div className="prof-section-title">
        <Icon name="standings" size={16} color="#ffd700" />
        <span>My Positions</span>
      </div>
      <div className="tabs">
        <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
          Active ({active.length})
        </button>
        <button className={`tab ${tab === 'closed' ? 'active' : ''}`} onClick={() => setTab('closed')}>
          Closed ({closed.length})
        </button>
      </div>

      <div className="positions-list">
        {tab === 'active' && (
          active.length > 0 ? active.map(pos => (
            <div key={pos.id} className="position-card active-position glass-market">
              <div className="position-header">
                <h4>{pos.marketTitle}</h4>
                <span className={`prediction-badge ${pos.prediction}`}>{pos.prediction?.toUpperCase()}</span>
              </div>
              <div className="position-details">
                <div className="detail"><span className="label">Wagered</span><span className="value">{pos.amount?.toFixed(2)} cUSD</span></div>
                <div className="detail"><span className="label">Odds</span><span className="value">{pos.odds?.toFixed(2)}x</span></div>
                <div className="detail"><span className="label">Payout</span><span className="value winner">{pos.potentialPayout} cUSD</span></div>
              </div>
              <div className="position-time">
                <Icon name="calendar" size={12} color="#6b7280" />
                <span>{pos.timestamp}</span>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <Icon name="target" size={38} color="#374151" />
              <p>No active positions — start predicting!</p>
            </div>
          )
        )}

        {tab === 'closed' && (
          closed.length > 0 ? closed.map(pos => (
            <div key={pos.id} className={`position-card closed-position ${pos.result} glass-market`}>
              <div className="position-header">
                <h4>{pos.marketTitle}</h4>
                <span className={`result-badge ${pos.result}`}>
                  <Icon name={pos.result === 'won' ? 'check' : 'close'} size={12} />
                  {pos.result === 'won' ? ' WON' : ' LOST'}
                </span>
              </div>
              <div className="position-details">
                <div className="detail"><span className="label">Wagered</span><span className="value">{pos.amount?.toFixed(2)} cUSD</span></div>
                <div className="detail"><span className="label">Result</span><span className={`value ${pos.result}`}>{pos.result === 'won' ? '+' : '-'}{Math.abs(pos.potentialProfit)} cUSD</span></div>
              </div>
              <div className="position-time">
                <Icon name="calendar" size={12} color="#6b7280" />
                <span>{pos.timestamp}</span>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <Icon name="standings" size={38} color="#374151" />
              <p>No closed positions yet.</p>
            </div>
          )
        )}
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
