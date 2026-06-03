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
import Icon         from './components/Icon';
import './styles.css';

function App() {
  const [appState,       setAppState]       = useState('onboarding');
  const [activeTab,      setActiveTab]      = useState('home');
  const [user,           setUser]           = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [walletBalance,  setWalletBalance]  = useState(0);
  const [portfolio,      setPortfolio]      = useState([]);

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setWalletBalance(userData.initialBalance || 100);
    setAppState('main');
  };

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setAppState('odds');
  };

  const handleOddsSubmit = (betData) => {
    setPortfolio(prev => [
      ...prev,
      { id: Date.now(), ...betData, timestamp: new Date().toLocaleString(), status: 'active' },
    ]);
    setWalletBalance(b => b - betData.amount);
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

  return (
    <>
      {/* Motion background — shown for every state except onboarding (which has its own) */}
      {appState !== 'onboarding' && <BackgroundFX />}

      <div className="app-container app-transparent">
        {/* ── Onboarding ── */}
        {appState === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {/* ── Main tabbed app ── */}
        {appState === 'main' && user && (
          <div className="main-app">
            <header className="top-bar glass-dark-bar">
              <div className="top-bar-left">
                <img src="/reallogo.png"     alt=""         className="topbar-logo" />
                <img src="/realceloseer.png" alt="CeloSeer" className="topbar-wordmark" />
              </div>
              <div className="top-bar-center">
                <span className="topbar-page-label">{TAB_LABELS[activeTab]}</span>
              </div>
              <div className="top-bar-right">
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

            <BottomNav activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); }} />
          </div>
        )}

        {/* ── Odds Slip ── */}
        {appState === 'odds' && user && selectedMarket && (
          <div className="page-slide-in">
            <OddsSlip
              market={selectedMarket}
              user={user}
              walletBalance={walletBalance}
              onSubmit={handleOddsSubmit}
              onBack={() => setAppState('main')}
            />
          </div>
        )}

        {/* ── My Profile ── */}
        {appState === 'profile' && user && (
          <div className="page-slide-in">
            <Profile
              user={user}
              positions={portfolio}
              walletBalance={walletBalance}
              onBack={() => setAppState('main')}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
