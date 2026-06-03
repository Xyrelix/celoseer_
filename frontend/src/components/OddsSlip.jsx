import { useState } from 'react';

export default function OddsSlip({ market, user, walletBalance, onSubmit, onBack }) {
  const [prediction, setPrediction] = useState(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(2);
  const [loading, setLoading] = useState(false);

  const betAmount = parseFloat(amount) || 0;
  const selectedOdds = prediction === 'yes' ? market.yesOdds : market.noOdds;
  const potentialPayout = betAmount > 0 ? (betAmount * selectedOdds).toFixed(2) : 0;
  const potentialProfit = betAmount > 0 ? (potentialPayout - betAmount).toFixed(2) : 0;
  const adjustedOdds = selectedOdds * (1 - slippage / 100);

  const isValid = prediction && betAmount > 0 && betAmount <= walletBalance;

  const quickAmounts = [10, 25, 50, 100];

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    onSubmit({
      marketId: market.id,
      marketTitle: market.title,
      prediction,
      amount: betAmount,
      odds: adjustedOdds,
      potentialPayout,
      potentialProfit
    });
    setLoading(false);
  };

  return (
    <div className="odds-slip">
      {/* Header */}
      <div className="slip-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Place Wager</h2>
        <div className="header-spacer"></div>
      </div>

      {/* Market Preview */}
      <div className="market-preview">
        <h3>{market.title}</h3>
        <div className="market-image-large">{market.image}</div>
      </div>

      {/* Prediction Selection */}
      <div className="prediction-selector">
        <p className="selector-label">What do you predict?</p>

        <button
          className={`prediction-btn yes ${prediction === 'yes' ? 'selected' : ''}`}
          onClick={() => setPrediction('yes')}
        >
          <span className="prediction-icon">✓</span>
          <span className="prediction-text">YES</span>
          <span className="prediction-odds">{market.yesOdds.toFixed(2)}x</span>
        </button>

        <button
          className={`prediction-btn no ${prediction === 'no' ? 'selected' : ''}`}
          onClick={() => setPrediction('no')}
        >
          <span className="prediction-icon">✗</span>
          <span className="prediction-text">NO</span>
          <span className="prediction-odds">{market.noOdds.toFixed(2)}x</span>
        </button>
      </div>

      {/* Amount Input */}
      {prediction && (
        <div className="amount-section">
          <div className="amount-input-group">
            <label>Wager Amount</label>
            <div className="input-wrapper">
              <span className="currency">💰</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                max={walletBalance}
                className="amount-input"
              />
              <span className="currency-code">cUSD</span>
            </div>
            <span className="balance-hint">Balance: {walletBalance.toFixed(2)} cUSD</span>
          </div>

          {/* Quick Amounts */}
          <div className="quick-amounts">
            {quickAmounts.map(qa => (
              <button
                key={qa}
                className="quick-btn"
                onClick={() => setAmount(Math.min(qa, walletBalance).toString())}
              >
                {qa}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Calculation Card */}
      {prediction && betAmount > 0 && (
        <div className="calculation-card">
          <div className="calc-item">
            <span className="calc-label">Wager</span>
            <span className="calc-value">{betAmount.toFixed(2)} cUSD</span>
          </div>

          <div className="calc-item">
            <span className="calc-label">Odds (with {slippage}% slippage)</span>
            <span className="calc-value highlight">{adjustedOdds.toFixed(2)}x</span>
          </div>

          <div className="divider"></div>

          <div className="calc-item">
            <span className="calc-label">Potential Payout</span>
            <span className="calc-value winner">{potentialPayout} cUSD</span>
          </div>

          <div className="calc-item">
            <span className="calc-label">Potential Profit</span>
            <span className="calc-value profit-amount">{potentialProfit} cUSD</span>
          </div>
        </div>
      )}

      {/* Slippage Control */}
      {prediction && betAmount > 0 && (
        <div className="slippage-control">
          <div className="slippage-header">
            <span className="slippage-label">Max Slippage</span>
            <span className="slippage-value">{slippage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="slippage-slider"
          />
          <div className="slippage-marks">
            <span>0%</span>
            <span>10%</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="slip-actions">
        <button
          className="btn-primary btn-lg btn-submit"
          onClick={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? 'Processing...' : 'Confirm Wager'}
        </button>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>⚠️ This is a high-risk prediction market. Only wager amounts you can afford to lose.</p>
      </div>
    </div>
  );
}
