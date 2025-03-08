import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Mendengarkan pada semua IP
    port: 5173,       // Port default Vite
    strictPort: true, // Gunakan port yang ditentukan secara ketat
    allowedHosts: [
      'localhost', 
      '127.0.0.1',
      'app.cryptosudoku.xyz',
      '.cryptosudoku.xyz'  // Mengizinkan semua subdomain cryptosudoku.xyz
    ],
    cors: true
  }
})
