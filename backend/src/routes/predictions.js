import { Router } from 'express';
import { getMatchPrediction, getTeamTournamentPrediction, listTeams } from '../controllers/predictionsController.js';

const router = Router();

router.get('/teams', listTeams);
router.get('/match/:team1/:team2', getMatchPrediction);
router.get('/tournament/:team', getTeamTournamentPrediction);

export default router;
