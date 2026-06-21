/* ============================================================
   hanko · glue de navegador del dogfood (F6 · incr. 2 — Etapa 1)

   Se ejecuta DENTRO del navegador: esbuild lo bundlea a un IIFE que
   `probe-shibui.ts` inyecta inline en una página en blanco. Hace dos
   cosas:
     1. importa el dist de shibui-ui → side-effect `customElements.define`
        de todos los componentes (shibui marca `dist/index.js` como
        sideEffect en su package.json, así que el import los registra);
     2. expone el harness genérico de hanko en `window.__hankoProbe`.

   ⚠️ ESTE es el único punto de todo hanko que toca shibui POR CÓDIGO, y
   por eso vive FUERA de `src/`: el guard `src/genericity.test.ts` escanea
   solo `src/`, de modo que el CORE sigue sin importar shibui. El dogfood
   —tooling, no publicable (no entra en `files`)— sí lo carga: es justo lo
   que significa «correr el motor real sobre los componentes reales».

   Nota Lit (calibración): los componentes de shibui son LitElement y
   renderizan su shadow DOM / reflejan prop→attr de forma ASÍNCRONA (microtask
   tras montar). El harness ya espera `el.updateComplete` antes de leer slots y
   la reflexión (`observeRuntime` es async); por eso `observe` lo `await`-ea.
   Ver `elUpdateComplete` en `src/harness/probe.ts`.

   Spec: docs/specs/harness.md
   ============================================================ */
import * as shibui from '../../shibui-ui/dist/index.js';
import * as axe from 'axe-core';
import { observeRuntime, observeA11y, observeResilience } from '../src/harness/probe';
import type { AxeRunner, PropTypeHint } from '../src/harness/probe';
import type { ComponentObservation } from '../src/report/observations';

// Fuerza la evaluación del módulo de shibui (sus @customElement → define()).
// Asignar a globalThis es un side-effect que NINGÚN bundler poda, a diferencia
// del `import` a secas que esbuild descartaba (sus chunks no están en sideEffects).
(globalThis as Record<string, unknown>).__shibui = shibui;

declare global {
  interface Window {
    /** Puente que `probe-shibui.ts` invoca por cada tag vía `page.evaluate`. */
    __hankoProbe: {
      observe(
        tagName: string,
        propTypes?: Record<string, PropTypeHint>,
      ): Promise<ComponentObservation>;
    };
  }
}

/** axe se INYECTA en el harness (no se importa allí): aquí lo cableamos. */
const runAxe: AxeRunner = (el) => axe.run(el);

window.__hankoProbe = {
  // `propTypes` (tipo declarado por prop, del CEM) lo arma `probe-shibui.ts` en
  // Node y lo inyecta por tag: tipa el sentinel de reflexión sin que el harness
  // conozca el contrato.
  async observe(
    tagName: string,
    propTypes?: Record<string, PropTypeHint>,
  ): Promise<ComponentObservation> {
    const runtime = await observeRuntime(tagName, propTypes);
    const a11y = await observeA11y(tagName, runAxe);
    const resilience = await observeResilience(tagName);
    return { tagName, runtime, a11y, resilience };
  },
};
