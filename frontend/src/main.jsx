import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles.css';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;
const queryClient = new QueryClient();

// If a real Privy App ID is present, load the full provider stack.
// Otherwise render App directly so the UI is visible during local dev.
async function bootstrap() {
  const root = createRoot(document.getElementById('root'));

  if (PRIVY_APP_ID && PRIVY_APP_ID.length > 4) {
    const { PrivyProvider }      = await import('@privy-io/react-auth');
    const { WagmiProvider }      = await import('@privy-io/wagmi');
    const { privyConfig }        = await import('./config/privy');
    const { wagmiConfig }        = await import('./config/wagmi');

    root.render(
      <React.StrictMode>
        <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
              <App />
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
      </React.StrictMode>
    );
  } else {
    // Dev-only fallback: no Privy, just render the UI
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
}

bootstrap();

