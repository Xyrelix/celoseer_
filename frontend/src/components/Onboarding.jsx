import { useState, useEffect } from 'react';

const WC_IMAGES = ['/wc1.jpg', '/wc2.jpg', '/wc3.jpg', '/wc4.jpg'];

const LANGUAGES = {
  en: {
    flag: '🇬🇧', name: 'EN',
    tagline: 'AI-Powered World Cup Predictions',
    copy: 'Begin your CeloSeer journey with a gasless smart wallet.',
    continue: 'Continue', preparing: 'Preparing...',
    getStarted: 'Get Started', settingUp: 'Setting up...',
    back: 'Back', creatingWallet: 'Creating Your Smart Wallet',
    walletDesc: "We're silently setting up your account abstraction wallet for gasless transactions.",
    walletGenerated: '✓ Wallet Generated',
    benefits: ['Gasless Tx', 'Secure', 'Mobile'], benefitIcons: ['⚡', '🔒', '📱'],
  },
  es: {
    flag: '🇪🇸', name: 'ES',
    tagline: 'Predicciones de Copa Mundial con IA',
    copy: 'Comienza tu viaje en CeloSeer con una billetera inteligente sin gas.',
    continue: 'Continuar', preparing: 'Preparando...',
    getStarted: 'Comenzar', settingUp: 'Configurando...',
    back: 'Atrás', creatingWallet: 'Creando Tu Billetera',
    walletDesc: 'Configuramos tu billetera para transacciones sin gas.',
    walletGenerated: '✓ Billetera Generada',
    benefits: ['Sin Gas', 'Seguro', 'Móvil'], benefitIcons: ['⚡', '🔒', '📱'],
  },
  fr: {
    flag: '🇫🇷', name: 'FR',
    tagline: 'Pronostics Coupe du Monde par IA',
    copy: 'Commencez votre parcours CeloSeer avec un portefeuille intelligent.',
    continue: 'Continuer', preparing: 'Préparation...',
    getStarted: 'Commencer', settingUp: 'Configuration...',
    back: 'Retour', creatingWallet: 'Création du Portefeuille',
    walletDesc: 'Nous configurons votre portefeuille pour des transactions sans gaz.',
    walletGenerated: '✓ Portefeuille Créé',
    benefits: ['Sans Gaz', 'Sécurisé', 'Mobile'], benefitIcons: ['⚡', '🔒', '📱'],
  },
  pt: {
    flag: '🇧🇷', name: 'PT',
    tagline: 'Previsões da Copa do Mundo com IA',
    copy: 'Comece sua jornada CeloSeer com uma carteira sem gás.',
    continue: 'Continuar', preparing: 'Preparando...',
    getStarted: 'Começar', settingUp: 'Configurando...',
    back: 'Voltar', creatingWallet: 'Criando Sua Carteira',
    walletDesc: 'Configuramos sua carteira para transações sem gás.',
    walletGenerated: '✓ Carteira Gerada',
    benefits: ['Sem Gas', 'Seguro', 'Mobile'], benefitIcons: ['⚡', '🔒', '📱'],
  },
  de: {
    flag: '🇩🇪', name: 'DE',
    tagline: 'KI-gestützte WM-Vorhersagen',
    copy: 'Beginne deine CeloSeer-Reise mit einem gaslosen Smart Wallet.',
    continue: 'Weiter', preparing: 'Vorbereitung...',
    getStarted: 'Loslegen', settingUp: 'Einrichten...',
    back: 'Zurück', creatingWallet: 'Wallet Wird Erstellt',
    walletDesc: 'Wir richten dein Wallet für gaslose Transaktionen ein.',
    walletGenerated: '✓ Wallet Erstellt',
    benefits: ['Gaslos', 'Sicher', 'Mobil'], benefitIcons: ['⚡', '🔒', '📱'],
  },
  ar: {
    flag: '🇸🇦', name: 'AR',
    tagline: 'توقعات كأس العالم بالذكاء الاصطناعي',
    copy: 'ابدأ رحلتك مع CeloSeer بمحفظة ذكية بدون رسوم غاز.',
    continue: 'متابعة', preparing: '...جاري التحضير',
    getStarted: 'ابدأ الآن', settingUp: '...جاري الإعداد',
    back: 'رجوع', creatingWallet: 'إنشاء محفظتك الذكية',
    walletDesc: 'نقوم بإعداد محفظتك للمعاملات بدون رسوم.',
    walletGenerated: '✓ تم إنشاء المحفظة',
    benefits: ['بدون رسوم', 'آمن', 'موبايل'], benefitIcons: ['⚡', '🔒', '📱'],
  },
};

const LANG_KEYS = ['en', 'es', 'fr', 'pt', 'de', 'ar'];

export default function Onboarding({ onComplete }) {
  const [step,         setStep]         = useState('start');
  const [loading,      setLoading]      = useState(false);
  const [imgIndex,     setImgIndex]     = useState(0);
  const [prevImgIndex, setPrevImgIndex] = useState(null);
  const [lang,         setLang]         = useState('en');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t = LANGUAGES[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex(i => {
        setPrevImgIndex(i);
        return (i + 1) % WC_IMAGES.length;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
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

  const goToSlide = (i) => {
    setPrevImgIndex(imgIndex);
    setImgIndex(i);
  };

  return (
    <div className="ob-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* ── Carousel Background ── */}
      <div className="ob-carousel">
        {WC_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`ob-slide ${i === imgIndex ? 'ob-slide--active' : ''} ${i === prevImgIndex ? 'ob-slide--prev' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="ob-overlay" />
      </div>

      {/* ── Language Picker ── */}
      <div className="ob-lang">
        <button
          className="ob-lang-btn"
          onClick={() => setShowLangPicker(p => !p)}
          aria-label="Select language"
        >
          <span className="ob-lang-flag">{t.flag}</span>
          <span className="ob-lang-code">{t.name}</span>
          <span className="ob-chevron">{showLangPicker ? '▴' : '▾'}</span>
        </button>

        {showLangPicker && (
          <div className="ob-lang-menu">
            {LANG_KEYS.map(key => (
              <button
                key={key}
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

      {/* ── Slide Dots ── */}
      <div className="ob-dots">
        {WC_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`ob-dot ${i === imgIndex ? 'ob-dot--active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="ob-content">
        {/* Hero */}
        <div className="ob-hero">
          <div className="ob-logo-ring">
            <img src="/reallogo.png" alt="CeloSeer" className="logo-image" />
          </div>
          <div className="ob-wordmark">
            <img src="/realceloseer.png" alt="CeloSeer" />
          </div>
          <p className="ob-tagline">{t.tagline}</p>
        </div>

        {/* Card */}
        <div className="ob-card">
          <div className="steps-indicator">
            <div className={`step ${step === 'start' ? 'active' : 'done'}`}>1</div>
            <div className="connector" />
            <div className={`step ${step === 'confirm' ? 'active' : ''}`}>2</div>
          </div>

          {step === 'start' && (
            <div className="start-section ob-animate-in" key="start">
              <p className="start-copy">{t.copy}</p>
              <button
                className="btn-primary btn-lg ob-btn-glow"
                onClick={handleStart}
                disabled={loading}
              >
                {loading ? t.preparing : t.continue}
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="confirm-section ob-animate-in" key="confirm">
              <div className="confirm-animation">
                <div className="wallet-icon">💼</div>
                <div className="loading-dots">
                  <span /><span /><span />
                </div>
              </div>
              <h3>{t.creatingWallet}</h3>
              <p className="confirm-text">{t.walletDesc}</p>
              <div className="confirm-details">
                <div className="detail-item">
                  <span className="detail-label">{t.walletGenerated}</span>
                  <span className="detail-value detail-addr">0x****...****</span>
                </div>
              </div>
              <button className="btn-primary btn-lg ob-btn-glow" onClick={handleConfirm} disabled={loading}>
                {loading ? t.settingUp : t.getStarted}
              </button>
              <button className="btn-secondary" onClick={() => setStep('start')} disabled={loading}>
                {t.back}
              </button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="onboarding-benefits">
          {t.benefits.map((b, i) => (
            <div key={i} className="ob-benefit" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
              <span className="benefit-icon">{t.benefitIcons[i]}</span>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
