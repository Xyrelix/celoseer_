import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, erc20Abi } from 'viem';
import { useState, useEffect } from 'react';

// Loaded after contracts are deployed — falls back gracefully if not yet deployed
let deploymentData = null;
try {
  deploymentData = (await import('../contracts/PredictionMarket.json', { assert: { type: 'json' } })).default;
} catch {
  // Contract not yet deployed — betting will use backend API fallback
}

export const CONTRACT_ADDRESS = deploymentData?.address ?? null;
export const CUSD_ADDRESS     = deploymentData?.cUSD    ?? null;
export const CONTRACT_ABI     = deploymentData?.abi     ?? [];
export const MARKET_MAPPINGS  = deploymentData?.marketMappings ?? {};

const OUTCOME_ENUM = { yes: 0, no: 1, draw: 2 };

// ─── Place bet on-chain ──────────────────────────────────────────────────────

export function usePlaceBetOnChain() {
  const [stage, setStage] = useState('idle'); // idle | approving | approved | betting | done | error
  const [error, setError] = useState(null);

  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: bet }     = useWriteContract();

  const placeBet = async ({ backendMarketId, outcome, amount, walletAddress }) => {
    if (!CONTRACT_ADDRESS) throw new Error('Contract not deployed yet');

    const contractMarketId = MARKET_MAPPINGS[backendMarketId];
    if (!contractMarketId) throw new Error(`No on-chain market for ${backendMarketId}`);

    const amountWei = parseEther(String(amount));
    const outcomeEnum = OUTCOME_ENUM[outcome];
    if (outcomeEnum === undefined) throw new Error(`Invalid outcome: ${outcome}`);

    try {
      setError(null);

      // Step 1: Approve cUSD spend
      setStage('approving');
      const approveTx = await approve({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountWei],
      });

      setStage('approved');

      // Step 2: Place bet on contract
      setStage('betting');
      const betTx = await bet({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'placeBet',
        args: [BigInt(contractMarketId), outcomeEnum, amountWei],
      });

      setStage('done');
      return { approveTx, betTx };
    } catch (err) {
      setError(err.shortMessage ?? err.message);
      setStage('error');
      throw err;
    }
  };

  const reset = () => { setStage('idle'); setError(null); };

  return { placeBet, stage, error, reset, isContractReady: !!CONTRACT_ADDRESS };
}

// ─── Read live on-chain odds for a market ───────────────────────────────────

export function useOnChainOdds(backendMarketId) {
  const contractMarketId = MARKET_MAPPINGS[backendMarketId];

  const { data } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getOdds',
    args: contractMarketId ? [BigInt(contractMarketId)] : undefined,
    query: { enabled: !!CONTRACT_ADDRESS && !!contractMarketId },
  });

  if (!data) return null;
  const [yesRaw, noRaw, drawRaw] = data;
  // Contract returns odds * 1e4, convert to decimal multiplier
  return {
    yes:  yesRaw  > 0n ? Number(yesRaw)  / 10000 : null,
    no:   noRaw   > 0n ? Number(noRaw)   / 10000 : null,
    draw: drawRaw > 0n ? Number(drawRaw) / 10000 : null,
  };
}
