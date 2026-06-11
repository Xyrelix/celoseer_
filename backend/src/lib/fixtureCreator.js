import { FIXTURES, fixtureToMarketTitle } from '../data/fixtures.js';
import { publicClient, walletClient, CONTRACT_ADDRESS, MARKET_ABI } from './market.js';
import { log } from './logger.js';

// Autonomous agent: create on-chain markets for all World Cup 2026 fixtures.
// Idempotent — only creates if marketCount < expected total.
// Expected: 26 initial (from CreateMarkets.s.sol) + FIXTURES.length = 26 + ~87 = ~113 total.

const INITIAL_MARKET_COUNT = 26; // from CreateMarkets.s.sol
const EXPECTED_TOTAL = INITIAL_MARKET_COUNT + FIXTURES.length;

export async function createFixtures() {
  if (!walletClient || !publicClient || !CONTRACT_ADDRESS) {
    log.warn('[fixtureCreator] not configured (missing key/address)');
    return { created: 0, skipped: 0 };
  }

  const currentCount = Number(await publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: MARKET_ABI, functionName: 'marketCount',
  }));

  if (currentCount >= EXPECTED_TOTAL) {
    log.info(`[fixtureCreator] ${currentCount} markets exist; all fixtures already created`);
    return { created: 0, skipped: FIXTURES.length };
  }

  log.info(`[fixtureCreator] creating ${FIXTURES.length} fixture markets (from #${currentCount})`);

  let created = 0;
  for (const fixture of FIXTURES) {
    try {
      const question = fixtureToMarketTitle(fixture);
      const closeTime = Math.floor(new Date(fixture.date).getTime() / 1000);
      const hasDraw = fixture.stage === 'group'; // only group matches can draw

      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'createMarket',
        args: [question, BigInt(closeTime), hasDraw],
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      created++;

      if (created % 10 === 0) {
        log.info(`[fixtureCreator] ${created}/${FIXTURES.length} created...`);
      }
    } catch (err) {
      log.error(`[fixtureCreator] failed to create fixture: ${err.shortMessage || err.message}`);
      // Continue trying the rest
    }
  }

  log.info(`[fixtureCreator] finished: created ${created}/${FIXTURES.length} fixtures`);
  return { created, skipped: FIXTURES.length - created };
}
