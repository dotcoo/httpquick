import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig(({ mode = 'es' }) => ({
  plugins: [
    vue(),
    // dts(),
    viteStaticCopy({
      targets: [
        {
          src: 'lib/httpquick.d.ts',
          dest: '',
          rename: { stripBase: 1/*, name: 'httpquick.d.ts'*/ }, // strips `bin/`
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: {
        'httpquick-ajax': 'lib/httpquick-ajax.js',
        'httpquick-fetch': 'lib/httpquick-fetch.js',
        'httpquick-uniapp': 'lib/httpquick-uniapp.js',
        'httpquick-xcx': 'lib/httpquick-xcx.js',
        'httpquick-node': 'lib/httpquick-node.js',
        'httpquick-fibjs': 'lib/httpquick-fibjs.js',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['http', 'util'],
    },
  },
}));
