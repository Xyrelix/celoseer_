import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('start');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    onComplete({
      username: `seer_${Math.random().toString(36).substring(2, 8)}`,
      walletAddress: '0x' + Math.random().toString(16).slice(2, 42),
      initialBalance: 100,
      createdAt: new Date().toISOString()
    });

    setLoading(false);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-hero">
        <div className="logo-circle">
          <img src="/logo.png" alt="CeloSeer logo" className="logo-image" />
        </div>
        <div className="logo-wordmark">
          <img src="CeloSeer.png" alt="CeloSeer" />
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
              Begin your CeloSeer journey with a gasless smart wallet.
            </p>

            <button
              className="btn-primary btn-lg"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? 'Preparing...' : 'Continue'}
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="confirm-section">
            <div className="confirm-animation">
              <div className="wallet-icon">💼</div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <h3>Creating Your Smart Wallet</h3>
            <p className="confirm-text">
              We're silently setting up your account abstraction wallet for gasless transactions.
            </p>

            <div className="confirm-details">
              <div className="detail-item">
                <span className="detail-label">✓ Wallet Generated</span>
                <span className="detail-value detail-addr">0x****...****</span>
              </div>
            </div>

            <button
              className="btn-primary btn-lg"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Get Started'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setStep('start')}
              disabled={loading}
            >
              Back
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
          <p>Mobile-optimized</p>
        </div>
      </div>
    </div>
  );
}
