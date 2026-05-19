import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-visually-hidden.component';

const meta: Meta = {
  title: 'Utilities/Visually Hidden',
  tags:['autodocs'],
  component: 'lib-visually-hidden',
};

export default meta;

export const Default: StoryObj = {
  render: (): TemplateResult => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <p>A la derecha hay un botón que solo tiene un icono (X), pero es accesible:</p>

      <button style="padding: 8px; cursor: pointer;">
        <span aria-hidden="true">❌</span>
        <lib-visually-hidden>Cerrar ventana modal</lib-visually-hidden>
      </button>
    </div>

    <div style="margin-top: 2rem; padding: 1rem; background: var(--color-washi-100);">
      <strong>Nota:</strong> Si inspeccionas el botón con el navegador, verás el texto.
      Si usas un lector de pantalla, escuchará "Cerrar ventana modal".
      Visualmente, el texto no ocupa espacio.
    </div>
  `
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: StoryObj = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="display:flex;gap:10px;align-items:center;padding:12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);">
            <button style="padding:6px 10px;background:var(--bg-surface);border:1px solid var(--border-default);color:var(--text-primary);cursor:pointer;font-family:var(--lib-font-body);font-size:.875rem;">
              <span aria-hidden="true">✕</span>
              <lib-visually-hidden>Cerrar diálogo</lib-visually-hidden>
            </button>
            <button style="padding:6px 10px;background:var(--bg-surface);border:1px solid var(--border-default);color:var(--text-primary);cursor:pointer;font-family:var(--lib-font-body);font-size:.875rem;" aria-label="Navegar al inicio">
              <span aria-hidden="true">⌂</span>
              <lib-visually-hidden>Inicio</lib-visually-hidden>
            </button>
            <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">texto oculto visualmente</span>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};