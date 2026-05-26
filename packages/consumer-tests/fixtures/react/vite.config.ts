import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite toma este directorio como root cuando se llama con:
//   vite fixtures/react --port 5174
// Los módulos de node_modules/ se resuelven desde packages/consumer-tests/.
export default defineConfig({
  plugins: [
    react({
      // Limitar el transform React (JSX + Fast Refresh) sólo a los archivos
      // del fixture. Sin esto, @vitejs/plugin-react intenta procesar también
      // los archivos de @shibui-ui/ui/dist/ (workspace symlink, fuera de
      // node_modules), lo que puede corromper los Lit components y hacer que
      // customElements.define() nunca se ejecute.
      include: /\/src\/.*\.[jt]sx?$/,
    }),
  ],
  optimizeDeps: {
    // @shibui-ui/ui usa preserveModules → muchos archivos pequeños.
    // Excluirlo del pre-bundling evita que esbuild lo trate como un paquete
    // monolítico y garantiza que los side-effects (define) se ejecuten.
    exclude: ['@shibui-ui/ui'],
  },
  server: {
    // Permite servir archivos desde fuera del root del fixture
    // (necesario para resolver @shibui-ui/ui → packages/shibui-ui/dist/).
    fs: { strict: false },
  },
});
