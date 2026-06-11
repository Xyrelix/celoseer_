import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

const WC_SLIDES = [
  { url: '/mexico.jpg',   type: 'image', caption: 'Starting This Thursday',  sub: 'Estadio Azteca — Mexico City, Mexico' },
  { url: '/trim.mp4',     type: 'video', caption: 'The Greatest Show',       sub: 'FIFA World Cup 2026 · The Spectacle Begins' },
  { url: '/wc2.jpg',      type: 'image', caption: 'The Stage Is Set',        sub: 'An Unforgettable Opening Ceremony' },
  { url: '/rimm%202.mp4', type: 'video', caption: 'World Cup Moments',       sub: 'Where Legends Are Born' },
  { url: '/wc3.jpg',      type: 'image', caption: 'The Greatest Tournament', sub: 'The Greatest Show on Earth' },
  { url: '/wc4.jpg',      type: 'image', caption: '17 Straight Days',        sub: 'Group Stage · June 11 – June 27, 2026' },
];

const FEATURED = [
  { team: 'Argentina', flag: 'https://flagcdn.com/ar.svg',     odds: '3.5x', confidence: 82, tag: 'FAVORITES' },
  { team: 'France',    flag: 'https://flagcdn.com/fr.svg',     odds: '4.2x', confidence: 78, tag: 'STRONG' },
  { team: 'Brazil',    flag: 'https://flagcdn.com/br.svg',     odds: '3.8x', confidence: 80, tag: 'FAVORITES' },
  { team: 'England',   flag: 'https://flagcdn.com/gb-eng.svg', odds: '4.8x', confidence: 75, tag: 'CONTENDER' },
];

const FIXTURES = [
  { date: 'Jun 11', time: '15:00', team1: 'Mexico',      f1: 'mx',     team2: 'South Africa',  f2: 'za',     venue: 'Estadio Azteca, Mexico City' },
  { date: 'Jun 11', time: '22:00', team1: 'South Korea', f1: 'kr',     team2: 'Czechia',        f2: 'cz',     venue: 'Estadio Akron, Guadalajara' },
  { date: 'Jun 12', time: '15:00', team1: 'Canada',      f1: 'ca',     team2: 'Bosnia & Herz.', f2: 'ba',     venue: 'BMO Field, Toronto' },
  { date: 'Jun 12', time: '21:00', team1: 'USA',         f1: 'us',     team2: 'Paraguay',       f2: 'py',     venue: 'SoFi Stadium, Los Angeles' },
  { date: 'Jun 13', time: '18:00', team1: 'Brazil',      f1: 'br',     team2: 'Morocco',        f2: 'ma',     venue: 'MetLife Stadium, New Jersey' },
  { date: 'Jun 13', time: '21:00', team1: 'Haiti',       f1: 'ht',     team2: 'Scotland',       f2: 'gb-sct', venue: 'Gillette Stadium, Boston' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADD YOUR OWN CLIPS HERE
//
//  { type: 'local', src: '/yourfile.mp4', ... }
//  → Drop your .mp4 into the /public folder and reference it as '/yourfile.mp4'
//
// label / labelColor: badge shown on the clip  (e.g. 'GOAL', '#ffd700')
// flag1 / flag2     : ISO 2-letter country codes (e.g. 'ng', 'gh', 'fr')
// ─────────────────────────────────────────────────────────────────────────────
const HIGHLIGHTS = [
  // 1 — Argentina vs Nigeria, Messi free kick
  {
    type: 'local',
    src: '/Nigeria2.mp4',
    title: 'Argentina 2 - 1 Nigeria',
    sub: 'Messi Free Kick · Group D · Russia 2018',
    flag1: 'ar', flag2: 'ng',
    label: 'MESSI',
    labelColor: '#6366f1',
  },
  // 2 — World Cup Champions compilation
  {
    type: 'local',
    src: '/trophy.mp4',
    title: 'World Cup Champions',
    sub: 'Winning Moments · Different Nations · Different Eras',
    label: 'CHAMPIONS',
    labelColor: '#ffd700',
  },
  // 3 — USA vs Wales
  {
    type: 'local',
    src: '/highlight.mp4',
    title: 'USA 1 - 0 Wales',
    sub: 'Group B · FIFA World Cup 2022',
    flag1: 'us', flag2: 'gb-wls',
    label: 'GROUP',
    labelColor: '#3b82f6',
  },
  // 4 — Nigeria vs Brazil
  {
    type: 'local',
    src: '/Nigeria.mp4',
    title: 'Nigeria 4 - 3 Brazil',
    sub: 'Olympic Semifinal · Atlanta 1996',
    flag1: 'ng', flag2: 'br',
    label: 'LEGENDARY',
    labelColor: '#22c55e',
  },
  // 5 — Iconic moments compilation (was highlight 1)
  {
    type: 'local',
    src: '/iconic moments.mp4',
    title: 'World Cup Iconic Moments',
    sub: 'Greatest Goals & Memories · Multiple Nations',
    label: 'ICONIC',
    labelColor: '#ffd700',
  },
];

const tilt = (e) => {
  const c = e.currentTarget, r = c.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
  const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
  c.style.transition = 'box-shadow 0.15s ease';
  c.style.transform  = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px) scale(1.01)`;
  c.style.boxShadow  = `${-x * 1.2}px ${-y * 1.2}px 24px rgba(255,215,0,0.12), 0 14px 36px rgba(0,0,0,0.45)`;
};
const untilt = (e) => {
  const c = e.currentTarget;
  c.style.transition = 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.55s ease';
  c.style.transform  = '';
  c.style.boxShadow  = '';
};

/* ─────────────────────────────────────────────────────────────────────────────
   HighlightCard — one video at a time, click to pause, IntersectionObserver
   Props:
     hl        — clip data object
     isActive  — true = this card should be playing
     onActivate() — call this to request playback (parent sets activeIdx)
     onPause()    — call this to give up playback (parent clears activeIdx)
   ───────────────────────────────────────────────────────────────────────────── */
function HighlightCard({ hl, isActive, onActivate, onPause }) {
  const videoRef  = useRef(null);
  const cardRef   = useRef(null);
  const [paused,  setPaused]  = useState(true);   // local UI state for icon
  const [missing, setMissing] = useState(false);  // true if file 404'd

  /* Play or pause whenever isActive changes */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      v.pause();
      setPaused(true);
    }
  }, [isActive]);

  /* IntersectionObserver — activates when 55% visible */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onActivate(); // request to be the active card
        } else {
          // left viewport — give up active slot if we held it
          onPause();
        }
      },
      { threshold: 0.55 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onActivate, onPause]);

  /* Click → toggle play / pause */
  const handleClick = () => {
    if (isActive && !paused) {
      // currently playing — pause it
      videoRef.current?.pause();
      setPaused(true);
      onPause();
    } else {
      // request to become the active card
      onActivate();
    }
  };

  return (
    <div
      className="hlv-card glass-market"
      ref={cardRef}
      onMouseMove={tilt}
      onMouseLeave={untilt}
      onClick={handleClick}
    >
      <div className="hlv-media-wrap">
        {missing ? (
          /* ── Placeholder shown if file isn't uploaded yet ── */
          <div className="hlv-missing">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
            </svg>
            <span>Drop <code>{hl.src}</code> into <code>/public</code></span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="hlv-video"
            src={hl.src}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setMissing(true)}
          />
        )}

        {/* Play / Pause overlay icon */}
        {!missing && (
          <div className={`hlv-play-overlay ${isActive && !paused ? 'hlv-play-overlay--playing' : ''}`}>
            <div className="hlv-play-btn">
              {isActive && !paused ? (
                /* Pause icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                /* Play icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Label badge */}
        <span
          className="hlv-label"
          style={{
            background:  `${hl.labelColor}22`,
            border:      `1px solid ${hl.labelColor}66`,
            color:        hl.labelColor,
          }}
        >
          {hl.label}
        </span>
        <div className="hlv-gradient" />
      </div>

      {/* Meta */}
      <div className="hlv-meta">
        {(hl.flag1 || hl.flag2) && (
          <div className="hlv-flags">
            {hl.flag1 && <img src={`https://flagcdn.com/${hl.flag1}.svg`} alt="" className="hlv-flag" />}
            {hl.flag1 && hl.flag2 && <span className="hlv-vs">vs</span>}
            {hl.flag2 && <img src={`https://flagcdn.com/${hl.flag2}.svg`} alt="" className="hlv-flag" />}
          </div>
        )}
        <div className="hlv-text">
          <span className="hlv-title">{hl.title}</span>
          <span className="hlv-sub">{hl.sub}</span>
        </div>
        {/* Playback state indicator */}
        <div className={`hlv-status ${isActive && !paused ? 'hlv-status--live' : ''}`} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HomeTab
   ───────────────────────────────────────────────────────────────────────────── */
export default function HomeTab({ onSelectMarket }) {
  const [slideIdx,   setSlideIdx]   = useState(0);
  const [activeIdx,  setActiveIdx]  = useState(null); // which highlight is playing
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlideIdx(i => (i + 1) % WC_SLIDES.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => { setSlideIdx(i); startTimer(); };
  const prev = () => goTo((slideIdx - 1 + WC_SLIDES.length) % WC_SLIDES.length);
  const next = () => goTo((slideIdx + 1) % WC_SLIDES.length);

  return (
    <div className="home-tab">

      {/* ── Hero Slider ── */}
      <div className="home-slider">
        <div className="home-slides-track" style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
          {WC_SLIDES.map((slide, i) => (
            <div key={i} className="home-slide">
              {slide.type === 'video' ? (
                <video className="slide-media" src={slide.url} autoPlay muted loop playsInline />
              ) : (
                <div className="slide-media slide-media--img" style={{ backgroundImage: `url(${slide.url})` }} />
              )}
              <div className="home-slide-overlay" />
              <div className="home-slide-caption">
                <span className="slide-badge">
                  <Icon name="football" size={14} color="#ffd700" />
                  FIFA WORLD CUP 2026
                </span>
                <h2 className="slide-title">{slide.caption}</h2>
                <p className="slide-sub">{slide.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-arrow slider-arrow--left"  onClick={prev} aria-label="Previous">
          <Icon name="back" size={18} color="#fff" />
        </button>
        <button className="slider-arrow slider-arrow--right" onClick={next} aria-label="Next">
          <Icon name="back" size={18} color="#fff" className="icon-flip" />
        </button>
        <div className="slider-dots">
          {WC_SLIDES.map((_, i) => (
            <button key={i} className={`slider-dot ${i === slideIdx ? 'slider-dot--active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>

      {/* ── Tournament Quick Stats ── */}
      <div className="home-quick-stats">
        {[
          { icon: 'globe',    label: '3 Nations',  val: 'USA · CAN · MEX' },
          { icon: 'football', label: '104 Matches', val: '48 Teams' },
          { icon: 'trophy',   label: 'Host Cities', val: '12 Cities' },
        ].map((s, i) => (
          <div key={i} className="qs-chip glass-market">
            <Icon name={s.icon} size={20} color="#ffd700" />
            <div>
              <span className="qs-val">{s.val}</span>
              <span className="qs-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tournament Favorites ── */}
      <div className="home-section">
        <div className="section-header">
          <Icon name="trophy" size={18} color="#ffd700" />
          <h3 className="section-title">Tournament Favorites</h3>
        </div>
        <div className="favorites-grid">
          {FEATURED.map((t, i) => (
            <div
              key={i}
              className="fav-card glass-market"
              style={{ animationDelay: `${i * 0.07}s` }}
              onMouseMove={tilt}
              onMouseLeave={untilt}
              onClick={() => onSelectMarket({
                id: i + 100,
                title: `${t.team} to Win World Cup 2026?`,
                category: 'knockout', team: t.team,
                yesOdds: parseFloat(t.odds), noOdds: 1.3,
                sentiment: 68, volume: 125000,
                image: t.flag, confidence: t.confidence,
                prediction: t.tag,
              })}
            >
              <img src={t.flag} alt={t.team} className="fav-flag" />
              <span className="fav-team">{t.team}</span>
              <span className="fav-odds">{t.odds}</span>
              <span className="fav-tag">{t.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming Fixtures ── */}
      <div className="home-section">
        <div className="section-header">
          <Icon name="calendar" size={18} color="#ffd700" />
          <h3 className="section-title">Upcoming Fixtures</h3>
        </div>
        <div className="fixtures-list">
          {FIXTURES.map((f, i) => (
            <div
              key={i}
              className="fixture-row glass-market"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="fix-date">
                <span className="fix-day">{f.date}</span>
                <span className="fix-time">{f.time}</span>
              </div>
              <div className="fix-match">
                <div className="fix-team">
                  <img src={`https://flagcdn.com/${f.f1}.svg`} alt={f.team1} className="fix-flag" />
                  <span>{f.team1}</span>
                </div>
                <span className="fix-vs">VS</span>
                <div className="fix-team fix-team--right">
                  <span>{f.team2}</span>
                  <img src={`https://flagcdn.com/${f.f2}.svg`} alt={f.team2} className="fix-flag" />
                </div>
              </div>
              <div className="fix-venue">
                <Icon name="globe" size={12} color="#9ca3af" />
                <span>{f.venue}</span>
              </div>
              <div className="fixture-wager-cta">
                <span>Place Wager</span>
                <Icon name="back" size={11} color="#ffd700" className="icon-flip" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Classic Highlights ── */}
      <div className="home-section">
        <div className="section-header">
          <Icon name="insights" size={18} color="#ffd700" />
          <h3 className="section-title">Classic Highlights</h3>
        </div>
        <div className="hlv-list">
          {HIGHLIGHTS.map((hl, i) => (
            <HighlightCard
              key={i}
              hl={hl}
              isActive={activeIdx === i}
              onActivate={() => setActiveIdx(i)}
              onPause={() => setActiveIdx(prev => prev === i ? null : prev)}
            />
          ))}
        </div>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
