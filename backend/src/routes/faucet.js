import { Router } from 'express';
import { isAddress } from 'viem';
import { sendWelcome, sendClaim, isFaucetConfigured } from '../lib/faucet.js';
import { log } from '../lib/logger.js';

const router = Router();

const CLAIM_AMOUNT = '500';        // cUSD per manual faucet claim
const CLAIM_COOLDOWN_MS = 60_000;  // per-address cooldown for the faucet page
const lastClaim = new Map();       // address -> timestamp

function validAddress(req, res) {
  const address = req.body?.address;
  if (!address || !isAddress(address)) {
    res.status(400).json({ error: 'Valid `address` required' });
    return null;
  }
  return address;
}

// One-time signup deposit — called automatically on first login.
router.post('/welcome', async (req, res) => {
  if (!isFaucetConfigured()) return res.status(503).json({ error: 'Faucet not configured' });
  const address = validAddress(req, res);
  if (!address) return;
  try {
    const result = await sendWelcome(address);
    res.json({ ok: true, amount: '500', ...result });
  } catch (err) {
    log.error('welcome failed:', err.shortMessage ?? err.message);
    res.status(500).json({ error: err.shortMessage ?? err.message });
  }
});

// Manual faucet-page claim — fixed amount with a short cooldown.
router.post('/claim', async (req, res) => {
  if (!isFaucetConfigured()) return res.status(503).json({ error: 'Faucet not configured' });
  const address = validAddress(req, res);
  if (!address) return;

  const last = lastClaim.get(address.toLowerCase()) ?? 0;
  const wait = CLAIM_COOLDOWN_MS - (Date.now() - last);
  if (wait > 0) {
    return res.status(429).json({ error: `Please wait ${Math.ceil(wait / 1000)}s before claiming again` });
  }

  try {
    lastClaim.set(address.toLowerCase(), Date.now());
    const result = await sendClaim(address, CLAIM_AMOUNT);
    res.json({ ok: true, amount: CLAIM_AMOUNT, ...result });
  } catch (err) {
    lastClaim.delete(address.toLowerCase()); // failed — let them retry
    log.error('claim failed:', err.shortMessage ?? err.message);
    res.status(500).json({ error: err.shortMessage ?? err.message });
  }
});

export default router;
