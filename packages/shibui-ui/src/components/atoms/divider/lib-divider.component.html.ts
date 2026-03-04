import { html, nothing, TemplateResult } from 'lit';

export type LibDividerStyle     = 'hairline' | 'default' | 'strong' | 'heavy' | 'dashed' | 'dotted' | 'gradient';
export type LibDividerColor     = 'default' | 'kaki' | 'celadon';
export type LibDividerAlign     = 'left' | 'center' | 'right';
export type LibDividerOrnament  = 'none' | 'dot' | 'diamond' | unknown;
export type LibDividerLabelStyle = 'mono' | 'display' | 'kanji';
export type LibDividerOrientation = 'horizontal' | 'vertical';

export interface DividerTemplateProps {
  orientation: LibDividerOrientation;
  style: LibDividerStyle;
  color: LibDividerColor;
  align: LibDividerAlign;
  ornament: LibDividerOrnament;
  labelStyle: LibDividerLabelStyle;
  hasSlotContent: boolean;
  onSlotChange: (e: Event) => void;
}

/**
 * Renderiza el contenido central del divider:
 *   - ornament (dot / diamond) si está activo
 *   - slot con label si hay contenido slotado
 *   - nada si es una línea pura
 *
 * Las dos .dv-line siempre se renderizan.
 * La alineación izquierda/derecha la gestiona CSS via :host([align]).
 */
function dividerCenter(props: DividerTemplateProps): TemplateResult | typeof nothing {
  if (props.ornament === 'dot') {
    return html`<span class="dv__ornament dv__ornament--dot"></span>`;
  }
  if (props.ornament === 'diamond') {
    return html`<span class="dv__ornament dv__ornament--diamond"></span>`;
  }
  if (props.hasSlotContent) {
    return html`
      <span class="dv__label dv__label--${props.labelStyle}">
        <slot @slotchange="${props.onSlotChange}"></slot>
      </span>
    `;
  }
  // Slot vacío — lo mantenemos para detectar cambios futuros
  return html`<slot @slotchange="${props.onSlotChange}" style="display:none"></slot>`;
}

export function dividerTemplate(props: DividerTemplateProps): TemplateResult {
  return html`
    <div class="dv">
      <span class="dv__line"></span>
      ${dividerCenter(props)}
      <span class="dv__line"></span>
    </div>
  `;
}