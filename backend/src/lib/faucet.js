import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
  parseEther,
} from 'viem';
import { celoSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Use viem's built-in Celo Sepolia chain — it carries the Celo-specific
// transaction formatters/serializers, without which gas estimates come out 0.
const RPC_URL = process.env.CELO_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org';

const MOCK_CUSD_ABI = parseAbi([
  'function welcome(address user)',
  'function mint(address to, uint256 amt)',
  'function welcomed(address) view returns (bool)',
]);

const TOKEN_ADDRESS = process.env.MOCK_CUSD_ADDRESS;
const PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;

const account = PRIVATE_KEY ? privateKeyToAccount(PRIVATE_KEY) : null;

export const isFaucetConfigured = () => !!(account && TOKEN_ADDRESS);

const publicClient = createPublicClient({ chain: celoSepolia, transport: http(RPC_URL) });

const walletClient = account
  ? createWalletClient({ account, chain: celoSepolia, transport: http(RPC_URL) })
  : null;

function assertConfigured() {
  if (!isFaucetConfigured()) {
    throw new Error('Faucet not configured — set FAUCET_PRIVATE_KEY and MOCK_CUSD_ADDRESS');
  }
}

/** True if this address already received its one-time welcome deposit. */
export async function hasBeenWelcomed(address) {
  assertConfigured();
  return publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: MOCK_CUSD_ABI,
    functionName: 'welcomed',
    args: [address],
  });
}

/** One-time 500 cUSD welcome deposit. Idempotent on-chain. */
export async function sendWelcome(address) {
  assertConfigured();
  if (await hasBeenWelcomed(address)) {
    return { alreadyWelcomed: true, txHash: null };
  }
  const txHash = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: MOCK_CUSD_ABI,
    functionName: 'welcome',
    args: [address],
  });
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return { alreadyWelcomed: false, txHash };
}

/** Faucet-page top-up: mint a fixed amount of test cUSD to the user. */
export async function sendClaim(address, amount = '500') {
  assertConfigured();
  const txHash = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: MOCK_CUSD_ABI,
    functionName: 'mint',
    args: [address, parseEther(String(amount))],
  });
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return { txHash };
}
