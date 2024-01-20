import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
  ],
  server: {
    host: true,
    port: 3000,
    hmr: { port: 3000 },
  },
});
