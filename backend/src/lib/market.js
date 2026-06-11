import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { celoSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const RPC_URL = process.env.CELO_RPC_URL || 'https://celo-sepolia.drpc.org';
const CONTRACT = process.env.CONTRACT_ADDRESS || '0xFC653BA52d3d4919FC7806A621ef60b55ebc2859';
const KEY = process.env.FAUCET_PRIVATE_KEY; // contract owner — same wallet that owns MockCUSD

export const MARKET_ABI = parseAbi([
  'function marketCount() view returns (uint256)',
  'function getMarket(uint256 id) view returns (string question, uint256 closeTime, uint8 status, uint8 result, bool hasDraw, uint256 yesPool, uint256 noPool, uint256 drawPool, uint256 totalPool)',
  'function resolveMarket(uint256 id, uint8 result)',
]);

export const STATUS = { OPEN: 0, RESOLVED: 1, CANCELLED: 2 };
export const OUTCOME = { yes: 0, no: 1, draw: 2 };

const account = KEY ? privateKeyToAccount(KEY) : null;

export const isResolverConfigured = () => !!(account && CONTRACT);

export const publicClient = createPublicClient({ chain: celoSepolia, transport: http(RPC_URL) });

export const walletClient = account
  ? createWalletClient({ account, chain: celoSepolia, transport: http(RPC_URL) })
  : null;

export const CONTRACT_ADDRESS = CONTRACT;
