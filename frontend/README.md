# CeloSeer Frontend - Mobile-First Prediction Market UI

A sleek, gamified prediction market interface built with React + Vite, styled for dark mode with mobile-first responsive design.

## 📱 Features

### 1. **User Onboarding & Smart Wallet Creation**
- Email/username signup with silent account abstraction
- Social login integration (Google, X/Twitter)
- Visual onboarding flow with step indicators
- Smart wallet generation simulation

### 2. **Dynamic Market Discover Feed**
- AI-generated prediction pool cards
- Category filtering (Crypto, Tech, Economics)
- Live sentiment bars showing community predictions
- Interactive odds display (YES/NO)
- Real-time volume metrics
- Search functionality across markets

### 3. **Live AI Odds Slip - Real-Time Checkout**
- Binary prediction selection (YES/NO)
- Interactive wager amount input
- Quick amount buttons (10, 25, 50, 100 cUSD)
- Real-time calculation of:
  - Potential payout
  - Potential profit
  - Adjusted odds with slippage
- Slippage control slider (0-10%)
- Risk disclaimer

### 4. **My Portfolio & Rewards Hub**
- Wallet balance tracking
- Active vs. closed positions tabs
- Accuracy statistics with 6-week trend chart
- Performance metrics (accuracy %, winnings, streaks)
- Individual position details with results
- One-tap fund withdrawal system

## 🎨 Design Highlights

- **Dark Mode**: Premium dark gradient backgrounds (#0f0f0f to #1a1a1a)
- **Gamified UX**: Micro-interactions, animations, and visual feedback
- **Mobile-First**: Optimized for devices, responsive up to 768px
- **Glassmorphism Effects**: Subtle transparency and borders
- **Color Coding**: 
  - Blue (#3b82f6): Primary actions & accents
  - Green (#10b981): Positive predictions/winnings
  - Red (#ef4444): Negative/risk indicators
  - Purple (#8b5cf6): Secondary gradients

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on `http://localhost:5173` (or shown in terminal)

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML entry point
├── src/
│   ├── components/
│   │   ├── Onboarding.jsx      # Auth & wallet creation flow
│   │   ├── MarketDiscoverFeed.jsx # Main market discovery UI
│   │   ├── OddsSlip.jsx        # Real-time odds calculator
│   │   └── Portfolio.jsx       # User portfolio & rewards
│   ├── App.jsx             # Main app router
│   ├── main.jsx            # React entry point
│   └── styles.css          # Global dark mode styles (900+ lines)
├── vite.config.js
└── package.json
```

## 🎯 Component Architecture

### App.jsx
Central state manager handling:
- View switching (onboarding → discover → odds → portfolio)
- User authentication state
- Wallet balance tracking
- Portfolio positions management

### Onboarding.jsx
Two-step signup:
1. Email/social login entry
2. Smart wallet confirmation

### MarketDiscoverFeed.jsx
Main market browsing interface:
- Category filtering
- Search functionality
- Market card grid with sentiment visualization
- Wallet info display

### OddsSlip.jsx
Checkout flow for placing wagers:
- Prediction selection buttons
- Amount input with quick presets
- Real-time odds calculation
- Slippage management

### Portfolio.jsx
User dashboard displaying:
- Wallet status cards
- Performance metrics
- Accuracy trend chart
- Position history

## 💻 Responsive Breakpoints

- **Mobile**: Full width optimization (< 480px)
- **Tablet**: 2-column layouts (768px+)
- **Desktop**: Enhanced spacing and grid layouts

## 🎪 Gamification Elements

- Animated onboarding with floating wallet icon
- Loading dots during async operations
- Sentiment bars for community predictions
- Real-time payout calculations
- Accuracy trend visualization
- Win/loss result badges
- Visual feedback on interactions

## 🔄 State Flow

```
App Component
├── currentView: 'onboarding' → 'discover' → 'odds' → 'portfolio'
├── user: { email, username, walletAddress, initialBalance }
├── selectedMarket: { id, title, odds, sentiment, ... }
├── walletBalance: number (cUSD)
└── portfolio: [ { id, marketId, prediction, amount, result }, ... ]
```

## 🌐 API Integration Points

The frontend is structured to easily integrate:
- Backend authentication endpoints (for wallet creation)
- Market data service (fetch predictions)
- Odds calculation service (real-time updates)
- Portfolio service (fetch user positions)
- Withdrawal service (fund repatriation)

## 📱 Mobile Optimization

- Touch-friendly buttons (min 44px tap targets)
- Scrollable category tabs
- Full-width cards for easy interaction
- Optimized fonts and spacing
- Safe area insets for notch devices

## 🎨 Customization

### Color Scheme
Edit CSS variables in `styles.css`:
```css
/* Primary */
background: #0f0f0f;
accent: #3b82f6;

/* Secondary */
success: #10b981;
warning: #fbbf24;
error: #ef4444;
```

### Typography
Font stack: System fonts optimized for readability

## ⚡ Performance

- Vite for fast HMR development
- Minimal dependencies (React + React-DOM only)
- CSS-only animations for smooth 60fps
- Lazy component rendering

## 🔐 Security Notes

- Smart wallet addresses are simulated (replace with real wallet service)
- All transaction data is currently mock data
- Integrate real Celo blockchain APIs for production
- Add proper authentication tokens

## 📦 Dependencies

- `react@^18.3.0` - UI framework
- `react-dom@^18.3.0` - DOM rendering
- `vite@^5.0.0` - Build tool
- `@vitejs/plugin-react@^4.3.0` - React HMR plugin

## 🚀 Deployment Ready

The frontend can be deployed to:
- Vercel (auto-deployment from Git)
- Netlify (drag & drop or Git sync)
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages

## 📝 Future Enhancements

- [ ] WebSocket for real-time market updates
- [ ] Push notifications for market changes
- [ ] Chart.js for advanced analytics
- [ ] PWA support for offline functionality
- [ ] Dark/Light mode toggle
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements (WCAG AA)

## 📧 Support

For issues or questions, refer to backend API documentation and ensure Celo testnet is configured.

---

**Built with ❤️ for the Celo ecosystem**
