import { useState } from 'react';
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
import { useWalletBalance }  from './hooks/useWalletBalance';
import { useWelcomeDeposit } from './hooks/useWelcomeDeposit';
import './styles.css';

function App() {
  const { ready, authenticated, user, walletAddress, displayAddress } = useAuth();
  const { balance, refetch: refetchBalance } = useWalletBalance(walletAddress);

  // Auto-deposit 500 cUSD to every new user, once.
  useWelcomeDeposit(walletAddress, authenticated, refetchBalance);

  const [appState,       setAppState]       = useState('main'); // 'main' | 'odds' | 'profile' | 'faucet'
  const [activeTab,      setActiveTab]      = useState('home');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [portfolio,      setPortfolio]      = useState([]);

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setAppState('odds');
  };

  const handleOddsSubmit = (betData) => {
    setPortfolio(prev => [
      ...prev,
      { id: Date.now(), ...betData, timestamp: new Date().toLocaleString(), status: 'active' },
    ]);
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

  /* Show onboarding immediately — Privy init happens in background */
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
              onBack={() => setAppState('main')}
              onClaimed={refetchBalance}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
