import { html, svg, nothing, TemplateResult } from 'lit';

export type LibProgressCircleSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LibProgressCircleVariant = 'default' | 'kaki' | 'celadon' | 'error';

/** Dimensiones canónicas por tamaño */
const SIZE_MAP: Record<LibProgressCircleSize, { px: number; stroke: number }> = {
  xs: { px: 40,  stroke: 3 },
  sm: { px: 64,  stroke: 4 },
  md: { px: 96,  stroke: 6 },
  lg: { px: 128, stroke: 7 },
  xl: { px: 176, stroke: 6 },
};

export interface ProgressCircleTemplateProps {
  value:         number;
  max:           number;
  size:          LibProgressCircleSize;
  /** Sobreescribe el strokeWidth por defecto del tamaño */
  strokeWidth:   number | null;
  variant:       LibProgressCircleVariant;
  indeterminate: boolean;
  /** Oculta el label central */
  bare:          boolean;
  /** Subtítulo bajo el valor numérico */
  sub:           string;
  /** Icono SVG en el centro en lugar del texto */
  icon:          'check' | null;
}

/**
 * Renderiza el SVG circular y el label central.
 *
 * Fórmula del arco:
 *   r           = (size - strokeWidth) / 2
 *   circumference = 2π × r
 *   offset      = circumference × (1 − value/max)
 *
 * El SVG se rota -90° en CSS para que el arco empiece arriba.
 */
export function progressCircleTemplate(props: ProgressCircleTemplateProps): TemplateResult {
  const { px, stroke: defaultStroke } = SIZE_MAP[props.size];
  const sw = props.strokeWidth ?? defaultStroke;

  const r    = (px - sw) / 2;
  const circ = 2 * Math.PI * r;

  // Indeterminate: arco corto fijo; determinado: offset calculado
  const offset = props.indeterminate
    ? 0   // stroke-dasharray en CSS controla la longitud del segmento
    : circ * (1 - Math.min(props.value, props.max) / props.max);

  const pct = Math.round((props.value / props.max) * 100);

  return html`
    <div
      class="pc"
      style="width:${px}px; height:${px}px;"
      role="progressbar"
      aria-valuenow=${props.indeterminate ? nothing : props.value}
      aria-valuemin="0"
      aria-valuemax=${props.max}
      aria-label=${props.indeterminate ? 'Cargando…' : `${pct}%`}
    >
      ${svg`
        <svg
          width="${px}"
          height="${px}"
          viewBox="0 0 ${px} ${px}"
          class="pc__svg ${props.indeterminate ? 'pc__svg--spin' : ''}"
        >
          <circle
            class="pc__track"
            cx="${px / 2}"
            cy="${px / 2}"
            r="${r}"
            stroke-width="${sw}"
          />
          <circle
            class="pc__arc ${props.indeterminate ? 'pc__arc--indet' : ''}"
            cx="${px / 2}"
            cy="${px / 2}"
            r="${r}"
            stroke-width="${sw}"
            stroke-dasharray="${props.indeterminate ? `${circ * 0.3} ${circ}` : circ}"
            stroke-dashoffset="${props.indeterminate ? 0 : offset}"
            stroke-linecap="round"
          />
        </svg>
      `}

      ${!props.bare && !props.indeterminate ? html`
        <div class="pc__label">
          ${props.icon === 'check' ? html`
            <svg class="pc__check" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <polyline
                points="6,14 11,20 22,9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ` : html`
            <span class="pc__value">${pct}%</span>
            ${props.sub ? html`<span class="pc__sub">${props.sub}</span>` : nothing}
          `}
        </div>
      ` : nothing}
    </div>
  `;
}