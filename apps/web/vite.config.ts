import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const api = 'http://127.0.0.1:3000';

export default defineConfig({
  // Chemins relatifs : le serveur injecte <base href="/cms/"> selon le chemin choisi à l'installation.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // changeOrigin: false garde l'en-tête Host du navigateur, comme Nginx en production.
      '/api': { target: api, changeOrigin: false },
      '/uploads': { target: api, changeOrigin: false },
      '/ws': { target: api, ws: true, changeOrigin: false },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
  },
});
