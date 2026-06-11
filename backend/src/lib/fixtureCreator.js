import { FIXTURES, fixtureToMarketTitle } from '../data/fixtures.js';
import { publicClient, walletClient, CONTRACT_ADDRESS, MARKET_ABI } from './market.js';
import { log } from './logger.js';

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Find World Cup 2026 competition ID by searching all competitions
async function findWorldCupId() {
  if (!API_KEY) return null;

  try {
    const res = await fetch(`${BASE_URL}/competitions`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const wc2026 = data.competitions?.find(c =>
      c.name?.includes('World Cup') && c.name?.includes('2026')
    );

    if (wc2026) {
      log.info(`[fixtureCreator] found World Cup 2026 with ID: ${wc2026.id}`);
      return wc2026.id;
    }
  } catch (err) {
    log.warn('[fixtureCreator] could not find World Cup ID:', err.message);
  }

  return null;
}

// Autonomous: create markets for all World Cup 2026 fixtures.
// Uses hardcoded fixtures if API unavailable, otherwise syncs from API.
// Idempotent — only creates if market doesn't exist.

export async function createFixtures() {
  if (!walletClient || !publicClient || !CONTRACT_ADDRESS) {
    log.warn('[fixtureCreator] not configured (missing key/address)');
    return { created: 0, skipped: 0 };
  }

  log.info(`[fixtureCreator] creating ${FIXTURES.length} World Cup 2026 markets...`);

  let created = 0;
  for (let i = 0; i < FIXTURES.length; i++) {
    const fixture = FIXTURES[i];
    try {
      const question = fixtureToMarketTitle(fixture);
      const closeTime = Math.floor(new Date(fixture.date).getTime() / 1000);
      const hasDraw = fixture.stage === 'group';

      log.info(`[fixtureCreator] creating market ${i + 1}/${FIXTURES.length}: ${question.slice(0, 50)}...`);

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

      if (i < FIXTURES.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      if (err.message?.includes('already exists')) {
        log.info(`[fixtureCreator] market ${i + 1} already exists (skipping)`);
      } else {
        log.warn(`[fixtureCreator] market ${i + 1} error: ${err.shortMessage || err.message}`);
      }
    }
  }

  log.info(`[fixtureCreator] finished: created ${created}/${FIXTURES.length} new markets`);
  return { created, skipped: FIXTURES.length - created };
}
