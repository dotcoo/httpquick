import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        ajax: 'lib/HttpquickAjax.js',
        fetch: 'lib/HttpquickFetch.js',
        uniapp: 'lib/HttpquickUniapp.js',
        xcx: 'lib/HttpquickXcx.js',
      },
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia'],
    },
  },
});
