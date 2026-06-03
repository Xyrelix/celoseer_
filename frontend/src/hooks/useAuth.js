import { usePrivy, useWallets } from '@privy-io/react-auth';

export function useAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

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
