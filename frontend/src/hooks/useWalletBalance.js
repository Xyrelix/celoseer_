import { useReadContract, useBalance } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { CUSD_ADDRESS, ACTIVE_CHAIN } from '../config/wagmi';

const HAS_PRIVY = !!(import.meta.env.VITE_PRIVY_APP_ID?.length > 4);

// wagmi 3's useBalance no longer takes a `token` param — read the ERC20
// balanceOf directly. cUSD is 18 decimals.
export function useWalletBalance(address) {
  // When WagmiProvider isn't mounted (no Privy App ID), return zero stubs.
  const result = HAS_PRIVY
    ? useReadContract({  // eslint-disable-line react-hooks/rules-of-hooks
        address: CUSD_ADDRESS[ACTIVE_CHAIN.id],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: ACTIVE_CHAIN.id,
        query: { enabled: !!address },
      })
    : { data: undefined, isLoading: false, refetch: () => {} };

  const formatted = result.data != null
    ? parseFloat(formatUnits(result.data, 18)).toFixed(2)
    : '0.00';

  return { balance: formatted, isLoading: result.isLoading, refetch: result.refetch };
}

// Native CELO balance — the gas the user needs to send bet transactions.
export function useNativeBalance(address) {
  const result = HAS_PRIVY
    ? useBalance({  // eslint-disable-line react-hooks/rules-of-hooks
        address: address ?? undefined,
        chainId: ACTIVE_CHAIN.id,
        query: { enabled: !!address },
      })
    : { data: undefined, isLoading: false, refetch: () => {} };

  const formatted = result.data?.value != null
    ? parseFloat(formatUnits(result.data.value, 18)).toFixed(4)
    : '0.0000';

  return { celo: formatted, isLoading: result.isLoading, refetch: result.refetch };
}

