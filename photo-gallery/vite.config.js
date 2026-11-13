import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// send API calls through the dev server so the browser only talks to our own
// origin (no CORS). /backup-api is used when picsum is down, see src/feed.js
const proxy = {
  '/api': {
    target: 'https://picsum.photos',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/backup-api': {
    target: 'https://api.slingacademy.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/backup-api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
