import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'axios'],
          threecore: ['three', '@react-three/fiber'],
          threehelpers: ['@react-three/drei'],
          motion: ['framer-motion'],
          charts: ['recharts', 'socket.io-client', 'lucide-react'],
        },
      },
    },
  },
})
