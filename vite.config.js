import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/3dcity/',
  server: {
    host: true,
    port: 5173
  }
})
