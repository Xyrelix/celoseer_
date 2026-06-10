const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data;
}

export function fetchMarkets(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v && v !== 'all')
  ).toString();
  return request(`/api/markets${qs ? `?${qs}` : ''}`);
}

export function fetchMarket(id) {
  return request(`/api/markets/${id}`);
}

export function placeBet({ marketId, outcome, amount }, walletAddress) {
  return request('/api/bets', {
    method: 'POST',
    headers: { 'x-wallet-address': walletAddress },
    body: JSON.stringify({ marketId, outcome, amount }),
  });
}

export function fetchMyBets(walletAddress, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/bets/me${qs ? `?${qs}` : ''}`, {
    headers: { 'x-wallet-address': walletAddress },
  });
}

export function fetchMatchPrediction(team1, team2, stage = 'group') {
  return request(`/api/predictions/match/${team1}/${team2}?stage=${stage}`);
}

// One-time signup deposit (500 cUSD). Idempotent — safe to call on every login.
export function claimWelcome(address) {
  return request('/api/faucet/welcome', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}

// Manual faucet-page top-up.
export function claimFaucet(address) {
  return request('/api/faucet/claim', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}
