import { useState } from 'react';
import Onboarding      from './components/Onboarding';
import BackgroundFX    from './components/BackgroundFX';
import BottomNav       from './components/BottomNav';
import HomeTab         from './components/HomeTab';
import StandingsTab    from './components/StandingsTab';
import PredictTab      from './components/PredictTab';
import InsightsTab     from './components/InsightsTab';
import OddsSlip        from './components/OddsSlip';
import Profile         from './components/Profile';
import PlaceWagerPage  from './components/PlaceWagerPage';
import Positions       from './components/Positions';
import Faucet          from './components/Faucet';
import Icon            from './components/Icon';
import { useAuth }             from './hooks/useAuth';
import { useWalletBalance, useNativeBalance } from './hooks/useWalletBalance';
import { useWelcomeDeposit }   from './hooks/useWelcomeDeposit';
import { useOnChainBets }      from './hooks/useOnChainBets';
import { placeBet as apiPlaceBet } from './services/api';
import './styles.css';

function App() {
  const { ready, authenticated, user, walletAddress, displayAddress } = useAuth();
  const { balance, refetch: refetchBalance } = useWalletBalance(walletAddress);
  const { celo, refetch: refetchCelo }       = useNativeBalance(walletAddress);

  // Positions come straight from the contract — the source of truth.
  const { positions, refetch: refetchBets } = useOnChainBets(walletAddress);

  // Auto-deposit 500 cUSD to every new user, once.
  useWelcomeDeposit(walletAddress, authenticated, refetchBalance);

  const [appState,        setAppState]        = useState('main'); // 'main' | 'odds' | 'profile' | 'wager' | 'faucet' | 'positions'
  const [activeTab,       setActiveTab]       = useState('home');
  const [selectedMarket,  setSelectedMarket]  = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null);

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setAppState('odds');
  };

  const handleFixtureSelect = (fixture) => {
    setSelectedFixture(fixture);
    setAppState('wager');
  };

  const handleWagerSubmit = (_betData) => {
    refetchBalance?.();
    setAppState('main');
    setActiveTab('home');
  };

  const handleOddsSubmit = async (betData) => {
    // Bet is already on-chain; mirror it to the backend best-effort (history
    // /analytics only — the UI reads positions from the chain, so a failure
    // here never blocks anything).
    apiPlaceBet(
      {
        marketId:    betData.marketId,
        outcome:     betData.prediction,
        amount:      betData.amount,
        txHash:      betData.txHash,
        marketTitle: betData.marketTitle,
        odds:        betData.odds,
      },
      walletAddress,
    ).catch(err => console.warn('backend bet log failed (non-fatal):', err.message));

    // refresh the on-chain view + both balances after the tx
    refetchBalance?.();
    refetchBets?.();
    refetchCelo?.();
    setAppState('main');
    setActiveTab('predict');
  };

  const TAB_LABELS = { home: 'Home', standings: 'Standings', predict: 'Predict', insights: 'Insights' };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return <HomeTab      key="home"      onSelectMarket={handleMarketSelect} onFixtureSelect={handleFixtureSelect} user={user} />;
      case 'standings': return <StandingsTab key="standings" />;
      case 'predict':   return <PredictTab   key="predict"   onSelectMarket={handleMarketSelect} />;
      case 'insights':  return <InsightsTab  key="insights"  />;
      default:          return <HomeTab      key="home"      onSelectMarket={handleMarketSelect} onFixtureSelect={handleFixtureSelect} user={user} />;
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
                  onClick={() => setAppState('positions')}
                  aria-label="My Positions"
                  title="My positions"
                >
                  <Icon name="target" size={22} color="#ffd700" />
                </button>
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

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onPositions={() => setAppState('positions')} />
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

        {appState === 'wager' && selectedFixture && (
          <div className="page-slide-in">
            <PlaceWagerPage
              fixture={selectedFixture}
              walletAddress={walletAddress}
              walletBalance={parseFloat(balance)}
              onSubmit={handleWagerSubmit}
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
              positions={positions}
              onViewPositions={() => setAppState('positions')}
              onBack={() => setAppState('main')}
            />
          </div>
        )}

        {appState === 'positions' && (
          <div className="page-slide-in">
            <Positions
              positions={positions}
              onRefresh={() => { refetchBets?.(); refetchBalance?.(); }}
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
