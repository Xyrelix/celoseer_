import { useState } from 'react';

const mockMarkets = [
  {
    id: 1,
    title: 'Bitcoin hits $100k by end of 2026?',
    category: 'crypto',
    yesOdds: 2.45,
    noOdds: 1.65,
    sentiment: 72,
    volume: 45230,
    image: '₿'
  },
  {
    id: 2,
    title: 'US unemployment stays below 4%?',
    category: 'economics',
    yesOdds: 1.89,
    noOdds: 2.15,
    sentiment: 58,
    volume: 28910,
    image: '📊'
  },
  {
    id: 3,
    title: 'AI passes medical licensing exam?',
    category: 'tech',
    yesOdds: 3.2,
    noOdds: 1.45,
    sentiment: 81,
    volume: 56780,
    image: '🤖'
  },
  {
    id: 4,
    title: 'Celo network TVL reaches $1B?',
    category: 'crypto',
    yesOdds: 2.8,
    noOdds: 1.52,
    sentiment: 68,
    volume: 33450,
    image: '💰'
  },
  {
    id: 5,
    title: 'Apple releases new AR glasses?',
    category: 'tech',
    yesOdds: 1.95,
    noOdds: 2.05,
    sentiment: 55,
    volume: 41200,
    image: '👓'
  },
  {
    id: 6,
    title: 'Ethereum fees drop below $0.10?',
    category: 'crypto',
    yesOdds: 2.6,
    noOdds: 1.6,
    sentiment: 74,
    volume: 52310,
    image: '⟠'
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
    { id: 'all', label: 'All Markets', icon: '📺' },
    { id: 'crypto', label: 'Crypto', icon: '₿' },
    { id: 'tech', label: 'Technology', icon: '🚀' },
    { id: 'economics', label: 'Economics', icon: '💹' }
  ];

  return (
    <div className="discover-feed">
      {/* Header */}
      <div className="feed-header">
        <div className="header-top">
          <h1>Markets</h1>
          <button className="btn-portfolio" onClick={onNavigatePortfolio} title="View your portfolio">
            <span className="portfolio-icon">📈</span>
          </button>
        </div>

        <div className="wallet-info">
          <span className="wallet-label">Wallet Balance</span>
          <span className="wallet-amount">{walletBalance.toFixed(2)} cUSD</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search markets..."
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

      {/* Markets Grid */}
      <div className="markets-container">
        {filteredMarkets.map(market => (
          <div
            key={market.id}
            className="market-card"
            onClick={() => onSelectMarket(market)}
          >
            <div className="card-header">
              <div className="market-image">{market.image}</div>
              <div className="market-meta">
                <span className="category-badge">{market.category}</span>
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

            <div className="volume-footer">
              <span className="volume-label">Volume</span>
              <span className="volume-value">{(market.volume / 1000).toFixed(1)}k cUSD</span>
            </div>

            <div className="card-cta">
              <span className="cta-text">Tap to wager →</span>
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
    </div>
  );
}
