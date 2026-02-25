import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import labelStyles from './lib-label.css?inline';

@customElement('lib-label')
export class LibLabel extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(labelStyles)}
    `,
  ];

  /** ID del input al que va asociado (para accesibilidad) */
  @property({ type: String }) htmlFor: string = '';

  /** Muestra un indicador visual de campo obligatorio */
  @property({ type: Boolean }) required: boolean = false;

  protected override render(): TemplateResult {
    return html`
      <label for="${this.htmlFor}">
        <slot></slot>
        ${this.required ? html`<span class="required-indicator" aria-hidden="true">*</span>` : ''}
      </label>
    `;
  }
}
