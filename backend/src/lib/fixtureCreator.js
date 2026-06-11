import { publicClient, walletClient, CONTRACT_ADDRESS, MARKET_ABI } from './market.js';
import { log } from './logger.js';

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';
const WORLD_CUP_ID = 740; // World Cup 2026

// Fetch all World Cup 2026 matches from football-data.org API
async function fetchWorldCupMatches() {
  if (!API_KEY) {
    log.warn('[fixtureCreator] FOOTBALL_DATA_API_KEY not set — cannot fetch fixtures');
    return [];
  }

  try {
    const res = await fetch(`${BASE_URL}/competitions/${WORLD_CUP_ID}/matches`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    if (!res.ok) {
      log.error(`[fixtureCreator] API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.matches || [];
  } catch (err) {
    log.error('[fixtureCreator] fetch failed:', err.message);
    return [];
  }
}

// Convert API match to market question
function matchToQuestion(match) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const stage = match.stage || 'GROUP';
  return `${home} vs ${away} (${stage})`;
}

// Autonomous: fetch live fixtures from API, create markets for new ones
export async function createFixtures() {
  if (!walletClient || !publicClient || !CONTRACT_ADDRESS) {
    log.warn('[fixtureCreator] not configured (missing key/address)');
    return { created: 0, skipped: 0 };
  }

  log.info('[fixtureCreator] fetching World Cup 2026 matches from football-data.org...');
  const apiMatches = await fetchWorldCupMatches();

  if (apiMatches.length === 0) {
    log.warn('[fixtureCreator] no matches fetched from API');
    return { created: 0, skipped: 0 };
  }

  log.info(`[fixtureCreator] found ${apiMatches.length} matches, creating markets...`);

  let created = 0;
  for (let i = 0; i < apiMatches.length; i++) {
    const match = apiMatches[i];
    try {
      const question = matchToQuestion(match);
      const closeTime = Math.floor(new Date(match.utcDate).getTime() / 1000);
      const hasDraw = match.stage?.toLowerCase().includes('group') !== false; // group matches allow draws

      log.info(`[fixtureCreator] creating market ${i + 1}/${apiMatches.length}: ${question.slice(0, 50)}...`);

      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'createMarket',
        args: [question, BigInt(closeTime), hasDraw],
      });

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        timeout: 90_000,
        pollingInterval: 2_000,
      });
      created++;

      if (i < apiMatches.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      // Likely "market already exists" — that's fine
      if (err.message?.includes('already exists') || err.message?.includes('CREATE_MARKET_ALREADY_EXISTS')) {
        log.info(`[fixtureCreator] market ${i + 1} already exists (skipping)`);
      } else {
        log.warn(`[fixtureCreator] market ${i + 1} error: ${err.shortMessage || err.message}`);
      }
    }
  }

  log.info(`[fixtureCreator] finished: created ${created}/${apiMatches.length} new markets`);
  return { created, skipped: apiMatches.length - created };
}
