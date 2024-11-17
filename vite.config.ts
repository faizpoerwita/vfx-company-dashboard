import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  server: {
    port: 5173,
    strictPort: true, // Force the specified port
    host: true, // Listen on all addresses
    open: true,
    cors: true,
    historyApiFallback: true, // Enable SPA routing
  },
  base: '/', // Ensure proper base URL for routing
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'chart.js', 'react-chartjs-2']
  },
})
