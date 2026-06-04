import { useReadContract } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { CUSD_ADDRESS, ACTIVE_CHAIN } from '../config/wagmi';

// wagmi 3's useBalance no longer takes a `token` param — read the ERC20
// balanceOf directly. cUSD is 18 decimals.
export function useWalletBalance(address) {
  const { data, isLoading, refetch } = useReadContract({
    address: CUSD_ADDRESS[ACTIVE_CHAIN.id],
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: !!address },
  });

  const formatted = data != null
    ? parseFloat(formatUnits(data, 18)).toFixed(2)
    : '0.00';

  return { balance: formatted, isLoading, refetch };
}
