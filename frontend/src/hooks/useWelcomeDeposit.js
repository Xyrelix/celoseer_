import { useEffect, useRef } from 'react';
import { claimWelcome } from '../services/api';

// Fires the one-time 500 cUSD welcome deposit the first time we see an
// authenticated wallet. The backend is idempotent (on-chain `welcomed` guard),
// localStorage just avoids re-hitting the API on every reload.
export function useWelcomeDeposit(walletAddress, authenticated, onDeposited) {
  const attempted = useRef(new Set());

  useEffect(() => {
    if (!authenticated || !walletAddress) return;

    const key = `celoseer:welcomed:${walletAddress.toLowerCase()}`;
    if (attempted.current.has(walletAddress) || localStorage.getItem(key)) return;
    attempted.current.add(walletAddress);

    (async () => {
      try {
        const res = await claimWelcome(walletAddress);
        localStorage.setItem(key, '1');
        // Only refresh balance if tokens were actually minted this time.
        if (res?.txHash) onDeposited?.();
      } catch (err) {
        // Non-fatal — let them top up via the faucet page. Allow a later retry.
        attempted.current.delete(walletAddress);
        console.warn('welcome deposit failed:', err.message);
      }
    })();
  }, [walletAddress, authenticated, onDeposited]);
}
