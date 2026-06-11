import { useState } from 'react';
import Icon from './Icon';
import { useClaim } from '../hooks/useContract';

export default function Positions({ positions = [], onBack, onRefresh }) {
  const { claim, claimingId, error: claimError } = useClaim();
  const [tab, setTab] = useState('active');

  const active = positions.filter(p => p.status === 'active');
  const closed = positions.filter(p => p.status === 'closed');

  const totalStaked    = positions.reduce((s, p) => s + p.amount, 0);
  const totalPotential = active.reduce((s, p) => s + parseFloat(p.potentialPayout || 0), 0);

  const handleClaim = async (pos) => {
    try {
      await claim(pos.onChainId, pos.claimType);
      onRefresh?.();
    } catch {
      // surfaced via claimError
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button className="prof-back-btn" onClick={onBack}>
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2 className="profile-topbar-title">My Positions</h2>
        <div style={{ width: 36 }} />
      </div>

      {/* Summary */}
      <div className="prof-balance-card glass-market">
        <div className="pbal-row">
          <div className="pbal-item">
            <span className="pbal-item-label">Staked</span>
            <span className="pbal-item-val staked">{totalStaked.toFixed(2)} cUSD</span>
          </div>
          <div className="pbal-divider" />
          <div className="pbal-item">
            <span className="pbal-item-label">Active Payout</span>
            <span className="pbal-item-val risk">{totalPotential.toFixed(2)} cUSD</span>
          </div>
          <div className="pbal-divider" />
          <div className="pbal-item">
            <span className="pbal-item-label">Positions</span>
            <span className="pbal-item-val">{positions.length}</span>
          </div>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="empty-state">
          <Icon name="target" size={40} color="#374151" />
          <p>No bets yet — head to Predict and make your first call.</p>
        </div>
      ) : (
        <>
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
                    <Icon name="globe" size={12} color="#6b7280" />
                    <span>{pos.timestamp}</span>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Icon name="target" size={38} color="#374151" />
                  <p>No active positions.</p>
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
        </>
      )}

      <div className="home-bottom-pad" />
    </div>
  );
}
