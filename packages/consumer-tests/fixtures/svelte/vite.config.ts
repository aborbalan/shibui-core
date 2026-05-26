import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    // @shibui-ui/ui usa preserveModules:true → muchos archivos pequeños.
    // Excluirlo del pre-bundling evita conflictos con la gestión de caché de
    // @sveltejs/vite-plugin-svelte y permite que Vite sirva los módulos
    // directamente (requiere server.fs.strict:false — ver abajo).
    exclude: ['@shibui-ui/ui'],
  },
  server: {
    // @shibui-ui/ui está instalado como symlink pnpm workspace:
    //   node_modules/@shibui-ui/ui → ../../../shibui-ui/
    // Al seguir el symlink, los archivos de dist/ quedan fuera del root del
    // fixture. Con strict:false Vite puede servirlos sin devolver 403.
    // Sin esta opción, customElements.define() nunca se llama → timeout.
    fs: { strict: false },
  },
});
