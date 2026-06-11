import { getMatchResult, getFallbackResult } from './sportsApi.js';
import { log } from './logger.js';
import {
  publicClient, walletClient, isResolverConfigured,
  CONTRACT_ADDRESS, MARKET_ABI, STATUS, OUTCOME,
} from './market.js';

// Resolve markets using real World Cup 2026 results from sports API (RapidAPI).
// Falls back to deterministic hash if API unavailable.
async function decideOutcome(id, question, hasDraw) {
  // Extract team names from question (e.g., "Argentina vs France (GROUP)" → Argentina, France)
  const match = question.match(/^(.+?)\s+vs\s+(.+?)\s*\(/);
  if (!match) {
    // Fallback if can't parse question
    return getFallbackResult(id, question);
  }

  const [, homeTeam, awayTeam] = match;

  // Try real sports API first
  const result = await getMatchResult(homeTeam.trim(), awayTeam.trim(), new Date().toISOString().split('T')[0]);

  if (result && result.result) {
    // Convert API result (home/away/draw) to market outcome (yes/no/draw)
    // Assumption: "yes" = home team wins, "no" = away team wins, "draw" = draw
    // (This depends on how your market questions are phrased)
    if (result.result === 'draw' && hasDraw) return 'draw';
    if (result.result === 'home') return 'yes';
    if (result.result === 'away') return 'no';
  }

  if (result && result.status !== 'finished') {
    // Match not yet played
    return null;
  }

  // API failed or match data unavailable → fall back to deterministic
  log.warn(`[resolver] using fallback for market ${id}: ${question}`);
  const fallback = getFallbackResult(id, question);
  return fallback;
}

async function readMarket(id) {
  const r = await publicClient.readContract({
    address: CONTRACT_ADDRESS, abi: MARKET_ABI, functionName: 'getMarket', args: [BigInt(id)],
  });
  return { question: r[0], closeTime: Number(r[1]), status: Number(r[2]), result: Number(r[3]), hasDraw: r[4] };
}

/** Resolve a single market on-chain (real results from sports API). */
export async function resolveOne(id, { force = false } = {}) {
  if (!isResolverConfigured()) throw new Error('Resolver not configured (FAUCET_PRIVATE_KEY / CONTRACT_ADDRESS)');

  const m = await readMarket(id);
  if (m.status !== STATUS.OPEN) return { id, skipped: true, reason: `not open (status ${m.status})` };
  if (!force && m.closeTime * 1000 > Date.now()) return { id, skipped: true, reason: 'not yet closed' };

  const outcome = await decideOutcome(id, m.question, m.hasDraw);
  if (!outcome) return { id, skipped: true, reason: 'match not yet finished' };

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
