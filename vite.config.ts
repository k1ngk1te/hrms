import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
const path = require("path")
export default defineConfig({
  base: process.env.mode === "production" ? "/static/" : "/",
  build: {
    manifest: true
  },
  plugins: [react()],
  publicDir: "static",
  root: "src",
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
})
