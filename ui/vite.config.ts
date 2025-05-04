import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env à la racine du projet
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')

  return {
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
    envDir: path.resolve(__dirname, '..'),
    // Expose les variables d'environnement au frontend
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  }
})
