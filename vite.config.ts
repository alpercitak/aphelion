import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    // The shared chunk is mostly three.js's WebGL renderer (~570 kB, ~140 kB gzip), which every scene needs
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
