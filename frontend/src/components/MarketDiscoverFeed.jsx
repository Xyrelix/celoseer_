import { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';

const CELO_LOGO = 'https://assets.coingecko.com/coins/images/11090/thumb/InjXBNx9_400x400.jpg';
const HOST_FLAGS = [
  { src: 'https://flagcdn.com/us.svg', alt: 'USA' },
  { src: 'https://flagcdn.com/ca.svg', alt: 'Canada' },
  { src: 'https://flagcdn.com/mx.svg', alt: 'Mexico' },
];

function MatchCard({ market, onClick }) {
  return (
    <div className="market-card" onClick={onClick}>
      {/* team1 vs team2 */}
      <div className="match-teams">
        <div className="match-team">
          <img src={market.image} alt={market.team} className="match-flag"
            onError={(e) => { e.target.src = 'https://flagcdn.com/un.svg'; }} />
          <span className="match-team-name">{market.team}</span>
        </div>
        <span className="match-vs">VS</span>
        <div className="match-team">
          <img src={market.team2Image} alt={market.team2} className="match-flag"
            onError={(e) => { e.target.src = 'https://flagcdn.com/un.svg'; }} />
          <span className="match-team-name">{market.team2}</span>
        </div>
      </div>

      {/* group + live + confidence row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {market.group && (
            <span className="category-badge">Group {market.group}</span>
          )}
          <span className="live-badge">
            <span className="live-dot" />OPEN
          </span>
        </div>
        <span className="confidence-badge">AI {market.confidence}%</span>
      </div>

      {/* AI analysis */}
      {market.analysis && (
        <p className="market-analysis">🤖 {market.analysis}</p>
      )}

      {/* Odds */}
      <div className="odds-row">
        <div className="odds-item yes">
          <span className="odds-label">1 ({market.team?.slice(0,3).toUpperCase()})</span>
          <span className="odds-value">{market.yesOdds?.toFixed(2)}</span>
        </div>
        <div className="divider-vertical" />
        {market.drawOdds && (
          <>
            <div className="odds-item" style={{ borderLeft: '3px solid #6b7280' }}>
              <span className="odds-label">Draw</span>
              <span className="odds-value">{market.drawOdds.toFixed(2)}</span>
            </div>
            <div className="divider-vertical" />
          </>
        )}
        <div className="odds-item no">
          <span className="odds-label">2 ({market.team2?.slice(0,3).toUpperCase()})</span>
          <span className="odds-value">{market.noOdds?.toFixed(2)}</span>
        </div>
      </div>

      {/* Sentiment */}
      <div className="sentiment-section">
        <div className="sentiment-bar">
          <div className="sentiment-fill yes" style={{ width: `${market.sentiment}%` }} />
        </div>
        <div className="sentiment-labels">
          <span className="label-yes">{market.sentiment}% back {market.team}</span>
          <span className="label-no">{100 - market.sentiment}% back {market.team2}</span>
        </div>
      </div>

      <div className="card-bottom">
        <div className="volume-badge">{((market.volume ?? 0) / 1000).toFixed(0)}k vol</div>
        <span className="prediction-tag">{market.prediction}</span>
      </div>
      <div className="card-cta">Place Prediction →</div>
    </div>
  );
}

function TournamentCard({ market, onClick }) {
  return (
    <div className="market-card" onClick={onClick}>
      <div className="card-header">
        <div className="market-image-wc">
          {market.image ? (
            <img src={market.image} alt={market.team || 'market'} className="flag-icon"
              onError={(e) => { e.target.src = 'https://flagcdn.com/un.svg'; }} />
          ) : <span style={{ fontSize: '2rem' }}>🏆</span>}
        </div>
        <div className="market-meta">
          <span className="category-badge">{market.category}</span>
          <span className="confidence-badge">AI {market.confidence}%</span>
        </div>
      </div>

      <h3 className="market-title">{market.title}</h3>

      {market.analysis && (
        <p className="market-analysis">🤖 {market.analysis}</p>
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
        <div className="odds-item no">
          <span className="odds-label">NO</span>
          <span className="odds-value">{market.noOdds?.toFixed(2)}</span>
        </div>
      </div>

      <div className="card-bottom">
        <div className="volume-badge">{((market.volume ?? 0) / 1000).toFixed(0)}k vol</div>
        <span className="prediction-tag">{market.prediction}</span>
      </div>
      <div className="card-cta">Place Prediction →</div>
    </div>
  );
}

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
    { id: 'all',      label: 'All',       icon: '🏆' },
    { id: 'knockout', label: 'Champions', icon: '👑' },
    { id: 'stage',    label: 'Stages',    icon: '📈' },
    { id: 'match',    label: 'Matches',   icon: '⚽' },
    { id: 'prop',     label: 'Props',     icon: '🎲' },
  ];

  return (
    <div className="discover-feed">

      {/* ── Stadium Hero Header ─────────────────── */}
      <div className="feed-hero">
        <div className="feed-hero-bg">
          <div className="header-top">
            <div className="header-title">
              <h1>FIFA World Cup 2026</h1>
              <p className="subtitle">AI-Powered Predictions on Celo</p>
              <div className="host-flags">
                {HOST_FLAGS.map(f => (
                  <img key={f.alt} src={f.src} alt={f.alt} className="host-flag" />
                ))}
                <span className="host-label">USA · Canada · Mexico</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <button className="btn-portfolio" onClick={onNavigatePortfolio} title="Portfolio">📊</button>
              <button className="btn-portfolio" onClick={onLogout} title="Sign out" style={{ fontSize: '0.9rem' }}>⏏</button>
            </div>
          </div>

          <div className="wallet-info">
            <div className="info-item">
              <span className="info-label">cUSD Balance</span>
              <span className="info-value">{walletBalance.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Wallet</span>
              <span className="info-value" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                {user?.displayAddress ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search ──────────────────────────────── */}
      <div className="search-bar">
        <input type="text" placeholder="Search teams or markets…"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input" />
        <span className="search-icon">🔍</span>
      </div>

      {/* ── Category tabs ───────────────────────── */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button key={cat.id}
            className={`category-tab ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}>
            <span>{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── AI stats bar ────────────────────────── */}
      <div className="ai-stats-bar">
        <div className="stat-box">
          <span className="stat-number">{markets.length}</span>
          <span className="stat-name">Markets</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">82.4%</span>
          <span className="stat-name">AI Acc.</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">48</span>
          <span className="stat-name">Teams</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">104</span>
          <span className="stat-name">Matches</span>
        </div>
      </div>

      {/* ── Loading skeleton ────────────────────── */}
      {loading && (
        <div className="markets-container">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line" style={{ height: 14, width: '45%', marginBottom: 10 }} />
              <div className="skeleton-line" style={{ height: 20, marginBottom: 8 }} />
              <div className="skeleton-line" style={{ height: 14, width: '70%', marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton-line" style={{ flex: 1, height: 40, borderRadius: 10 }} />
                <div className="skeleton-line" style={{ flex: 1, height: 40, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ───────────────────────────────── */}
      {error && (
        <div style={{ textAlign: 'center', padding: 40, color: '#f87171' }}>
          <p>Failed to load markets: {error}</p>
          <button className="btn-secondary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }} onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {/* ── Market cards ────────────────────────── */}
      {!loading && !error && (
        <div className="markets-container">
          {filteredMarkets.map(market =>
            market.category === 'match'
              ? <MatchCard key={market.id} market={market} onClick={() => onSelectMarket(market)} />
              : <TournamentCard key={market.id} market={market} onClick={() => onSelectMarket(market)} />
          )}

          {filteredMarkets.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔎</span>
              <p>No markets found</p>
            </div>
          )}
        </div>
      )}

      {/* ── Footer ──────────────────────────────── */}
      <div className="footer-stats">
        <div className="footer-stat-item">
          <span className="footer-stat-icon">🌎</span>
          <span className="footer-stat-text">16 Host Cities</span>
        </div>
        <div className="footer-stat-item">
          <span className="footer-stat-icon">🏟️</span>
          <span className="footer-stat-text">16 Stadiums</span>
        </div>
        <div className="footer-stat-item">
          <span className="footer-stat-icon">⛓</span>
          <span className="footer-stat-text">Powered by Celo</span>
        </div>
      </div>
    </div>
  );
}
