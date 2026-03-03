import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import cardStyles from './lib-card.css?inline';
import { cardTemplate } from './lib-card.html';

/**
 * @element lib-card
 * @slot tag      - Etiqueta o metadata en el header.
 * @slot title    - Título principal de la card.
 * @slot          - Cuerpo de la card (default slot).
 * @slot footer   - Acciones o información en el footer.
 */
@customElement('lib-card')
export class LibCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(cardStyles)}`,
  ];

  @property({ type: String, reflect: true })
  variant: 'default' | 'inverse' | 'accent' = 'default';

  @property({ type: String })
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