import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '192.168.254.167',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wordscapes',
        short_name: 'Wordscapes',
        display: 'fullscreen',
        description: 'A crossword with a twist',
        background_color: '#1a1a1c',
        icons: [
          {
            src: '/wordscapes-dark.svg',
            sizes:
              '48x48 72x72 96x96 120x120 128x128 144x144 180x180 256x256 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/wordscapes-dark.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        theme_color: '#1a1a1c',
      },
    }),
  ],
})
