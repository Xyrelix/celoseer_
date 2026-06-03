// FIFA World Cup 2026 — 48 teams, 16 groups of 3
// Host nations: USA, Canada, Mexico

export const TEAMS = {
  ARG: { name: 'Argentina',    flag: 'https://flagcdn.com/ar.svg', fifaRank: 1 },
  FRA: { name: 'France',       flag: 'https://flagcdn.com/fr.svg', fifaRank: 2 },
  ENG: { name: 'England',      flag: 'https://flagcdn.com/gb-eng.svg', fifaRank: 4 },
  BRA: { name: 'Brazil',       flag: 'https://flagcdn.com/br.svg', fifaRank: 5 },
  POR: { name: 'Portugal',     flag: 'https://flagcdn.com/pt.svg', fifaRank: 6 },
  BEL: { name: 'Belgium',      flag: 'https://flagcdn.com/be.svg', fifaRank: 3 },
  ESP: { name: 'Spain',        flag: 'https://flagcdn.com/es.svg', fifaRank: 8 },
  GER: { name: 'Germany',      flag: 'https://flagcdn.com/de.svg', fifaRank: 16 },
  NED: { name: 'Netherlands',  flag: 'https://flagcdn.com/nl.svg', fifaRank: 7 },
  USA: { name: 'USA',          flag: 'https://flagcdn.com/us.svg', fifaRank: 13 },
  CRO: { name: 'Croatia',      flag: 'https://flagcdn.com/hr.svg', fifaRank: 10 },
  MAR: { name: 'Morocco',      flag: 'https://flagcdn.com/ma.svg', fifaRank: 14 },
  MEX: { name: 'Mexico',       flag: 'https://flagcdn.com/mx.svg', fifaRank: 15 },
  COL: { name: 'Colombia',     flag: 'https://flagcdn.com/co.svg', fifaRank: 9 },
  URU: { name: 'Uruguay',      flag: 'https://flagcdn.com/uy.svg', fifaRank: 17 },
  SEN: { name: 'Senegal',      flag: 'https://flagcdn.com/sn.svg', fifaRank: 20 },
  JPN: { name: 'Japan',        flag: 'https://flagcdn.com/jp.svg', fifaRank: 18 },
  KOR: { name: 'South Korea',  flag: 'https://flagcdn.com/kr.svg', fifaRank: 22 },
  CAN: { name: 'Canada',       flag: 'https://flagcdn.com/ca.svg', fifaRank: 44 },
  AUS: { name: 'Australia',    flag: 'https://flagcdn.com/au.svg', fifaRank: 24 },
};

export const GROUP_MATCHES = [
  // Group A
  { id: 'gA1', team1: 'ARG', team2: 'CAN', group: 'A', stage: 'group', date: '2026-06-11', venue: 'MetLife Stadium, New York' },
  { id: 'gA2', team1: 'POR', team2: 'ARG', group: 'A', stage: 'group', date: '2026-06-15', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gA3', team1: 'CAN', team2: 'POR', group: 'A', stage: 'group', date: '2026-06-19', venue: 'BC Place, Vancouver' },

  // Group B
  { id: 'gB1', team1: 'FRA', team2: 'MEX', group: 'B', stage: 'group', date: '2026-06-12', venue: 'AT&T Stadium, Dallas' },
  { id: 'gB2', team1: 'MEX', team2: 'GER', group: 'B', stage: 'group', date: '2026-06-16', venue: 'Estadio Azteca, Mexico City' },
  { id: 'gB3', team1: 'GER', team2: 'FRA', group: 'B', stage: 'group', date: '2026-06-20', venue: 'Levi\'s Stadium, San Francisco' },

  // Group C
  { id: 'gC1', team1: 'BRA', team2: 'MAR', group: 'C', stage: 'group', date: '2026-06-12', venue: 'Hard Rock Stadium, Miami' },
  { id: 'gC2', team1: 'MAR', team2: 'COL', group: 'C', stage: 'group', date: '2026-06-16', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gC3', team1: 'COL', team2: 'BRA', group: 'C', stage: 'group', date: '2026-06-20', venue: 'Lincoln Financial Field, Philadelphia' },

  // Group D
  { id: 'gD1', team1: 'ENG', team2: 'USA', group: 'D', stage: 'group', date: '2026-06-13', venue: 'MetLife Stadium, New York' },
  { id: 'gD2', team1: 'USA', team2: 'NED', group: 'D', stage: 'group', date: '2026-06-17', venue: 'Rose Bowl, Los Angeles' },
  { id: 'gD3', team1: 'NED', team2: 'ENG', group: 'D', stage: 'group', date: '2026-06-21', venue: 'Gillette Stadium, Boston' },

  // Group E
  { id: 'gE1', team1: 'ESP', team2: 'JPN', group: 'E', stage: 'group', date: '2026-06-13', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gE2', team1: 'JPN', team2: 'URU', group: 'E', stage: 'group', date: '2026-06-17', venue: 'NRG Stadium, Houston' },
  { id: 'gE3', team1: 'URU', team2: 'ESP', group: 'E', stage: 'group', date: '2026-06-21', venue: 'Estadio Guadalajara, Mexico' },

  // Group F
  { id: 'gF1', team1: 'BEL', team2: 'SEN', group: 'F', stage: 'group', date: '2026-06-14', venue: 'Camping World Stadium, Orlando' },
  { id: 'gF2', team1: 'SEN', team2: 'CRO', group: 'F', stage: 'group', date: '2026-06-18', venue: 'Estadio Monterrey, Mexico' },
  { id: 'gF3', team1: 'CRO', team2: 'BEL', group: 'F', stage: 'group', date: '2026-06-22', venue: 'Q2 Stadium, Austin' },
];

export const TOURNAMENT_MARKETS = [
  { id: 'tm1', type: 'tournament_winner', question: 'Argentina to Win World Cup 2026?', team: 'ARG', category: 'knockout' },
  { id: 'tm2', type: 'tournament_winner', question: 'France to Win World Cup 2026?',    team: 'FRA', category: 'knockout' },
  { id: 'tm3', type: 'tournament_winner', question: 'England to Win World Cup 2026?',   team: 'ENG', category: 'knockout' },
  { id: 'tm4', type: 'tournament_winner', question: 'Brazil to Win World Cup 2026?',    team: 'BRA', category: 'knockout' },
  { id: 'tm5', type: 'tournament_winner', question: 'Spain to Win World Cup 2026?',     team: 'ESP', category: 'knockout' },
  { id: 'tm6', type: 'stage_advance',     question: 'USA to Reach Semi-Finals?',        team: 'USA', category: 'stage' },
  { id: 'tm7', type: 'stage_advance',     question: 'Morocco to Reach Quarter-Finals?', team: 'MAR', category: 'stage' },
  { id: 'tm8', type: 'prop',              question: 'Final Match Over 2.5 Goals?',      team: null,  category: 'prop' },
];
