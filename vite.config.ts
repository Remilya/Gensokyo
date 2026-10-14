import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base path './' ensures all JS/CSS/assets load properly when hosted on
  // GitHub Pages under a subpath like https://remilya.dev/Gensokyo/ or any custom directory.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('data/characters.json')) return 'characters-data';
          if (id.includes('data/locations.json') || id.includes('data/routes.json') || id.includes('data/terrain.json')) {
            return 'geography-data';
          }
        },
      },
    },
  },
  server: {
    port: 5179,
  },
});
