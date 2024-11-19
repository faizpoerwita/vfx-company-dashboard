import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') }
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu'],
          charts: ['chart.js', 'react-chartjs-2'],
          icons: ['@heroicons/react', '@tabler/icons-react'],
          utils: ['axios', 'zod', 'react-hot-toast']
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8888/.netlify/functions/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
