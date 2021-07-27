import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  base: './',
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      pages: resolve(__dirname, './src/pages'),
      utils: resolve(__dirname, './src/utils'),
      components: resolve(__dirname, './src/components'),
    },
  },
  server: {
    open: '/index.html',
    strictPort: true,
    port: 8090,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
  },
});
