import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => ({
  plugins: [vue()],
  build: {
    lib: mode == 'umd' ? {
      entry: 'lib/HttpQuickAjax.js',
      name: 'httpquick',
      formats: ['umd'],
    } : {
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
}));
