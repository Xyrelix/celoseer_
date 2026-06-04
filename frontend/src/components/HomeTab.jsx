import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

const WC_SLIDES = [
  { url: '/wc1.jpg',         type: 'image', caption: 'FIFA World Cup 2026',     sub: 'Estadio AKRON — Guadalajara, Mexico' },
  { url: '/trim.mp4',        type: 'video', caption: 'The Greatest Show',        sub: 'FIFA World Cup 2026 · The Spectacle Begins' },
  { url: '/wc2.jpg',         type: 'image', caption: 'The Stage Is Set',         sub: 'An Unforgettable Opening Ceremony' },
  { url: '/rimm%202.mp4',    type: 'video', caption: 'World Cup Moments',        sub: 'Where Legends Are Born' },
  { url: '/wc3.jpg',         type: 'image', caption: 'The Greatest Tournament',  sub: 'The Greatest Show on Earth' },
  { url: '/wc4.jpg',         type: 'image', caption: '17 Straight Days',         sub: 'Group Stage · June 11 – June 27, 2026' },
];

const FEATURED = [
  { team: 'Argentina', flag: 'https://flagcdn.com/ar.svg', odds: '3.5x', confidence: 82, tag: 'FAVORITES' },
  { team: 'France',    flag: 'https://flagcdn.com/fr.svg', odds: '4.2x', confidence: 78, tag: 'STRONG' },
  { team: 'Brazil',    flag: 'https://flagcdn.com/br.svg', odds: '3.8x', confidence: 80, tag: 'FAVORITES' },
  { team: 'England',   flag: 'https://flagcdn.com/gb-eng.svg', odds: '4.8x', confidence: 75, tag: 'CONTENDER' },
];

const FIXTURES = [
  { date: 'Jun 11', time: '18:00', team1: 'Mexico',    f1: 'mx', team2: 'Poland',   f2: 'pl', venue: 'Azteca, Mexico City' },
  { date: 'Jun 12', time: '21:00', team1: 'Argentina', f1: 'ar', team2: 'Iceland',  f2: 'is', venue: 'MetLife, New Jersey' },
  { date: 'Jun 13', time: '18:00', team1: 'France',    f1: 'fr', team2: 'Ecuador',  f2: 'ec', venue: 'AT&T, Dallas' },
  { date: 'Jun 14', time: '21:00', team1: 'Brazil',    f1: 'br', team2: 'Croatia',  f2: 'hr', venue: 'Allegiant, Las Vegas' },
  { date: 'Jun 15', time: '18:00', team1: 'England',   f1: 'gb-eng', team2: 'Senegal',  f2: 'sn', venue: 'Rose Bowl, LA' },
  { date: 'Jun 16', time: '21:00', team1: 'Germany',   f1: 'de', team2: 'Portugal', f2: 'pt', venue: "Levi's, San Francisco" },
];

const tilt = (e) => {
  const c = e.currentTarget, r = c.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
  const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
  c.style.transition = 'box-shadow 0.15s ease';
  c.style.transform  = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-5px) scale(1.015)`;
  c.style.boxShadow  = `${-x * 1.5}px ${-y * 1.5}px 28px rgba(255,215,0,0.15), 0 18px 40px rgba(0,0,0,0.5)`;
};
const untilt = (e) => {
  const c = e.currentTarget;
  c.style.transition = 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.55s ease';
  c.style.transform  = '';
  c.style.boxShadow  = '';
};

export default function HomeTab({ onSelectMarket }) {
  const [slideIdx, setSlideIdx] = useState(0);
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

  const goTo = (i) => {
    setSlideIdx(i);
    startTimer();
  };

  const prev = () => goTo((slideIdx - 1 + WC_SLIDES.length) % WC_SLIDES.length);
  const next = () => goTo((slideIdx + 1) % WC_SLIDES.length);

  return (
    <div className="home-tab">
      {/* ── Hero Slider ── */}
      <div className="home-slider">
        <div
          className="home-slides-track"
          style={{ transform: `translateX(-${slideIdx * 100}%)` }}
        >
          {WC_SLIDES.map((slide, i) => (
            <div key={i} className="home-slide">
              {slide.type === 'video' ? (
                <video
                  className="slide-media"
                  src={slide.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div
                  className="slide-media slide-media--img"
                  style={{ backgroundImage: `url(${slide.url})` }}
                />
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
            <button
              key={i}
              className={`slider-dot ${i === slideIdx ? 'slider-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* ── Tournament Quick Stats ── */}
      <div className="home-quick-stats">
        {[
          { icon: 'globe',    label: '3 Nations',   val: 'USA · CAN · MEX' },
          { icon: 'football', label: '104 Matches',  val: '48 Teams' },
          { icon: 'trophy',   label: 'Host Cities',  val: '12 Cities' },
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
            <div key={i} className="fixture-row glass-market" style={{ animationDelay: `${i * 0.06}s` }} onMouseMove={tilt} onMouseLeave={untilt}>
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
            </div>
          ))}
        </div>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
