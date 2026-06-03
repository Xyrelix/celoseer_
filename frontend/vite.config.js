import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  optimizeDeps: {
    exclude: [
      '@wagmi/connectors',
      '@reown/appkit',
      '@reown/appkit-ui',
      '@reown/appkit-utils',
      '@reown/appkit-wallet',
      '@walletconnect/universal-provider',
    ],
    esbuildOptions: {
      // react-stately private subpath not listed in its exports map
      external: ['react-stately/private/flags/flags'],
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: false,
  },
});
