import { ACTIVE_CHAIN } from './wagmi';

export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

export const privyConfig = {
  appearance: {
    theme: 'dark',
    accentColor: '#ffd700',
    logo: '/reallogo.png',
    landingHeader: 'Welcome to CeloSeer',
    loginMessage: 'Sign in to start predicting World Cup 2026',
  },
  loginMethods: ['email', 'google', 'twitter', 'apple', 'discord', 'wallet'],
  // Privy v3 nests embedded-wallet config under the chain type.
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
    showWalletUIs: true,
  },
  defaultChain: ACTIVE_CHAIN,
  supportedChains: [ACTIVE_CHAIN],
};
