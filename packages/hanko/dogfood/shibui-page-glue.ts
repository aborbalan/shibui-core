/* ============================================================
   hanko · glue de registro de shibui para la PÁGINA del Trust Report

   Hermano de `browser-glue.ts`, pero mínimo: aquí no hay harness ni axe.
   Lo único que hace es importar el dist de shibui-ui para que sus
   `@customElement` registren los custom elements en `customElements`.
   `bundle-shibui-page.ts` lo empaqueta (esbuild → IIFE autocontenido,
   con `lit` incluido) y lo deja como `shibui-ui.js` junto al index.html,
   de modo que el Trust Report renderice con los componentes reales.

   ⚠️ Igual que `browser-glue.ts`, ESTE fichero toca shibui POR CÓDIGO y por
   eso vive FUERA de `src/`: el guard `src/genericity.test.ts` escanea solo
   `src/`, así que el CORE sigue sin importar shibui. Solo la VISUALIZACIÓN
   (el HTML del report) usa la librería; el motor de informes no.

   Spec: docs/specs/trust-report.md
   ============================================================ */
import * as shibui from '../../shibui-ui/dist/index.js';

// Fuerza la evaluación del módulo de shibui (sus @customElement → define()).
// Asignar a globalThis es un side-effect que NINGÚN bundler poda, a diferencia
// del `import` a secas que esbuild descartaría (sus chunks no están en sideEffects).
(globalThis as Record<string, unknown>).__shibui = shibui;
