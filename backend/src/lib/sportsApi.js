import { log } from './logger.js';

// Real World Cup 2026 match results from RapidAPI Football API
// Env: RAPIDAPI_KEY (https://rapidapi.com/api-sports/api/api-football)
// Env: RAPIDAPI_HOST (usually "api-football-v3.p.rapidapi.com")

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'api-football-v3.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Cache match results (30 min TTL) to avoid hammering the API
const matchCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Fetch a match result from the sports API
// Returns: { status: 'not_started' | 'live' | 'finished', result: null | 'home' | 'away' | 'draw' }
export async function getMatchResult(homeTeam, awayTeam, matchDate) {
  if (!RAPIDAPI_KEY) {
    log.warn('[sportsApi] RAPIDAPI_KEY not set — cannot fetch real results');
    return null;
  }

  const cacheKey = `${homeTeam}-${awayTeam}-${matchDate}`;
  const cached = matchCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  try {
    // RapidAPI Football API: search for matches
    // endpoint: /fixtures?teams=X&teams=Y&date=YYYY-MM-DD
    const [h, a] = await Promise.all([
      getTeamId(homeTeam),
      getTeamId(awayTeam),
    ]);

    if (!h || !a) {
      log.warn(`[sportsApi] could not find team IDs: ${homeTeam} vs ${awayTeam}`);
      return null;
    }

    const dateObj = new Date(matchDate);
    const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    const res = await fetch(`${BASE_URL}/fixtures?teams=${h}&teams=${a}&date=${dateStr}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!res.ok) {
      log.warn(`[sportsApi] API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const fixture = data.response?.[0];
    if (!fixture) {
      log.warn(`[sportsApi] no fixture found: ${homeTeam} vs ${awayTeam}`);
      return null;
    }

    const status = fixture.fixture.status.short; // 'NS' | 'TBD' | 'LIVE' | 'FT' | 'AET' | 'PEN' | 'PST'
    let result = null;

    if (['FT', 'AET', 'PEN'].includes(status)) {
      const homeGoals = fixture.goals.home;
      const awayGoals = fixture.goals.away;
      if (homeGoals > awayGoals) result = 'home';
      else if (awayGoals > homeGoals) result = 'away';
      else result = 'draw';
    }

    const output = {
      status: status === 'FT' || status === 'AET' || status === 'PEN' ? 'finished' : status === 'LIVE' ? 'live' : 'not_started',
      result,
    };

    // Cache for 30 min
    matchCache.set(cacheKey, { data: output, time: Date.now() });
    return output;
  } catch (err) {
    log.error('[sportsApi] fetch failed:', err.message);
    return null;
  }
}

// Get team ID from RapidAPI by name (cached)
const teamCache = new Map();
async function getTeamId(teamName) {
  if (teamCache.has(teamName)) return teamCache.get(teamName);

  try {
    const res = await fetch(`${BASE_URL}/teams?search=${encodeURIComponent(teamName)}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    const data = await res.json();
    const team = data.response?.[0];
    if (!team) return null;

    const id = team.team.id;
    teamCache.set(teamName, id);
    return id;
  } catch {
    return null;
  }
}

// Fallback: deterministic hash-based result if API fails or key not set
export function getFallbackResult(marketId, question) {
  const crypto = require('crypto');
  const seed = crypto.createHash('sha256').update(`${marketId}:${question}`).digest();
  const r = seed[0] % 100;

  // Slight draw bias for group matches
  if (question.includes('Group') || question.includes('vs')) {
    if (r < 30) return 'draw';
    return r < 65 ? 'home' : 'away';
  }

  return r < 50 ? 'home' : 'away';
}
