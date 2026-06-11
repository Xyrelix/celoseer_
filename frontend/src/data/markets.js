// Single source of truth for the displayed markets. Used by PredictTab for
// rendering and by useOnChainBets to label on-chain positions.
export const MARKETS = [
  { id: 1, title: 'Argentina to Win World Cup 2026?', category: 'knockout', team: 'Argentina', yesOdds: 3.5, noOdds: 1.35, sentiment: 68, volume: 125430, image: 'https://flagcdn.com/ar.svg', confidence: 82, prediction: 'FAVORITES' },
  { id: 2, title: 'France to Win World Cup 2026?',    category: 'knockout', team: 'France',    yesOdds: 4.2, noOdds: 1.25, sentiment: 72, volume: 98760,  image: 'https://flagcdn.com/fr.svg', confidence: 78, prediction: 'STRONG' },
  { id: 3, title: 'England to Win World Cup 2026?',   category: 'knockout', team: 'England',   yesOdds: 4.8, noOdds: 1.20, sentiment: 65, volume: 87340,  image: 'https://flagcdn.com/gb-eng.svg', confidence: 75, prediction: 'CONTENDER' },
  { id: 4, title: 'Brazil to Win World Cup 2026?',    category: 'knockout', team: 'Brazil',    yesOdds: 3.8, noOdds: 1.30, sentiment: 71, volume: 156200, image: 'https://flagcdn.com/br.svg', confidence: 80, prediction: 'FAVORITES' },
  { id: 5, title: 'USA to Reach World Cup Semi-Finals?', category: 'stage', team: 'USA',      yesOdds: 2.1, noOdds: 1.85, sentiment: 58, volume: 64320,  image: 'https://flagcdn.com/us.svg', confidence: 72, prediction: 'LIKELY' },
  { id: 6, title: 'Spain to Reach World Cup Final?',  category: 'stage',   team: 'Spain',     yesOdds: 2.45, noOdds: 1.65, sentiment: 69, volume: 112560, image: 'https://flagcdn.com/es.svg', confidence: 76, prediction: 'PROBABLE' },
  { id: 7, title: 'Germany to Win World Cup 2026?',   category: 'knockout', team: 'Germany',  yesOdds: 5.5, noOdds: 1.18, sentiment: 62, volume: 73890,  image: 'https://flagcdn.com/de.svg', confidence: 71, prediction: 'CONTENDER' },
  { id: 8, title: 'Final Match Over 2.5 Goals?',      category: 'prop',                        yesOdds: 1.65, noOdds: 2.1,  sentiment: 74, volume: 203450, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26bd.png', confidence: 79, prediction: 'LIKELY' },
];

export const MARKET_BY_ID = Object.fromEntries(MARKETS.map(m => [m.id, m]));
