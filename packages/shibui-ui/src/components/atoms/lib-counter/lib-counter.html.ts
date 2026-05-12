import { html, nothing, svg, TemplateResult } from 'lit';

export type LibCounterSize     = 'sm' | 'md' | 'lg' | 'xl';
export type LibCounterTone     = 'default' | 'kaki' | 'celadon' | 'error' | 'muted' | 'on-dark';
export type LibCounterDeltaDir = 'up' | 'down' | 'flat';

export interface CounterTemplateProps {
  size:     LibCounterSize;
  tone:     LibCounterTone;
  label:    string;
  delta:    string;
  deltaDir: LibCounterDeltaDir;
}

/* ── Delta icons — inline SVG, sin dependencia Phosphor ── */
const iconUp = svg`
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    <polygon points="5,1 9,9 1,9"/>
  </svg>`;

const iconDown = svg`
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    <polygon points="5,9 9,1 1,1"/>
  </svg>`;

const iconFlat = svg`
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
       stroke="currentColor" stroke-width="1.8"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="1" y1="5" x2="9" y2="5"/>
  </svg>`;

const DELTA_ICON: Record<LibCounterDeltaDir, TemplateResult> = {
  up:   iconUp,
  down: iconDown,
  flat: iconFlat,
};

/**
 * Shell estático de lib-counter.
 *
 * El .cnt-row se construye y anima enteramente por el motor
 * imperativo en LibCounter.updated(). El template solo provee
 * el contenedor y la fila de metadatos.
 *
 * Estructura:
 *   div.cnt.cnt-{size}[.cnt-{tone}]
 *     div.cnt-row[part="row"]       ← dígitos, construidos vía DOM
 *     div.cnt-meta                  ← label + delta (opcionales)
 */
export function counterTemplate(props: CounterTemplateProps): TemplateResult {
  const { size, tone, label, delta, deltaDir } = props;
  const toneClass = tone !== 'default' ? `cnt-${tone}` : '';

  return html`
    <div class="cnt cnt-${size} ${toneClass}">
      <div class="cnt-row" part="row"></div>

      ${label || delta ? html`
        <div class="cnt-meta">
          ${label ? html`<span class="cnt-label">${label}</span>` : nothing}
          ${delta ? html`
            <span class="cnt-delta cnt-delta-${deltaDir}" aria-label="Variación ${deltaDir}">
              ${DELTA_ICON[deltaDir]}
              ${delta}
            </span>
          ` : nothing}
        </div>
      ` : nothing}
    </div>
  `;
}