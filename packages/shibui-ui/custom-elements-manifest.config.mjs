// packages/shibui-ui/custom-elements-manifest.config.mjs
export default {
    /** Carpeta de entrada */
    globs: ['src/components/**/*.component.ts'],
    /** Carpeta de salida */
    outdir: 'dist',
    /** Plugins específicos para Lit */
    litelement: true,
    /** Evitar que intente generar readmes si no los necesitas ahora */
    plugins: [], 
    /** Exclusiones */
    exclude: ['dist', 'node_modules', 'scripts'],
    /** No fallar si no hay JSDoc en todo */
    dev: false,
    watch: false
  };