/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Vite Configuration for React Frontend
 * 
 * @description Vite build configuration with React plugin and optimizations
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    cors: {
      origin: ['http://localhost:3000', 'https://os.c6group.co.za'],
      credentials: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          aws: ['amazon-cognito-identity-js', '@aws-amplify/auth', '@aws-amplify/core'],
          ui: ['lucide-react', 'framer-motion']
        }
      }
    }
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})