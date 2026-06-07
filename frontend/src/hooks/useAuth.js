import { usePrivy, useWallets } from '@privy-io/react-auth';

const HAS_PRIVY = !!(import.meta.env.VITE_PRIVY_APP_ID?.length > 4);

const STUB_PRIVY   = { ready: true, authenticated: false, user: null, login: () => {}, logout: () => {} };
const STUB_WALLETS = { wallets: [] };

export function useAuth() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ready, authenticated, user, login, logout } = HAS_PRIVY ? usePrivy()   : STUB_PRIVY;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { wallets }                                   = HAS_PRIVY ? useWallets() : STUB_WALLETS;

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const externalWallet = wallets.find(w => w.walletClientType !== 'privy');
  const activeWallet = embeddedWallet || externalWallet || null;

  const walletAddress = activeWallet?.address ?? null;
  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return {
    ready,
    authenticated,
    user,
    login,
    logout,
    activeWallet,
    walletAddress,
    displayAddress,
    isEmbeddedWallet: !!embeddedWallet,
  };
}
