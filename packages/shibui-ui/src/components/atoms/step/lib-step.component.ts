import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import stepStyles from './lib-step.css?inline';

@customElement('lib-step')
export class LibStep extends LitElement {
  static override styles = [css`${unsafeCSS(stepStyles)}` || []];

  @property({ type: String }) label = '';
  @property({ type: Number }) index = 1;
  @property({ type: String, reflect: true }) status: 'active' | 'completed' | 'inactive' = 'inactive';

  override render(): TemplateResult {
    return html`
      <div class="step-item">
        <div class="icon-container">
          ${this.status === 'completed' ? html`✓` : this.index}
        </div>
        <div class="label">${this.label}</div>
      </div>
    `;
  }
}