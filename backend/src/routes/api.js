import { Router } from 'express';
import marketsRouter from './markets.js';
import betsRouter from './bets.js';
import predictionsRouter from './predictions.js';
import faucetRouter from './faucet.js';

const router = Router();

router.use('/markets', marketsRouter);
router.use('/bets', betsRouter);
router.use('/predictions', predictionsRouter);
router.use('/faucet', faucetRouter);

// Health check
router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default router;
