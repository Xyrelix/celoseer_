import { getPrediction, getTournamentPrediction } from '../services/aiPredictor.js';
import { TEAMS } from '../data/worldCupMatches.js';
import { log } from '../lib/logger.js';

export async function getMatchPrediction(req, res) {
  try {
    const { team1, team2 } = req.params;
    const { stage } = req.query;

    if (!TEAMS[team1] || !TEAMS[team2]) {
      return res.status(400).json({ error: 'Invalid team code. Use FIFA 3-letter codes (e.g. ARG, FRA)' });
    }

    const prediction = await getPrediction(team1, team2, stage ?? 'group');
    res.json(prediction);
  } catch (err) {
    log.error('getMatchPrediction error:', err);
    res.status(500).json({ error: 'Prediction failed' });
  }
}

export async function getTeamTournamentPrediction(req, res) {
  try {
    const { team } = req.params;

    if (!TEAMS[team]) {
      return res.status(400).json({ error: 'Invalid team code' });
    }

    const prediction = await getTournamentPrediction(team);
    res.json(prediction);
  } catch (err) {
    log.error('getTeamTournamentPrediction error:', err);
    res.status(500).json({ error: 'Prediction failed' });
  }
}

export function listTeams(req, res) {
  const teams = Object.entries(TEAMS).map(([code, data]) => ({ code, ...data }));
  res.json({ teams });
}
