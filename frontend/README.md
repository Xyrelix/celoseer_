# CeloSeer Frontend

Mobile-first prediction market UI built with **React 19 + Vite 8**, dark mode, glassmorphism, and real Celo blockchain integration via Privy + wagmi.

---

## 📱 Features

### 1. Onboarding (`Onboarding.jsx`)
- Full-screen hero carousel (images + video) with crossfade transitions
- Typewriter tagline rotator across 5 marketing messages
- **16-language support** (EN, ES, FR, PT, DE, AR, IT, ZH, JA, KO, NL, TR, PL, RU, HI, SW) with RTL for Arabic
- Feature highlights: AI Predictions, Earn cUSD, Gasless Wallet, WC 2026
- Delegates login to **Privy** (`useAuth().login()`) — email + Google + Twitter

### 2. Home Tab (`HomeTab.jsx`)
- Auto-advancing hero slider (images + video, 4 s interval)
- Tournament quick-stats strip (nations, matches, cities)
- **Tournament favorites** — 3D-tilt cards linking directly to OddsSlip
- Upcoming fixtures list (next 6 WC 2026 group-stage matches)
- **Classic highlights** — IntersectionObserver-driven video reel (one plays at a time)

### 3. Standings Tab (`StandingsTab.jsx`)
- Group tables (A–F) with team rankings
- Knockout bracket display

### 4. Predict Tab (`PredictTab.jsx` + `MarketDiscoverFeed.jsx`)
- Fetches live AI-enriched market data from the backend (`/api/markets`)
- Category filtering and search
- Sentiment bars, confidence percentages, AI prediction labels
- Tapping a card opens `OddsSlip`

### 5. Insights Tab (`InsightsTab.jsx`)
- Animated count-up stats: 82.4% accuracy, 847 calls, 32 teams
- SVG accuracy trend line graph with bezier smoothing
- Ranked AI calls list with confidence bars
- Hot markets with volume and 24h movement

### 6. OddsSlip (`OddsSlip.jsx`)
- **Live on-chain odds** via `getOdds()` read (refreshed every 15 s)
- Falls back to AI odds when pools are empty; LIVE badge when on-chain
- Quick wager buttons: 10 / 25 / 50 / 100 cUSD
- Real-time payout + profit calculation
- Slippage slider (0–10%)
- **2-step on-chain flow:** ERC-20 `approve` → `placeBet` (Privy wallet)
- Stage indicators: Approving… / Placing Bet… / Bet Placed!

### 7. Profile / Portfolio (`Profile.jsx`, `Portfolio.jsx`)
- Wallet balance (live cUSD from chain)
- Active and closed position tabs
- Accuracy trend chart and performance stats

---

## 🏗️ Architecture

```
App.jsx  (state: main | odds | profile)
├── Onboarding.jsx          ← not authenticated
└── main layout             ← authenticated
    ├── TopBar
    ├── BottomNav (home | standings | predict | insights)
    ├── HomeTab
    ├── StandingsTab
    ├── PredictTab → MarketDiscoverFeed
    ├── InsightsTab
    ├── OddsSlip             ← appState='odds'
    └── Profile              ← appState='profile'
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### Installation

```bash
cp .env.example .env          # fill in required vars (see below)
npm install
npm run dev                   # → http://localhost:5173
npm run build                 # production bundle → dist/
npm run preview               # preview production build
```

### Environment Variables

```
VITE_PRIVY_APP_ID=<your-privy-app-id>
VITE_BACKEND_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=0x91F8763B119CA7EC990ECCD0Db6A19ca13cAfDDa
VITE_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
```

---

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets (images, videos, logos)
├── src/
│   ├── components/
│   │   ├── BackgroundFX.jsx    # Animated gradient canvas
│   │   ├── BottomNav.jsx       # 4-tab navigation
│   │   ├── HomeTab.jsx         # Hero slider + highlights + fixtures
│   │   ├── StandingsTab.jsx    # Group tables + bracket
│   │   ├── PredictTab.jsx      # Market browse (calls backend)
│   │   ├── MarketDiscoverFeed.jsx  # Reusable card grid
│   │   ├── InsightsTab.jsx     # AI stats + chart
│   │   ├── OddsSlip.jsx        # On-chain bet placement
│   │   ├── Portfolio.jsx       # Portfolio positions
│   │   ├── Profile.jsx         # Account + settings
│   │   ├── Onboarding.jsx      # Pre-auth landing (16 languages)
│   │   └── Icon.jsx            # SVG icon registry
│   ├── hooks/
│   │   ├── useAuth.js          # Privy wrapper
│   │   ├── useContract.js      # wagmi reads/writes + odds helpers
│   │   ├── useWalletBalance.js # cUSD balance
│   │   ├── useBets.js          # Portfolio state
│   │   └── useMarkets.js       # Backend market fetcher
│   ├── config/
│   │   ├── wagmi.js            # wagmi + Privy chain config
│   │   └── privy.js            # PrivyProvider config
│   ├── contracts/
│   │   └── deployment.js       # Contract address, ABI, market mappings
│   ├── services/
│   │   └── api.js              # fetch wrapper for backend REST
│   ├── App.jsx                 # Root component + state machine
│   ├── main.jsx                # React DOM + provider tree
│   └── styles.css              # Global stylesheet (3 200+ lines)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0a0a0a → #111111` |
| Gold accent | `#ffd700` |
| Success (win) | `#10b981` |
| Error (loss) | `#ef4444` |
| Purple | `#6366f1` |
| Orange | `#f97316` |
| Glass card | `rgba(255,255,255,0.04)` + `backdrop-filter: blur(16px)` |
| Glass border | `rgba(255,255,255,0.08)` |
| Glow button | gold drop-shadow + animated pulse |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | `^19.2.0` | UI framework |
| `react-dom` | `^19.2.0` | DOM rendering |
| `@privy-io/react-auth` | `^3.0.0` | Auth + embedded wallet |
| `@privy-io/wagmi` | `^4.0.0` | Privy-aware wagmi adapter |
| `wagmi` | `^3.6.0` | React hooks for Ethereum |
| `viem` | `^2.52.0` | Low-level EVM client |
| `@tanstack/react-query` | `^5.100.0` | Data fetching / caching |
| `vite` | `^8.0.12` | Build tool |
| `@vitejs/plugin-react` | `^6.0.1` | React HMR |

---

## 🔐 Auth Degradation

If `VITE_PRIVY_APP_ID` is missing or ≤ 4 characters, the app runs with stub auth objects — useful for UI development without a Privy account. All wallet-dependent features are disabled gracefully.

---

## 🗺️ State Flow

```
App.jsx
├── appState: 'main' | 'odds' | 'profile'
├── activeTab: 'home' | 'standings' | 'predict' | 'insights'
├── selectedMarket: Market | null
└── portfolio: Bet[]
```

---

## 🚀 Deployment

Works on any static host:

```bash
npm run build
# Upload dist/ to Vercel, Netlify, Firebase Hosting, etc.
```

Vercel auto-deploys from the `frontend/` subdirectory.  
Set env vars in the Vercel dashboard under **Settings → Environment Variables**.

---

**Built with ❤️ for the Celo ecosystem**
