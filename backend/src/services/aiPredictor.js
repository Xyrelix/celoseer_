import Groq from 'groq-sdk';
import { TEAMS } from '../data/worldCupMatches.js';
import { log } from '../lib/logger.js';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LABEL_MAP = [
  { maxDiff: 5,  label: 'EVEN MATCH' },
  { maxDiff: 15, label: 'SLIGHT FAVOR' },
  { maxDiff: 25, label: 'LIKELY' },
  { maxDiff: 40, label: 'STRONG' },
  { maxDiff: 100, label: 'FAVORITES' },
];

function derivePredictionLabel(team1WinProb, team2WinProb) {
  const diff = Math.abs(team1WinProb - team2WinProb) * 100;
  return LABEL_MAP.find(r => diff <= r.maxDiff)?.label ?? 'FAVORITES';
}

const predictionCache = new Map();

export async function getPrediction(team1Code, team2Code, stage = 'group') {
  const cacheKey = `${team1Code}-${team2Code}-${stage}`;
  if (predictionCache.has(cacheKey)) return predictionCache.get(cacheKey);

  const team1 = TEAMS[team1Code];
  const team2 = TEAMS[team2Code];

  if (!process.env.GROQ_API_KEY) {
    return getMockPrediction(team1Code, team2Code, team1, team2);
  }

  const prompt = `You are a football analytics AI. Predict the outcome of this FIFA World Cup 2026 match.

Match: ${team1.name} (FIFA rank #${team1.fifaRank}) vs ${team2.name} (FIFA rank #${team2.fifaRank})
Stage: ${stage}
Tournament: FIFA World Cup 2026 (hosted by USA, Canada, Mexico)

Consider: FIFA rankings, recent form, historical World Cup performance, squad depth, playing style, and home continent advantage if applicable.

Respond ONLY with valid JSON, no explanation outside the JSON:
{
  "team1WinProbability": <0-1 float>,
  "drawProbability": <0-1 float>,
  "team2WinProbability": <0-1 float>,
  "confidence": <50-95 integer>,
  "analysis": "<one concise sentence explaining the key factor>",
  "keyFactor": "<one phrase like 'Recent form', 'Squad depth', 'Home advantage'>"
}

Probabilities must sum to exactly 1.0.`;

  try {
    const message = await client.chat.completions.create({
      model: 'llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.choices[0].message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const data = JSON.parse(jsonMatch[0]);
    const total = data.team1WinProbability + data.drawProbability + data.team2WinProbability;

    const result = {
      team1: { code: team1Code, name: team1.name, flag: team1.flag, winProbability: +(data.team1WinProbability / total).toFixed(3) },
      draw: { probability: +(data.drawProbability / total).toFixed(3) },
      team2: { code: team2Code, name: team2.name, flag: team2.flag, winProbability: +(data.team2WinProbability / total).toFixed(3) },
      confidence: data.confidence,
      analysis: data.analysis,
      keyFactor: data.keyFactor,
      label: derivePredictionLabel(data.team1WinProbability / total, data.team2WinProbability / total),
      generatedAt: new Date().toISOString(),
      source: 'claude',
    };

    predictionCache.set(cacheKey, result);
    return result;
  } catch (err) {
    log.error('AI prediction failed, using fallback:', err.message);
    return getMockPrediction(team1Code, team2Code, team1, team2);
  }
}

export async function getTournamentPrediction(teamCode) {
  const cacheKey = `tournament-${teamCode}`;
  if (predictionCache.has(cacheKey)) return predictionCache.get(cacheKey);

  const team = TEAMS[teamCode];
  if (!team) return null;

  if (!process.env.GROQ_API_KEY) {
    return getMockTournamentPrediction(teamCode, team);
  }

  const prompt = `You are a football analytics AI. Assess ${team.name}'s chances of winning the FIFA World Cup 2026.

${team.name} current FIFA rank: #${team.fifaRank}
Tournament: FIFA World Cup 2026 (48 teams, hosted by USA, Canada, Mexico)

Consider: recent tournament performance, squad quality, manager, current form, and the competitive landscape.

Respond ONLY with valid JSON:
{
  "winProbability": <0-1 float, realistic for a 48-team tournament>,
  "confidence": <50-90 integer>,
  "analysis": "<one concise sentence>",
  "label": "FAVORITES" | "CONTENDER" | "STRONG" | "PROBABLE" | "UNDERDOG",
  "sentiment": <50-85 integer representing % of bettors who believe YES>
}`;

  try {
    const message = await client.chat.completions.create({
      model: 'llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.choices[0].message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const data = JSON.parse(jsonMatch[0]);
    const result = {
      team: { code: teamCode, name: team.name, flag: team.flag },
      winProbability: data.winProbability,
      confidence: data.confidence,
      analysis: data.analysis,
      label: data.label,
      sentiment: data.sentiment,
      generatedAt: new Date().toISOString(),
      source: 'claude',
    };

    predictionCache.set(cacheKey, result);
    return result;
  } catch (err) {
    log.error('Tournament prediction failed:', err.message);
    return getMockTournamentPrediction(teamCode, team);
  }
}

// Rank-based fallback when API key isn't set
function getMockPrediction(team1Code, team2Code, team1, team2) {
  const rankDiff = team2.fifaRank - team1.fifaRank;
  const base = 0.33;
  const adjustment = Math.min(Math.abs(rankDiff) * 0.008, 0.25);
  const t1Win = rankDiff > 0 ? base + adjustment : base - adjustment;
  const t2Win = rankDiff < 0 ? base + adjustment : base - adjustment;
  const draw = +(1 - t1Win - t2Win).toFixed(3);

  return {
    team1: { code: team1Code, name: team1.name, flag: team1.flag, winProbability: +t1Win.toFixed(3) },
    draw: { probability: draw },
    team2: { code: team2Code, name: team2.name, flag: team2.flag, winProbability: +t2Win.toFixed(3) },
    confidence: 65,
    analysis: `${team1.name} (rank #${team1.fifaRank}) face ${team2.name} (rank #${team2.fifaRank}) in a competitive group stage clash.`,
    keyFactor: 'FIFA Rankings',
    label: derivePredictionLabel(t1Win, t2Win),
    generatedAt: new Date().toISOString(),
    source: 'mock',
  };
}

function getMockTournamentPrediction(teamCode, team) {
  const winProbs = { ARG: 0.14, FRA: 0.12, BRA: 0.11, ENG: 0.10, ESP: 0.09, POR: 0.08, GER: 0.07 };
  const labels = { ARG: 'FAVORITES', FRA: 'FAVORITES', BRA: 'FAVORITES', ENG: 'CONTENDER', ESP: 'CONTENDER' };
  const sentiments = { ARG: 78, FRA: 72, BRA: 71, ENG: 65, ESP: 69 };

  return {
    team: { code: teamCode, name: team.name, flag: team.flag },
    winProbability: winProbs[teamCode] ?? 0.04,
    confidence: 70,
    analysis: `${team.name} enter the tournament as one of the pre-tournament favourites based on recent form.`,
    label: labels[teamCode] ?? 'CONTENDER',
    sentiment: sentiments[teamCode] ?? 55,
    generatedAt: new Date().toISOString(),
    source: 'mock',
  };
}

export function clearCache() {
  predictionCache.clear();
}
