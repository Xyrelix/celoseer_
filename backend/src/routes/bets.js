import { Router } from 'express';
import { getUserBets } from '../controllers/betsController.js';

const router = Router();

// Bets are recorded on-chain and indexed into Turso; these are read-only.
router.get('/me', getUserBets);
router.get('/user/:address', getUserBets);

export default router;
