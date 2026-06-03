import { Router } from 'express';
import { placeBet, getUserBets } from '../controllers/betsController.js';

const router = Router();

router.post('/', placeBet);
router.get('/me', getUserBets);
router.get('/user/:address', getUserBets);

export default router;
