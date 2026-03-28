import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import cardStyles from './lib-card.css?inline';
import { cardTemplate } from './lib-card.html';

export type LibCardVariant = 'default' | 'inverse' | 'accent' | 'featured' | 'kintsugi';

/**
 * @element lib-card
 *
 * @attr {'default'|'inverse'|'accent'|'featured'|'kintsugi'} variant
 *   - default   → superficie elevada neutra
 *   - inverse   → fondo washi-900 oscuro
 *   - accent    → borde izquierdo de color (`accent-color`)
 *   - featured  → fondo kaki degradado, título grande — pensado para 2 columnas en grid
 *   - kintsugi  → seam de oro animado en borde superior + shimmer en título
 *
 * @attr {string} accent-color - Color del borde (solo variante `accent`).
 *
 * @slot tag    - Etiqueta o metadata en el header.
 * @slot title  - Título principal de la card.
 * @slot        - Cuerpo de la card (default slot).
 * @slot footer - Acciones o información en el footer.
 */
@customElement('lib-card')
export class LibCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(cardStyles)}`,
  ];

  @property({ type: String, reflect: true })
  variant: LibCardVariant = 'default';

  @property({ type: String, attribute: 'accent-color' })
  accentColor: string | undefined = undefined;

  override render(): TemplateResult {
    return cardTemplate({
      variant: this.variant,
      accentColor: this.accentColor,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-card': LibCard;
  }
}