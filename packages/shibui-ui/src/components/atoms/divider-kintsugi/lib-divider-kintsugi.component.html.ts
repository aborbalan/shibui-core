import { html, nothing, TemplateResult } from 'lit';
import type {
  LibDividerAlign,
  LibDividerLabelStyle,
  LibDividerOrientation,
} from '../divider/lib-divider.component.html';

export type LibKintsugiWeight   = 'base' | 'thick' | 'full';
export type LibKintsugiOrnament = 'none' | 'dot' | 'diamond' | 'ring' | 'kanji-label';

export interface KintsugiDividerTemplateProps {
  orientation:    LibDividerOrientation;
  weight:         LibKintsugiWeight;
  align:          LibDividerAlign;
  ornament:       LibKintsugiOrnament;
  labelStyle:     LibDividerLabelStyle;
  hasSlotContent: boolean;
  onSlotChange:   (e: Event) => void;
}

/**
 * Centro del divider kintsugi:
 *   ornamento con glow > label slotado con gradiente dorado > vacío (línea pura)
 */
function kintsugiCenter(props: KintsugiDividerTemplateProps): TemplateResult | typeof nothing {
  switch (props.ornament) {
    case 'dot':
      return html`<span class="dv-kin__dot"></span>`;
    case 'diamond':
      return html`<span class="dv-kin__diamond"></span>`;
    case 'ring':
      return html`<span class="dv-kin__ring"></span>`;
    case 'kanji-label':
      return html`
        <span class="dv-kin__kanji">
          <slot @slotchange="${props.onSlotChange}"></slot>
        </span>
      `;
    default:
      break;
  }

  if (props.hasSlotContent) {
    const labelMod = props.labelStyle === 'display' ? ' dv-kin__label--display' : '';
    return html`
      <span class="dv-kin__label${labelMod}">
        <slot @slotchange="${props.onSlotChange}"></slot>
      </span>
    `;
  }

  return html`<slot @slotchange="${props.onSlotChange}" style="display:none"></slot>`;
}

export function kintsugiDividerTemplate(props: KintsugiDividerTemplateProps): TemplateResult {
  return html`
    <div class="dv-kin">
      <span class="dv-kin__line"></span>
      ${kintsugiCenter(props)}
      <span class="dv-kin__line"></span>
    </div>
  `;
}