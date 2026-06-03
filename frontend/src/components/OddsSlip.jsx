import { useState } from 'react';
import { placeBet as apiBet } from '../services/api';
import { usePlaceBetOnChain, useOnChainOdds, CONTRACT_ADDRESS } from '../hooks/useContract';

const STAGE_LABEL = {
  idle:      'Confirm Wager',
  approving: 'Approving cUSD…',
  approved:  'Approval confirmed…',
  betting:   'Submitting to chain…',
  done:      'Placed!',
  error:     'Try again',
};

export default function OddsSlip({ market, user, walletBalance, onSubmit, onBack }) {
  const [outcome, setOutcome]   = useState(null);
  const [amount, setAmount]     = useState('');
  const [slippage, setSlippage] = useState(2);
  const [apiError, setApiError] = useState(null);

  const { placeBet: placeBetOnChain, stage, error: contractError, reset, isContractReady } = usePlaceBetOnChain();
  const onChainOdds = useOnChainOdds(market.id);

  const betAmount    = parseFloat(amount) || 0;
  // Prefer live on-chain odds if available, fall back to AI-computed odds from backend
  const oddsMap = {
    yes:  onChainOdds?.yes  ?? market.yesOdds,
    no:   onChainOdds?.no   ?? market.noOdds,
    draw: onChainOdds?.draw ?? market.drawOdds,
  };
  const selectedOdds  = outcome ? oddsMap[outcome] : 0;
  const adjustedOdds  = selectedOdds * (1 - slippage / 100);
  const potentialPayout  = betAmount > 0 ? (betAmount * adjustedOdds).toFixed(2) : '0.00';
  const potentialProfit  = betAmount > 0 ? (betAmount * adjustedOdds - betAmount).toFixed(2) : '0.00';

  const loading = ['approving', 'approved', 'betting'].includes(stage);
  const isValid = outcome && betAmount > 0 && betAmount <= walletBalance && !loading;

  const handleSubmit = async () => {
    if (!isValid) return;
    setApiError(null);
    reset();

    try {
      if (isContractReady) {
        // On-chain path
        await placeBetOnChain({
          backendMarketId: market.id,
          outcome,
          amount: betAmount,
          walletAddress: user.walletAddress,
        });
        onSubmit({ marketId: market.id, outcome, amount: betAmount, potentialPayout, potentialProfit, source: 'chain' });
      } else {
        // Backend API fallback (pre-contract deployment)
        const result = await apiBet(
          { marketId: market.id, outcome, amount: betAmount },
          user.walletAddress
        );
        onSubmit({ ...result.bet, potentialPayout, potentialProfit, source: 'api' });
      }
    } catch (err) {
      if (!isContractReady) setApiError(err.message);
    }
  };

  const outcomeButtons = [
    { id: 'yes',  label: 'YES',  icon: '✓', odds: oddsMap.yes,  color: 'yes' },
    ...(market.drawOdds || onChainOdds?.draw ? [{ id: 'draw', label: 'DRAW', icon: '—', odds: oddsMap.draw, color: 'draw' }] : []),
    { id: 'no',   label: 'NO',   icon: '✗', odds: oddsMap.no,   color: 'no'  },
  ];

  const displayError = contractError || apiError;

  return (
    <div className="odds-slip">
      <div className="slip-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Place Wager</h2>
        <div className="header-spacer" />
      </div>

      {/* Contract mode indicator */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px',
          padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase',
          background: isContractReady ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.2)',
          color: isContractReady ? '#34d399' : '#9ca3af',
        }}>
          {isContractReady ? '⛓ On-chain · Celo' : '📡 Off-chain (pre-deployment)'}
        </span>
      </div>

      <div className="market-preview">
        <h3>{market.title}</h3>
        {market.image && (
          <div className="market-image-large">
            <img src={market.image} alt={market.team || 'market'}
              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        {market.analysis && (
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: 10, lineHeight: 1.5 }}>
            🤖 {market.analysis}
          </p>
        )}
      </div>

      <div className="prediction-selector">
        <p className="selector-label">What do you predict?</p>
        {outcomeButtons.map(btn => (
          <button
            key={btn.id}
            className={`prediction-btn ${btn.color} ${outcome === btn.id ? 'selected' : ''}`}
            onClick={() => { setOutcome(btn.id); reset(); }}
          >
            <span className="prediction-icon">{btn.icon}</span>
            <span className="prediction-text">{btn.label}</span>
            <span className="prediction-odds">{btn.odds?.toFixed(2)}x</span>
          </button>
        ))}
      </div>

      {outcome && (
        <div className="amount-section">
          <div className="amount-input-group">
            <label>Wager Amount</label>
            <div className="input-wrapper">
              <span className="currency">💰</span>
              <input
                type="number" placeholder="0.00" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0" step="0.01" max={walletBalance}
                className="amount-input"
              />
              <span className="currency-code">cUSD</span>
            </div>
            <span className="balance-hint">Balance: {walletBalance.toFixed(2)} cUSD</span>
          </div>

          <div className="quick-amounts">
            {[10, 25, 50, 100].map(qa => (
              <button key={qa} className="quick-btn"
                onClick={() => setAmount(Math.min(qa, walletBalance).toString())}>
                {qa}
              </button>
            ))}
          </div>
        </div>
      )}

      {outcome && betAmount > 0 && (
        <div className="calculation-card">
          <div className="calc-item">
            <span className="calc-label">Wager</span>
            <span className="calc-value">{betAmount.toFixed(2)} cUSD</span>
          </div>
          <div className="calc-item">
            <span className="calc-label">Odds (with {slippage}% slippage)</span>
            <span className="calc-value highlight">{adjustedOdds.toFixed(2)}x</span>
          </div>
          <div className="divider" />
          <div className="calc-item">
            <span className="calc-label">Potential Payout</span>
            <span className="calc-value winner">{potentialPayout} cUSD</span>
          </div>
          <div className="calc-item">
            <span className="calc-label">Potential Profit</span>
            <span className="calc-value profit-amount">+{potentialProfit} cUSD</span>
          </div>
        </div>
      )}

      {outcome && betAmount > 0 && (
        <div className="slippage-control">
          <div className="slippage-header">
            <span className="slippage-label">Max Slippage</span>
            <span className="slippage-value">{slippage}%</span>
          </div>
          <input type="range" min="0" max="10" step="0.5" value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="slippage-slider" />
          <div className="slippage-marks"><span>0%</span><span>10%</span></div>
        </div>
      )}

      {/* On-chain multi-step progress */}
      {isContractReady && stage !== 'idle' && (
        <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.88rem' }}>
            <span style={{ color: stage === 'approving' ? '#fbbf24' : '#34d399' }}>
              {['approving', 'approved'].includes(stage) ? '⏳' : '✓'} Step 1: Approve cUSD
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.88rem', marginTop: 6 }}>
            <span style={{ color: stage === 'betting' ? '#fbbf24' : stage === 'done' ? '#34d399' : '#6b7280' }}>
              {stage === 'done' ? '✓' : stage === 'betting' ? '⏳' : '○'} Step 2: Place bet on Celo
            </span>
          </div>
        </div>
      )}

      {displayError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, color: '#f87171', fontSize: '0.88rem' }}>
          ⚠️ {displayError}
        </div>
      )}

      <div className="slip-actions">
        <button className="btn-primary btn-lg btn-submit" onClick={handleSubmit} disabled={!isValid}>
          {loading ? STAGE_LABEL[stage] : STAGE_LABEL.idle}
        </button>
      </div>

      <div className="disclaimer">
        <p>⚠️ This is a high-risk prediction market. Only wager amounts you can afford to lose.</p>
      </div>
    </div>
  );
}
