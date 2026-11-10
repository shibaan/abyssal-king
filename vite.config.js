import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the site from https://<user>.github.io/abyssal-king/ (dev server stays at /)
  base: command === 'build' || isPreview ? '/abyssal-king/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    // three.js lives in lazily-loaded chunks (HeroScene / AnatomyScene)
    chunkSizeWarningLimit: 1600,
  },
}))
