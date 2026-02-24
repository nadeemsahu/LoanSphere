import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase warning threshold to avoid noise
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // React core — almost never changes; long cache lifetime
          'react-vendor': ['react', 'react-dom'],
          // Router — stable library
          'router-vendor': ['react-router-dom'],
        },
      },
    },
  },
  // Better source maps for debugging without exposing source in prod
  css: {
    devSourcemap: true,
  },
})
