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
  },
  server: {
    port: 5179,
  },
});
