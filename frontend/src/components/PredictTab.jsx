import { useState } from 'react';
import Icon from './Icon';
import { useDisplayOdds } from '../hooks/useContract';

// Per-card odds row — reads live on-chain odds, falls back to AI odds.
function LiveOddsRow({ market }) {
  const live = useDisplayOdds(market);
  return (
    <div className="odds-row">
      <div className="odds-item yes">
        <span className="odds-label">YES</span>
        <span className="odds-value">
          {live.yes.toFixed(2)}{live.liveYes && <span className="live-dot" />}
        </span>
      </div>
      <div className="divider-vertical" />
      <div className="odds-item no">
        <span className="odds-label">NO</span>
        <span className="odds-value">
          {live.no.toFixed(2)}{live.liveNo && <span className="live-dot" />}
        </span>
      </div>
    </div>
  );
}

const mockMarkets = [
  { id: 1, title: 'Argentina to Win World Cup 2026?', category: 'knockout', team: 'Argentina', yesOdds: 3.5, noOdds: 1.35, sentiment: 68, volume: 125430, image: 'https://flagcdn.com/ar.svg', confidence: 82, prediction: 'FAVORITES' },
  { id: 2, title: 'France to Win World Cup 2026?',    category: 'knockout', team: 'France',    yesOdds: 4.2, noOdds: 1.25, sentiment: 72, volume: 98760,  image: 'https://flagcdn.com/fr.svg', confidence: 78, prediction: 'STRONG' },
  { id: 3, title: 'England to Win World Cup 2026?',   category: 'knockout', team: 'England',   yesOdds: 4.8, noOdds: 1.20, sentiment: 65, volume: 87340,  image: 'https://flagcdn.com/gb-eng.svg', confidence: 75, prediction: 'CONTENDER' },
  { id: 4, title: 'Brazil to Win World Cup 2026?',    category: 'knockout', team: 'Brazil',    yesOdds: 3.8, noOdds: 1.30, sentiment: 71, volume: 156200, image: 'https://flagcdn.com/br.svg', confidence: 80, prediction: 'FAVORITES' },
  { id: 5, title: 'USA to Reach World Cup Semi-Finals?', category: 'stage', team: 'USA',      yesOdds: 2.1, noOdds: 1.85, sentiment: 58, volume: 64320,  image: 'https://flagcdn.com/us.svg', confidence: 72, prediction: 'LIKELY' },
  { id: 6, title: 'Spain to Reach World Cup Final?',  category: 'stage',   team: 'Spain',     yesOdds: 2.45, noOdds: 1.65, sentiment: 69, volume: 112560, image: 'https://flagcdn.com/es.svg', confidence: 76, prediction: 'PROBABLE' },
  { id: 7, title: 'Germany to Win World Cup 2026?',   category: 'knockout', team: 'Germany',  yesOdds: 5.5, noOdds: 1.18, sentiment: 62, volume: 73890,  image: 'https://flagcdn.com/de.svg', confidence: 71, prediction: 'CONTENDER' },
  { id: 8, title: 'Final Match Over 2.5 Goals?',      category: 'prop',                        yesOdds: 1.65, noOdds: 2.1,  sentiment: 74, volume: 203450, image: 'https://cdn-icons-png.flaticon.com/512/2436/2436481.png', confidence: 79, prediction: 'LIKELY' },
];

const CATEGORIES = [
  { id: 'all',      label: 'All Markets',       icon: 'trophy' },
  { id: 'knockout', label: 'Tournament Winners', icon: 'standings' },
  { id: 'stage',    label: 'Stage Advances',     icon: 'chart' },
  { id: 'prop',     label: 'Props',              icon: 'football' },
];

const tilt = (e) => {
  const c = e.currentTarget, r = c.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
  const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
  c.style.transition = 'box-shadow 0.12s ease';
  c.style.transform  = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px) scale(1.012)`;
  c.style.boxShadow  = `${-x}px ${-y}px 30px rgba(249,115,22,0.18), 0 20px 40px rgba(0,0,0,0.5)`;
};
const untilt = (e) => {
  const c = e.currentTarget;
  c.style.transition = 'transform 0.5s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.5s ease';
  c.style.transform  = '';
  c.style.boxShadow  = '';
};

export default function PredictTab({ onSelectMarket }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockMarkets.filter(m => {
    const matchCat  = filter === 'all' || m.category === filter;
    const matchText = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="predict-tab">
      {/* Page title */}
      <div className="predict-header">
        <h2 className="predict-title">Prediction Markets</h2>
        <p className="predict-sub">Click any market to place a wager</p>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Icon name="search" size={18} color="#6b7280" className="search-svg-icon" />
        <input
          type="text"
          placeholder="Search teams or matches..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input glass-input"
        />
      </div>

      {/* Category tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-tab glass-tab ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            <Icon name={cat.icon} size={14} className="cat-svg-icon" />
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Markets */}
      <div className="markets-container">
        {filtered.map((market, idx) => (
          <div
            key={market.id}
            className="market-card wc-card glass-market"
            style={{ animationDelay: `${idx * 0.07}s` }}
            onMouseMove={tilt}
            onMouseLeave={untilt}
            onClick={() => onSelectMarket(market)}
          >
            <div className="card-header">
              <div className="market-image-wc">
                <img src={market.image} alt={market.team || 'market'} className="flag-icon" />
              </div>
              <div className="market-meta">
                <span className="category-badge">{market.category}</span>
                <span className="confidence-badge">{market.confidence}%</span>
              </div>
            </div>

            <h3 className="market-title">{market.title}</h3>

            <div className="sentiment-section">
              <div className="sentiment-bar">
                <div className="sentiment-fill yes" style={{ width: `${market.sentiment}%` }} />
              </div>
              <div className="sentiment-labels">
                <span className="label-yes">{market.sentiment}% YES</span>
                <span className="label-no">{100 - market.sentiment}% NO</span>
              </div>
            </div>

            <LiveOddsRow market={market} />

            <div className="card-bottom">
              <div className="card-stats">
                <span className="volume-badge">{(market.volume / 1000).toFixed(0)}k vol</span>
              </div>
              <span className="prediction-tag">{market.prediction}</span>
            </div>

            <div className="card-cta">
              <span className="cta-text">Place Prediction →</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={40} color="#4b5563" />
          <p>No markets found</p>
        </div>
      )}

      <div className="home-bottom-pad" />
    </div>
  );
}
