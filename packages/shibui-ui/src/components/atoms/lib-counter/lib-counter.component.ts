import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit-element/decorators.js';
import styles from './lib-counter.css?inline';

@customElement('lib-counter')
export class LibCounter extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number }) value = 0;
  @property({ type: Number }) duration = 2000; // ms

  @property({ type: String }) override prefix = '';
    @property({ type: String }) suffix = '';

  override render(): TemplateResult {
    return html`
    <span class="counter-container">
      ${this.prefix ? html`<span class="prefix">${this.prefix}</span>` : ''}
      <span class="counter" style="--target-value: ${this.value}; --duration: ${this.duration}ms"></span>
      ${this.suffix ? html`<span class="suffix">${this.suffix}</span>` : ''}
    </span>
  `;
  }
}