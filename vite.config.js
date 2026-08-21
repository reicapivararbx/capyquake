import { defineConfig } from 'vite';

export default defineConfig({
  base: '/capyquake/',
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    host: true,
    open: true,
    allowedHosts: true,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});
