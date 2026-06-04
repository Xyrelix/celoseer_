import { useState, useEffect } from 'react';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

const WC_IMAGES = [
  { url: '/wc1.jpg',        type: 'image' },
  { url: '/trim.mp4',       type: 'video' },
  { url: '/wc2.jpg',        type: 'image' },
  { url: '/rimm%202.mp4',   type: 'video' },
  { url: '/wc3.jpg',        type: 'image' },
  { url: '/wc4.jpg',        type: 'image' },
];

const TW_TEXTS = [
  'Predict FIFA World Cup 2026 outcomes with AI.',
  '82.4% accuracy across 847 prediction calls.',
  'Earn cUSD rewards on every correct call.',
  'Gasless smart wallet — zero fees on Celo.',
  "Join the world's first AI sports prediction market.",
];

const FEATURES = [
  { icon: 'insights', color: '#ffd700', title: 'AI Predictions', desc: '82.4% accuracy on 847+ historical calls' },
  { icon: 'coin',     color: '#10b981', title: 'Earn cUSD',      desc: 'Real rewards for every correct prediction' },
  { icon: 'shield',   color: '#6366f1', title: 'Gasless Wallet', desc: 'Zero transaction fees on Celo blockchain' },
  { icon: 'globe',    color: '#f97316', title: 'WC 2026 Live',   desc: '48 Teams · 104 Matches · 3 Nations' },
];

const LANGUAGES = {
  en: { flag: '🇬🇧', name: 'English',    rtl: false, copy: 'Begin your CeloSeer journey with a gasless smart wallet.',             continue: 'Get Started',  preparing: 'Preparing...',       back: 'Back' },
  es: { flag: '🇪🇸', name: 'Español',    rtl: false, copy: 'Comienza tu viaje en CeloSeer con una billetera sin gas.',             continue: 'Comenzar',     preparing: 'Preparando...',      back: 'Atrás' },
  fr: { flag: '🇫🇷', name: 'Français',   rtl: false, copy: 'Commencez votre parcours CeloSeer avec un portefeuille sans gaz.',     continue: 'Commencer',    preparing: 'Préparation...',     back: 'Retour' },
  pt: { flag: '🇧🇷', name: 'Português',  rtl: false, copy: 'Comece sua jornada CeloSeer com uma carteira sem gás.',               continue: 'Começar',      preparing: 'Preparando...',      back: 'Voltar' },
  de: { flag: '🇩🇪', name: 'Deutsch',    rtl: false, copy: 'Beginne deine CeloSeer-Reise mit einem gaslosen Wallet.',             continue: 'Loslegen',     preparing: 'Vorbereitung...',    back: 'Zurück' },
  ar: { flag: '🇸🇦', name: 'العربية',    rtl: true,  copy: 'ابدأ رحلتك مع CeloSeer بمحفظة ذكية بدون رسوم.',                    continue: 'ابدأ',         preparing: '...جاري',            back: 'رجوع' },
  it: { flag: '🇮🇹', name: 'Italiano',   rtl: false, copy: 'Inizia il tuo viaggio su CeloSeer con un portafoglio smart senza gas.', continue: 'Inizia',       preparing: 'Preparazione...',    back: 'Indietro' },
  zh: { flag: '🇨🇳', name: '中文',        rtl: false, copy: '使用无Gas智能钱包开始您的CeloSeer之旅。',                             continue: '开始',         preparing: '准备中...',           back: '返回' },
  ja: { flag: '🇯🇵', name: '日本語',      rtl: false, copy: 'ガスレス スマートウォレットでCeloSeerを始めましょう。',               continue: '始める',       preparing: '準備中...',           back: '戻る' },
  ko: { flag: '🇰🇷', name: '한국어',      rtl: false, copy: '가스 없는 스마트 지갑으로 CeloSeer 여정을 시작하세요.',              continue: '시작하기',      preparing: '준비 중...',          back: '뒤로' },
  nl: { flag: '🇳🇱', name: 'Nederlands', rtl: false, copy: 'Begin je CeloSeer-reis met een gasloze smart wallet.',               continue: 'Beginnen',     preparing: 'Voorbereiden...',    back: 'Terug' },
  tr: { flag: '🇹🇷', name: 'Türkçe',     rtl: false, copy: 'Gassız akıllı cüzdanla CeloSeer yolculuğuna başla.',               continue: 'Başla',        preparing: 'Hazırlanıyor...',    back: 'Geri' },
  pl: { flag: '🇵🇱', name: 'Polski',     rtl: false, copy: 'Rozpocznij swoją podróż z CeloSeer z portfelem bez gazu.',           continue: 'Rozpocznij',   preparing: 'Przygotowywanie...', back: 'Wróć' },
  ru: { flag: '🇷🇺', name: 'Русский',    rtl: false, copy: 'Начните путешествие с CeloSeer с безгазовым кошельком.',             continue: 'Начать',       preparing: 'Подготовка...',      back: 'Назад' },
  hi: { flag: '🇮🇳', name: 'हिन्दी',     rtl: false, copy: 'गैसलेस स्मार्ट वॉलेट के साथ CeloSeer यात्रा शुरू करें।',          continue: 'शुरू करें',    preparing: 'तैयारी हो रही है...', back: 'वापस' },
  sw: { flag: '🇰🇪', name: 'Kiswahili',  rtl: false, copy: 'Anza safari yako ya CeloSeer na pochi ya smart bila gesi.',         continue: 'Anza',         preparing: 'Inaandaa...',        back: 'Rudi' },
};
const LANG_KEYS = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'it', 'zh', 'ja', 'ko', 'nl', 'tr', 'pl', 'ru', 'hi', 'sw'];

export default function Onboarding({ privyReady = false }) {
  const { login } = useAuth();
  const [loading,        setLoading]        = useState(false);
  const [imgIndex,       setImgIndex]       = useState(0);
  const [prevImgIndex,   setPrevImgIndex]   = useState(null);
  const [lang,           setLang]           = useState('en');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const [twDisplay, setTwDisplay] = useState('');
  const [twIdx,     setTwIdx]     = useState(0);
  const [twPos,     setTwPos]     = useState(0);
  const [twPhase,   setTwPhase]   = useState('typing');

  const t = LANGUAGES[lang];

  useEffect(() => {
    const id = setInterval(() => {
      setImgIndex(i => { setPrevImgIndex(i); return (i + 1) % WC_IMAGES.length; });
    }, 4500);
    return () => clearInterval(id);
  }, []);

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

  const handleGetStarted = () => {
    setLoading(true);
    login();
    /* Privy's modal takes over; when user completes it, App detects authenticated=true */
    /* Reset loading after a moment in case user dismisses the modal */
    setTimeout(() => setLoading(false), 3000);
  };

  const goToSlide = (i) => { setPrevImgIndex(imgIndex); setImgIndex(i); };

  return (
    <div className="ob-root" dir={t.rtl ? 'rtl' : 'ltr'}>

      {/* Carousel background */}
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

      {/* Wordmark */}
      <div className="ob-corner-logo">
        <img src="/yellowceloseerbanner.png" alt="CeloSeer" className="ob-corner-img" />
      </div>

      {/* Language picker */}
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

      {/* Slide dots */}
      <div className="ob-dots">
        {WC_IMAGES.map((_, i) => (
          <button key={i} className={`ob-dot ${i === imgIndex ? 'ob-dot--active' : ''}`} onClick={() => goToSlide(i)} />
        ))}
      </div>

      {/* Main content */}
      <div className="ob-content">

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

        <div className="ob-card">
          <div className="start-section ob-animate-in">
            <p className="start-copy">{t.copy}</p>
            <button className="btn-primary btn-lg ob-btn-glow" onClick={handleGetStarted} disabled={loading || !privyReady}>
              {loading
                ? <span className="ob-loading-row"><span className="ob-spin" />{t.preparing}</span>
                : !privyReady
                ? <span className="ob-loading-row"><span className="ob-spin" />Loading...</span>
                : t.continue}
            </button>
          </div>
        </div>

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
