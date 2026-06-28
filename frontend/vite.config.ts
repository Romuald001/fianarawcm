import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // écoute sur toutes les interfaces réseau, pas seulement localhost
    allowedHosts: true, // autorise les hôtes externes (ex: tunnel ngrok) — usage temporaire/dev uniquement
  },
})
