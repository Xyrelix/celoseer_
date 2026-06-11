import { useState } from 'react';
import Icon from './Icon';

const RESULT_ODDS   = { team1: 2.10, draw: 3.20, team2: 3.40 };
const GOALS_OPTIONS = [
  { key: 'u1.5', label: 'Under 1.5', odds: 4.00 },
  { key: 'u2.5', label: 'Under 2.5', odds: 1.95 },
  { key: 'o2.5', label: 'Over 2.5',  odds: 2.05 },
  { key: 'o3.5', label: 'Over 3.5',  odds: 3.50 },
];
const FIRST_TEAM_ODDS = { team1: 1.85, team2: 2.10, noGoal: 8.00 };
const HT_OPTIONS = [
  { label: '0-0', odds: 3.8  },
  { label: '1-0', odds: 4.5  },
  { label: '0-1', odds: 5.0  },
  { label: '1-1', odds: 5.5  },
  { label: '2-0', odds: 7.0  },
  { label: '2-1', odds: 9.0  },
  { label: '0-2', odds: 10.0 },
  { label: '1-2', odds: 12.0 },
];
const CARDS_OPTIONS = [
  { key: 'cu2.5', label: 'Under 2.5', odds: 2.10 },
  { key: 'c2-4',  label: '2.5 – 4.5', odds: 1.75 },
  { key: 'co4.5', label: 'Over 4.5',  odds: 2.80 },
];
const FIRST_SCORER_ODDS = 7.50;

export default function PlaceWagerPage({ fixture, walletBalance, onBack, onSubmit }) {
  const [picks, setPicks] = useState({
    result:      null,
    goals:       null,
    firstTeam:   null,
    firstScorer: '',
    halfTime:    null,
    cards:       null,
  });
  const [amount, setAmount] = useState('');

  const toggle = (type, value) =>
    setPicks(prev => ({ ...prev, [type]: prev[type] === value ? null : value }));

  // Build active selections with display labels + odds
  const activeSelections = [
    picks.result && {
      label: picks.result === 'team1' ? `${fixture.team1} Win`
           : picks.result === 'draw'  ? 'Draw'
           : `${fixture.team2} Win`,
      odds: RESULT_ODDS[picks.result],
    },
    picks.goals && GOALS_OPTIONS.find(g => g.key === picks.goals),
    picks.firstTeam && {
      label: picks.firstTeam === 'team1'  ? `${fixture.team1} First`
           : picks.firstTeam === 'team2'  ? `${fixture.team2} First`
           : 'No Goal Scored',
      odds: FIRST_TEAM_ODDS[picks.firstTeam],
    },
    picks.firstScorer.trim().length >= 2 && {
      label: `First Scorer: ${picks.firstScorer.trim()}`,
      odds: FIRST_SCORER_ODDS,
    },
    picks.halfTime && {
      label: `HT Score ${picks.halfTime}`,
      odds: HT_OPTIONS.find(h => h.label === picks.halfTime)?.odds,
    },
    picks.cards && CARDS_OPTIONS.find(c => c.key === picks.cards),
  ].filter(Boolean);

  const combinedOdds    = activeSelections.reduce((acc, s) => acc * s.odds, 1);
  const betAmount       = parseFloat(amount) || 0;
  const potentialPayout = betAmount > 0 ? (betAmount * combinedOdds).toFixed(2) : 0;
  const potentialProfit = betAmount > 0 ? (potentialPayout - betAmount).toFixed(2) : 0;
  const hasSelections   = activeSelections.length > 0;
  const isValid         = hasSelections && betAmount > 0 && betAmount <= (walletBalance ?? Infinity);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      fixtureTitle:  `${fixture.team1} vs ${fixture.team2}`,
      picks,
      combinedOdds:  parseFloat(combinedOdds.toFixed(2)),
      amount:        betAmount,
      potentialPayout,
      potentialProfit,
    });
  };

  return (
    <div className="wager-page">

      {/* ── Header ── */}
      <div className="slip-header">
        <button className="btn-back slip-back" onClick={onBack} aria-label="Back">
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2>Place Wager</h2>
        <div className="header-spacer" />
      </div>

      {/* ── Fixture banner ── */}
      <div className="wager-fixture-banner glass-market">
        <div className="wager-fix-meta">
          <span className="fix-day">{fixture.date}</span>
          <span className="wager-fix-dot" />
          <span className="fix-time">{fixture.time}</span>
        </div>
        <div className="wager-fix-teams">
          <div className="wager-team">
            <img src={`https://flagcdn.com/${fixture.f1}.svg`} alt={fixture.team1} className="wager-flag" />
            <span className="wager-team-name">{fixture.team1}</span>
          </div>
          <span className="wager-vs">VS</span>
          <div className="wager-team wager-team--right">
            <span className="wager-team-name">{fixture.team2}</span>
            <img src={`https://flagcdn.com/${fixture.f2}.svg`} alt={fixture.team2} className="wager-flag" />
          </div>
        </div>
        <div className="wager-venue">
          <Icon name="globe" size={12} color="#6b7280" />
          <span>{fixture.venue}</span>
        </div>
      </div>

      {/* ── 1. Full-time Result ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">🏆</span>
          <span className="wager-section-title">Full-time Result</span>
        </div>
        <div className="wager-3col">
          {[
            { key: 'team1', label: fixture.team1, odds: RESULT_ODDS.team1, flagCode: fixture.f1 },
            { key: 'draw',  label: 'Draw',        odds: RESULT_ODDS.draw,  flagCode: null },
            { key: 'team2', label: fixture.team2, odds: RESULT_ODDS.team2, flagCode: fixture.f2 },
          ].map(opt => (
            <button
              key={opt.key}
              className={`wager-pick-btn ${picks.result === opt.key ? 'wager-pick-btn--active' : ''}`}
              onClick={() => toggle('result', opt.key)}
            >
              {opt.flagCode
                ? <img src={`https://flagcdn.com/${opt.flagCode}.svg`} alt="" className="wager-pick-flag" />
                : <span className="wager-pick-draw-icon">🤝</span>
              }
              <span className="wager-pick-name">{opt.label}</span>
              <span className="wager-pick-odds">{opt.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Total Goals ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">⚽</span>
          <span className="wager-section-title">Total Goals Scored</span>
        </div>
        <div className="wager-chips">
          {GOALS_OPTIONS.map(g => (
            <button
              key={g.key}
              className={`wager-chip ${picks.goals === g.key ? 'wager-chip--active' : ''}`}
              onClick={() => toggle('goals', g.key)}
            >
              <span className="wager-chip-label">{g.label}</span>
              <span className="wager-chip-odds">{g.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. First Team to Score ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">🥅</span>
          <span className="wager-section-title">First Team to Score</span>
        </div>
        <div className="wager-3col">
          {[
            { key: 'team1',  label: fixture.team1, odds: FIRST_TEAM_ODDS.team1,  flagCode: fixture.f1 },
            { key: 'noGoal', label: 'No Goal',     odds: FIRST_TEAM_ODDS.noGoal, flagCode: null },
            { key: 'team2',  label: fixture.team2, odds: FIRST_TEAM_ODDS.team2,  flagCode: fixture.f2 },
          ].map(opt => (
            <button
              key={opt.key}
              className={`wager-pick-btn ${picks.firstTeam === opt.key ? 'wager-pick-btn--active' : ''}`}
              onClick={() => toggle('firstTeam', opt.key)}
            >
              {opt.flagCode
                ? <img src={`https://flagcdn.com/${opt.flagCode}.svg`} alt="" className="wager-pick-flag" />
                : <span className="wager-pick-draw-icon">🚫</span>
              }
              <span className="wager-pick-name">{opt.label}</span>
              <span className="wager-pick-odds">{opt.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. First Goalscorer ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">👤</span>
          <span className="wager-section-title">First Goalscorer</span>
          <span className="wager-section-badge">{FIRST_SCORER_ODDS.toFixed(2)}x</span>
        </div>
        <div className="wager-text-input-wrap">
          <input
            type="text"
            placeholder="Enter player name…"
            value={picks.firstScorer}
            onChange={e => setPicks(prev => ({ ...prev, firstScorer: e.target.value }))}
            className="wager-text-input glass-input"
          />
          {picks.firstScorer.trim().length >= 2 && (
            <span className="wager-input-check">✓</span>
          )}
        </div>
        <p className="wager-field-hint">Odds applied when you enter a player name</p>
      </div>

      {/* ── 5. Half-time Score ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">⏱</span>
          <span className="wager-section-title">Half-time Score</span>
        </div>
        <div className="wager-chips wager-chips--grid">
          {HT_OPTIONS.map(ht => (
            <button
              key={ht.label}
              className={`wager-chip ${picks.halfTime === ht.label ? 'wager-chip--active' : ''}`}
              onClick={() => toggle('halfTime', ht.label)}
            >
              <span className="wager-chip-label">{ht.label}</span>
              <span className="wager-chip-odds">{ht.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 6. Total Cards ── */}
      <div className="wager-section glass-market">
        <div className="wager-section-header">
          <span className="wager-section-icon">🟨</span>
          <span className="wager-section-title">Total Cards</span>
        </div>
        <div className="wager-chips">
          {CARDS_OPTIONS.map(c => (
            <button
              key={c.key}
              className={`wager-chip ${picks.cards === c.key ? 'wager-chip--active' : ''}`}
              onClick={() => toggle('cards', c.key)}
            >
              <span className="wager-chip-label">{c.label}</span>
              <span className="wager-chip-odds">{c.odds.toFixed(2)}x</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bet Slip Summary ── */}
      {hasSelections && (
        <div className="wager-slip-summary glass-market">
          <div className="wager-slip-heading">
            <span>Bet Slip</span>
            <span className="wager-slip-count">{activeSelections.length} selection{activeSelections.length !== 1 ? 's' : ''}</span>
          </div>
          {activeSelections.map((sel, i) => (
            <div key={i} className="wager-slip-row">
              <span className="wager-slip-label">{sel.label}</span>
              <span className="wager-slip-odds">{sel.odds.toFixed(2)}x</span>
            </div>
          ))}
          <div className="divider" />
          <div className="wager-slip-row wager-slip-row--total">
            <span className="wager-slip-label">Combined Odds</span>
            <span className="wager-slip-odds wager-slip-odds--total">{combinedOdds.toFixed(2)}x</span>
          </div>
        </div>
      )}

      {/* ── Wager Amount + Payout ── */}
      {hasSelections && (
        <div className="wager-amount-card glass-market">
          <div className="amount-input-group" style={{ marginBottom: 12 }}>
            <label>Wager Amount</label>
            <div className="input-wrapper">
              <Icon name="coin" size={18} color="#ffd700" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                max={walletBalance}
                className="amount-input glass-input"
              />
              <span className="currency-code">cUSD</span>
            </div>
            <span className="balance-hint">Balance: {walletBalance?.toFixed(2) ?? '0.00'} cUSD</span>
          </div>
          <div className="quick-amounts">
            {[5, 10, 25, 50].map(qa => (
              <button
                key={qa}
                className="quick-btn glass-tab"
                onClick={() => setAmount(Math.min(qa, walletBalance ?? qa).toString())}
              >
                {qa}
              </button>
            ))}
          </div>
          {betAmount > 0 && (
            <div className="wager-payout-preview">
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
        </div>
      )}

      {/* ── Submit ── */}
      <div className="slip-actions">
        <button
          className="btn-primary btn-lg btn-submit ob-btn-glow"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          {!hasSelections
            ? 'Select at Least One Prediction'
            : !betAmount
            ? 'Enter Wager Amount'
            : `Place Wager · ${combinedOdds.toFixed(2)}x`}
        </button>
      </div>

      <div className="disclaimer">
        <Icon name="warning" size={16} color="#f87171" />
        <p>High-risk prediction market. Only wager amounts you can afford to lose.</p>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
