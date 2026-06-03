import { ACTIVE_CHAIN } from './wagmi';

export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID,
  appearance: {
    theme: 'dark',
    accentColor: '#ffd700',
    logo: '/reallogo.png',
    landingHeader: 'Welcome to CeloSeer',
    loginMessage: 'Sign in to start predicting World Cup 2026',
  },
  loginMethods: ['email', 'google', 'twitter', 'apple', 'discord', 'wallet'],
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
    showWalletUIs: true,
  },
  defaultChain: ACTIVE_CHAIN,
  supportedChains: [ACTIVE_CHAIN],
};
