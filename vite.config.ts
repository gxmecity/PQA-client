import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'gxme-city',
      project: 'javascript-react',
    }),
  ],
  server: {
    port: 5001,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: true,
  },
})
