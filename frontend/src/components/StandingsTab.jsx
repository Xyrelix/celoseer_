import { useState } from 'react';
import Icon from './Icon';

const GROUPS = {
  A: {
    name: 'Group A',
    teams: [
      { pos: 1, team: 'Argentina', flag: 'ar', p: 3, w: 3, d: 0, l: 0, gf: 7, ga: 2, gd: '+5', pts: 9 },
      { pos: 2, team: 'Poland',    flag: 'pl', p: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: '0',  pts: 4 },
      { pos: 3, team: 'Mexico',    flag: 'mx', p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 6, gd: '-3', pts: 3 },
      { pos: 4, team: 'Saudi Ar.', flag: 'sa', p: 3, w: 0, d: 1, l: 2, gf: 2, ga: 4, gd: '-2', pts: 1 },
    ],
  },
  B: {
    name: 'Group B',
    teams: [
      { pos: 1, team: 'France',    flag: 'fr', p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: '+4', pts: 7 },
      { pos: 2, team: 'Denmark',   flag: 'dk', p: 3, w: 2, d: 0, l: 1, gf: 4, ga: 4, gd: '0',  pts: 6 },
      { pos: 3, team: 'Tunisia',   flag: 'tn', p: 3, w: 0, d: 2, l: 1, gf: 2, ga: 3, gd: '-1', pts: 2 },
      { pos: 4, team: 'Australia', flag: 'au', p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 4, gd: '-3', pts: 1 },
    ],
  },
  C: {
    name: 'Group C',
    teams: [
      { pos: 1, team: 'Brazil',   flag: 'br', p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 2, gd: '+6', pts: 9 },
      { pos: 2, team: 'Serbia',   flag: 'rs', p: 3, w: 1, d: 1, l: 1, gf: 5, ga: 5, gd: '0',  pts: 4 },
      { pos: 3, team: 'Swiss',    flag: 'ch', p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: '-1', pts: 4 },
      { pos: 4, team: 'Cameroon', flag: 'cm', p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 7, gd: '-5', pts: 0 },
    ],
  },
  D: {
    name: 'Group D',
    teams: [
      { pos: 1, team: 'England',   flag: 'gb', p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, gd: '+4', pts: 7 },
      { pos: 2, team: 'USA',       flag: 'us', p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: '0',  pts: 4 },
      { pos: 3, team: 'Iran',      flag: 'ir', p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 7, gd: '-3', pts: 3 },
      { pos: 4, team: 'Wales',     flag: 'gb-wls', p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 7, gd: '-6', pts: 0 },
    ],
  },
  E: {
    name: 'Group E',
    teams: [
      { pos: 1, team: 'Spain',    flag: 'es', p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: '+4', pts: 7 },
      { pos: 2, team: 'Germany',  flag: 'de', p: 3, w: 1, d: 2, l: 0, gf: 4, ga: 3, gd: '+1', pts: 5 },
      { pos: 3, team: 'Japan',    flag: 'jp', p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 5, gd: '-1', pts: 3 },
      { pos: 4, team: 'Costa Rica', flag: 'cr', p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 5, gd: '-4', pts: 1 },
    ],
  },
  F: {
    name: 'Group F',
    teams: [
      { pos: 1, team: 'Morocco',  flag: 'ma', p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, gd: '+4', pts: 7 },
      { pos: 2, team: 'Croatia',  flag: 'hr', p: 3, w: 1, d: 2, l: 0, gf: 3, ga: 2, gd: '+1', pts: 5 },
      { pos: 3, team: 'Belgium',  flag: 'be', p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: '-1', pts: 3 },
      { pos: 4, team: 'Canada',   flag: 'ca', p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 5, gd: '-4', pts: 1 },
    ],
  },
};

const GROUP_KEYS = Object.keys(GROUPS);

export default function StandingsTab() {
  const [activeGroup, setActiveGroup] = useState('A');
  const group = GROUPS[activeGroup];

  return (
    <div className="standings-tab">
      <div className="standings-header">
        <Icon name="standings" size={22} color="#ffd700" />
        <h2 className="standings-title">Group Stage Standings</h2>
      </div>

      {/* Group selector */}
      <div className="group-tabs">
        {GROUP_KEYS.map(k => (
          <button
            key={k}
            className={`group-tab glass-tab ${activeGroup === k ? 'active' : ''}`}
            onClick={() => setActiveGroup(k)}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Standings table */}
      <div className="standings-card glass-market">
        <div className="st-group-name">{group.name}</div>
        <div className="st-table">
          <div className="st-row st-row--header">
            <span className="st-col st-col--pos">#</span>
            <span className="st-col st-col--team">Team</span>
            <span className="st-col st-col--num">P</span>
            <span className="st-col st-col--num">W</span>
            <span className="st-col st-col--num">D</span>
            <span className="st-col st-col--num">L</span>
            <span className="st-col st-col--num">GD</span>
            <span className="st-col st-col--pts">Pts</span>
          </div>
          {group.teams.map((t, i) => (
            <div
              key={i}
              className={`st-row ${i < 2 ? 'st-row--qualify' : ''} ${i === 2 ? 'st-row--borderline' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className={`st-col st-col--pos st-pos--${t.pos}`}>{t.pos}</span>
              <span className="st-col st-col--team">
                <img src={`https://flagcdn.com/${t.flag}.svg`} alt={t.team} className="st-flag" />
                <span className="st-team-name">{t.team}</span>
              </span>
              <span className="st-col st-col--num">{t.p}</span>
              <span className="st-col st-col--num">{t.w}</span>
              <span className="st-col st-col--num">{t.d}</span>
              <span className="st-col st-col--num">{t.l}</span>
              <span className={`st-col st-col--num ${t.gd.startsWith('+') ? 'st-pos-gd' : t.gd === '0' ? '' : 'st-neg-gd'}`}>{t.gd}</span>
              <span className="st-col st-col--pts st-pts-val">{t.pts}</span>
            </div>
          ))}
        </div>
        <div className="st-legend">
          <span className="st-legend-item st-legend--qualify">Advances to Round of 32</span>
          <span className="st-legend-item st-legend--border">Borderline</span>
        </div>
      </div>

      {/* Tournament bracket teaser */}
      <div className="bracket-teaser glass-market">
        <Icon name="trophy" size={20} color="#ffd700" />
        <div className="bracket-text">
          <span className="bracket-title">Knockout Stage</span>
          <span className="bracket-sub">Round of 32 begins July 1, 2026</span>
        </div>
        <span className="bracket-badge">SOON</span>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
