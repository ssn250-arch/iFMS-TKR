import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/iFMS-TKR/', // Wajib ada untuk GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Inilah fungsi ajaib untuk Auto-Sync kod baru!
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // Fail yang akan di-cache
      },
      includeAssets: ['logo.png', 'icons.svg'], // Guna logo dari folder public bro
      manifest: {
        name: 'ServeDesk+ ADTEC',
        short_name: 'ServeDesk',
        description: 'Sistem Pengurusan Fasiliti & Aduan ICT',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})