import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// En modo build (vite build) Rollup resuelve y bundlea @shibui-ui/ui + lit
// en un único chunk. No hay problema de pre-bundling ni de symlinks.
// Los tests se sirven con `vite preview` sobre la salida estática del build.
export default defineConfig({
  plugins: [svelte()],
});
