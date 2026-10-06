import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
  build: { outDir: '../dist', emptyOutDir: true },
  // Sem isto o Vitest herda o root 'frontend' e não acha backend/tests.
  test: { root: import.meta.dirname },
});
