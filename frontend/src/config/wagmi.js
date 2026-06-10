import { http } from 'wagmi';
import { celo, celoSepolia } from 'wagmi/chains';
// Use Privy's createConfig wrapper so wagmi routes through the embedded wallet.
import { createConfig } from '@privy-io/wagmi';

export const CUSD_ADDRESS = {
  [celo.id]:       '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  [celoSepolia.id]: '0x0b219348a62037a6Ef33acF74EFD79a53234824b',
};

export const ACTIVE_CHAIN = celoSepolia;

export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  transports: {
    [celo.id]:        http(),
    [celoSepolia.id]: http(),
  },
});
