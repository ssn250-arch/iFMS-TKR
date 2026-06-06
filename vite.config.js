import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ifms-tkr/', // Tambah baris ni (Mesti letak slash depan dan belakang)
})