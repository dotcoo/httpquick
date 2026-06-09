import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig(({ mode = 'es' }) => ({
  plugins: [
    vue(),
    dts(),
  ],
  build: {
    lib: {
      entry: mode == 'es' ? {
        ajax: 'lib/httpquick-ajax.js',
        fetch: 'lib/httpquick-fetch.js',
        uniapp: 'lib/httpquick-uniapp.js',
        xcx: 'lib/httpquick-xcx.js',
        node: 'lib/httpquick-node.js',
        fibjs: 'lib/httpquick-fibjs.js',
      } : mode == 'cjs' ? {
        node: 'lib/httpquick-node.js',
        fibjs: 'lib/httpquick-fibjs.js',
      } : {
        ajax: 'lib/httpquick-ajax.js',
      },
      name: 'httpquick',
      formats: [mode],
      fileName: (format, entryName) => ({ es: `httpquick-${entryName}.js`, cjs: `httpquick-${entryName}.cjs`, umd: `httpquick-${entryName}.umd.js` })[format],
    },
    rollupOptions: {
      external: ['http', 'util'],
    },
  },
}));
