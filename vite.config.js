import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env.VITE_BASE_PATH': JSON.stringify(process.env.VITE_BASE_PATH || '/')
  }
})
