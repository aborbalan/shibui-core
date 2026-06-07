import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-visually-hidden.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Utilities/Visually Hidden',
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
   KATACHI · 形 · Las 6 historias estándar
   lib-visually-hidden no tiene superficie propia — los tokens
   semánticos (bg-elevated, border-subtle, text-primary) del
   contenedor heredan el katachi activo.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;gap:var(--lib-space-sm);align-items:center;padding:var(--lib-space-md);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
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
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;