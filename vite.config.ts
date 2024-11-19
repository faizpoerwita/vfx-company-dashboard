import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor'
            if (id.includes('@headlessui') || id.includes('@radix-ui')) return 'ui'
            if (id.includes('chart.js')) return 'charts'
            if (id.includes('heroicons') || id.includes('tabler')) return 'icons'
            return 'vendor'
          }
        }
      }
    }
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
