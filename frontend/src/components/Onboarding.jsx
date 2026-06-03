import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LOGIN_OPTIONS = [
  { id: 'google',   label: 'Continue with Google',   icon: 'G' },
  { id: 'twitter',  label: 'Continue with X',         icon: '𝕏' },
  { id: 'apple',    label: 'Continue with Apple',     icon: '' },
  { id: 'email',    label: 'Continue with Email',     icon: '✉' },
];

export default function Onboarding({ onComplete }) {
  const { ready, authenticated, login, user, walletAddress, displayAddress, isEmbeddedWallet } = useAuth();
  const [step, setStep] = useState('start');
  const [loggingIn, setLoggingIn] = useState(false);

  // Once authenticated + wallet ready, move to confirm step
  useEffect(() => {
    if (authenticated && walletAddress && step === 'start') {
      setStep('confirm');
    }
  }, [authenticated, walletAddress, step]);

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      await login();
    } finally {
      setLoggingIn(false);
    }
  };

  const handleEnter = () => {
    onComplete({
      privyId: user?.id,
      email: user?.email?.address ?? null,
      walletAddress,
      displayAddress,
      isEmbeddedWallet,
    });
  };

  if (!ready) {
    return (
      <div className="onboarding">
        <div className="onboarding-hero">
          <div className="logo-circle">
            <img src="/reallogo.png" alt="CeloSeer logo" className="logo-image" />
          </div>
        </div>
        <div className="loading-dots" style={{ justifyContent: 'center', marginTop: 40 }}>
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding">
      <div className="onboarding-hero">
        <div className="logo-circle">
          <img src="/reallogo.png" alt="CeloSeer logo" className="logo-image" />
        </div>
        <div className="logo-wordmark">
          <img src="/realceloseer.png" alt="CeloSeer" />
        </div>
      </div>

      <div className="onboarding-card">
        <div className="steps-indicator">
          <div className={`step ${step === 'start' ? 'active' : 'done'}`}>1</div>
          <div className="connector"></div>
          <div className={`step ${step === 'confirm' ? 'active' : ''}`}>2</div>
        </div>

        {step === 'start' && (
          <div className="start-section">
            <p className="start-copy">
              Predict World Cup 2026 outcomes powered by AI — sign in to get your gasless wallet.
            </p>

            {LOGIN_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className="btn-social"
                onClick={handleLogin}
                disabled={loggingIn}
              >
                <span className="social-icon">{opt.icon}</span>
                {loggingIn ? 'Opening login…' : opt.label}
              </button>
            ))}

            <div className="divider">─── or ───</div>

            <button className="btn-secondary" onClick={handleLogin} disabled={loggingIn}>
              Connect Existing Wallet
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="confirm-section">
            <div className="confirm-animation">
              <div className="wallet-icon">💼</div>
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <h3>Wallet Ready</h3>
            <p className="confirm-text">
              {isEmbeddedWallet
                ? 'Your gasless smart wallet has been created on Celo.'
                : 'External wallet connected to Celo.'}
            </p>

            <div className="confirm-details">
              <div className="detail-item">
                <span className="detail-label">✓ Wallet</span>
                <span className="detail-value detail-addr">{displayAddress}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">✓ Network</span>
                <span className="detail-value">Celo Alfajores</span>
              </div>
              {isEmbeddedWallet && (
                <div className="detail-item">
                  <span className="detail-label">✓ Gas</span>
                  <span className="detail-value">Sponsored</span>
                </div>
              )}
            </div>

            <button className="btn-primary btn-lg" onClick={handleEnter}>
              Enter CeloSeer
            </button>
          </div>
        )}
      </div>

      <div className="onboarding-benefits">
        <div className="benefit">
          <span className="benefit-icon">⚡</span>
          <p>Gasless transactions</p>
        </div>
        <div className="benefit">
          <span className="benefit-icon">🔒</span>
          <p>Secure & private</p>
        </div>
        <div className="benefit">
          <span className="benefit-icon">📱</span>
          <p>Social login</p>
        </div>
      </div>
    </div>
  );
}
