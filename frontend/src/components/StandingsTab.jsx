import { useState } from 'react';
import Icon from './Icon';

const GROUPS = {
  A: {
    name: 'Group A',
    teams: [
      { pos: 1, team: 'Mexico',      flag: 'mx',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'South Korea', flag: 'kr',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'S. Africa',   flag: 'za',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Czechia',     flag: 'cz',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  B: {
    name: 'Group B',
    teams: [
      { pos: 1, team: 'Canada',      flag: 'ca',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Switzerland', flag: 'ch',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Qatar',       flag: 'qa',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Bosnia & Hz', flag: 'ba',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  C: {
    name: 'Group C',
    teams: [
      { pos: 1, team: 'Brazil',      flag: 'br',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Morocco',     flag: 'ma',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Haiti',       flag: 'ht',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Scotland',    flag: 'gb-sct', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  D: {
    name: 'Group D',
    teams: [
      { pos: 1, team: 'USA',         flag: 'us',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Paraguay',    flag: 'py',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Australia',   flag: 'au',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Türkiye',     flag: 'tr',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  E: {
    name: 'Group E',
    teams: [
      { pos: 1, team: 'Germany',     flag: 'de',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Ecuador',     flag: 'ec',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Ivory Coast', flag: 'ci',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Curaçao',     flag: 'cw',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  F: {
    name: 'Group F',
    teams: [
      { pos: 1, team: 'Netherlands', flag: 'nl',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Japan',       flag: 'jp',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Sweden',      flag: 'se',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Tunisia',     flag: 'tn',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  G: {
    name: 'Group G',
    teams: [
      { pos: 1, team: 'Belgium',     flag: 'be',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Egypt',       flag: 'eg',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Iran',        flag: 'ir',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'N. Zealand',  flag: 'nz',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  H: {
    name: 'Group H',
    teams: [
      { pos: 1, team: 'Spain',       flag: 'es',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Uruguay',     flag: 'uy',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Saudi Ar.',   flag: 'sa',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Cape Verde',  flag: 'cv',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  I: {
    name: 'Group I',
    teams: [
      { pos: 1, team: 'France',      flag: 'fr',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Senegal',     flag: 'sn',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Norway',      flag: 'no',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Iraq',        flag: 'iq',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  J: {
    name: 'Group J',
    teams: [
      { pos: 1, team: 'Argentina',   flag: 'ar',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Algeria',     flag: 'dz',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Austria',     flag: 'at',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Jordan',      flag: 'jo',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  K: {
    name: 'Group K',
    teams: [
      { pos: 1, team: 'Portugal',    flag: 'pt',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Colombia',    flag: 'co',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Uzbekistan',  flag: 'uz',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'DR Congo',    flag: 'cd',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
  L: {
    name: 'Group L',
    teams: [
      { pos: 1, team: 'England',     flag: 'gb-eng', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 2, team: 'Croatia',     flag: 'hr',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 3, team: 'Ghana',       flag: 'gh',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
      { pos: 4, team: 'Panama',      flag: 'pa',     p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 },
    ],
  },
};

const GROUP_KEYS = [...Object.keys(GROUPS), '3RD'];

// 12 ranked slots for the 3rd-place playoff (populated after group stage ends Jun 27)
const PLAYOFF_SLOTS = Array.from({ length: 12 }, (_, i) => ({ rank: i + 1 }));

export default function StandingsTab() {
  const [activeGroup, setActiveGroup] = useState('A');
  const isPlayoff = activeGroup === '3RD';
  const group = GROUPS[activeGroup];

  return (
    <div className="standings-tab">
      <div className="standings-header">
        <Icon name="standings" size={22} color="#ffd700" />
        <h2 className="standings-title">Group Stage Standings</h2>
      </div>

      {/* Group selector — two rows of 6, plus playoff tab */}
      <div className="group-tabs-wrapper">
        <div className="group-tabs group-tabs--row">
          {['A','B','C','D','E','F'].map(k => (
            <button key={k} className={`group-tab glass-tab ${activeGroup === k ? 'active' : ''}`}
              onClick={() => setActiveGroup(k)}>{k}</button>
          ))}
        </div>
        <div className="group-tabs group-tabs--row">
          {['G','H','I','J','K','L'].map(k => (
            <button key={k} className={`group-tab glass-tab ${activeGroup === k ? 'active' : ''}`}
              onClick={() => setActiveGroup(k)}>{k}</button>
          ))}
        </div>
        <button
          className={`group-tab group-tab--playoff glass-tab ${activeGroup === '3RD' ? 'active' : ''}`}
          onClick={() => setActiveGroup('3RD')}
        >
          3rd-Place Playoff ★
        </button>
      </div>

      {isPlayoff ? (
        /* ── 3rd-place playoff table ── */
        <div className="standings-card glass-market">
          <div className="st-group-name">3rd-Place Playoff · Top 8 of 12 Advance</div>

          <div className="st-playoff-note">
            <Icon name="trophy" size={13} color="#f59e0b" />
            <span>Rankings set after group stage (Jun 27). 8 best third-placed teams join the Round of 32.</span>
          </div>

          <div className="st-table">
            <div className="st-row st-row--header">
              <span className="st-col st-col--pos">#</span>
              <span className="st-col st-col--team">Team</span>
              <span className="st-col st-col--num">Grp</span>
              <span className="st-col st-col--num">Pts</span>
              <span className="st-col st-col--num">GD</span>
              <span className="st-col st-col--pts">GF</span>
            </div>
            {PLAYOFF_SLOTS.map(({ rank }) => (
              <div
                key={rank}
                className={`st-row ${rank <= 8 ? 'st-row--qualify' : 'st-row--elim'}`}
                style={{ animationDelay: `${rank * 0.05}s` }}
              >
                <span className={`st-col st-col--pos st-pos--${rank <= 8 ? (rank <= 2 ? 1 : 2) : 4}`}>{rank}</span>
                <span className="st-col st-col--team">
                  <span className="st-team-name st-tbd">—</span>
                </span>
                <span className="st-col st-col--num st-tbd-val">—</span>
                <span className="st-col st-col--num st-tbd-val">—</span>
                <span className="st-col st-col--num st-tbd-val">—</span>
                <span className="st-col st-col--pts st-tbd-val">—</span>
              </div>
            ))}
          </div>

          <div className="st-legend">
            <span className="st-legend-item st-legend--qualify">Advances to Round of 32</span>
            <span className="st-legend-item st-legend--elim">Eliminated</span>
          </div>
        </div>
      ) : (
        /* ── Regular group table ── */
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
            <span className="st-legend-item st-legend--qualify">Advances to R32</span>
            <span className="st-legend-item st-legend--border">3rd Place Playoff</span>
          </div>
        </div>
      )}

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
