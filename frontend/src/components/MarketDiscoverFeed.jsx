import { useState } from 'react';

const mockMarkets = [
  { id: 1, title: 'Argentina to Win World Cup 2026?', category: 'knockout', team: 'Argentina', yesOdds: 3.5, noOdds: 1.35, sentiment: 68, volume: 125430, image: 'https://flagcdn.com/ar.svg', confidence: 82, prediction: 'FAVORITES' },
  { id: 2, title: 'France to Win World Cup 2026?', category: 'knockout', team: 'France', yesOdds: 4.2, noOdds: 1.25, sentiment: 72, volume: 98760, image: 'https://flagcdn.com/fr.svg', confidence: 78, prediction: 'STRONG' },
  { id: 3, title: 'England to Win World Cup 2026?', category: 'knockout', team: 'England', yesOdds: 4.8, noOdds: 1.20, sentiment: 65, volume: 87340, image: 'https://flagcdn.com/gb-eng.svg', confidence: 75, prediction: 'CONTENDER' },
  { id: 4, title: 'Brazil to Win World Cup 2026?', category: 'knockout', team: 'Brazil', yesOdds: 3.8, noOdds: 1.30, sentiment: 71, volume: 156200, image: 'https://flagcdn.com/br.svg', confidence: 80, prediction: 'FAVORITES' },
  { id: 5, title: 'USA to Reach World Cup Semi-Finals?', category: 'stage', team: 'USA', yesOdds: 2.1, noOdds: 1.85, sentiment: 58, volume: 64320, image: 'https://flagcdn.com/us.svg', confidence: 72, prediction: 'LIKELY' },
  { id: 6, title: 'Spain to Reach World Cup Final?', category: 'stage', team: 'Spain', yesOdds: 2.45, noOdds: 1.65, sentiment: 69, volume: 112560, image: 'https://flagcdn.com/es.svg', confidence: 76, prediction: 'PROBABLE' },
  { id: 7, title: 'Morocco to Reach Quarter-Finals?', category: 'stage', team: 'Morocco', yesOdds: 2.2, noOdds: 1.75, sentiment: 59, volume: 73890, image: 'https://flagcdn.com/ma.svg', confidence: 71, prediction: 'CONTENDER' },
  { id: 8, title: 'Final Match Over 2.5 Goals?', category: 'prop', yesOdds: 1.65, noOdds: 2.1, sentiment: 74, volume: 203450, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26bd.png', confidence: 79, prediction: 'LIKELY' },
];

const categories = [
  { id: 'all', label: 'All Markets', icon: '🏆' },
  { id: 'knockout', label: 'Tournament Winners', icon: '👑' },
  { id: 'stage', label: 'Stage Advances', icon: '📈' },
  { id: 'prop', label: 'Props & Parlays', icon: '⚽' },
];

export default function MarketDiscoverFeed({ onSelectMarket, user, walletBalance, onNavigatePortfolio }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = mockMarkets.filter(market => {
    const matchesFilter = filter === 'all' || market.category === filter;
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="discover-feed world-cup-theme">
      <div className="feed-header">
        <div className="header-top">
          <div className="header-title">
            <h1>🏆 FIFA World Cup 2026</h1>
            <p className="subtitle">AI-Powered Predictions & Live Odds</p>
          </div>
          <button className="btn-portfolio glass-btn" onClick={onNavigatePortfolio} title="View your portfolio">
            <span className="portfolio-icon">📊</span>
          </button>
        </div>

        <div className="wallet-info">
          <div className="info-item glass-info">
            <span className="info-label">Your Balance</span>
            <span className="info-value">{walletBalance?.toFixed(2) ?? '0.00'} cUSD</span>
          </div>
          <div className="info-item glass-info">
            <span className="info-label">AI Accuracy</span>
            <span className="info-value accuracy">82.4%</span>
          </div>
        </div>
      </div>

      {/* ── Search ──────────────────────────────── */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search teams or matches..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input glass-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* ── Category tabs ───────────────────────── */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab glass-tab ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="ai-stats-bar glass-stats">
        <div className="stat-box"><span className="stat-number">847</span><span className="stat-name">Predictions</span></div>
        <div className="stat-box"><span className="stat-number">82.4%</span><span className="stat-name">Accuracy</span></div>
        <div className="stat-box"><span className="stat-number">32</span><span className="stat-name">Teams</span></div>
        <div className="stat-box"><span className="stat-number">16</span><span className="stat-name">Stadiums</span></div>
      </div>

      <div className="markets-container">
        {filteredMarkets.map((market, idx) => (
          <div
            key={market.id}
            className="market-card wc-card glass-market"
            style={{ animationDelay: `${idx * 0.07}s` }}
            onClick={() => onSelectMarket(market)}
          >
            <div className="card-header">
              <div className="market-image-wc">
                <img src={market.image} alt={market.team || 'market'} className="flag-icon" onError={e => { e.target.style.display = 'none'; }} />
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

            <div className="odds-row">
              <div className="odds-item yes"><span className="odds-label">YES</span><span className="odds-value">{market.yesOdds.toFixed(2)}</span></div>
              <div className="divider-vertical" />
              <div className="odds-item no"><span className="odds-label">NO</span><span className="odds-value">{market.noOdds.toFixed(2)}</span></div>
            </div>

            <div className="card-bottom">
              <div className="card-stats"><span className="volume-badge">{(market.volume / 1000).toFixed(0)}k vol</span></div>
              <span className="prediction-tag">{market.prediction}</span>
            </div>

            <div className="card-cta"><span className="cta-text">Place Prediction →</span></div>
          </div>
        ))}

        {filteredMarkets.length === 0 && (
          <div className="empty-state"><div className="empty-icon">🔎</div><p>No markets found</p></div>
        )}
      </div>
    </div>
  );
}
