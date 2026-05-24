import { html, nothing, TemplateResult } from 'lit';
import type { EditorToolbarTemplateProps } from './lib-editor-toolbar.types';

/* ── Inline SVGs ─────────────────────────────────────────── */

const newFileSvg = html`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="11" x2="12" y2="17"/>
    <line x1="9" y1="14" x2="15" y2="14"/>
  </svg>
`;

const openFileSvg = html`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
`;

const saveFileSvg = html`
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
`;

const savingSpinnerSvg = html`
  <svg class="toolbar__saving-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <path d="M21 12a9 9 0 1 1-9-9"/>
  </svg>
`;

/* ── Template ────────────────────────────────────────────── */

/**
 * Template de lib-editor-toolbar.
 *
 * Estructura:
 *   .toolbar
 *   ├── .toolbar__actions      ← botones New, [Open], Save
 *   ├── .toolbar__divider
 *   └── .toolbar__file-info    ← nombre del fichero + dirty indicator
 */
export function editorToolbarTemplate(props: EditorToolbarTemplateProps): TemplateResult {
  const { filename, dirty, saving, showOpen, onNew, onOpen, onSave } = props;

  const displayName = filename ?? 'Sin título';
  const canSave     = !saving;

  return html`
    <div class="toolbar" role="toolbar" aria-label="Acciones del editor">

      <!-- ACCIONES -->
      <div class="toolbar__actions">
        <button
          class="toolbar__btn"
          aria-label="Nuevo fichero"
          title="Nuevo"
          @click="${(): void => onNew()}"
        >
          ${newFileSvg}
          <span class="toolbar__btn-label">Nuevo</span>
        </button>

        ${showOpen ? html`
          <button
            class="toolbar__btn"
            aria-label="Abrir fichero"
            title="Abrir"
            @click="${(): void => onOpen()}"
          >
            ${openFileSvg}
            <span class="toolbar__btn-label">Abrir</span>
          </button>
        ` : nothing}

        <button
          class="toolbar__btn toolbar__btn--save"
          aria-label="Guardar fichero"
          title="Guardar"
          ?disabled="${!canSave}"
          @click="${(): void => { if (canSave) onSave(); }}"
        >
          ${saving ? savingSpinnerSvg : saveFileSvg}
          <span class="toolbar__btn-label">${saving ? 'Guardando…' : 'Guardar'}</span>
        </button>
      </div>

      <!-- SEPARADOR -->
      <div class="toolbar__divider" role="separator"></div>

      <!-- INFO DEL FICHERO -->
      <div class="toolbar__file-info">
        <span class="toolbar__filename" title="${displayName}">${displayName}</span>
        ${dirty ? html`<span class="toolbar__dirty-dot" aria-label="Cambios sin guardar" title="Cambios sin guardar">·</span>` : nothing}
      </div>

    </div>
  `;
}
