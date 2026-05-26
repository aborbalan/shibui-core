import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite toma este directorio como root cuando se llama con:
//   vite fixtures/react --port 5174
// Los módulos de node_modules/ se resuelven desde packages/consumer-tests/.
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
