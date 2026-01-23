import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import {defineConfig} from 'vite'
import pkg from '../../packages/eskill/package.json'

const version = pkg.version

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
