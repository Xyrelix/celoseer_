import { useState, useEffect, useCallback } from 'react';
import { fetchMyBets } from '../services/api';

export function useBets(walletAddress) {
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalStaked: 0, totalWon: 0, pnl: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyBets(walletAddress);
      setBets(data.bets ?? []);
      setStats(data.stats ?? {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => { load(); }, [load]);

  return { bets, stats, loading, error, refetch: load };
}
