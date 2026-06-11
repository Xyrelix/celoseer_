import { log } from './logger.js';

// Real World Cup 2026 match results from football-data.org
// Get free API key at https://www.football-data.org/client/register
// Free tier: 10 matches/day (plenty for demo)

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Cache match results (30 min TTL) + competition ID (6 hour TTL)
const matchCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;
let worldCupIdCache = null;
let worldCupIdCacheTime = 0;

// Find World Cup 2026 competition ID
async function getWorldCupId() {
  if (worldCupIdCache && Date.now() - worldCupIdCacheTime < 6 * 60 * 60 * 1000) {
    return worldCupIdCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/competitions`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const wc = data.competitions?.find(c =>
      c.name?.includes('World Cup') && c.name?.includes('2026')
    );

    if (wc) {
      worldCupIdCache = wc.id;
      worldCupIdCacheTime = Date.now();
      return wc.id;
    }
  } catch (err) {
    log.warn('[sportsApi] could not find World Cup ID:', err.message);
  }

  return null;
}

export async function getMatchResult(homeTeam, awayTeam, matchDate) {
  if (!API_KEY) {
    log.warn('[sportsApi] FOOTBALL_DATA_API_KEY not set — cannot fetch real results');
    return null;
  }

  const cacheKey = `${homeTeam}-${awayTeam}-${matchDate}`;
  const cached = matchCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  try {
    const wcId = await getWorldCupId();
    if (!wcId) {
      log.warn('[sportsApi] could not find World Cup 2026 competition ID');
      return null;
    }

    // Get all World Cup 2026 matches (unfold goals to see scores)
    const res = await fetch(`${BASE_URL}/competitions/${wcId}/matches`, {
      headers: {
        'X-Auth-Token': API_KEY,
        'X-Unfold-Goals': 'true',
      },
    });

    if (!res.ok) {
      log.warn(`[sportsApi] API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const match = data.matches?.find(m =>
      (m.homeTeam.name === homeTeam || m.homeTeam.name.includes(homeTeam)) &&
      (m.awayTeam.name === awayTeam || m.awayTeam.name.includes(awayTeam))
    );

    if (!match) {
      log.warn(`[sportsApi] no fixture found: ${homeTeam} vs ${awayTeam}`);
      return null;
    }

    const status = match.status; // 'TIMED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED'
    let result = null;

    if (status === 'FINISHED') {
      const homeGoals = match.score.fullTime.home;
      const awayGoals = match.score.fullTime.away;
      if (homeGoals > awayGoals) result = 'home';
      else if (awayGoals > homeGoals) result = 'away';
      else result = 'draw';
    }

    const output = {
      status: status === 'FINISHED' ? 'finished' : status === 'LIVE' || status === 'IN_PLAY' ? 'live' : 'not_started',
      result,
    };

    matchCache.set(cacheKey, { data: output, time: Date.now() });
    return output;
  } catch (err) {
    log.error('[sportsApi] fetch failed:', err.message);
    return null;
  }
}

// Fallback: deterministic result if API fails
export function getFallbackResult(marketId, question) {
  const crypto = require('crypto');
  const seed = crypto.createHash('sha256').update(`${marketId}:${question}`).digest();
  const r = seed[0] % 100;
  if (r < 30) return 'draw';
  return r < 65 ? 'home' : 'away';
}
