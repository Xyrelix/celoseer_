import { Router } from 'express';
import { listMarkets, getMarket } from '../controllers/marketsController.js';

const router = Router();

router.get('/', listMarkets);
router.get('/:id', getMarket);

export default router;
