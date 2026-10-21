import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// One build convention for the portal's independently adopted Vue panels.
export function portalBuild(entry, fileName) {
  return defineConfig({
    plugins: [vue()], publicDir: false,
    define: {'process.env.NODE_ENV': JSON.stringify('production'), __VUE_OPTIONS_API__: false, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false},
    build: {
      outDir: 'services/portal/public/assets', emptyOutDir: false,
      lib: {entry, formats: ['es'], fileName: () => fileName},
      rolldownOptions: {external: ['/assets/client.js']},
      minify: true, sourcemap: false
    }
  });
}
