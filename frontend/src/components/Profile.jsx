import { useState } from 'react';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

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

export default function Profile({ user, walletAddress, displayAddress, balance, celo, positions, onBack, onViewPositions }) {
  const { logout } = useAuth();
  const [copied, setCopied] = useState(false);

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
  const settled = closed.filter(p => p.result === 'won' || p.result === 'lost');
  const accuracy = settled.length > 0
    ? Math.round((settled.filter(p => p.result === 'won').length / settled.length) * 100)
    : 0;

  const hasPositions = positions.length > 0;

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

      {/* Performance stats — only once there's real activity */}
      {hasPositions && (
        <>
          <div className="prof-section-title">
            <Icon name="chart" size={16} color="#ffd700" />
            <span>Performance</span>
          </div>
          <div className="stats-grid">
            {[
              { icon: 'target',    label: 'Accuracy',  val: settled.length > 0 ? `${accuracy}%` : '—' },
              { icon: 'trophy',    label: 'Winnings',  val: `${totalWinnings.toFixed(2)} cUSD` },
              { icon: 'standings', label: 'Positions', val: positions.length },
              { icon: 'coin',      label: 'Staked',    val: `${totalStaked.toFixed(2)} cUSD` },
            ].map((s, i) => (
              <div key={i} className="stat-card glass-market" style={{ animationDelay: `${i * 0.07}s` }}>
                <Icon name={s.icon} size={22} color="#ffd700" className="stat-svg-icon" />
                <span className="stat-label">{s.label}</span>
                <span className="stat-value animate">{s.val}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Positions → dedicated page */}
      <div className="prof-section-title">
        <Icon name="standings" size={16} color="#ffd700" />
        <span>My Positions</span>
      </div>
      <button className="prof-positions-link glass-market" onClick={onViewPositions}>
        <div className="ppl-left">
          <Icon name="target" size={20} color="#ffd700" />
          <div className="ppl-text">
            <span className="ppl-title">
              {hasPositions ? `${active.length} active · ${closed.length} closed` : 'No bets yet'}
            </span>
            <span className="ppl-sub">
              {hasPositions ? `${totalStaked.toFixed(2)} cUSD staked` : 'Make your first prediction'}
            </span>
          </div>
        </div>
        <Icon name="back" size={18} color="#6b7280" className="ppl-chevron" />
      </button>

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
