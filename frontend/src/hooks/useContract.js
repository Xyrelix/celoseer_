import { useWriteContract, useReadContract } from 'wagmi';
import { parseEther, erc20Abi } from 'viem';
import { useState } from 'react';
import deployment from '../contracts/deployment.js';
import { ACTIVE_CHAIN } from '../config/wagmi';

export const CONTRACT_ADDRESS = deployment.address;
export const CUSD_ADDRESS     = deployment.cUSD;
export const CONTRACT_ABI     = deployment.abi;
export const MARKET_MAPPINGS  = deployment.marketMappings;

const OUTCOME_ENUM = { yes: 0, no: 1, draw: 2 };

// ─── Place bet on-chain ──────────────────────────────────────────────────────

export function usePlaceBetOnChain() {
  const [stage, setStage] = useState('idle'); // idle | approving | betting | done | error
  const [error, setError] = useState(null);

  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: bet }     = useWriteContract();

  const placeBet = async ({ backendMarketId, outcome, amount }) => {
    if (!CONTRACT_ADDRESS) throw new Error('Contract not deployed yet');

    const contractMarketId = MARKET_MAPPINGS[backendMarketId];
    if (!contractMarketId) throw new Error(`No on-chain market for ${backendMarketId}`);

    const amountWei   = parseEther(String(amount));
    const outcomeEnum = OUTCOME_ENUM[outcome];
    if (outcomeEnum === undefined) throw new Error(`Invalid outcome: ${outcome}`);

    try {
      setError(null);

      setStage('approving');
      await approve({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountWei],
      });

      setStage('betting');
      const betTx = await bet({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'placeBet',
        args: [BigInt(contractMarketId), outcomeEnum, amountWei],
      });

      setStage('done');
      return betTx;
    } catch (err) {
      setError(err.shortMessage ?? err.message);
      setStage('error');
      throw err;
    }
  };

  const reset = () => { setStage('idle'); setError(null); };

  return { placeBet, stage, error, reset, isContractReady: !!CONTRACT_ADDRESS };
}

// ─── Read live on-chain odds ─────────────────────────────────────────────────

export function useOnChainOdds(backendMarketId) {
  const contractMarketId = MARKET_MAPPINGS[backendMarketId];
  const enabled = !!CONTRACT_ADDRESS && !!contractMarketId;

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getOdds',
    args: contractMarketId ? [BigInt(contractMarketId)] : undefined,
    chainId: ACTIVE_CHAIN.id,
    query: {
      enabled,
      // odds shift as pools fill — keep them reasonably fresh
      refetchInterval: 15_000,
    },
  });

  const odds = data
    ? {
        yes:  data[0] > 0n ? Number(data[0]) / 10000 : null,
        no:   data[1] > 0n ? Number(data[1]) / 10000 : null,
        draw: data[2] > 0n ? Number(data[2]) / 10000 : null,
      }
    : null;

  return { odds, isLoading, refetch, enabled };
}

// ─── Merge on-chain odds with the AI/fallback odds carried on the market ──────
// Returns display-ready odds plus an `isLive` flag per outcome so the UI can
// badge values that actually come from the contract's live pools.

export function useDisplayOdds(market) {
  const { odds, isLoading } = useOnChainOdds(market?.id);

  const yes  = odds?.yes  ?? market?.yesOdds  ?? null;
  const no   = odds?.no   ?? market?.noOdds   ?? null;
  const draw = odds?.draw ?? market?.drawOdds ?? null;

  return {
    yes,
    no,
    draw,
    // a value is "live" only when it came from a non-empty on-chain pool
    liveYes:  odds?.yes  != null,
    liveNo:   odds?.no   != null,
    liveDraw: odds?.draw != null,
    isLive:   odds?.yes != null || odds?.no != null,
    isLoading,
  };
}
