/* ============================================================
   hanko · Observaciones del harness — contrato de cable (F6 · incr. 2)

   Forma del fichero que la Etapa 1 (la sonda de navegador,
   `dogfood/probe-shibui.ts`) escribe y la Etapa 2 (el runner del
   Trust Report, `report/run.ts`) lee. Es el PUENTE entre las dos:
   el navegador produce las observaciones crudas; Node corre los
   checks puros sobre ellas.

   Solo TIPOS (sin DOM, sin shibui): lo importan ambos lados sin
   acoplarse al navegador. La sonda vive fuera de `src/` —importa
   shibui para registrar los elementos— pero reusa estos tipos.

   Spec: docs/specs/trust-report.md · docs/specs/harness.md
   ============================================================ */
import type { ComponentRuntime } from '../core/runtime';
import type { A11yObservation } from '../checks/a11y';
import type { ResilienceObservation } from '../checks/resilience';

/** Las tres observaciones que el harness captura de un elemento vivo. */
export interface ComponentObservation {
  tagName: string;
  runtime: ComponentRuntime;
  a11y: A11yObservation;
  resilience: ResilienceObservation;
}

/** Fichero `observations.json` emitido por la sonda de navegador. */
export interface ObservationsFile {
  /** ISO timestamp de la corrida de la sonda. */
  generatedAt: string;
  /** Cómo se generó, p.ej. `'playwright-chromium'` (procedencia/depuración). */
  via: string;
  /** Una observación por custom element registrado del CEM. */
  components: ComponentObservation[];
}
