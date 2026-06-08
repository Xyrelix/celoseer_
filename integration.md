# CeloSeer — Integration Guide

> How the frontend, backend, and smart contract connect end-to-end.

---

## Table of Contents

1. [System Diagram](#1-system-diagram)
2. [Frontend ↔ Backend](#2-frontend--backend)
3. [Frontend ↔ Smart Contract](#3-frontend--smart-contract)
4. [Backend ↔ AI (Anthropic)](#4-backend--ai-anthropic)
5. [Auth Flow (Privy)](#5-auth-flow-privy)
6. [Bet Placement End-to-End](#6-bet-placement-end-to-end)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [Common Issues](#8-common-issues)

---

## 1. System Diagram

```
User's Browser
│
├─ Privy SDK  ──────────────────────────────► Privy Auth Servers
│  (embedded wallet / social login)
│
├─ wagmi / viem  ───────────────────────────► Celo Sepolia RPC (forno)
│  (on-chain reads: getOdds, balance)         PredictionMarket.sol
│  (on-chain writes: approve, placeBet)       cUSD ERC-20
│
└─ fetch (api.js)  ─────────────────────────► Backend :4000
                                               │
                                               └─► Anthropic API
                                                   (Claude Sonnet 4.6)
```

---

## 2. Frontend ↔ Backend

### 2.1 Base URL

Configured in `.env`:
```
VITE_BACKEND_URL=http://localhost:4000    # local
VITE_BACKEND_URL=https://api.example.com  # production
```

`frontend/src/services/api.js` wraps all calls:
```js
const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000';

export async function fetchMarkets() {
  const res = await fetch(`${BASE}/api/markets`);
  return res.json();
}
```

### 2.2 Market Data Flow

```
PredictTab (mount)
  → useMarkets()
    → GET /api/markets
      → footballData.getAllMarkets()
        → for each market: getTournamentPrediction / getPrediction (Claude AI)
        → returns array of market objects
      ← JSON array
    ← market[]
  → renders <MarketDiscoverFeed markets={...} />
```

**Market object shape:**
```ts
{
  id:         number,         // backend market ID
  title:      string,
  category:   'winner' | 'match' | 'stage',
  team:       string,
  image:      string,         // flag URL
  yesOdds:    number,         // decimal (e.g. 3.5 = 3.5x)
  noOdds:     number,
  drawOdds?:  number,         // only on group-stage matches
  sentiment:  number,         // 0-100, % of community backing YES
  confidence: number,         // AI confidence 50–95
  prediction: string,         // 'FAVORITES' | 'CONTENDER' | ...
  analysis:   string,         // one-sentence AI rationale
  volume:     number,         // simulated cUSD volume
  closesAt:   string,         // ISO 8601
  source:     'claude' | 'mock'
}
```

### 2.3 AI Prediction Endpoints

```
GET /api/predictions/match/:team1/:team2
  → { team1, draw, team2, confidence, analysis, keyFactor, label, source }

GET /api/predictions/tournament/:team
  → { team, winProbability, confidence, analysis, label, sentiment, source }

GET /api/predictions/teams
  → { teams: [{ code, name, flag, fifaRank }] }
```

Team codes match FIFA 2-letter codes used throughout the app (e.g. `ARG`, `FRA`, `BRA`).

### 2.4 Bets API

Although bets are placed on-chain, the backend maintains an in-memory ledger for portfolio display until a database is integrated:

```
POST /api/bets
Body: { marketId, outcome, amount, walletAddress, txHash }

GET /api/bets/user/:address
Response: [{ id, marketId, marketTitle, outcome, amount, odds, status, timestamp }]
```

> ⚠️ The in-memory store resets on server restart. Migrate to a persistent database (e.g. PostgreSQL, MongoDB) before production.

---

## 3. Frontend ↔ Smart Contract

### 3.1 Configuration Files

**`frontend/src/contracts/deployment.js`**
```js
{
  address: '0x91F8763B119CA7EC990ECCD0Db6A19ca13cAfDDa',  // PredictionMarket
  cUSD:    '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',  // cUSD on Alfajores
  chainId: 11142220,                                         // Celo Sepolia
  marketMappings: { /* backendId → contractMarketId */ },
  abi: [ /* minimal human-readable ABI */ ]
}
```

**`frontend/src/config/wagmi.js`**
```js
// Uses @privy-io/wagmi createConfig so transactions route through
// Privy's embedded wallet signer
export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  transports: { [celo.id]: http(), [celoSepolia.id]: http() },
});
export const ACTIVE_CHAIN = celoSepolia;
```

### 3.2 Reading On-Chain Odds

`useOnChainOdds(backendMarketId)` in `useContract.js`:

```js
const contractMarketId = MARKET_MAPPINGS[backendMarketId];

const { data } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'getOdds',
  args: [BigInt(contractMarketId)],
  chainId: ACTIVE_CHAIN.id,
  query: { enabled: !!CONTRACT_ADDRESS && !!contractMarketId, refetchInterval: 15_000 },
});

// data = [yesOdds_1e4, noOdds_1e4, drawOdds_1e4] (BigInt)
// e.g. [25000n, 40000n, 0n] → yes=2.5x, no=4.0x, draw=null
```

Odds are `null` when the pool for an outcome is empty (no bets yet). The UI falls back to AI-generated odds in that case.

### 3.3 Placing a Bet (2-Step Flow)

`usePlaceBetOnChain()` in `useContract.js`:

```
Step 1 — ERC-20 approval
  writeContractAsync({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'approve',
    args: [CONTRACT_ADDRESS, amountWei],
  })

Step 2 — Bet placement
  writeContractAsync({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'placeBet',
    args: [BigInt(contractMarketId), outcomeEnum, amountWei],
  })
```

`outcomeEnum`: `{ yes: 0, no: 1, draw: 2 }`

Both calls route through Privy's embedded wallet — the user signs inside Privy's modal rather than an external browser extension.

### 3.4 Market ID Mapping Table

| Backend ID | Market | Contract ID |
|---|---|---|
| 1 | Argentina to Win | 1 |
| 2 | France to Win | 2 |
| 3 | England to Win | 3 |
| 4 | Brazil to Win | 4 |
| 5 | USA to Reach Semi-Finals | 6 |
| 6 | Spain to Win | 5 |
| 7 | Morocco to Reach QF | 7 |
| 8 | Final Over 2.5 Goals | 8 |

> **Note:** IDs 5 and 6 are swapped because `CreateMarkets.s.sol` creates Spain before USA (following FIFA order). Update `deployment.js → marketMappings` if the contract is redeployed with different ordering.

---

## 4. Backend ↔ AI (Anthropic)

### 4.1 SDK Setup

```js
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### 4.2 Match Prediction Call

```js
const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 256,
  messages: [{ role: 'user', content: prompt }],
});
```

The prompt instructs the model to output **only valid JSON** — no markdown fences, no prose. The response is extracted with a regex: `raw.match(/\{[\s\S]*\}/)`.

### 4.3 Probability Normalisation

Claude's probabilities may not sum to exactly 1.0. The backend normalises:
```js
const total = t1Win + draw + t2Win;
result.team1.winProbability = +(data.team1WinProbability / total).toFixed(3);
```

### 4.4 Caching Strategy

Results are cached in a module-level `Map` keyed by `"team1-team2-stage"` or `"tournament-teamCode"`. Cache persists for the process lifetime. Call `clearCache()` (exported) to invalidate — useful if you add a scheduled refresh task.

### 4.5 Mock Fallback

When `ANTHROPIC_API_KEY` is missing or the API call fails, `getMockPrediction()` uses a linear formula based on FIFA rank difference:

```js
const rankDiff = team2.fifaRank - team1.fifaRank;
const adjustment = Math.min(Math.abs(rankDiff) * 0.008, 0.25);
t1Win = rankDiff > 0 ? base + adjustment : base - adjustment;
```

`source` field is set to `'mock'` vs `'claude'` so the UI can surface the distinction.

---

## 5. Auth Flow (Privy)

```
1. App loads → PrivyProvider initialises (VITE_PRIVY_APP_ID)
2. useAuth() → { ready, authenticated }
3. !authenticated → render <Onboarding privyReady={ready} />
4. User taps "Get Started" → login() → Privy modal
5. User completes email/social login → Privy creates embedded wallet
6. authenticated=true → App renders main tabs
7. useWalletBalance(walletAddress) fetches cUSD balance
```

**Privy config** (`config/privy.js`):
```js
loginMethods: ['email', 'google', 'twitter'],
appearance: { theme: 'dark' },
defaultChain: celoSepolia,
supportedChains: [celo, celoSepolia],
```

The wagmi config uses `@privy-io/wagmi`'s `createConfig`, which routes all `writeContractAsync` calls through Privy's embedded wallet — no MetaMask needed.

---

## 6. Bet Placement End-to-End

```
User on OddsSlip:
  1. Selects YES or NO prediction button
  2. Enters amount (or taps quick-amount: 10/25/50/100 cUSD)
  3. Views real-time payout calculation
     payout = amount × adjustedOdds
     adjustedOdds = selectedOdds × (1 - slippage / 100)
  4. Taps "Confirm Wager"

useContract.usePlaceBetOnChain():
  5. setStage('approving')
  6. writeContractAsync → cUSD.approve(contract, amountWei)
     Privy modal → user signs
  7. setStage('betting')
  8. writeContractAsync → PredictionMarket.placeBet(marketId, outcome, amountWei)
     Privy modal → user signs
  9. setStage('done')
  10. onSubmit({ marketId, prediction, amount, odds, potentialPayout, ... })

App.jsx:
  11. Appends bet to portfolio state
  12. refetchBalance() — pulls fresh cUSD balance
  13. setAppState('main'), setActiveTab('predict')
```

**Error handling:** Any wagmi / contract revert surfaces `err.shortMessage` (e.g. `"AlreadyBet()"`, `"MarketClosed()"`) in the OddsSlip error banner. The user can tap "Try Again" to reset the hook state.

---

## 7. Environment Variables Reference

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_PRIVY_APP_ID` | ✅ | Privy dashboard app ID |
| `VITE_BACKEND_URL` | ✅ | Backend base URL |
| `VITE_CONTRACT_ADDRESS` | ✅ | Deployed `PredictionMarket` address |
| `VITE_CUSD_ADDRESS` | optional | cUSD address (defaults to Alfajores) |

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key (falls back to mock) |
| `PORT` | optional | Server port (default: `4000`) |
| `ALLOWED_ORIGINS` | optional | Comma-separated CORS origins |

### Contracts (`contracts/.env`)

| Variable | Required | Description |
|---|---|---|
| `PRIVATE_KEY` | ✅ | Deployer EOA private key |
| `CELOSCAN_API_KEY` | optional | For contract verification |
| `CONTRACT_ADDRESS` | ✅ (CreateMarkets) | Address of deployed `PredictionMarket` |

---

## 8. Common Issues

### "Contract not configured" banner in OddsSlip
`VITE_CONTRACT_ADDRESS` is not set or not matching an entry in `marketMappings`. Set the env var and ensure the backend market ID has a mapping in `deployment.js`.

### AI predictions returning `source: 'mock'`
`ANTHROPIC_API_KEY` is missing from the backend `.env`. Add the key and restart the server. Cached mock values will be replaced on the next cache miss.

### On-chain odds showing as AI odds (no LIVE badge)
The market's betting pools are empty (no bets placed yet). Once a bet goes through, `getOdds` returns non-zero values and the live badge appears within 15 seconds.

### `AlreadyBet()` error
The connected wallet already has an open position on this market. Each address can place one bet per market (contract invariant).

### `MarketClosed()` error
`block.timestamp >= market.closeTime`. The market's betting window has passed. Check the `closesAt` field on the market object.

### CORS errors from frontend to backend
Add the frontend origin to `ALLOWED_ORIGINS` in the backend `.env`:
```
ALLOWED_ORIGINS=http://localhost:5173,https://celoseer.vercel.app
```

---

*Last updated: June 2026*
