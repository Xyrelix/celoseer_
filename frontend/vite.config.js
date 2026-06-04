import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Modern stack (Vite 8 + wagmi 3 + Privy v3) ships clean ESM, so none of the
// old WalletConnect aliases / dedupe / CJS-interop includes are needed.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: {
      // Some web3 deps reference the Node `buffer` global in the browser.
      buffer: 'buffer/',
    },
  },
  define: {
    'process.env': {},
  },
});
