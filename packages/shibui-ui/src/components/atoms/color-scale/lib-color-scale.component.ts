import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens          from '../../../styles/shared/tokens.css?inline';
import colorScaleStyles      from './lib-color-scale.css?inline';
import { colorScaleTemplate } from './lib-color-scale.html';
import type { ColorStep }    from './lib-color-scale.types';

/**
 * lib-color-scale — Shibui UI
 *
 * Escala de color horizontal con 11 pasos (50 → 950).
 * Cada swatch expande en hover y revela el número del paso.
 * Los extremos muestran el nombre y el valor hex.
 *
 * @prop {string}       name        — Nombre de la paleta (ej: "washi", "kaki").
 * @prop {ColorStep[]}  steps       — Array de pasos de la escala. Orden de izquierda a derecha.
 * @prop {boolean}      show-labels — Muestra las etiquetas de los extremos (activo por defecto).
 *
 * @csspart track   — El contenedor de los swatches.
 * @cssprop --lib-color-scale-height — Altura de la pista (default: 56px).
 */
@customElement('lib-color-scale')
export class LibColorScale extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(colorScaleStyles)}`,
  ];

  @property({ type: String })
  name = 'scale';

  @property({ type: Array })
  steps: ColorStep[] = [];

  @property({ type: Boolean, attribute: 'show-labels' })
  showLabels = true;

  protected override render(): TemplateResult {
    return colorScaleTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-color-scale': LibColorScale;
  }
}