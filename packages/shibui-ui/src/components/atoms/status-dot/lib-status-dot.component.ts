import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { statusDotTemplate } from './lib-status-dot.html';
import cssStyles from './lib-status-dot.css?inline';

export type StatusDotVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

@customElement('lib-status-dot')
export class LibStatusDot extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String, reflect: true }) variant: StatusDotVariant = 'neutral';
  @property({ type: Boolean, reflect: true }) pulse = false;
  @property({ type: String }) label = '';

  protected override render(): TemplateResult {
    return statusDotTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-status-dot': LibStatusDot;
  }
}