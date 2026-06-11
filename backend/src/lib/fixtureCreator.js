import { FIXTURES, fixtureToMarketTitle } from '../data/fixtures.js';
import { publicClient, walletClient, CONTRACT_ADDRESS, MARKET_ABI } from './market.js';
import { log } from './logger.js';

// Autonomous: create markets for all World Cup 2026 fixtures (hardcoded for now).
// Once tournament starts, resolver fetches LIVE results from football-data.org API.
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
