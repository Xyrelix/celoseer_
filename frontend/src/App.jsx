import { useState } from 'react';
import Onboarding from './components/Onboarding';
import MarketDiscoverFeed from './components/MarketDiscoverFeed';
import OddsSlip from './components/OddsSlip';
import Portfolio from './components/Portfolio';
import { useAuth } from './hooks/useAuth';
import { useWalletBalance } from './hooks/useWalletBalance';
import './styles.css';

function App() {
  const { authenticated, user, walletAddress, displayAddress, logout } = useAuth();
  const { balance, refetch: refetchBalance } = useWalletBalance(walletAddress);

  const [currentView, setCurrentView] = useState('discover');
  const [selectedMarket, setSelectedMarket] = useState(null);

  const appUser = authenticated
    ? { privyUser: user, walletAddress, displayAddress }
    : null;

  if (!authenticated) {
    return (
      <div className="app-container">
        <Onboarding onComplete={() => setCurrentView('discover')} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentView === 'discover' && (
        <MarketDiscoverFeed
          onSelectMarket={(market) => { setSelectedMarket(market); setCurrentView('odds'); }}
          user={appUser}
          walletBalance={parseFloat(balance)}
          onNavigatePortfolio={() => setCurrentView('portfolio')}
          onLogout={logout}
        />
      )}
      {currentView === 'odds' && selectedMarket && (
        <OddsSlip
          market={selectedMarket}
          user={appUser}
          walletBalance={parseFloat(balance)}
          onSubmit={() => { refetchBalance(); setCurrentView('discover'); }}
          onBack={() => setCurrentView('discover')}
        />
      )}
      {currentView === 'portfolio' && (
        <Portfolio
          user={appUser}
          walletBalance={parseFloat(balance)}
          onBack={() => setCurrentView('discover')}
        />
      )}
    </div>
  );
}

export default App;
