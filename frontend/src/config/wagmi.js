import { http, createConfig } from 'wagmi';
import { celo, celoAlfajores } from 'wagmi/chains';

export const CUSD_ADDRESS = {
  [celo.id]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  [celoAlfajores.id]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
};

export const ACTIVE_CHAIN = celoAlfajores;

export const wagmiConfig = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});
