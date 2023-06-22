import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
      "src/assets/privato.PNG",
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
      "src/assets/img11.PNG",
      "src/assets/img12.PNG",
      "src/assets/img13.PNG",
      "src/assets/img14.PNG",
      "src/assets/img15.PNG",
      "src/assets/img16.PNG",
      "src/assets/img17.PNG",
      "src/assets/img18.PNG",
      "src/assets/img19.PNG",
      "src/assets/img20.PNG",
      "src/assets/img21.PNG",
      "src/assets/img22.PNG",
      "src/assets/img23.PNG",
      "src/assets/img24.PNG",
      "src/assets/img25.PNG",
      "src/assets/info.png",
      "src/assets/rimuovi.PNG",
      "src/assets/pubblico.PNG",
      "src/assets/trash.png",
      "src/assets/commenti.PNG",
      "src/assets/storico.PNG",
      "src/assets/calendario.PNG",
      ]
    }
  }
})
