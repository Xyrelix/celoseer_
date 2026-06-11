import { resolveAllDue } from './resolver.js';
import { indexEvents } from './indexer.js';
import { isResolverConfigured } from './market.js';
import { log } from './logger.js';

// Chain → Turso indexer. Read-only (no owner key needed), so on by default.
// Disable with INDEXER_ENABLED=false.
export function startIndexer() {
  if (process.env.INDEXER_ENABLED === 'false') return;
  const mins = Math.max(0.25, Number(process.env.INDEXER_INTERVAL_MIN) || 1);
  log.info(`event indexer on — every ${mins}m`);

  const tick = async () => {
    try { await indexEvents(); }
    catch (err) { log.error('indexer tick failed:', err.shortMessage ?? err.message); }
  };
  setTimeout(tick, 5_000);            // initial catch-up shortly after boot
  setInterval(tick, mins * 60_000);
}

// Autonomous settlement loop. Every RESOLVER_INTERVAL_MIN minutes it resolves
// any open market past its close time. Free + deterministic — no AI cost.
// Disabled unless RESOLVER_ENABLED=true and the owner signer is configured.
export function startResolver() {
  if (process.env.RESOLVER_ENABLED !== 'true') return;
  if (!isResolverConfigured()) {
    log.warn('resolver enabled but not configured (need FAUCET_PRIVATE_KEY + CONTRACT_ADDRESS)');
    return;
  }

  const mins = Math.max(1, Number(process.env.RESOLVER_INTERVAL_MIN) || 15);
  log.info(`autonomous resolver on — every ${mins}m`);

  const tick = async () => {
    try {
      const results = await resolveAllDue();
      const settled = results.filter(r => r.txHash);
      if (settled.length) {
        log.info(`resolver settled ${settled.length} market(s): ${settled.map(r => `#${r.id}=${r.outcome}`).join(', ')}`);
      }
    } catch (err) {
      log.error('resolver tick failed:', err.shortMessage ?? err.message);
    }
  };

  setTimeout(tick, 30_000);            // first pass shortly after boot
  setInterval(tick, mins * 60_000);   // then on the interval
}
