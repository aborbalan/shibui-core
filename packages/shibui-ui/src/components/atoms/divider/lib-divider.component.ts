import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import dividerStyles from './lib-divider.css?inline';

@customElement('lib-divider')
export class LibDivider extends LitElement {
  static override styles = [css`${unsafeCSS(dividerStyles)}` || []];

  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: String, reflect: true }) align: 'left' | 'center' | 'right' = 'center';
  @property({ type: Boolean, reflect: true }) faded = false;

  override render(): TemplateResult {
    return html`
      <div class="divider-container">
        <span class="line line-before"></span>
        <div class="content">
          <slot></slot>
        </div>
        <span class="line line-after"></span>
      </div>
    `;
  }
}