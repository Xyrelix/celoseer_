import { useState } from 'react';
import Icon from './Icon';
import { claimFaucet } from '../services/api';

const EXPLORER_TX = (hash) => `https://celo-sepolia.blockscout.com/tx/${hash}`;
const GAS_FAUCET = 'https://faucet.celo.org/celo-sepolia';

export default function Faucet({ walletAddress, displayAddress, balance, celo, onBack, onClaimed }) {
  const [status, setStatus] = useState('idle'); // idle | claiming | done | error
  const [txHash, setTxHash] = useState(null);
  const [error,  setError]  = useState(null);

  const claiming = status === 'claiming';

  const handleClaim = async () => {
    if (claiming || !walletAddress) return;
    setStatus('claiming');
    setError(null);
    setTxHash(null);
    try {
      const res = await claimFaucet(walletAddress);
      setTxHash(res.txHash);
      setStatus('done');
      onClaimed?.();
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button className="prof-back-btn" onClick={onBack}>
          <Icon name="back" size={20} color="#ffd700" />
        </button>
        <h2 className="profile-topbar-title">Test Faucet</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="prof-balance-card glass-market">
        <div className="pbal-header">
          <Icon name="wallet" size={20} color="#ffd700" />
          <span className="pbal-label">Current Balance</span>
        </div>
        <div className="pbal-amount">
          {parseFloat(balance || 0).toFixed(2)} <span className="pbal-currency">cUSD</span>
        </div>
        <div className="pbal-row">
          <div className="pbal-item">
            <span className="pbal-item-label">Gas (CELO)</span>
            <span className="pbal-item-val">{parseFloat(celo || 0).toFixed(4)}</span>
          </div>
        </div>
        <div className="pbal-wallet-addr">
          <Icon name="coin" size={13} color="#6b7280" />
          <span className="pbal-addr-text">{displayAddress || walletAddress || '—'}</span>
        </div>
      </div>

      <div className="glass-market" style={{ padding: '20px 18px', marginTop: 14, textAlign: 'center' }}>
        <Icon name="coin" size={40} color="#ffd700" />
        <h3 style={{ margin: '12px 0 6px', color: '#fff' }}>Claim 500 test cUSD</h3>
        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 18px' }}>
          Free testnet cUSD to place wagers. No gas needed — it's minted straight to your wallet.
        </p>

        <button
          className="btn-primary btn-lg ob-btn-glow"
          style={{ width: '100%' }}
          onClick={handleClaim}
          disabled={claiming || !walletAddress}
        >
          {claiming
            ? <span className="ob-loading-row"><span className="ob-spin" />Minting…</span>
            : 'Claim 500 cUSD'}
        </button>

        {status === 'done' && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
              ✓ 500 cUSD sent to your wallet
            </span>
            {txHash && (
              <a href={EXPLORER_TX(txHash)} target="_blank" rel="noreferrer"
                 style={{ color: '#ffd700', fontSize: '0.75rem' }}>
                View transaction ↗
              </a>
            )}
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="warning" size={15} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Gas — users need CELO to actually send a bet tx */}
      <div className="glass-market" style={{ padding: '16px 18px', marginTop: 14 }}>
        <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: '0.95rem' }}>Need gas to place bets?</h4>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 12px' }}>
          Bets are sent from your own wallet, which needs a little <strong>CELO</strong> for gas.
          Claim some free, then paste your address below.
        </p>
        <button
          className="btn-secondary"
          style={{ width: '100%', marginBottom: 8 }}
          onClick={() => navigator.clipboard?.writeText(walletAddress || '')}
        >
          Copy my address
        </button>
        <a
          href={GAS_FAUCET}
          target="_blank"
          rel="noreferrer"
          className="btn-primary btn-lg"
          style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          Get CELO for gas ↗
        </a>
      </div>

      <div className="disclaimer" style={{ marginTop: 16 }}>
        <Icon name="warning" size={16} color="#f87171" />
        <p>Testnet only. These tokens have no real value.</p>
      </div>

      <div className="home-bottom-pad" />
    </div>
  );
}
