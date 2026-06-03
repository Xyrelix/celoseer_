import { GROUP_MATCHES, TOURNAMENT_MARKETS, TEAMS } from '../data/worldCupMatches.js';
import { getPrediction, getTournamentPrediction } from './aiPredictor.js';

// In-memory market store (replace with DB later)
const marketStore = new Map();

function oddsFromProbability(prob) {
  if (prob <= 0) return 99.0;
  return +((1 / prob).toFixed(2));
}

export async function getAllMarkets() {
  const markets = [];

  // Tournament winner + stage markets
  for (const tm of TOURNAMENT_MARKETS) {
    const key = `market-${tm.id}`;
    if (marketStore.has(key)) {
      markets.push(marketStore.get(key));
      continue;
    }

    let prediction = null;
    if (tm.team) {
      prediction = await getTournamentPrediction(tm.team);
    }

    const team = tm.team ? TEAMS[tm.team] : null;
    const winProb = prediction?.winProbability ?? 0.12;
    const market = {
      id: tm.id,
      title: tm.question,
      category: tm.category,
      team: team?.name ?? null,
      image: team?.flag ?? 'https://cdn-icons-png.flaticon.com/512/2436/2436481.png',
      yesOdds: oddsFromProbability(winProb),
      noOdds: oddsFromProbability(1 - winProb),
      sentiment: prediction?.sentiment ?? 55,
      confidence: prediction?.confidence ?? 70,
      prediction: prediction?.label ?? 'CONTENDER',
      analysis: prediction?.analysis ?? null,
      volume: Math.floor(50000 + Math.random() * 200000),
      closesAt: '2026-06-11T18:00:00Z',
      type: tm.type,
      source: prediction?.source ?? 'mock',
    };

    marketStore.set(key, market);
    markets.push(market);
  }

  // Individual group-stage match markets
  for (const match of GROUP_MATCHES) {
    const key = `market-${match.id}`;
    if (marketStore.has(key)) {
      markets.push(marketStore.get(key));
      continue;
    }

    const prediction = await getPrediction(match.team1, match.team2, match.stage);
    const t1 = TEAMS[match.team1];
    const t2 = TEAMS[match.team2];

    const market = {
      id: match.id,
      title: `${t1.name} to beat ${t2.name}`,
      category: 'match',
      team: t1.name,
      image: t1.flag,
      team2: t2.name,
      team2Image: t2.flag,
      yesOdds: oddsFromProbability(prediction.team1.winProbability),
      noOdds: oddsFromProbability(prediction.team2.winProbability),
      drawOdds: oddsFromProbability(prediction.draw.probability),
      sentiment: Math.round(prediction.team1.winProbability * 100),
      confidence: prediction.confidence,
      prediction: prediction.label,
      analysis: prediction.analysis,
      keyFactor: prediction.keyFactor,
      volume: Math.floor(20000 + Math.random() * 80000),
      closesAt: `${match.date}T18:00:00Z`,
      venue: match.venue,
      group: match.group,
      stage: match.stage,
      type: 'match_winner',
      source: prediction.source,
    };

    marketStore.set(key, market);
    markets.push(market);
  }

  return markets;
}

export async function getMarketById(id) {
  const all = await getAllMarkets();
  return all.find(m => m.id === id) ?? null;
}

export function invalidateMarket(id) {
  marketStore.delete(`market-${id}`);
}
