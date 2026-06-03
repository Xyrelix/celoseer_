import { useState } from 'react';

const mockMarkets = [
  {
    id: 1,
    title: 'Argentina to Win World Cup 2026?',
    category: 'knockout',
    team: 'Argentina',
    yesOdds: 3.5,
    noOdds: 1.35,
    sentiment: 68,
    volume: 125430,
    image: 'https://flagcdn.com/ar.svg',
    confidence: 82,
    prediction: 'FAVORITES'
  },
  {
    id: 2,
    title: 'France to Win World Cup 2026?',
    category: 'knockout',
    team: 'France',
    yesOdds: 4.2,
    noOdds: 1.25,
    sentiment: 72,
    volume: 98760,
    image: 'https://flagcdn.com/fr.svg',
    confidence: 78,
    prediction: 'STRONG'
  },
  {
    id: 3,
    title: 'England to Win World Cup 2026?',
    category: 'knockout',
    team: 'England',
    yesOdds: 4.8,
    noOdds: 1.20,
    sentiment: 65,
    volume: 87340,
    image: 'https://flagcdn.com/gb.svg',
    confidence: 75,
    prediction: 'CONTENDER'
  },
  {
    id: 4,
    title: 'Brazil to Win World Cup 2026?',
    category: 'knockout',
    team: 'Brazil',
    yesOdds: 3.8,
    noOdds: 1.30,
    sentiment: 71,
    volume: 156200,
    image: 'https://flagcdn.com/br.svg',
    confidence: 80,
    prediction: 'FAVORITES'
  },
  {
    id: 5,
    title: 'USA to Reach World Cup Semi-Finals?',
    category: 'stage',
    team: 'USA',
    yesOdds: 2.1,
    noOdds: 1.85,
    sentiment: 58,
    volume: 64320,
    image: 'https://flagcdn.com/us.svg',
    confidence: 72,
    prediction: 'LIKELY'
  },
  {
    id: 6,
    title: 'Spain to Reach World Cup Final?',
    category: 'stage',
    team: 'Spain',
    yesOdds: 2.45,
    noOdds: 1.65,
    sentiment: 69,
    volume: 112560,
    image: 'https://flagcdn.com/es.svg',
    confidence: 76,
    prediction: 'PROBABLE'
  },
  {
    id: 7,
    title: 'Germany to Win World Cup 2026?',
    category: 'knockout',
    team: 'Germany',
    yesOdds: 5.5,
    noOdds: 1.18,
    sentiment: 62,
    volume: 73890,
    image: 'https://flagcdn.com/de.svg',
    confidence: 71,
    prediction: 'CONTENDER'
  },
  {
    id: 8,
    title: 'Final Match Over 2.5 Goals?',
    category: 'prop',
    yesOdds: 1.65,
    noOdds: 2.1,
    sentiment: 74,
    volume: 203450,
    image: 'https://cdn-icons-png.flaticon.com/512/2436/2436481.png',
    confidence: 79,
    prediction: 'LIKELY'
  }
];


export default function MarketDiscoverFeed({ onSelectMarket, user, walletBalance, onNavigatePortfolio }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = mockMarkets.filter(market => {
    const matchesFilter = filter === 'all' || market.category === filter;
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Markets', icon: '🏆' },
    { id: 'knockout', label: 'Tournament Winners', icon: '👑' },
    { id: 'stage', label: 'Stage Advances', icon: '📈' },
    { id: 'prop', label: 'Props & Parlays', icon: '⚽' }
  ];

  return (
    <div className="discover-feed world-cup-theme">
      {/* Header */}
      <div className="feed-header">
        <div className="header-top">
          <div className="header-title">
            <h1>🏆 FIFA World Cup 2026</h1>
            <p className="subtitle">AI-Powered Predictions & Live Odds</p>
          </div>
          <button className="btn-portfolio" onClick={onNavigatePortfolio} title="View your portfolio">
            <span className="portfolio-icon">📊</span>
          </button>
        </div>

        <div className="wallet-info">
          <div className="info-item">
            <span className="info-label">Your Balance</span>
            <span className="info-value">{walletBalance.toFixed(2)} cUSD</span>
          </div>
          <div className="info-item">
            <span className="info-label">AI Accuracy</span>
            <span className="info-value accuracy">82.4%</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search teams or matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Category Filter */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* AI Stats Bar */}
      <div className="ai-stats-bar">
        <div className="stat-box">
          <span className="stat-number">847</span>
          <span className="stat-name">Predictions</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">82.4%</span>
          <span className="stat-name">Accuracy</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">32</span>
          <span className="stat-name">Teams</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">12</span>
          <span className="stat-name">Stadiums</span>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="markets-container">
        {filteredMarkets.map(market => (
          <div
            key={market.id}
            className="market-card wc-card"
            onClick={() => onSelectMarket(market)}
          >
            <div className="card-header">
              <div className="market-image-wc">
                {market.image.includes('http') || market.image.includes('cdn') ? (
                  <img src={market.image} alt={market.team || 'market'} className="flag-icon" />
                ) : (
                  market.image
                )}
              </div>
              <div className="market-meta">
                <span className="category-badge">{market.category}</span>
                <span className="confidence-badge">{market.confidence}%</span>
              </div>
            </div>

            <h3 className="market-title">{market.title}</h3>

            <div className="sentiment-section">
              <div className="sentiment-bar">
                <div className="sentiment-fill yes" style={{ width: `${market.sentiment}%` }}></div>
              </div>
              <div className="sentiment-labels">
                <span className="label-yes">{market.sentiment}% YES</span>
                <span className="label-no">{100 - market.sentiment}% NO</span>
              </div>
            </div>

            <div className="odds-row">
              <div className="odds-item yes">
                <span className="odds-label">YES</span>
                <span className="odds-value">{market.yesOdds.toFixed(2)}</span>
              </div>
              <div className="divider-vertical"></div>
              <div className="odds-item no">
                <span className="odds-label">NO</span>
                <span className="odds-value">{market.noOdds.toFixed(2)}</span>
              </div>
            </div>

            <div className="card-bottom">
              <div className="card-stats">
                <div className="volume-badge">
                  <span>{(market.volume / 1000).toFixed(0)}k</span>
                </div>
              </div>
              <span className="prediction-tag">{market.prediction}</span>
            </div>

            <div className="card-cta">
              <span className="cta-text">Place Prediction →</span>
            </div>
          </div>
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <p>No markets found</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="footer-stat-item">
          <span className="footer-stat-icon">🌍</span>
          <span className="footer-stat-text">12 Host Cities</span>
        </div>
        <div className="footer-stat-item">
          <span className="footer-stat-icon">🏟️</span>
          <span className="footer-stat-text">16 Stadiums</span>
        </div>
        <div className="footer-stat-item">
          <span className="footer-stat-icon">⚽</span>
          <span className="footer-stat-text">64 Matches</span>
        </div>
      </div>
    </div>
  );
}
