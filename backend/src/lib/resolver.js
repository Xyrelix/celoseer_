import { createHash } from 'node:crypto';
import { log } from './logger.js';
import {
  publicClient, walletClient, isResolverConfigured,
  CONTRACT_ADDRESS, MARKET_ABI, STATUS, OUTCOME,
} from './market.js';

// Free, deterministic settlement — no AI/API cost. The outcome is a stable
// pseudo-random pick seeded by the market (reproducible, never re-rolls).
// Slight YES lean; small draw chance for matches that allow it. Swap this for
// a real sports-data feed when you want true results.
function decideOutcome(id, question, hasDraw) {
  const seed = createHash('sha256').update(`${id}:${question}`).digest();
  const r = seed[0] % 100;
  if (hasDraw && r < 18) return 'draw';
  return r < 58 ? 'yes' : 'no';
}

async function readMarket(id) {
  const r = await publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: MARKET_ABI, functionName: 'getMarket', args: [BigInt(id)],
  });
  return { question: r[0], closeTime: Number(r[1]), status: Number(r[2]), result: Number(r[3]), hasDraw: r[4] };
}

/** Resolve a single market on-chain (free deterministic outcome). */
export async function resolveOne(id, { force = false } = {}) {
  if (!isResolverConfigured()) throw new Error('Resolver not configured (FAUCET_PRIVATE_KEY / CONTRACT_ADDRESS)');

  const m = await readMarket(id);
  if (m.status !== STATUS.OPEN) return { id, skipped: true, reason: `not open (status ${m.status})` };
  if (!force && m.closeTime * 1000 > Date.now()) return { id, skipped: true, reason: 'not yet closed' };

  const outcome = decideOutcome(id, m.question, m.hasDraw);

  const txHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS, abi: MARKET_ABI, functionName: 'resolveMarket',
    args: [BigInt(id), OUTCOME[outcome]],
  });
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  log.info(`resolved market ${id} → ${outcome.toUpperCase()}  ${txHash}`);
  return { id, question: m.question, outcome, txHash };
}

/** Resolve every open market past its close time. */
export async function resolveAllDue({ force = false } = {}) {
  if (!isResolverConfigured()) throw new Error('Resolver not configured');

  const count = Number(await publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: MARKET_ABI, functionName: 'marketCount',
  }));

  const results = [];
  for (let id = 1; id <= count; id++) {
    try {
      results.push(await resolveOne(id, { force }));
    } catch (err) {
      log.error(`resolve market ${id} failed:`, err.shortMessage ?? err.message);
      results.push({ id, error: err.shortMessage ?? err.message });
    }
  }
  return results;
}
