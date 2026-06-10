# CeloSeer — Implementation Reference

> Technical deep-dive covering the smart contract, backend service, and frontend layers.

---

## Table of Contents

1. [Smart Contract](#1-smart-contract)
2. [Backend Service](#2-backend-service)
3. [Frontend Application](#3-frontend-application)
4. [Authentication & Wallets](#4-authentication--wallets)
5. [On-Chain Interaction](#5-on-chain-interaction)
6. [Deployment](#6-deployment)

---

## 1. Smart Contract

**File:** [`contracts/src/PredictionMarket.sol`](./contracts/src/PredictionMarket.sol)  
**Chain:** Celo Sepolia (chainId `11142220`)  
**Deployed:** `0x91F8763B119CA7EC990ECCD0Db6A19ca13cAfDDa`

### 1.1 Design

The contract is a **pool-based binary prediction market** settled in cUSD (Celo's stable token). It inherits OpenZeppelin's `Ownable` and `ReentrancyGuard`.

```
Market
 ├── question    string
 ├── closeTime   uint256 (unix)
 ├── status      OPEN | RESOLVED | CANCELLED
 ├── result      YES | NO | DRAW
 ├── hasDraw     bool  (false for tournament-winner markets)
 └── pools[3]    [yesPool, noPool, drawPool]  (wei)

Bet
 ├── amount    uint256
 ├── outcome   Outcome enum
 └── claimed   bool
```

### 1.2 Protocol Fee

- **Fee:** 2 % of `totalPool` at resolution time, transferred to `owner()`
- Constant `FEE_BPS = 200`, `BPS = 10_000`
- Deducted before payout calculation; remaining pool is split proportionally to winning stakers

### 1.3 Payout Formula

```
payout = (betAmount × remainingPool) / winningPool
```

### 1.4 Key Functions

| Function | Caller | Description |
|---|---|---|
| `createMarket(question, closeTime, hasDraw)` | `owner` | Opens a new market |
| `placeBet(id, outcome, amount)` | any user | ERC-20 transferFrom → updates pools |
| `resolveMarket(id, result)` | `owner` | Settles market, takes fee |
| `cancelMarket(id)` | `owner` | Allows full refunds |
| `claimWinnings(id)` | winner | Pull-pattern payout |
| `claimRefund(id)` | bettor | Pull-pattern refund on cancellation |
| `getOdds(id)` | view | Returns `(yesOdds, noOdds, drawOdds)` × 1e4 |
| `getMarket(id)` | view | Full market struct |
| `getBet(id, address)` | view | Single bettor's position |

### 1.5 Odds Encoding

`getOdds` returns multipliers scaled by **1e4**:
```
yesOdds = (remainingPool × 1e4) / yesPool
// 25000 → 2.5x multiplier
```

The frontend divides by `10_000` to get a decimal multiplier.

### 1.6 Market Inventory (26 total)

**Tournament markets (8) — no draw:**

| On-chain ID | Market |
|---|---|
| 1 | Argentina to Win World Cup 2026? |
| 2 | France to Win World Cup 2026? |
| 3 | England to Win World Cup 2026? |
| 4 | Brazil to Win World Cup 2026? |
| 5 | Spain to Win World Cup 2026? |
| 6 | USA to Reach Semi-Finals? |
| 7 | Morocco to Reach Quarter-Finals? |
| 8 | Final Match Over 2.5 Goals? |

**Group-stage match markets (18) — draw enabled:** Groups A–F covering Argentina, Brazil, France, England, Spain, Belgium fixture schedules.

### 1.7 Deployment Scripts

| Script | Purpose |
|---|---|
| `script/Deploy.s.sol` | Deploys `PredictionMarket` with the correct cUSD address per chain |
| `script/CreateMarkets.s.sol` | Seeds 26 markets via `createMarket` calls |

**Deploy commands:**
```bash
# Deploy contract
forge script script/Deploy.s.sol \
  --rpc-url alfajores --broadcast --verify \
  --etherscan-api-key $CELOSCAN_API_KEY

# Create markets (set CONTRACT_ADDRESS env first)
CONTRACT_ADDRESS=0x... forge script script/CreateMarkets.s.sol \
  --rpc-url alfajores --broadcast
```

---

## 2. Backend Service

**Directory:** `backend/src/`  
**Runtime:** Node.js (ESM), Express 4  
**Port:** `4000` (configurable via `PORT` env)

### 2.1 Project Structure

```
backend/src/
├── index.js                   # Express bootstrap, CORS, route mounting
├── routes/
│   ├── api.js                 # /api router — aggregates sub-routers
│   ├── markets.js             # GET /api/markets (list + single)
│   ├── predictions.js         # GET /api/predictions/{teams,match,tournament}
│   └── bets.js                # POST /api/bets, GET /api/bets/me
├── controllers/
│   ├── marketsController.js   # Delegates to footballData service
│   ├── predictionsController.js  # Delegates to aiPredictor service
│   └── betsController.js      # In-memory bet ledger
├── services/
│   ├── footballData.js        # Market assembly: prediction + metadata
│   └── aiPredictor.js         # Claude AI wrapper + mock fallback
└── data/
    └── worldCupMatches.js     # Static fixture & team data (TEAMS, GROUP_MATCHES, TOURNAMENT_MARKETS)
```

### 2.2 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/markets` | Full market list (AI-enriched) |
| `GET` | `/api/markets/:id` | Single market by ID |
| `GET` | `/api/predictions/teams` | All tracked teams |
| `GET` | `/api/predictions/match/:team1/:team2` | Head-to-head prediction |
| `GET` | `/api/predictions/tournament/:team` | Team win probability |
| `POST` | `/api/bets` | Record a bet (in-memory) |
| `GET` | `/api/bets/me` | User's bets |
| `GET` | `/api/bets/user/:address` | Bets by wallet address |

### 2.3 AI Prediction Engine (`aiPredictor.js`)

Uses **Claude Sonnet 4.6** (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`.

**Match prediction prompt** returns:
```json
{
  "team1WinProbability": 0.42,
  "drawProbability": 0.28,
  "team2WinProbability": 0.30,
  "confidence": 74,
  "analysis": "Argentina's superior squad depth gives them the edge.",
  "keyFactor": "Squad depth"
}
```

**Tournament prediction prompt** returns:
```json
{
  "winProbability": 0.14,
  "confidence": 82,
  "analysis": "...",
  "label": "FAVORITES",
  "sentiment": 78
}
```

**Caching:** Results are cached in a `Map` for the lifetime of the process (keyed by team codes + stage). Call `clearCache()` to purge.

**Fallback:** If `ANTHROPIC_API_KEY` is not set, rank-based mock predictions are returned — the service degrades gracefully.

**Label mapping:**

| Win prob diff | Label |
|---|---|
| ≤ 5 % | `EVEN MATCH` |
| ≤ 15 % | `SLIGHT FAVOR` |
| ≤ 25 % | `LIKELY` |
| ≤ 40 % | `STRONG` |
| > 40 % | `FAVORITES` |

### 2.4 Market Assembly (`footballData.js`)

`getAllMarkets()` combines:
1. **Tournament markets** from `TOURNAMENT_MARKETS` static list + `getTournamentPrediction(teamCode)` AI call
2. **Group-stage match markets** from `GROUP_MATCHES` static list + `getPrediction(team1, team2, stage)` AI call

Each market object exposes: `id`, `title`, `category`, `yesOdds`, `noOdds`, `drawOdds`, `sentiment`, `confidence`, `prediction`, `analysis`, `volume`, `closesAt`, `source`.

An in-memory `marketStore` (Map) avoids redundant AI calls on repeated requests.

### 2.5 Environment Variables

```
PORT=4000
ANTHROPIC_API_KEY=sk-ant-...
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

---

## 3. Frontend Application

**Directory:** `frontend/src/`  
**Build tool:** Vite 8  
**Framework:** React 19 (JSX)

### 3.1 Project Structure

```
frontend/src/
├── App.jsx                    # Root: auth gate, app-state router
├── main.jsx                   # React DOM + Privy/wagmi providers
├── styles.css                 # 3 200+ line global stylesheet
├── components/
│   ├── BackgroundFX.jsx       # Animated gradient canvas background
│   ├── BottomNav.jsx          # 4-tab navigation bar
│   ├── HomeTab.jsx            # Hero slider, fixtures, highlight reel
│   ├── StandingsTab.jsx       # Group tables & knockout bracket
│   ├── PredictTab.jsx         # AI market browse (calls backend)
│   ├── MarketDiscoverFeed.jsx # Reusable market card grid
│   ├── InsightsTab.jsx        # AI engine stats, accuracy chart
│   ├── OddsSlip.jsx           # Bet placement flow (approve + bet)
│   ├── Portfolio.jsx          # User wallet + open positions
│   ├── Profile.jsx            # Account, settings, logout
│   ├── Onboarding.jsx         # Pre-auth landing (16-language)
│   └── Icon.jsx               # SVG icon registry
├── hooks/
│   ├── useAuth.js             # Privy wrapper + stub fallback
│   ├── useContract.js         # wagmi read/write + odds helpers
│   ├── useWalletBalance.js    # cUSD balance poller
│   ├── useBets.js             # Local portfolio hook
│   └── useMarkets.js          # Backend market fetcher
├── config/
│   ├── wagmi.js               # wagmi config (Privy adapter, chains)
│   └── privy.js               # PrivyProvider config
├── contracts/
│   └── deployment.js          # Contract address, ABI, market mappings
└── services/
    └── api.js                 # fetch wrapper for backend REST calls
```

### 3.2 App State Machine

```
App.jsx state:  appState ∈ { 'main' | 'odds' | 'profile' }
                activeTab ∈ { 'home' | 'standings' | 'predict' | 'insights' }

Flow:
  Not authenticated   →  <Onboarding />  (Privy login modal)
  authenticated + main →  <TopBar> + <BottomNav> + renderTab()
  authenticated + odds →  <OddsSlip market={selectedMarket} />
  authenticated + profile → <Profile />
```

### 3.3 Component Highlights

#### `HomeTab`
- **Hero slider** — auto-advances every 4 s, supports image + video slides
- **Tournament favorites** — 3D tilt cards linking to OddsSlip
- **Upcoming fixtures** — next 6 WC 2026 group-stage matches
- **Highlight reel** — IntersectionObserver-driven video autoplay (one at a time)

#### `Onboarding`
- Full-screen media carousel (crossfade between images & videos)
- Typewriter tagline rotator (5 phrases, 16 languages)
- Language picker with RTL support (Arabic)
- Feature cards: AI Predictions, Earn cUSD, Gasless Wallet, WC 2026 Live
- Delegates login to Privy via `useAuth().login()`

#### `OddsSlip`
- Reads **live on-chain odds** via `useOnChainOdds` (refetch 15 s); falls back to AI odds
- **2-step on-chain flow:** ERC-20 `approve` → `placeBet`
- Live vs AI badge on each odds display
- Slippage slider (0–10%), real-time payout calculation
- Transaction progress indicators (approving / betting)

#### `InsightsTab`
- Animated count-up stats (accuracy %, total calls, teams tracked)
- SVG accuracy trend line graph with bezier smoothing and area fill
- Top AI calls ranked by confidence
- Hot markets with volume and 24h movement

### 3.4 Design System

| Token | Value |
|---|---|
| Background | `#0a0a0a` → `#111111` gradient |
| Gold accent | `#ffd700` |
| Green (win) | `#10b981` |
| Red (loss) | `#ef4444` |
| Purple | `#6366f1` |
| Glass card | `rgba(255,255,255,0.04)` + `backdrop-filter: blur(16px)` |
| Border | `rgba(255,255,255,0.08)` |
| Mobile breakpoint | `480px` |

---

## 4. Authentication & Wallets

### Privy Integration

- Provider: `@privy-io/react-auth` v3  
- Config: `frontend/src/config/privy.js`  
- The `useAuth()` hook wraps `usePrivy` + `useWallets`, exposes:
  - `authenticated`, `user`, `login()`, `logout()`
  - `walletAddress`, `displayAddress` (truncated), `isEmbeddedWallet`

### Graceful Degradation

If `VITE_PRIVY_APP_ID` is absent or short (≤ 4 chars), `useAuth` returns stub objects that keep the app navigable without real auth — useful for local development without a Privy account.

### Wallet Balance

`useWalletBalance(address)` polls the cUSD ERC-20 `balanceOf` on Celo Sepolia every time `refetch` is called. Balance is exposed in the top bar and OddsSlip.

---

## 5. On-Chain Interaction

### `useContract.js` Hooks

#### `usePlaceBetOnChain()`
Manages the two-transaction bet flow:

```
stage: idle → approving → betting → done | error
```

1. **Approve** — calls `cUSD.approve(contractAddress, amountWei)` via `writeContractAsync`
2. **Bet** — calls `PredictionMarket.placeBet(marketId, outcomeEnum, amountWei)`

Error messages are taken from `err.shortMessage` (viem) or `err.message`.

#### `useOnChainOdds(backendMarketId)`
- Reads `getOdds(contractMarketId)` on-chain
- Auto-refetches every 15 seconds
- Disabled if contract address or market mapping is missing
- Returns `{ odds: { yes, no, draw }, isLoading, refetch, enabled }`

#### `useDisplayOdds(market)`
Merges on-chain data with AI fallback:
```
displayOdds.yes  = onChainOdds.yes  ?? market.yesOdds
displayOdds.liveYes = onChainOdds.yes != null   // badge flag
```

### Market ID Mapping

On-chain market IDs (uint256) are mapped to backend market IDs in `deployment.js`:

```js
marketMappings: {
  1: 1,  // Argentina to Win   (backend id 1 → contract market 1)
  2: 2,  // France to Win
  5: 6,  // USA Semi-Finals    (backend id 5 → contract market 6)
  6: 5,  // Spain to Win       (backend id 6 → contract market 5)
  // ...
}
```

---

## 6. Deployment

### Frontend (Vercel / Netlify)

```
Build command:  npm run build
Output dir:     dist
Node version:   18+
```

**Required env vars:**
```
VITE_PRIVY_APP_ID=<privy-app-id>
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_CONTRACT_ADDRESS=0x91F8763B119CA7EC990ECCD0Db6A19ca13cAfDDa
VITE_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
```

### Backend

Can be deployed to any Node.js host (Railway, Render, Fly.io, etc.):

```
Start command:  node src/index.js
```

**Required env vars:**
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=4000
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Contracts

Contracts are compiled and deployed via Foundry. See Section 1.7.  
ABI is embedded in `frontend/src/contracts/deployment.js` — update it after any redeployment.

---

*Last updated: June 2026*
