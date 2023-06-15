import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: [
      "src/assets/aggiungi.PNG",
      "src/assets/bloccato.PNG",
      "src/assets/conferma.PNG",
      "src/assets/favicon.ico",
      "src/assets/img1.PNG",
      "src/assets/img2.PNG",
      "src/assets/img3.PNG",
      "src/assets/img4.PNG",
      "src/assets/img5.PNG",
      "src/assets/img6.PNG",
      "src/assets/img7.PNG",
      "src/assets/img8.PNG",
      "src/assets/img9.PNG",
      "src/assets/img10.PNG",
      "src/assets/info.png",
      "src/assets/rimuovi.PNG",
      "src/assets/sbloccato.PNG",
      "src/assets/trash.png",
      ]
    }
  }
})
