import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // Force the specified port
    host: true, // Listen on all addresses
    open: true,
    cors: {
      origin: ['http://localhost:5000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    historyApiFallback: true, // Enable SPA routing
  },
  base: '/', // Ensure proper base URL for routing
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'chart.js', 'react-chartjs-2']
  },
})
