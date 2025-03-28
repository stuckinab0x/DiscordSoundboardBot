import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components',
            { displayNames: mode === 'development' },
          ],
        ],
      },
    }),
  ],
  server: {
    allowedHosts: ['frontend'],
    hmr: { port: 3000 },
    host: true,
    port: 3000,
  },
}));
