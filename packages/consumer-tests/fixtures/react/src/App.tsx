/**
 * App fixture — React 19
 *
 * Expone los cuatro ejes del contrato de consumo:
 *   1. Registro    — los custom elements están definidos tras el import
 *   2. Properties  — boolean y string enum llegan correctamente al elemento
 *   3. Eventos     — ui-lib-modal-close se puede capturar desde React
 *   4. Slots       — contenido sloteado se proyecta en el shadow DOM
 *   5. Katachi     — data-katachi en un ancestro propaga CSS tokens al componente
 *
 * Cada escenario tiene data-scenario="<id>" para ser identificado desde Playwright.
 */
import { useRef, useEffect, useState } from 'react';

// Tipo local para el registro de eventos — no importamos desde shared/contract
// para evitar que la fixture tenga dependencia de ruta relativa cross-root.
type CapturedEventsMap = Record<string, Array<Record<string, unknown>>>;
type WindowWithCapture = Window & { __capturedEvents__: CapturedEventsMap };

function capture(name: string, detail: Record<string, unknown>): void {
  const win = window as unknown as WindowWithCapture;
  win.__capturedEvents__[name] ??= [];
  win.__capturedEvents__[name].push(detail);
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  // useRef para acceder al elemento DOM y adjuntar el listener sin pasar
  // por el sistema de eventos sintéticos de React.
  const modalRef = useRef<HTMLElement>(null);

  // ── Escucha ui-lib-modal-close en el elemento, no en el document ─────────
  // Esto verifica que el evento compuesto (bubbles+composed) llega al host
  // element y puede ser interceptado desde código React.
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail ?? {};
      capture('ui-lib-modal-close', detail);
      setModalOpen(false);
    };

    modal.addEventListener('ui-lib-modal-close', handler);
    return () => modal.removeEventListener('ui-lib-modal-close', handler);
  }, []);

  return (
    <div>

      {/* ── 1. Registro ─────────────────────────────────────────────────── */}
      <section data-scenario="registration">
        <lib-button data-testid="btn-registration">Present</lib-button>
      </section>

      {/* ── 2a. Property — boolean ──────────────────────────────────────── */}
      {/* React 19 envía props booleanas como propiedad JS (no como atributo
          string) en custom elements, igual que hace con elementos nativos. */}
      <section data-scenario="boolean-prop">
        <lib-button disabled data-testid="btn-disabled">Disabled</lib-button>
        <lib-button data-testid="btn-enabled">Enabled</lib-button>
      </section>

      {/* ── 2b. Property — string enum ──────────────────────────────────── */}
      {/* tone="error" debe llegar como atributo reflejado (reflect:true
          en el LitElement) para que los tests de atributo funcionen. */}
      <section data-scenario="string-prop">
        <lib-button tone="error" data-testid="btn-error">Error</lib-button>
      </section>

      {/* ── 3. Eventos ──────────────────────────────────────────────────── */}
      <section data-scenario="events">
        {/* open={modalOpen} en React 19: React detecta que el custom element
            tiene la propiedad `.open` y la asigna directamente (no setAttribute).
            Requiere Lit @property({ type: Boolean, reflect: true }). */}
        <lib-modal
          ref={modalRef}
          id="ct-modal"
          open={modalOpen}
        >
          <span slot="header">Consumer Test Modal</span>
          <p>Prueba de propagación de eventos</p>
        </lib-modal>

        <lib-button
          data-testid="btn-open-modal"
          onClick={() => setModalOpen(true)}
        >
          Abrir modal
        </lib-button>
      </section>

      {/* ── 4. Slots ────────────────────────────────────────────────────── */}
      {/* lib-icon dentro de lib-button con slot="prefix":
          el elemento React renderizado debe aparecer en los assignedNodes
          del slot[name="prefix"] del shadow DOM del botón. */}
      <section data-scenario="slots">
        <lib-button data-testid="btn-with-icon">
          <lib-icon slot="prefix" name="home" />
          Home
        </lib-button>
      </section>

      {/* ── 5. Katachi ──────────────────────────────────────────────────── */}
      {/* CSS custom properties definidas en [data-katachi="x"] deben
          heredarse hasta el custom element y ser visibles vía getComputedStyle.
          El token --katachi-id es el más directo para verificarlo. */}
      <section data-scenario="katachi">
        <div data-katachi="kintsugi">
          <lib-button data-testid="btn-in-kintsugi">Button</lib-button>
        </div>
        <div data-katachi="terminal">
          <lib-button data-testid="btn-in-terminal">Button</lib-button>
        </div>
        {/* Fuera de cualquier katachi — valor por defecto */}
        <lib-button data-testid="btn-no-katachi">Button</lib-button>
      </section>

    </div>
  );
}
