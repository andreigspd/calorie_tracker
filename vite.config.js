import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base is set to the repo name so assets resolve correctly on GitHub Pages
// (served from https://<user>.github.io/calorie_tracker/).
export default defineConfig({
  base: '/calorie_tracker/',
  plugins: [react()],
})
