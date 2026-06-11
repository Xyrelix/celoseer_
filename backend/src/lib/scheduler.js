import { resolveAllDue } from './resolver.js';
import { isResolverConfigured } from './market.js';
import { log } from './logger.js';

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
