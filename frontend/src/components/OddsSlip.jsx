import { useState } from 'react';
import Icon from './Icon';
import { usePlaceBetOnChain } from '../hooks/useContract';

const STAGE_LABEL = {
  idle:      'Confirm Wager',
  approving: 'Approving cUSD...',
  betting:   'Placing Bet...',
  done:      'Bet Placed!',
  error:     'Try Again',
};

export default function OddsSlip({ market, walletAddress, walletBalance, onSubmit, onBack }) {
  const [prediction, setPrediction] = useState(null);
  const [amount,     setAmount]     = useState('');
  const [slippage,   setSlippage]   = useState(2);

  const { placeBet, stage, error, reset, isContractReady } = usePlaceBetOnChain();

  const betAmount      = parseFloat(amount) || 0;
  const selectedOdds   = prediction === 'yes' ? market.yesOdds : market.noOdds;
  const potentialPayout  = betAmount > 0 ? (betAmount * selectedOdds).toFixed(2) : 0;
  const potentialProfit  = betAmount > 0 ? (potentialPayout - betAmount).toFixed(2) : 0;
  const adjustedOdds   = selectedOdds * (1 - slippage / 100);
  const isValid        = prediction && betAmount > 0 && betAmount <= walletBalance;
  const loading        = stage === 'approving' || stage === 'betting';

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    if (stage === 'error') { reset(); return; }

    try {
      await placeBet({
        backendMarketId: market.id,
        outcome: prediction,
        amount: betAmount,
      });
      onSubmit({
        marketId:       market.id,
        marketTitle:    market.title,
        prediction,
        amount:         betAmount,
        odds:           adjustedOdds,
        potentialPayout,
        potentialProfit,
      });
    } catch {
      // error state handled by hook
    }
  };

  return (
    <div className="odds-slip">
      <div className="slip-header">
        <button className="btn-back slip-back" onClick={onBack} aria-label="Back">
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2>Place Wager</h2>
        <div className="header-spacer" />
      </div>

      <div className="market-preview glass-market">
        <img src={market.image} alt={market.team || 'market'} className="market-preview-flag"
          onError={e => { e.target.style.display = 'none'; }} />
        <h3>{market.title}</h3>
        <div className="preview-badges">
          <span className="confidence-badge">{market.confidence}% Confidence</span>
          <span className="prediction-tag">{market.prediction}</span>
        </div>
      </div>

      {!isContractReady && (
        <div className="glass-market" style={{ padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="warning" size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Contract not configured — set VITE_CONTRACT_ADDRESS</span>
        </div>
      )}

      <div className="prediction-selector">
        <p className="selector-label">What do you predict?</p>
        <button className={`prediction-btn yes ${prediction === 'yes' ? 'selected' : ''}`} onClick={() => setPrediction('yes')}>
          <Icon name="check" size={20} className="prediction-icon" />
          <span className="prediction-text">YES</span>
          <span className="prediction-odds">{market.yesOdds.toFixed(2)}x</span>
        </button>
        <button className={`prediction-btn no ${prediction === 'no' ? 'selected' : ''}`} onClick={() => setPrediction('no')}>
          <Icon name="close" size={20} className="prediction-icon" />
          <span className="prediction-text">NO</span>
          <span className="prediction-odds">{market.noOdds.toFixed(2)}x</span>
        </button>
      </div>

      {prediction && (
        <div className="amount-section">
          <div className="amount-input-group">
            <label>Wager Amount</label>
            <div className="input-wrapper">
              <Icon name="coin" size={18} color="#ffd700" className="currency-icon" />
              <input type="number" placeholder="0.00" value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0" step="0.01" max={walletBalance} className="amount-input glass-input" />
              <span className="currency-code">cUSD</span>
            </div>
            <span className="balance-hint">Balance: {walletBalance?.toFixed(2) ?? '0.00'} cUSD</span>
          </div>
          <div className="quick-amounts">
            {[10, 25, 50, 100].map(qa => (
              <button key={qa} className="quick-btn glass-tab"
                onClick={() => setAmount(Math.min(qa, walletBalance).toString())}>
                {qa}
              </button>
            ))}
          </div>
        </div>
      )}

      {prediction && betAmount > 0 && (
        <div className="calculation-card glass-market">
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

      {prediction && betAmount > 0 && (
        <div className="slippage-control glass-market">
          <div className="slippage-header">
            <span className="slippage-label">Max Slippage</span>
            <span className="slippage-value">{slippage}%</span>
          </div>
          <input type="range" min="0" max="10" step="0.5" value={slippage}
            onChange={e => setSlippage(parseFloat(e.target.value))} className="slippage-slider" />
          <div className="slippage-marks"><span>0%</span><span>10%</span></div>
        </div>
      )}

      {error && (
        <div className="glass-market" style={{ padding: '10px 16px', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon name="warning" size={15} color="#ef4444" />
          <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* Tx progress */}
      {(stage === 'approving' || stage === 'betting') && (
        <div className="glass-market" style={{ padding: '10px 16px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="ob-spin" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.82rem', color: '#ffd700' }}>
            {stage === 'approving' ? 'Step 1/2 — Approving cUSD spend…' : 'Step 2/2 — Sending bet to contract…'}
          </span>
        </div>
      )}

      <div className="slip-actions">
        <button className="btn-primary btn-lg btn-submit ob-btn-glow"
          onClick={handleSubmit}
          disabled={(!isValid && stage !== 'error') || loading || !isContractReady}>
          {loading
            ? <span className="ob-loading-row"><span className="ob-spin" />{STAGE_LABEL[stage]}</span>
            : STAGE_LABEL[stage] ?? 'Confirm Wager'}
        </button>
      </div>

      <div className="disclaimer">
        <Icon name="warning" size={16} color="#f87171" />
        <p>High-risk prediction market. Only wager amounts you can afford to lose.</p>
      </div>
    </div>
  );
}
