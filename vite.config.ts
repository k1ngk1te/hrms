import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Find a way to read environment variables from the .env file

export default defineConfig({
  base: process.env.mode === "production" ? "/static/" : "/",
  build: {
    manifest: true
  },
  plugins: [react()],
  publicDir: "static",
  root: "src"
})
