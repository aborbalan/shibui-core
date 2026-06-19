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

   Nota Lit (calibración, Paso 0): los componentes de shibui son LitElement
   y renderizan su shadow DOM de forma ASÍNCRONA (microtask tras montar). El
   harness observa de forma síncrona, así que en esta v0 los slots de un
   componente Lit quedan SIN observar (→ `skipped` por la regla de oro, no
   un falso fallo) y el sondeo de reflect puede quedar corto. Afinarlo
   (esperar `updateComplete`) es trabajo de calibración del harness.

   Spec: docs/specs/harness.md
   ============================================================ */
import '../../shibui-ui/dist/index.js';
import * as axe from 'axe-core';
import { observeRuntime, observeA11y, observeResilience } from '../src/harness/probe';
import type { AxeRunner } from '../src/harness/probe';
import type { ComponentObservation } from '../src/report/observations';

declare global {
  interface Window {
    /** Puente que `probe-shibui.ts` invoca por cada tag vía `page.evaluate`. */
    __hankoProbe: {
      observe(tagName: string): Promise<ComponentObservation>;
    };
  }
}

/** axe se INYECTA en el harness (no se importa allí): aquí lo cableamos. */
const runAxe: AxeRunner = (el) => axe.run(el);

window.__hankoProbe = {
  async observe(tagName: string): Promise<ComponentObservation> {
    const runtime = observeRuntime(tagName);
    const a11y = await observeA11y(tagName, runAxe);
    const resilience = observeResilience(tagName);
    return { tagName, runtime, a11y, resilience };
  },
};
