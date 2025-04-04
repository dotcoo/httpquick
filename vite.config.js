import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        ajax: 'lib/HttpQuickAjax.js',
        fetch: 'lib/HttpQuickFetch.js',
        uniapp: 'lib/HttpQuickUniapp.js',
        xcx: 'lib/HttpQuickXcx.js',
        node: 'lib/HttpQuickNode.js',
        fibjs: 'lib/HttpQuickFibjs.js',
      },
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'http', 'util'],
    },
  },
});
