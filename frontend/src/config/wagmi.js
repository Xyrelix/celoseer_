import { http } from 'wagmi';
import { celo, celoSepolia as celoSepoliaBase } from 'wagmi/chains';
// Use Privy's createConfig wrapper so wagmi routes through the embedded wallet.
import { createConfig } from '@privy-io/wagmi';

// forno (viem's default Celo Sepolia RPC) 403s the browser under load. Build a
// custom chain that points at dRPC so BOTH wagmi AND Privy's embedded wallet
// (which uses the chain's default RPC, not wagmi's transport) hit a working
// endpoint. Override with VITE_RPC_URL in .env / Vercel.
const SEPOLIA_RPC = import.meta.env.VITE_RPC_URL || 'https://celo-sepolia.drpc.org';

export const celoSepolia = {
  ...celoSepoliaBase,
  rpcUrls: {
    default: { http: [SEPOLIA_RPC] },
    public:  { http: [SEPOLIA_RPC] },
  },
};

export const CUSD_ADDRESS = {
  [celo.id]:        '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  [celoSepolia.id]: '0x0b219348a62037a6Ef33acF74EFD79a53234824b',
};

export const ACTIVE_CHAIN = celoSepolia;

export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  transports: {
    [celo.id]:        http(),
    [celoSepolia.id]: http(SEPOLIA_RPC),
  },
});
