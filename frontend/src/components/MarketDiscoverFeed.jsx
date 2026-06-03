import { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';

export default function MarketDiscoverFeed({ onSelectMarket, user, walletBalance, onNavigatePortfolio, onLogout }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { markets, loading, error, refetch } = useMarkets();

  const filteredMarkets = markets.filter(market => {
    const matchesFilter = filter === 'all' || market.category === filter;
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: 'all',     label: 'All Markets',       icon: '🏆' },
    { id: 'knockout', label: 'Tournament Winners', icon: '👑' },
    { id: 'stage',   label: 'Stage Advances',     icon: '📈' },
    { id: 'match',   label: 'Match Results',      icon: '⚽' },
    { id: 'prop',    label: 'Props',              icon: '🎲' },
  ];

  return (
    <div className="discover-feed world-cup-theme">
      <div className="feed-header">
        <div className="header-top">
          <div className="header-title">
            <h1>🏆 FIFA World Cup 2026</h1>
            <p className="subtitle">AI-Powered Predictions & Live Odds</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-portfolio" onClick={onNavigatePortfolio} title="My Portfolio">
              <span className="portfolio-icon">📊</span>
            </button>
            <button className="btn-portfolio" onClick={onLogout} title="Sign out" style={{ fontSize: '1rem' }}>
              ⏏
            </button>
          </div>
        </div>

        <div className="wallet-info">
          <div className="info-item">
            <span className="info-label">Balance</span>
            <span className="info-value">{walletBalance.toFixed(2)} cUSD</span>
          </div>
          <div className="info-item">
            <span className="info-label">Wallet</span>
            <span className="info-value" style={{ fontSize: '0.85rem' }}>{user?.displayAddress ?? '—'}</span>
          </div>
        </div>
      </div>

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

      <div className="ai-stats-bar">
        <div className="stat-box">
          <span className="stat-number">{markets.length}</span>
          <span className="stat-name">Markets</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">82.4%</span>
          <span className="stat-name">AI Accuracy</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">32</span>
          <span className="stat-name">Teams</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">64</span>
          <span className="stat-name">Matches</span>
        </div>
      </div>

      {loading && (
        <div className="markets-container">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="market-card wc-card" style={{ opacity: 0.4, minHeight: 180 }}>
              <div style={{ background: '#374151', borderRadius: 8, height: 20, marginBottom: 12 }} />
              <div style={{ background: '#374151', borderRadius: 8, height: 14, width: '60%' }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: 40, color: '#f87171' }}>
          <p>Failed to load markets: {error}</p>
          <button className="btn-secondary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }} onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="markets-container">
          {filteredMarkets.map(market => (
            <div
              key={market.id}
              className="market-card wc-card"
              onClick={() => onSelectMarket(market)}
            >
              <div className="card-header">
                <div className="market-image-wc">
                  {market.image ? (
                    <img src={market.image} alt={market.team || 'market'} className="flag-icon"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : '⚽'}
                </div>
                <div className="market-meta">
                  <span className="category-badge">{market.category}</span>
                  <span className="confidence-badge">{market.confidence}%</span>
                </div>
              </div>

              <h3 className="market-title">{market.title}</h3>

              {market.analysis && (
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 10, lineHeight: 1.4 }}>
                  {market.analysis}
                </p>
              )}

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
                <div className="odds-item yes">
                  <span className="odds-label">YES</span>
                  <span className="odds-value">{market.yesOdds?.toFixed(2)}</span>
                </div>
                <div className="divider-vertical" />
                {market.drawOdds && (
                  <>
                    <div className="odds-item" style={{ borderLeft: '3px solid #6b7280' }}>
                      <span className="odds-label">DRAW</span>
                      <span className="odds-value">{market.drawOdds.toFixed(2)}</span>
                    </div>
                    <div className="divider-vertical" />
                  </>
                )}
                <div className="odds-item no">
                  <span className="odds-label">NO</span>
                  <span className="odds-value">{market.noOdds?.toFixed(2)}</span>
                </div>
              </div>

              <div className="card-bottom">
                <div className="card-stats">
                  <div className="volume-badge">
                    <span>{((market.volume ?? 0) / 1000).toFixed(0)}k vol</span>
                  </div>
                </div>
                <span className="prediction-tag">{market.prediction}</span>
              </div>

              <div className="card-cta">
                <span className="cta-text">Place Prediction →</span>
              </div>
            </div>
          ))}

          {filteredMarkets.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>
              <p>No markets found</p>
            </div>
          )}
        </div>
      )}

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
