import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

dotenv.config()

// https://vitejs.dev/config/

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/static/" : "/",
  build: {
    manifest: true
  },
  plugins: [react()],
  publicDir: "../static",
  root: "src"
})
