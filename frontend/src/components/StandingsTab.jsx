import { useState } from 'react';
import Icon from './Icon';

/* ── Group colours matching the reference image ── */
const GROUP_COLORS = {
  A: '#22c55e', // green
  B: '#ef4444', // red
  C: '#f97316', // orange
  D: '#3b82f6', // blue
  E: '#8b5cf6', // purple
  F: '#eab308', // yellow
  G: '#ec4899', // pink
  H: '#06b6d4', // cyan
  I: '#a855f7', // violet
  J: '#0d9488', // teal
  K: '#f97316', // orange
  L: '#38bdf8', // sky
};

const GROUPS = {
  A: { teams: [
    { team: 'Mexico',       flag: 'mx'     },
    { team: 'South Africa', flag: 'za'     },
    { team: 'Korea Rep.',   flag: 'kr'     },
    { team: 'Czechia',      flag: 'cz'     },
  ]},
  B: { teams: [
    { team: 'Canada',       flag: 'ca'     },
    { team: 'Bosnia & Hz.', flag: 'ba'     },
    { team: 'Qatar',        flag: 'qa'     },
    { team: 'Switzerland',  flag: 'ch'     },
  ]},
  C: { teams: [
    { team: 'Brazil',       flag: 'br'     },
    { team: 'Morocco',      flag: 'ma'     },
    { team: 'Haiti',        flag: 'ht'     },
    { team: 'Scotland',     flag: 'gb-sct' },
  ]},
  D: { teams: [
    { team: 'USA',          flag: 'us'     },
    { team: 'Paraguay',     flag: 'py'     },
    { team: 'Australia',    flag: 'au'     },
    { team: 'Türkiye',      flag: 'tr'     },
  ]},
  E: { teams: [
    { team: 'Germany',      flag: 'de'     },
    { team: 'Curaçao',      flag: 'cw'     },
    { team: "Côte d'Ivoire",flag: 'ci'     },
    { team: 'Ecuador',      flag: 'ec'     },
  ]},
  F: { teams: [
    { team: 'Netherlands',  flag: 'nl'     },
    { team: 'Japan',        flag: 'jp'     },
    { team: 'Sweden',       flag: 'se'     },
    { team: 'Tunisia',      flag: 'tn'     },
  ]},
  G: { teams: [
    { team: 'Belgium',      flag: 'be'     },
    { team: 'Egypt',        flag: 'eg'     },
    { team: 'IR Iran',      flag: 'ir'     },
    { team: 'New Zealand',  flag: 'nz'     },
  ]},
  H: { teams: [
    { team: 'Spain',        flag: 'es'     },
    { team: 'Cabo Verde',   flag: 'cv'     },
    { team: 'Saudi Arabia', flag: 'sa'     },
    { team: 'Uruguay',      flag: 'uy'     },
  ]},
  I: { teams: [
    { team: 'France',       flag: 'fr'     },
    { team: 'Senegal',      flag: 'sn'     },
    { team: 'Iraq',         flag: 'iq'     },
    { team: 'Norway',       flag: 'no'     },
  ]},
  J: { teams: [
    { team: 'Argentina',    flag: 'ar'     },
    { team: 'Algeria',      flag: 'dz'     },
    { team: 'Austria',      flag: 'at'     },
    { team: 'Jordan',       flag: 'jo'     },
  ]},
  K: { teams: [
    { team: 'Portugal',     flag: 'pt'     },
    { team: 'Congo DR',     flag: 'cd'     },
    { team: 'Uzbekistan',   flag: 'uz'     },
    { team: 'Colombia',     flag: 'co'     },
  ]},
  L: { teams: [
    { team: 'England',      flag: 'gb-eng' },
    { team: 'Croatia',      flag: 'hr'     },
    { team: 'Ghana',        flag: 'gh'     },
    { team: 'Panama',       flag: 'pa'     },
  ]},
};

const LEFT_GROUPS  = ['A','B','C','D','E','F'];
const RIGHT_GROUPS = ['G','H','I','J','K','L'];

const PLAYOFF_SLOTS = Array.from({ length: 12 }, (_, i) => ({ rank: i + 1 }));

/* ── Single coloured group box ── */
function GroupBox({ letter, onSelect }) {
  const color = GROUP_COLORS[letter];
  const { teams } = GROUPS[letter];
  return (
    <button
      className="draw-group-box"
      style={{ '--gc': color }}
      onClick={() => onSelect(letter)}
      aria-label={`Group ${letter}`}
    >
      <div className="draw-group-letter">{letter}</div>
      <ul className="draw-group-teams">
        {teams.map((t, i) => (
          <li key={i} className="draw-team-row">
            <img src={`https://flagcdn.com/${t.flag}.svg`} alt={t.team} className="draw-team-flag" />
            <span className="draw-team-name">{t.team.toUpperCase()}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ── Detail modal / panel for a selected group ── */
function GroupDetail({ letter, onClose }) {
  const color  = GROUP_COLORS[letter];
  const { teams } = GROUPS[letter];
  return (
    <div className="draw-detail glass-market" style={{ '--gc': color }}>
      <div className="draw-detail-header">
        <div className="draw-detail-letter" style={{ background: color }}>Group {letter}</div>
        <button className="draw-detail-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
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
        {teams.map((t, i) => (
          <div
            key={i}
            className={`st-row ${i < 2 ? 'st-row--qualify' : ''} ${i === 2 ? 'st-row--borderline' : ''}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className={`st-col st-col--pos st-pos--${i + 1}`}>{i + 1}</span>
            <span className="st-col st-col--team">
              <img src={`https://flagcdn.com/${t.flag}.svg`} alt={t.team} className="st-flag" />
              <span className="st-team-name">{t.team}</span>
            </span>
            <span className="st-col st-col--num">0</span>
            <span className="st-col st-col--num">0</span>
            <span className="st-col st-col--num">0</span>
            <span className="st-col st-col--num">0</span>
            <span className="st-col st-col--num">0</span>
            <span className="st-col st-col--pts st-pts-val">0</span>
          </div>
        ))}
      </div>
      <div className="st-legend">
        <span className="st-legend-item st-legend--qualify">Advances to R32</span>
        <span className="st-legend-item st-legend--border">3rd Place Playoff</span>
      </div>
    </div>
  );
}

export default function StandingsTab() {
  const [view,        setView]        = useState('draw');   // 'draw' | 'group' | 'playoff'
  const [activeGroup, setActiveGroup] = useState(null);

  const openGroup = (letter) => { setActiveGroup(letter); setView('group'); };
  const goBack    = () => { setActiveGroup(null); setView('draw'); };

  return (
    <div className="standings-tab">

      {/* ── Title ── */}
      <div className="draw-title-block">
        <h2 className="draw-main-title">FIFA WORLD CUP 2026<sup>™</sup></h2>
        <div className="draw-stage-pill">GROUP STAGE</div>
      </div>

      {view === 'draw' && (
        <>
          {/* ── Draw grid ── */}
          <div className="draw-grid">
            {/* Left column  A–F */}
            <div className="draw-col draw-col--left">
              {LEFT_GROUPS.map(l => <GroupBox key={l} letter={l} onSelect={openGroup} />)}
            </div>

            {/* Centre — rotating trophy with 3D double-face */}
            <div className="draw-center">
              <div className="draw-trophy-wrap">
                <div className="draw-trophy-3d">
                  {/* Front face */}
                  <img
                    src="/fifa-trophy.png"
                    alt="FIFA World Cup Trophy"
                    className="draw-trophy-face draw-trophy-front"
                  />
                  {/* Back face (mirrored so it looks correct from behind) */}
                  <img
                    src="/fifa-trophy.png"
                    alt=""
                    className="draw-trophy-face draw-trophy-back"
                  />
                </div>
              </div>
              <div className="draw-trophy-glow" />
            </div>

            {/* Right column G–L */}
            <div className="draw-col draw-col--right">
              {RIGHT_GROUPS.map(l => <GroupBox key={l} letter={l} onSelect={openGroup} />)}
            </div>
          </div>

          {/* ── 3rd-place Playoff button ── */}
          <button className="draw-playoff-btn" onClick={() => setView('playoff')}>
            <Icon name="trophy" size={14} color="#f59e0b" />
            3rd-Place Playoff Rankings
            <span className="draw-playoff-badge">Jun 27</span>
          </button>

          {/* ── Knockout stage coming soon ── */}
          <div className="bracket-teaser glass-market">
            <Icon name="trophy" size={20} color="#ffd700" />
            <div className="bracket-text">
              <span className="bracket-title">Knockout Stage</span>
              <span className="bracket-sub">Round of 32 begins July 1, 2026</span>
            </div>
            <span className="bracket-badge">SOON</span>
          </div>
        </>
      )}

      {view === 'group' && activeGroup && (
        <div style={{ padding: '0 4px' }}>
          <button className="draw-back-btn" onClick={goBack}>
            ← All Groups
          </button>
          <GroupDetail letter={activeGroup} onClose={goBack} />

          {/* Knockout teaser */}
          <div className="bracket-teaser glass-market" style={{ marginTop: 16 }}>
            <Icon name="trophy" size={20} color="#ffd700" />
            <div className="bracket-text">
              <span className="bracket-title">Knockout Stage</span>
              <span className="bracket-sub">Round of 32 begins July 1, 2026</span>
            </div>
            <span className="bracket-badge">SOON</span>
          </div>
        </div>
      )}

      {view === 'playoff' && (
        <div style={{ padding: '0 4px' }}>
          <button className="draw-back-btn" onClick={goBack}>
            ← Draw
          </button>
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
        </div>
      )}

      <div className="home-bottom-pad" />
    </div>
  );
}
