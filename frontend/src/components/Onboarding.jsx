import { useState, useEffect } from 'react';
import Icon from './Icon';

const WC_IMAGES = [
  { url: '/wc1.jpg',        type: 'image' },
  { url: '/trim.mp4',       type: 'video' },
  { url: '/wc2.jpg',        type: 'image' },
  { url: '/rimm%202.mp4',   type: 'video' },
  { url: '/wc3.jpg',        type: 'image' },
  { url: '/wc4.jpg',        type: 'image' },
];

/* ── Typewriter texts ── */
const TW_TEXTS = [
  'Predict FIFA World Cup 2026 outcomes with AI.',
  '82.4% accuracy across 847 prediction calls.',
  'Earn cUSD rewards on every correct call.',
  'Gasless smart wallet — zero fees on Celo.',
  "Join the world's first AI sports prediction market.",
];

/* ── Platform features (replaces old benefit chips) ── */
const FEATURES = [
  { icon: 'insights', color: '#ffd700', title: 'AI Predictions', desc: '82.4% accuracy on 847+ historical calls' },
  { icon: 'coin',     color: '#10b981', title: 'Earn cUSD',      desc: 'Real rewards for every correct prediction' },
  { icon: 'shield',   color: '#6366f1', title: 'Gasless Wallet', desc: 'Zero transaction fees on Celo blockchain' },
  { icon: 'globe',    color: '#f97316', title: 'WC 2026 Live',   desc: '48 Teams · 104 Matches · 3 Nations' },
];

/* ── Language map ── */
const LANGUAGES = {
  en: { flag: '🇬🇧', name: 'EN', copy: 'Begin your CeloSeer journey with a gasless smart wallet.', continue: 'Get Started', preparing: 'Preparing...', getStarted: 'Enter CeloSeer', settingUp: 'Setting up...', back: 'Back', creatingWallet: 'Your Wallet Is Ready', walletDesc: 'Account abstraction wallet created — gasless transactions enabled.', walletGenerated: 'Wallet generated', network: 'Celo Mainnet', gas: 'Gas sponsored (free)' },
  es: { flag: '🇪🇸', name: 'ES', copy: 'Comienza tu viaje en CeloSeer con una billetera sin gas.', continue: 'Comenzar', preparing: 'Preparando...', getStarted: 'Entrar a CeloSeer', settingUp: 'Configurando...', back: 'Atrás', creatingWallet: 'Tu Billetera Está Lista', walletDesc: 'Billetera creada — transacciones sin gas habilitadas.', walletGenerated: 'Billetera generada', network: 'Celo Mainnet', gas: 'Gas patrocinado (gratis)' },
  fr: { flag: '🇫🇷', name: 'FR', copy: 'Commencez votre parcours CeloSeer avec un portefeuille sans gaz.', continue: 'Commencer', preparing: 'Préparation...', getStarted: 'Entrer dans CeloSeer', settingUp: 'Configuration...', back: 'Retour', creatingWallet: 'Votre Portefeuille Est Prêt', walletDesc: 'Portefeuille créé — transactions sans gaz activées.', walletGenerated: 'Portefeuille généré', network: 'Celo Mainnet', gas: 'Gaz sponsorisé (gratuit)' },
  pt: { flag: '🇧🇷', name: 'PT', copy: 'Comece sua jornada CeloSeer com uma carteira sem gás.', continue: 'Começar', preparing: 'Preparando...', getStarted: 'Entrar no CeloSeer', settingUp: 'Configurando...', back: 'Voltar', creatingWallet: 'Sua Carteira Está Pronta', walletDesc: 'Carteira criada — transações sem gás habilitadas.', walletGenerated: 'Carteira gerada', network: 'Celo Mainnet', gas: 'Gas patrocinado (grátis)' },
  de: { flag: '🇩🇪', name: 'DE', copy: 'Beginne deine CeloSeer-Reise mit einem gaslosen Wallet.', continue: 'Loslegen', preparing: 'Vorbereitung...', getStarted: 'CeloSeer betreten', settingUp: 'Einrichten...', back: 'Zurück', creatingWallet: 'Dein Wallet Ist Bereit', walletDesc: 'Wallet erstellt — gaslose Transaktionen aktiviert.', walletGenerated: 'Wallet erstellt', network: 'Celo Mainnet', gas: 'Gas gesponsert (kostenlos)' },
  ar: { flag: '🇸🇦', name: 'AR', copy: 'ابدأ رحلتك مع CeloSeer بمحفظة ذكية بدون رسوم.', continue: 'ابدأ', preparing: '...جاري التحضير', getStarted: 'ادخل إلى CeloSeer', settingUp: '...جاري الإعداد', back: 'رجوع', creatingWallet: 'محفظتك جاهزة', walletDesc: 'تم إنشاء المحفظة — المعاملات بدون رسوم مفعّلة.', walletGenerated: 'تم إنشاء المحفظة', network: 'Celo Mainnet', gas: 'الغاز مدعوم (مجاني)' },
};
const LANG_KEYS = ['en', 'es', 'fr', 'pt', 'de', 'ar'];

/* ────────────────────────────────────────── */

export default function Onboarding({ onComplete }) {
  const [step,           setStep]           = useState('start');
  const [loading,        setLoading]        = useState(false);
  const [imgIndex,       setImgIndex]       = useState(0);
  const [prevImgIndex,   setPrevImgIndex]   = useState(null);
  const [lang,           setLang]           = useState('en');
  const [showLangPicker, setShowLangPicker] = useState(false);

  /* Typewriter state */
  const [twDisplay, setTwDisplay] = useState('');
  const [twIdx,     setTwIdx]     = useState(0);
  const [twPos,     setTwPos]     = useState(0);
  const [twPhase,   setTwPhase]   = useState('typing'); // 'typing' | 'waiting' | 'deleting'

  const t = LANGUAGES[lang];

  /* ── Image carousel ── */
  useEffect(() => {
    const id = setInterval(() => {
      setImgIndex(i => { setPrevImgIndex(i); return (i + 1) % WC_IMAGES.length; });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  /* ── Typewriter engine ── */
  useEffect(() => {
    const text = TW_TEXTS[twIdx];
    let id;
    if (twPhase === 'typing') {
      if (twPos < text.length) {
        id = setTimeout(() => { setTwDisplay(text.slice(0, twPos + 1)); setTwPos(p => p + 1); }, 52);
      } else {
        id = setTimeout(() => setTwPhase('deleting'), 2400);
      }
    } else if (twPhase === 'deleting') {
      if (twPos > 0) {
        id = setTimeout(() => { setTwDisplay(text.slice(0, twPos - 1)); setTwPos(p => p - 1); }, 22);
      } else {
        setTwIdx(i => (i + 1) % TW_TEXTS.length);
        setTwPhase('typing');
      }
    }
    return () => clearTimeout(id);
  }, [twPos, twPhase, twIdx]);

  const handleStart = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onComplete({
      username: `seer_${Math.random().toString(36).substring(2, 8)}`,
      walletAddress: '0x' + Math.random().toString(16).slice(2, 42),
      initialBalance: 100,
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
  };

  const goToSlide = (i) => { setPrevImgIndex(imgIndex); setImgIndex(i); };

  return (
    <div className="ob-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ── Carousel background ── */}
      <div className="ob-carousel">
        {WC_IMAGES.map((slide, i) => {
          const cls = `ob-slide ${i === imgIndex ? 'ob-slide--active' : ''} ${i === prevImgIndex ? 'ob-slide--prev' : ''}`;
          return slide.type === 'video' ? (
            <div key={i} className={cls}>
              <video
                className="ob-slide-video"
                src={slide.url}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ) : (
            <div key={i} className={cls} style={{ backgroundImage: `url(${slide.url})` }} />
          );
        })}
        <div className="ob-overlay" />
      </div>

      {/* ── Wordmark — top-left corner ── */}
      <div className="ob-corner-logo">
        <img src="/yellowceloseerbanner.png" alt="CeloSeer" className="ob-corner-img" />
      </div>

      {/* ── Language picker — top-right ── */}
      <div className="ob-lang">
        <button className="ob-lang-btn" onClick={() => setShowLangPicker(p => !p)} aria-label="Select language">
          <span className="ob-lang-flag">{t.flag}</span>
          <span className="ob-lang-code">{t.name}</span>
          <span className="ob-chevron">{showLangPicker ? '▴' : '▾'}</span>
        </button>
        {showLangPicker && (
          <div className="ob-lang-menu">
            {LANG_KEYS.map(key => (
              <button key={key}
                className={`ob-lang-opt ${lang === key ? 'ob-lang-opt--active' : ''}`}
                onClick={() => { setLang(key); setShowLangPicker(false); }}
              >
                <span>{LANGUAGES[key].flag}</span>
                <span>{LANGUAGES[key].name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Slide dots ── */}
      <div className="ob-dots">
        {WC_IMAGES.map((_, i) => (
          <button key={i} className={`ob-dot ${i === imgIndex ? 'ob-dot--active' : ''}`} onClick={() => goToSlide(i)} />
        ))}
      </div>

      {/* ── Main scrollable content ── */}
      <div className="ob-content">

        {/* Hero — small logo + typewriter */}
        <div className="ob-hero-slim">
          <div className="ob-logo-ring-sm">
            <img src="/reallogo.png" alt="CeloSeer" className="logo-image" />
          </div>
          <div className="ob-typewriter-wrap">
            <p className="ob-typewriter">
              {twDisplay}<span className="ob-cursor" />
            </p>
          </div>
        </div>

        {/* ── Login card ── */}
        <div className="ob-card">
          {/* Step indicator */}
          <div className="ob-steps">
            <div className={`ob-step-pip ${step === 'start' ? 'ob-step-pip--active' : 'ob-step-pip--done'}`}>
              {step !== 'start' ? <Icon name="check" size={13} color="#111" /> : '1'}
            </div>
            <div className={`ob-step-line ${step === 'confirm' ? 'ob-step-line--done' : ''}`} />
            <div className={`ob-step-pip ${step === 'confirm' ? 'ob-step-pip--active' : ''}`}>2</div>
          </div>

          {/* ── Step 1 ── */}
          {step === 'start' && (
            <div className="start-section ob-animate-in" key="start">
              <p className="start-copy">{t.copy}</p>
              <button className="btn-primary btn-lg ob-btn-glow" onClick={handleStart} disabled={loading}>
                {loading ? t.preparing : t.continue}
              </button>
            </div>
          )}

          {/* ── Step 2 — Crispy wallet confirmation ── */}
          {step === 'confirm' && (
            <div className="ob-confirm-clean ob-animate-in" key="confirm">
              {/* Animated wallet icon */}
              <div className="ob-wallet-ring">
                <div className="ob-wallet-pulse" />
                <Icon name="wallet" size={30} color="#ffd700" />
              </div>

              <h3 className="ob-confirm-title">{t.creatingWallet}</h3>
              <p className="ob-confirm-desc">{t.walletDesc}</p>

              {/* Setup checklist */}
              <div className="ob-setup-list">
                {[
                  { icon: 'check', color: '#10b981', label: t.walletGenerated, value: '0x****...****', mono: true },
                  { icon: 'globe', color: '#10b981', label: 'Network',          value: t.network },
                  { icon: 'bolt',  color: '#10b981', label: 'Gas',              value: t.gas },
                ].map((item, i) => (
                  <div key={i} className="ob-setup-row" style={{ animationDelay: `${i * 0.12}s` }}>
                    <span className="ob-setup-icon-wrap">
                      <Icon name={item.icon} size={13} color={item.color} />
                    </span>
                    <span className="ob-setup-label">{item.label}</span>
                    <span className={`ob-setup-val ${item.mono ? 'ob-setup-val--mono' : ''}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary btn-lg ob-btn-glow" onClick={handleConfirm} disabled={loading}>
                {loading
                  ? <span className="ob-loading-row"><span className="ob-spin" />{t.settingUp}</span>
                  : t.getStarted}
              </button>

              <button className="ob-back-link" onClick={() => setStep('start')} disabled={loading}>
                <Icon name="back" size={13} color="#9ca3af" /> {t.back}
              </button>
            </div>
          )}
        </div>

        {/* ── Features section (replaces old benefit chips) ── */}
        <div className="ob-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="ob-feature-card" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
              <div className="ob-feat-icon" style={{ background: `${f.color}18`, border: `1px solid ${f.color}40` }}>
                <Icon name={f.icon} size={18} color={f.color} />
              </div>
              <div>
                <span className="ob-feat-title">{f.title}</span>
                <span className="ob-feat-desc">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
