import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    allowedHosts: ['mystery-pic.com', 'www.mystery-pic.com'],
    host: true,
    port: 6050,
  },
})
