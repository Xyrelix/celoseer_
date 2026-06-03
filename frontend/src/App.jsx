import { useState } from 'react';
import Onboarding from './components/Onboarding';
import MarketDiscoverFeed from './components/MarketDiscoverFeed';
import OddsSlip from './components/OddsSlip';
import Portfolio from './components/Portfolio';
import './styles.css';

function App() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setWalletBalance(userData.initialBalance || 100);
    setCurrentView('discover');
  };

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setCurrentView('odds');
  };

  const handleOddsSubmit = (betData) => {
    const newPosition = {
      id: Date.now(),
      ...betData,
      timestamp: new Date().toLocaleString(),
      status: 'active'
    };
    setPortfolio([...portfolio, newPosition]);
    setWalletBalance(walletBalance - betData.amount);
    setCurrentView('discover');
  };

  return (
    <div className="app-container">
      {currentView === 'onboarding' && !user && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {currentView === 'discover' && user && (
        <MarketDiscoverFeed 
          onSelectMarket={handleMarketSelect}
          user={user}
          walletBalance={walletBalance}
          onNavigatePortfolio={() => setCurrentView('portfolio')}
        />
      )}
      {currentView === 'odds' && user && selectedMarket && (
        <OddsSlip 
          market={selectedMarket}
          user={user}
          walletBalance={walletBalance}
          onSubmit={handleOddsSubmit}
          onBack={() => setCurrentView('discover')}
        />
      )}
      {currentView === 'portfolio' && user && (
        <Portfolio 
          user={user}
          positions={portfolio}
          walletBalance={walletBalance}
          onBack={() => setCurrentView('discover')}
        />
      )}
    </div>
  );
}

export default App;
