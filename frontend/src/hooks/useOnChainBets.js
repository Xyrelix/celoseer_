import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI, MARKET_MAPPINGS } from './useContract';
import { ACTIVE_CHAIN } from '../config/wagmi';
import { MARKET_BY_ID } from '../data/markets';

const OUTCOME_LABEL = ['yes', 'no', 'draw'];
const STATUS = { OPEN: 0, RESOLVED: 1, CANCELLED: 2 };

// Read the user's positions straight from the contract — the source of truth.
// For each mapped market we read getBet (the user's stake) and getMarket (its
// resolution state) so we can tell active / won / lost / refundable + claimable.
export function useOnChainBets(address) {
  const entries = Object.entries(MARKET_MAPPINGS); // [frontendId, onChainId]

  const contracts = address && CONTRACT_ADDRESS
    ? entries.flatMap(([, onChainId]) => ([
        { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getBet',
          args: [BigInt(onChainId), address], chainId: ACTIVE_CHAIN.id },
        { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getMarket',
          args: [BigInt(onChainId)], chainId: ACTIVE_CHAIN.id },
      ]))
    : [];

  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    },
  });

  if (isError && error) {
    console.warn('[useOnChainBets] read failed:', error.message || error);
  }

  const positions = [];
  if (data && data.length > 0) {
    entries.forEach(([frontendId, onChainId], idx) => {
      const betRes = data[idx * 2];
      const mktRes = data[idx * 2 + 1];
      if (!betRes) {
        console.warn(`[useOnChainBets] no result for market ${onChainId}`);
        return;
      }
      if (betRes?.status !== 'success') {
        console.warn(`[useOnChainBets] market ${onChainId} getBet error:`, betRes?.error);
        return;
      }
      if (!betRes.result) return;

      // getBet → (amount, outcome, claimed)
      const [amountWei, outcomeRaw, claimed] = betRes.result;
      if (!amountWei || amountWei === 0n) return;

      const fid    = Number(frontendId);
      const meta   = MARKET_BY_ID[fid];
      const pick   = OUTCOME_LABEL[Number(outcomeRaw)] ?? 'yes';
      const amount = parseFloat(formatEther(amountWei));
      const odds   = pick === 'yes' ? meta?.yesOdds : pick === 'no' ? meta?.noOdds : meta?.drawOdds;

      // getMarket → (question, closeTime, status, result, ...)
      let mStatus = STATUS.OPEN, mResult = null;
      if (mktRes?.status === 'success' && mktRes.result) {
        mStatus = Number(mktRes.result[2]);
        mResult = OUTCOME_LABEL[Number(mktRes.result[3])] ?? null;
      }

      let state = 'active', result, claimable = false, claimType = null;
      if (mStatus === STATUS.RESOLVED) {
        const won = pick === mResult;
        state  = 'closed';
        result = won ? 'won' : 'lost';
        claimable = won && !claimed;
        if (claimable) claimType = 'winnings';
      } else if (mStatus === STATUS.CANCELLED) {
        state  = 'closed';
        result = 'refund';
        claimable = !claimed;
        if (claimable) claimType = 'refund';
      }

      positions.push({
        id:              `${fid}-${pick}`,
        marketId:        fid,
        onChainId:       Number(onChainId),
        marketTitle:     meta?.title ?? `Market ${fid}`,
        prediction:      pick,
        amount,
        odds:            odds ?? null,
        potentialPayout: odds ? +(amount * odds).toFixed(2) : null,
        potentialProfit: odds ? +(amount * odds - amount).toFixed(2) : null,
        status:          state,        // 'active' | 'closed'
        result,                        // 'won' | 'lost' | 'refund' | undefined
        claimed,
        claimable,
        claimType,                     // 'winnings' | 'refund' | null
        timestamp:       'On-chain',
      });
    });
  }

  return { positions, isLoading, refetch };
}
