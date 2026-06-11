import { useState } from 'react';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';
import { useClaim } from '../hooks/useContract';

const TREND = [
  { week: 'W1', v: 45 }, { week: 'W2', v: 52 }, { week: 'W3', v: 48 },
  { week: 'W4', v: 61 }, { week: 'W5', v: 58 }, { week: 'W6', v: 0 },
];

function deriveDisplayName(privyUser) {
  if (!privyUser) return 'Seer';
  return (
    privyUser.google?.name ||
    privyUser.twitter?.username ||
    privyUser.discord?.username ||
    privyUser.apple?.email?.split('@')[0] ||
    privyUser.email?.address?.split('@')[0] ||
    `seer_${privyUser.id?.slice(-6)}`
  );
}

export default function Profile({ user, walletAddress, displayAddress, balance, celo, positions, onBack, onRefresh }) {
  const { logout } = useAuth();
  const { claim, claimingId, error: claimError } = useClaim();
  const [tab, setTab] = useState('active');
  const [copied, setCopied] = useState(false);

  const handleClaim = async (pos) => {
    try {
      await claim(pos.onChainId, pos.claimType);
      onRefresh?.();           // refresh on-chain positions + balance
    } catch {
      // surfaced via claimError
    }
  };

  const copyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard?.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const active = positions.filter(p => p.status === 'active');
  const closed  = positions.filter(p => p.status === 'closed');

  const totalStaked    = positions.reduce((s, p) => s + p.amount, 0);
  const totalPotential = active.reduce((s, p) => s + parseFloat(p.potentialPayout || 0), 0);
  const totalWinnings  = closed.filter(p => p.result === 'won').reduce((s, p) => s + parseFloat(p.potentialProfit || 0), 0);
  const accuracy       = positions.length > 0
    ? Math.round((positions.filter(p => p.result === 'won').length / positions.length) * 100)
    : 0;

  const trend = TREND.map((t, i) => ({ ...t, v: i === TREND.length - 1 ? accuracy : t.v }));
  const maxTrend = Math.max(...trend.map(t => t.v), 1);

  const displayName = deriveDisplayName(user);
  const shortAddr   = displayAddress || (walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '—');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="profile-page">
      {/* Top bar */}
      <div className="profile-topbar">
        <button className="prof-back-btn" onClick={onBack}>
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2 className="profile-topbar-title">My Profile</h2>
        <button className="prof-logout-btn" onClick={handleLogout} title="Sign out">
          <Icon name="close" size={18} color="#9ca3af" />
        </button>
      </div>

      {/* User Identity card */}
      <div className="prof-identity glass-market">
        <div className="prof-avatar">
          <Icon name="user" size={36} color="#ffd700" />
        </div>
        <div className="prof-info">
          <span className="prof-username">{displayName}</span>
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
        <div className="pbal-amount">
          {parseFloat(balance || 0).toFixed(2)} <span className="pbal-currency">cUSD</span>
        </div>
        <div className="pbal-row">
          <div className="pbal-item">
            <span className="pbal-item-label">Gas (CELO)</span>
            <span className="pbal-item-val">{parseFloat(celo || 0).toFixed(4)}</span>
          </div>
          <div className="pbal-divider" />
          <div className="pbal-item">
            <span className="pbal-item-label">Total Staked</span>
            <span className="pbal-item-val staked">{totalStaked.toFixed(2)} cUSD</span>
          </div>
          <div className="pbal-divider" />
          <div className="pbal-item">
            <span className="pbal-item-label">Potential</span>
            <span className="pbal-item-val risk">{totalPotential.toFixed(2)} cUSD</span>
          </div>
        </div>
        <button className="pbal-wallet-addr" onClick={copyAddress} title="Copy wallet address"
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
          <Icon name="coin" size={13} color="#6b7280" />
          <span className="pbal-addr-text">{walletAddress || '—'}</span>
          <Icon name={copied ? 'check' : 'copy'} size={13} color={copied ? '#10b981' : '#6b7280'} />
        </button>
      </div>

      {/* Performance stats */}
      <div className="prof-section-title">
        <Icon name="chart" size={16} color="#ffd700" />
        <span>Performance</span>
      </div>
      <div className="stats-grid">
        {[
          { icon: 'target',    label: 'Accuracy',  val: `${accuracy}%` },
          { icon: 'trophy',    label: 'Winnings',  val: `${totalWinnings.toFixed(2)} cUSD` },
          { icon: 'standings', label: 'Positions', val: positions.length },
          { icon: 'bolt',      label: 'Streak',    val: positions.length > 0 ? '2W' : '—' },
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
                  background: t.v >= 50
                    ? 'linear-gradient(180deg,#10b981,#34d399)'
                    : 'linear-gradient(180deg,#ef4444,#f87171)',
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
          closed.length > 0 ? closed.map(pos => {
            const isRefund = pos.result === 'refund';
            const won = pos.result === 'won';
            const badgeLabel = isRefund ? ' CANCELLED' : won ? ' WON' : ' LOST';
            const badgeIcon = won ? 'check' : isRefund ? 'warning' : 'close';
            return (
            <div key={pos.id} className={`position-card closed-position ${pos.result} glass-market`}>
              <div className="position-header">
                <h4>{pos.marketTitle}</h4>
                <span className={`result-badge ${pos.result}`}>
                  <Icon name={badgeIcon} size={12} />
                  {badgeLabel}
                </span>
              </div>
              <div className="position-details">
                <div className="detail"><span className="label">Wagered</span><span className="value">{pos.amount?.toFixed(2)} cUSD</span></div>
                <div className="detail"><span className="label">Result</span>
                  <span className={`value ${pos.result}`}>
                    {isRefund ? `${pos.amount?.toFixed(2)} refundable`
                      : `${won ? '+' : '-'}${Math.abs(pos.potentialProfit)} cUSD`}
                  </span>
                </div>
              </div>

              {pos.claimable && (
                <button
                  className="btn-primary ob-btn-glow"
                  style={{ width: '100%', marginTop: 10 }}
                  onClick={() => handleClaim(pos)}
                  disabled={claimingId === pos.onChainId}
                >
                  {claimingId === pos.onChainId
                    ? <span className="ob-loading-row"><span className="ob-spin" />Claiming…</span>
                    : isRefund ? `Claim refund (${pos.amount?.toFixed(2)} cUSD)`
                    : `Claim winnings (${pos.potentialPayout} cUSD)`}
                </button>
              )}
              {pos.claimed && (
                <div className="position-time" style={{ color: '#10b981', marginTop: 8 }}>
                  <Icon name="check" size={12} color="#10b981" />
                  <span>Claimed</span>
                </div>
              )}

              <div className="position-time">
                <Icon name="calendar" size={12} color="#6b7280" />
                <span>{pos.timestamp}</span>
              </div>
            </div>
            );
          }) : (
            <div className="empty-state">
              <Icon name="standings" size={38} color="#374151" />
              <p>No closed positions yet.</p>
            </div>
          )
        )}
        {claimError && tab === 'closed' && (
          <div className="glass-market" style={{ padding: '10px 16px', marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="warning" size={15} color="#ef4444" />
            <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{claimError}</span>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div style={{ padding: '16px 0 8px' }}>
        <button
          className="prof-signout-btn"
          onClick={handleLogout}
        >
          <Icon name="lock" size={16} color="#ef4444" />
          Sign Out
        </button>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
