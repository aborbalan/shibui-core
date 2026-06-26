import { defineConfig } from 'vite';

// Demo Showcase de sukashi. Root = esta carpeta; build a demo/dist (servido en sukashi.web.app).
export default defineConfig({
  base: './',
  build: { target: 'es2022', outDir: 'dist', emptyOutDir: true },
});
