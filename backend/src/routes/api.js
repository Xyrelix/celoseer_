import { Router } from 'express';
import marketsRouter from './markets.js';
import betsRouter from './bets.js';
import predictionsRouter from './predictions.js';
import faucetRouter from './faucet.js';
import { db, initDb } from '../lib/db.js';

const router = Router();

router.use('/markets', marketsRouter);
router.use('/bets', betsRouter);
router.use('/predictions', predictionsRouter);
router.use('/faucet', faucetRouter);

// Health check — also reports which DB driver is actually in use + a live ping,
// so deployment config (Turso vs ephemeral file) can be verified from the browser.
router.get('/health', async (req, res) => {
  const driver = process.env.TURSO_DATABASE_URL ? 'turso' : 'file';
  const dbStatus = { driver, hasUrl: !!process.env.TURSO_DATABASE_URL, hasToken: !!process.env.TURSO_AUTH_TOKEN };
  try {
    await initDb();
    const { rows } = await db.execute('SELECT count(*) AS n FROM bets');
    dbStatus.ok = true;
    dbStatus.bets = Number(rows[0].n);
  } catch (err) {
    dbStatus.ok = false;
    dbStatus.error = err.message;
  }
  res.json({ status: 'ok', db: dbStatus, timestamp: new Date().toISOString() });
});

export default router;
