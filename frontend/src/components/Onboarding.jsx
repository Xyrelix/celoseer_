import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate account abstraction - creating smart wallet
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && username) {
      onComplete({
        email,
        username,
        walletAddress: '0x' + Math.random().toString(16).slice(2, 42),
        initialBalance: 100,
        createdAt: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    // Simulate social login + smart account creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete({
      email: `user-${provider}@${provider}.com`,
      username: `user_${Math.random().toString(36).substring(7)}`,
      walletAddress: '0x' + Math.random().toString(16).slice(2, 42),
      initialBalance: 100,
      provider,
      createdAt: new Date().toISOString()
    });
    setLoading(false);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-hero">
        <div className="logo-circle">🎯</div>
        <h1>CeloSeer</h1>
        <p className="tagline">Predict. Earn. Repeat.</p>
      </div>

      <div className="onboarding-card">
        <div className="steps-indicator">
          <div className={`step ${step === 'login' ? 'active' : 'done'}`}>1</div>
          <div className="connector"></div>
          <div className={`step ${step === 'confirm' ? 'active' : ''}`}>2</div>
        </div>

        {step === 'login' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            setStep('confirm');
          }} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary btn-lg">
              Continue
            </button>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn-social"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <span className="social-icon">G</span>
              Sign in with Google
            </button>

            <button
              type="button"
              className="btn-social"
              onClick={() => handleSocialLogin('twitter')}
              disabled={loading}
            >
              <span className="social-icon">𝕏</span>
              Sign in with X
            </button>
          </form>
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
                <span className="detail-label">✓ Email Verified</span>
                <span className="detail-value">{email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">✓ Username Set</span>
                <span className="detail-value">@{username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">✓ Wallet Generated</span>
                <span className="detail-value detail-addr">0x****...****</span>
              </div>
            </div>

            <button
              className="btn-primary btn-lg"
              onClick={(e) => {
                e.preventDefault();
                handleEmailSignup(e);
              }}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Get Started'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setStep('login')}
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
