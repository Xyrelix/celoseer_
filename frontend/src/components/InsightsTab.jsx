import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

/* Smooth count-up using requestAnimationFrame with ease-out cubic */
function useCountUp(target, duration = 1600, decimals = 0) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    startRef.current = null;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setVal(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return val;
}

const AI_CALLS = [
  { rank: 1, call: 'Argentina to Win World Cup', confidence: 82, trend: '+2.1%', flag: 'ar', tag: 'HIGH' },
  { rank: 2, call: 'Brazil to Reach Semi-Finals', confidence: 80, trend: '+1.4%', flag: 'br', tag: 'HIGH' },
  { rank: 3, call: 'France to Win World Cup',    confidence: 78, trend: '+0.9%', flag: 'fr', tag: 'STRONG' },
  { rank: 4, call: 'Spain to Reach the Final',   confidence: 76, trend: '+1.7%', flag: 'es', tag: 'PROBABLE' },
  { rank: 5, call: 'USA to Reach Semi-Finals',   confidence: 72, trend: '-0.3%', flag: 'us', tag: 'LIKELY' },
  { rank: 6, call: 'Germany to Win World Cup',   confidence: 71, trend: '+0.5%', flag: 'de', tag: 'CONTENDER' },
];

const TREND_BARS = [
  { week: 'W1', val: 45 },
  { week: 'W2', val: 52 },
  { week: 'W3', val: 48 },
  { week: 'W4', val: 61 },
  { week: 'W5', val: 75 },
  { week: 'W6', val: 82 },
];

const HOT_MARKETS = [
  { title: 'Final Match Over 2.5 Goals', volume: '203k', move: '+12%', up: true },
  { title: 'Spain to Reach World Cup Final', volume: '112k', move: '+8%', up: true },
  { title: 'USA Semi-Finals', volume: '64k', move: '-3%', up: false },
];

const maxBar = Math.max(...TREND_BARS.map(b => b.val));

export default function InsightsTab() {
  const accuracy = useCountUp(82.4, 1800, 1);
  const calls    = useCountUp(847,  1600, 0);
  const teams    = useCountUp(32,   1200, 0);

  return (
    <div className="insights-tab">
      {/* Header */}
      <div className="insights-hero glass-market">
        <div className="ih-top">
          <Icon name="insights" size={28} color="#ffd700" />
          <div>
            <h2 className="ih-title">AI Prediction Engine</h2>
            <p className="ih-sub">CeloSeer Neural Network · v3.2</p>
          </div>
        </div>
        <div className="ih-stats">
          <div className="ih-stat">
            <span className="ih-stat-val ih-stat-val--counting">{accuracy}%</span>
            <span className="ih-stat-label">Overall Accuracy</span>
          </div>
          <div className="ih-stat-div" />
          <div className="ih-stat">
            <span className="ih-stat-val ih-stat-val--counting">{calls}</span>
            <span className="ih-stat-label">Total Calls</span>
          </div>
          <div className="ih-stat-div" />
          <div className="ih-stat">
            <span className="ih-stat-val ih-stat-val--counting">{teams}</span>
            <span className="ih-stat-label">Teams Tracked</span>
          </div>
        </div>
      </div>

      {/* Accuracy Trend */}
      <div className="insights-section">
        <div className="section-header">
          <Icon name="chart" size={18} color="#ffd700" />
          <h3 className="section-title">Accuracy Trend</h3>
        </div>
        <div className="trend-card glass-market">
          <div className="trend-bars">
            {TREND_BARS.map((b, i) => (
              <div key={i} className="trend-bar-wrap" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="trend-pct">{b.val}%</span>
                <div className="trend-bar-track">
                  <div
                    className="trend-bar-fill"
                    style={{
                      height: `${(b.val / maxBar) * 100}%`,
                      background: b.val >= 70 ? 'linear-gradient(180deg,#10b981,#34d399)' : 'linear-gradient(180deg,#fbbf24,#f59e0b)',
                    }}
                  />
                </div>
                <span className="trend-week">{b.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top AI Calls */}
      <div className="insights-section">
        <div className="section-header">
          <Icon name="star" size={18} color="#ffd700" />
          <h3 className="section-title">Top AI Calls</h3>
        </div>
        <div className="ai-calls-list">
          {AI_CALLS.map((c, i) => (
            <div key={i} className="ai-call-row glass-market" style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="ac-rank">#{c.rank}</span>
              <img src={`https://flagcdn.com/${c.flag}.svg`} alt="" className="ac-flag" />
              <div className="ac-info">
                <span className="ac-call">{c.call}</span>
                <div className="ac-bar-wrap">
                  <div className="ac-bar">
                    <div className="ac-bar-fill" style={{ width: `${c.confidence}%` }} />
                  </div>
                  <span className="ac-pct">{c.confidence}%</span>
                </div>
              </div>
              <div className="ac-right">
                <span className={`ac-trend ${c.trend.startsWith('+') ? 'ac-trend--up' : 'ac-trend--down'}`}>
                  {c.trend}
                </span>
                <span className="ac-tag">{c.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Markets */}
      <div className="insights-section">
        <div className="section-header">
          <Icon name="fire" size={18} color="#f97316" />
          <h3 className="section-title">Hot Markets</h3>
        </div>
        <div className="hot-markets-list">
          {HOT_MARKETS.map((m, i) => (
            <div key={i} className="hot-market-row glass-market" style={{ animationDelay: `${i * 0.07}s` }}>
              <Icon name={m.up ? 'bolt' : 'chart'} size={16} color={m.up ? '#10b981' : '#ef4444'} />
              <div className="hm-info">
                <span className="hm-title">{m.title}</span>
                <span className="hm-vol">{m.volume} cUSD volume</span>
              </div>
              <span className={`hm-move ${m.up ? 'hm-move--up' : 'hm-move--down'}`}>{m.move}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
