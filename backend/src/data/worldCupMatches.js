// FIFA World Cup 2026 — 48 teams, 12 groups of 4
// Host nations: USA, Canada, Mexico
// Official draw: December 5, 2025, Kennedy Center, Washington D.C.

export const TEAMS = {
  // Group A
  MEX: { name: 'Mexico',               flag: 'https://flagcdn.com/mx.svg',     fifaRank: 15 },
  RSA: { name: 'South Africa',         flag: 'https://flagcdn.com/za.svg',     fifaRank: 64 },
  KOR: { name: 'South Korea',          flag: 'https://flagcdn.com/kr.svg',     fifaRank: 22 },
  CZE: { name: 'Czechia',              flag: 'https://flagcdn.com/cz.svg',     fifaRank: 37 },
  // Group B
  CAN: { name: 'Canada',               flag: 'https://flagcdn.com/ca.svg',     fifaRank: 44 },
  BIH: { name: 'Bosnia & Herzegovina', flag: 'https://flagcdn.com/ba.svg',     fifaRank: 67 },
  QAT: { name: 'Qatar',                flag: 'https://flagcdn.com/qa.svg',     fifaRank: 58 },
  SUI: { name: 'Switzerland',          flag: 'https://flagcdn.com/ch.svg',     fifaRank: 19 },
  // Group C
  BRA: { name: 'Brazil',               flag: 'https://flagcdn.com/br.svg',     fifaRank: 5  },
  MAR: { name: 'Morocco',              flag: 'https://flagcdn.com/ma.svg',     fifaRank: 14 },
  HTI: { name: 'Haiti',                flag: 'https://flagcdn.com/ht.svg',     fifaRank: 92 },
  SCO: { name: 'Scotland',             flag: 'https://flagcdn.com/gb-sct.svg', fifaRank: 39 },
  // Group D
  USA: { name: 'USA',                  flag: 'https://flagcdn.com/us.svg',     fifaRank: 13 },
  PAR: { name: 'Paraguay',             flag: 'https://flagcdn.com/py.svg',     fifaRank: 63 },
  AUS: { name: 'Australia',            flag: 'https://flagcdn.com/au.svg',     fifaRank: 24 },
  TUR: { name: 'Türkiye',              flag: 'https://flagcdn.com/tr.svg',     fifaRank: 29 },
  // Group E
  GER: { name: 'Germany',              flag: 'https://flagcdn.com/de.svg',     fifaRank: 16 },
  CUR: { name: 'Curaçao',              flag: 'https://flagcdn.com/cw.svg',     fifaRank: 88 },
  CIV: { name: 'Ivory Coast',          flag: 'https://flagcdn.com/ci.svg',     fifaRank: 23 },
  ECU: { name: 'Ecuador',              flag: 'https://flagcdn.com/ec.svg',     fifaRank: 28 },
  // Group F
  NED: { name: 'Netherlands',          flag: 'https://flagcdn.com/nl.svg',     fifaRank: 7  },
  JPN: { name: 'Japan',                flag: 'https://flagcdn.com/jp.svg',     fifaRank: 18 },
  SWE: { name: 'Sweden',               flag: 'https://flagcdn.com/se.svg',     fifaRank: 25 },
  TUN: { name: 'Tunisia',              flag: 'https://flagcdn.com/tn.svg',     fifaRank: 30 },
  // Group G
  BEL: { name: 'Belgium',              flag: 'https://flagcdn.com/be.svg',     fifaRank: 3  },
  EGY: { name: 'Egypt',                flag: 'https://flagcdn.com/eg.svg',     fifaRank: 34 },
  IRN: { name: 'Iran',                 flag: 'https://flagcdn.com/ir.svg',     fifaRank: 21 },
  NZL: { name: 'New Zealand',          flag: 'https://flagcdn.com/nz.svg',     fifaRank: 97 },
  // Group H
  ESP: { name: 'Spain',                flag: 'https://flagcdn.com/es.svg',     fifaRank: 8  },
  CPV: { name: 'Cape Verde',           flag: 'https://flagcdn.com/cv.svg',     fifaRank: 71 },
  KSA: { name: 'Saudi Arabia',         flag: 'https://flagcdn.com/sa.svg',     fifaRank: 56 },
  URU: { name: 'Uruguay',              flag: 'https://flagcdn.com/uy.svg',     fifaRank: 17 },
  // Group I
  FRA: { name: 'France',               flag: 'https://flagcdn.com/fr.svg',     fifaRank: 2  },
  SEN: { name: 'Senegal',              flag: 'https://flagcdn.com/sn.svg',     fifaRank: 20 },
  IRQ: { name: 'Iraq',                 flag: 'https://flagcdn.com/iq.svg',     fifaRank: 55 },
  NOR: { name: 'Norway',               flag: 'https://flagcdn.com/no.svg',     fifaRank: 48 },
  // Group J
  ARG: { name: 'Argentina',            flag: 'https://flagcdn.com/ar.svg',     fifaRank: 1  },
  ALG: { name: 'Algeria',              flag: 'https://flagcdn.com/dz.svg',     fifaRank: 35 },
  AUT: { name: 'Austria',              flag: 'https://flagcdn.com/at.svg',     fifaRank: 27 },
  JOR: { name: 'Jordan',               flag: 'https://flagcdn.com/jo.svg',     fifaRank: 73 },
  // Group K
  POR: { name: 'Portugal',             flag: 'https://flagcdn.com/pt.svg',     fifaRank: 6  },
  COD: { name: 'DR Congo',             flag: 'https://flagcdn.com/cd.svg',     fifaRank: 61 },
  UZB: { name: 'Uzbekistan',           flag: 'https://flagcdn.com/uz.svg',     fifaRank: 75 },
  COL: { name: 'Colombia',             flag: 'https://flagcdn.com/co.svg',     fifaRank: 9  },
  // Group L
  ENG: { name: 'England',              flag: 'https://flagcdn.com/gb-eng.svg', fifaRank: 4  },
  CRO: { name: 'Croatia',              flag: 'https://flagcdn.com/hr.svg',     fifaRank: 10 },
  GHA: { name: 'Ghana',                flag: 'https://flagcdn.com/gh.svg',     fifaRank: 60 },
  PAN: { name: 'Panama',               flag: 'https://flagcdn.com/pa.svg',     fifaRank: 43 },
};

export const GROUP_MATCHES = [
  // ── Group A ────────────────────────────────────────────────────────────────
  { id: 'gA1', team1: 'MEX', team2: 'RSA', group: 'A', stage: 'group', date: '2026-06-11', venue: 'Estadio Azteca, Mexico City' },
  { id: 'gA2', team1: 'KOR', team2: 'CZE', group: 'A', stage: 'group', date: '2026-06-11', venue: 'Estadio Akron, Guadalajara' },
  { id: 'gA3', team1: 'CZE', team2: 'RSA', group: 'A', stage: 'group', date: '2026-06-18', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gA4', team1: 'MEX', team2: 'KOR', group: 'A', stage: 'group', date: '2026-06-18', venue: 'Estadio Akron, Guadalajara' },
  { id: 'gA5', team1: 'CZE', team2: 'MEX', group: 'A', stage: 'group', date: '2026-06-24', venue: 'Estadio Azteca, Mexico City' },
  { id: 'gA6', team1: 'RSA', team2: 'KOR', group: 'A', stage: 'group', date: '2026-06-24', venue: 'Estadio BBVA, Monterrey' },

  // ── Group B ────────────────────────────────────────────────────────────────
  { id: 'gB1', team1: 'CAN', team2: 'BIH', group: 'B', stage: 'group', date: '2026-06-12', venue: 'BMO Field, Toronto' },
  { id: 'gB2', team1: 'QAT', team2: 'SUI', group: 'B', stage: 'group', date: '2026-06-13', venue: "Levi's Stadium, San Francisco" },
  { id: 'gB3', team1: 'SUI', team2: 'BIH', group: 'B', stage: 'group', date: '2026-06-18', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gB4', team1: 'CAN', team2: 'QAT', group: 'B', stage: 'group', date: '2026-06-18', venue: 'BC Place, Vancouver' },
  { id: 'gB5', team1: 'SUI', team2: 'CAN', group: 'B', stage: 'group', date: '2026-06-24', venue: 'BC Place, Vancouver' },
  { id: 'gB6', team1: 'BIH', team2: 'QAT', group: 'B', stage: 'group', date: '2026-06-24', venue: 'Lumen Field, Seattle' },

  // ── Group C ────────────────────────────────────────────────────────────────
  { id: 'gC1', team1: 'BRA', team2: 'MAR', group: 'C', stage: 'group', date: '2026-06-13', venue: 'MetLife Stadium, New Jersey' },
  { id: 'gC2', team1: 'HTI', team2: 'SCO', group: 'C', stage: 'group', date: '2026-06-13', venue: 'Gillette Stadium, Boston' },
  { id: 'gC3', team1: 'SCO', team2: 'MAR', group: 'C', stage: 'group', date: '2026-06-19', venue: 'Gillette Stadium, Boston' },
  { id: 'gC4', team1: 'BRA', team2: 'HTI', group: 'C', stage: 'group', date: '2026-06-19', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gC5', team1: 'SCO', team2: 'BRA', group: 'C', stage: 'group', date: '2026-06-24', venue: 'Hard Rock Stadium, Miami' },
  { id: 'gC6', team1: 'MAR', team2: 'HTI', group: 'C', stage: 'group', date: '2026-06-24', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ── Group D ────────────────────────────────────────────────────────────────
  { id: 'gD1', team1: 'USA', team2: 'PAR', group: 'D', stage: 'group', date: '2026-06-12', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gD2', team1: 'AUS', team2: 'TUR', group: 'D', stage: 'group', date: '2026-06-13', venue: 'BC Place, Vancouver' },
  { id: 'gD3', team1: 'USA', team2: 'AUS', group: 'D', stage: 'group', date: '2026-06-19', venue: 'Lumen Field, Seattle' },
  { id: 'gD4', team1: 'TUR', team2: 'PAR', group: 'D', stage: 'group', date: '2026-06-19', venue: "Levi's Stadium, San Francisco" },
  { id: 'gD5', team1: 'TUR', team2: 'USA', group: 'D', stage: 'group', date: '2026-06-25', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gD6', team1: 'PAR', team2: 'AUS', group: 'D', stage: 'group', date: '2026-06-25', venue: "Levi's Stadium, San Francisco" },

  // ── Group E ────────────────────────────────────────────────────────────────
  { id: 'gE1', team1: 'GER', team2: 'CUR', group: 'E', stage: 'group', date: '2026-06-14', venue: 'NRG Stadium, Houston' },
  { id: 'gE2', team1: 'CIV', team2: 'ECU', group: 'E', stage: 'group', date: '2026-06-14', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gE3', team1: 'GER', team2: 'CIV', group: 'E', stage: 'group', date: '2026-06-20', venue: 'BMO Field, Toronto' },
  { id: 'gE4', team1: 'ECU', team2: 'CUR', group: 'E', stage: 'group', date: '2026-06-20', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gE5', team1: 'ECU', team2: 'GER', group: 'E', stage: 'group', date: '2026-06-25', venue: 'MetLife Stadium, New Jersey' },
  { id: 'gE6', team1: 'CUR', team2: 'CIV', group: 'E', stage: 'group', date: '2026-06-25', venue: 'Lincoln Financial Field, Philadelphia' },

  // ── Group F ────────────────────────────────────────────────────────────────
  { id: 'gF1', team1: 'NED', team2: 'JPN', group: 'F', stage: 'group', date: '2026-06-14', venue: 'AT&T Stadium, Dallas' },
  { id: 'gF2', team1: 'SWE', team2: 'TUN', group: 'F', stage: 'group', date: '2026-06-14', venue: 'Estadio BBVA, Monterrey' },
  { id: 'gF3', team1: 'NED', team2: 'SWE', group: 'F', stage: 'group', date: '2026-06-20', venue: 'NRG Stadium, Houston' },
  { id: 'gF4', team1: 'TUN', team2: 'JPN', group: 'F', stage: 'group', date: '2026-06-20', venue: 'Estadio BBVA, Monterrey' },
  { id: 'gF5', team1: 'JPN', team2: 'SWE', group: 'F', stage: 'group', date: '2026-06-25', venue: 'AT&T Stadium, Dallas' },
  { id: 'gF6', team1: 'TUN', team2: 'NED', group: 'F', stage: 'group', date: '2026-06-25', venue: 'Arrowhead Stadium, Kansas City' },

  // ── Group G ────────────────────────────────────────────────────────────────
  { id: 'gG1', team1: 'BEL', team2: 'EGY', group: 'G', stage: 'group', date: '2026-06-15', venue: 'Lumen Field, Seattle' },
  { id: 'gG2', team1: 'IRN', team2: 'NZL', group: 'G', stage: 'group', date: '2026-06-15', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gG3', team1: 'BEL', team2: 'IRN', group: 'G', stage: 'group', date: '2026-06-21', venue: 'SoFi Stadium, Los Angeles' },
  { id: 'gG4', team1: 'NZL', team2: 'EGY', group: 'G', stage: 'group', date: '2026-06-21', venue: 'BC Place, Vancouver' },
  { id: 'gG5', team1: 'EGY', team2: 'IRN', group: 'G', stage: 'group', date: '2026-06-26', venue: 'Lumen Field, Seattle' },
  { id: 'gG6', team1: 'NZL', team2: 'BEL', group: 'G', stage: 'group', date: '2026-06-26', venue: 'BC Place, Vancouver' },

  // ── Group H ────────────────────────────────────────────────────────────────
  { id: 'gH1', team1: 'ESP', team2: 'CPV', group: 'H', stage: 'group', date: '2026-06-15', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gH2', team1: 'KSA', team2: 'URU', group: 'H', stage: 'group', date: '2026-06-15', venue: 'Hard Rock Stadium, Miami' },
  { id: 'gH3', team1: 'ESP', team2: 'KSA', group: 'H', stage: 'group', date: '2026-06-21', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gH4', team1: 'URU', team2: 'CPV', group: 'H', stage: 'group', date: '2026-06-21', venue: 'Hard Rock Stadium, Miami' },
  { id: 'gH5', team1: 'CPV', team2: 'KSA', group: 'H', stage: 'group', date: '2026-06-26', venue: 'NRG Stadium, Houston' },
  { id: 'gH6', team1: 'URU', team2: 'ESP', group: 'H', stage: 'group', date: '2026-06-26', venue: 'Estadio Akron, Guadalajara' },

  // ── Group I ────────────────────────────────────────────────────────────────
  { id: 'gI1', team1: 'FRA', team2: 'SEN', group: 'I', stage: 'group', date: '2026-06-16', venue: 'MetLife Stadium, New Jersey' },
  { id: 'gI2', team1: 'IRQ', team2: 'NOR', group: 'I', stage: 'group', date: '2026-06-16', venue: 'Gillette Stadium, Boston' },
  { id: 'gI3', team1: 'FRA', team2: 'IRQ', group: 'I', stage: 'group', date: '2026-06-22', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gI4', team1: 'NOR', team2: 'SEN', group: 'I', stage: 'group', date: '2026-06-22', venue: 'MetLife Stadium, New Jersey' },
  { id: 'gI5', team1: 'NOR', team2: 'FRA', group: 'I', stage: 'group', date: '2026-06-26', venue: 'Gillette Stadium, Boston' },
  { id: 'gI6', team1: 'SEN', team2: 'IRQ', group: 'I', stage: 'group', date: '2026-06-26', venue: 'BMO Field, Toronto' },

  // ── Group J ────────────────────────────────────────────────────────────────
  { id: 'gJ1', team1: 'ARG', team2: 'ALG', group: 'J', stage: 'group', date: '2026-06-16', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gJ2', team1: 'AUT', team2: 'JOR', group: 'J', stage: 'group', date: '2026-06-16', venue: "Levi's Stadium, San Francisco" },
  { id: 'gJ3', team1: 'ARG', team2: 'AUT', group: 'J', stage: 'group', date: '2026-06-22', venue: 'AT&T Stadium, Dallas' },
  { id: 'gJ4', team1: 'JOR', team2: 'ALG', group: 'J', stage: 'group', date: '2026-06-22', venue: "Levi's Stadium, San Francisco" },
  { id: 'gJ5', team1: 'ALG', team2: 'AUT', group: 'J', stage: 'group', date: '2026-06-27', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gJ6', team1: 'JOR', team2: 'ARG', group: 'J', stage: 'group', date: '2026-06-27', venue: 'AT&T Stadium, Dallas' },

  // ── Group K ────────────────────────────────────────────────────────────────
  { id: 'gK1', team1: 'POR', team2: 'COD', group: 'K', stage: 'group', date: '2026-06-17', venue: 'NRG Stadium, Houston' },
  { id: 'gK2', team1: 'UZB', team2: 'COL', group: 'K', stage: 'group', date: '2026-06-17', venue: 'Estadio Azteca, Mexico City' },
  { id: 'gK3', team1: 'POR', team2: 'UZB', group: 'K', stage: 'group', date: '2026-06-23', venue: 'NRG Stadium, Houston' },
  { id: 'gK4', team1: 'COL', team2: 'COD', group: 'K', stage: 'group', date: '2026-06-23', venue: 'Estadio Akron, Guadalajara' },
  { id: 'gK5', team1: 'COL', team2: 'POR', group: 'K', stage: 'group', date: '2026-06-27', venue: 'Hard Rock Stadium, Miami' },
  { id: 'gK6', team1: 'COD', team2: 'UZB', group: 'K', stage: 'group', date: '2026-06-27', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ── Group L ────────────────────────────────────────────────────────────────
  { id: 'gL1', team1: 'ENG', team2: 'CRO', group: 'L', stage: 'group', date: '2026-06-17', venue: 'AT&T Stadium, Dallas' },
  { id: 'gL2', team1: 'GHA', team2: 'PAN', group: 'L', stage: 'group', date: '2026-06-17', venue: 'BMO Field, Toronto' },
  { id: 'gL3', team1: 'ENG', team2: 'GHA', group: 'L', stage: 'group', date: '2026-06-23', venue: 'Gillette Stadium, Boston' },
  { id: 'gL4', team1: 'PAN', team2: 'CRO', group: 'L', stage: 'group', date: '2026-06-23', venue: 'BMO Field, Toronto' },
  { id: 'gL5', team1: 'PAN', team2: 'ENG', group: 'L', stage: 'group', date: '2026-06-27', venue: 'MetLife Stadium, New Jersey' },
  { id: 'gL6', team1: 'CRO', team2: 'GHA', group: 'L', stage: 'group', date: '2026-06-27', venue: 'Lincoln Financial Field, Philadelphia' },
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
