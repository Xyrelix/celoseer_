import { useBalance } from 'wagmi';
import { CUSD_ADDRESS, ACTIVE_CHAIN } from '../config/wagmi';

export function useWalletBalance(address) {
  const { data, isLoading, refetch } = useBalance({
    address,
    token: CUSD_ADDRESS[ACTIVE_CHAIN.id],
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: !!address },
  });

  const formatted = data ? parseFloat(data.formatted).toFixed(2) : '0.00';

  return { balance: formatted, isLoading, refetch };
}
