import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Two pages: the site, and /lab/scenes.html (code-built 3D scene preview; not linked from the site).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        scenes: resolve(import.meta.dirname, 'lab/scenes.html'),
      },
    },
  },
});
