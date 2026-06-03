// Seeded pseudo-random so server and client render identically (no hydration flicker)
function sr(i, s) {
  return Math.abs(Math.sin(i * s + s) * 43758.5453) % 1;
}

const STARS = Array.from({ length: 35 }, (_, i) => ({
  x:    sr(i, 7.31)  * 100,
  y:    sr(i, 13.73) * 100,
  sz:   sr(i, 3.17)  * 2.4 + 0.4,
  dur:  sr(i, 5.91)  * 7   + 4,
  del: -sr(i, 11.23) * 12,
  op:   sr(i, 2.37)  * 0.55 + 0.08,
  gold: i < 22,
}));

const BEAMS = Array.from({ length: 3 }, (_, i) => ({
  x:    20 + i * 30,
  dur:  8  + i * 4,
  del: -i  * 3,
  op:   0.03 + i * 0.01,
}));

export default function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      {/* Morphing gradient mesh */}
      <div className="bg-mesh" />

      {/* Drifting colour orbs */}
      <div className="bg-orb bg-orb--gold"    />
      <div className="bg-orb bg-orb--red"     />
      <div className="bg-orb bg-orb--blue"    />
      <div className="bg-orb bg-orb--green"   />
      <div className="bg-orb bg-orb--violet"  />

      {/* Moving diagonal grid */}
      <div className="bg-grid" />

      {/* Twinkling star field */}
      <div className="bg-stars">
        {STARS.map((s, i) => (
          <span
            key={i}
            className={`bg-star ${s.gold ? 'bg-star--gold' : 'bg-star--white'}`}
            style={{
              left:              `${s.x}%`,
              top:               `${s.y}%`,
              width:             `${s.sz}px`,
              height:            `${s.sz}px`,
              opacity:            s.op,
              animationDuration: `${s.dur}s`,
              animationDelay:    `${s.del}s`,
            }}
          />
        ))}
      </div>

      {/* Vertical light beams */}
      {BEAMS.map((b, i) => (
        <div
          key={i}
          className="bg-beam"
          style={{
            left:              `${b.x}%`,
            opacity:            b.op,
            animationDuration: `${b.dur}s`,
            animationDelay:    `${b.del}s`,
          }}
        />
      ))}

      {/* Edge vignette */}
      <div className="bg-vignette" />
    </div>
  );
}
