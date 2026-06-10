import { useState, useEffect, useCallback } from 'react';
import Onboarding   from './components/Onboarding';
import BackgroundFX from './components/BackgroundFX';
import BottomNav    from './components/BottomNav';
import HomeTab      from './components/HomeTab';
import StandingsTab from './components/StandingsTab';
import PredictTab   from './components/PredictTab';
import InsightsTab  from './components/InsightsTab';
import OddsSlip     from './components/OddsSlip';
import Profile      from './components/Profile';
import Faucet       from './components/Faucet';
import Icon         from './components/Icon';
import { useAuth }           from './hooks/useAuth';
import { useWalletBalance, useNativeBalance } from './hooks/useWalletBalance';
import { useWelcomeDeposit } from './hooks/useWelcomeDeposit';
import { placeBet as apiPlaceBet, fetchMyBets } from './services/api';
import './styles.css';

// Map a backend bet record onto the shape Profile expects.
function normalizeBet(b) {
  return {
    id:               b.id,
    marketId:         b.marketId,
    marketTitle:      b.marketTitle,
    prediction:       b.outcome,
    amount:           b.amount,
    odds:             b.odds,
    potentialPayout:  b.potentialWin,
    potentialProfit:  b.profit,
    timestamp:        new Date(b.timestamp).toLocaleString(),
    status:           b.status,
    result:           b.result,
  };
}

function App() {
  const { ready, authenticated, user, walletAddress, displayAddress } = useAuth();
  const { balance, refetch: refetchBalance } = useWalletBalance(walletAddress);
  const { celo, refetch: refetchCelo }       = useNativeBalance(walletAddress);

  // Auto-deposit 500 cUSD to every new user, once.
  useWelcomeDeposit(walletAddress, authenticated, refetchBalance);

  const [appState,       setAppState]       = useState('main'); // 'main' | 'odds' | 'profile' | 'faucet'
  const [activeTab,      setActiveTab]      = useState('home');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [portfolio,      setPortfolio]      = useState([]);

  // Load this wallet's bets from the backend.
  const loadBets = useCallback(async () => {
    if (!walletAddress) { setPortfolio([]); return; }
    try {
      const { bets } = await fetchMyBets(walletAddress);
      setPortfolio(bets.map(normalizeBet));
    } catch (err) {
      console.warn('failed to load bets:', err.message);
    }
  }, [walletAddress]);

  useEffect(() => { loadBets(); }, [loadBets]);

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setAppState('odds');
  };

  const handleOddsSubmit = async (betData) => {
    // Persist the bet to the backend so it survives reloads.
    try {
      await apiPlaceBet(
        { marketId: betData.marketId, outcome: betData.prediction, amount: betData.amount, txHash: betData.txHash },
        walletAddress,
      );
    } catch (err) {
      console.warn('failed to save bet:', err.message);
    }
    await loadBets();
    // bet just spent cUSD on-chain — pull the fresh balance
    refetchBalance?.();
    setAppState('main');
    setActiveTab('predict');
  };

  const TAB_LABELS = { home: 'Home', standings: 'Standings', predict: 'Predict', insights: 'Insights' };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return <HomeTab      key="home"      onSelectMarket={handleMarketSelect} user={user} />;
      case 'standings': return <StandingsTab key="standings" />;
      case 'predict':   return <PredictTab   key="predict"   onSelectMarket={handleMarketSelect} />;
      case 'insights':  return <InsightsTab  key="insights"  />;
      default:          return <HomeTab      key="home"      onSelectMarket={handleMarketSelect} user={user} />;
    }
  };

  /* Show onboarding when not authenticated — Privy init happens in background */
  if (!authenticated) {
    return <Onboarding privyReady={ready} />;
  }

  /* Logged in → Main app */
  return (
    <>
      <BackgroundFX />

      <div className="app-container app-transparent">
        {appState === 'main' && (
          <div className="main-app">
            <header className="top-bar glass-dark-bar">
              <div className="top-bar-left">
                 <img src="/yellowceloseerbanner.png" alt="CeloSeer" className="topbar-wordmark" />
              </div>
              <div className="top-bar-center">
                <span className="topbar-page-label">{TAB_LABELS[activeTab]}</span>
              </div>
              <div className="top-bar-right">
                <button
                  className="profile-icon-btn"
                  onClick={() => setAppState('faucet')}
                  aria-label="Test Faucet"
                  title="Claim test cUSD"
                >
                  <Icon name="coin" size={22} color="#ffd700" />
                </button>
                <button
                  className="profile-icon-btn"
                  onClick={() => setAppState('profile')}
                  aria-label="My Profile"
                >
                  <Icon name="user" size={22} color="#ffd700" />
                </button>
              </div>
            </header>

            <main className="tab-content">
              <div className="tab-page-anim">
                {renderTab()}
              </div>
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        )}

        {appState === 'odds' && selectedMarket && (
          <div className="page-slide-in">
            <OddsSlip
              market={selectedMarket}
              walletAddress={walletAddress}
              walletBalance={parseFloat(balance)}
              onSubmit={handleOddsSubmit}
              onBack={() => setAppState('main')}
            />
          </div>
        )}

        {appState === 'profile' && (
          <div className="page-slide-in">
            <Profile
              user={user}
              walletAddress={walletAddress}
              displayAddress={displayAddress}
              balance={balance}
              celo={celo}
              positions={portfolio}
              onBack={() => setAppState('main')}
            />
          </div>
        )}

        {appState === 'faucet' && (
          <div className="page-slide-in">
            <Faucet
              walletAddress={walletAddress}
              displayAddress={displayAddress}
              balance={balance}
              celo={celo}
              onBack={() => setAppState('main')}
              onClaimed={() => { refetchBalance?.(); refetchCelo?.(); }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
