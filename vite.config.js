import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'], // Pastikan logo.png ada dalam folder public
      manifest: {
        name: 'Sistem iFMS-TKR ADTEC Sandakan',
        short_name: 'iFMS-TKR',
        description: 'Pusat sehenti pengurusan fasiliti dan peralatan ICT',
        theme_color: '#ffffff',
        background_color: '#f8fafc',
        display: 'standalone', // Ini yang buat dia buang URL bar bila di-install
        icons: [
          {
            src: 'logo.png', // Guna logo kau sebagai icon app
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/iFMS-TKR/', 
})