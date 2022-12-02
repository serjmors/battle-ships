import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: './editor.html',
      },
    },
  },
  server: {
    open: '/editor.html',
    watch:{
      ignored: [
        './src/scenes/*/**'
      ]
    }
  },
})