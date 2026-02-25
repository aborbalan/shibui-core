import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { spinnerTemplate } from './lib-spinner.html';
import cssStyles from './lib-spinner.css?inline';

@customElement('lib-spinner')
export class LibSpinner extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: String }) variant: 'primary' | 'secondary' | 'white' = 'primary';

  protected override render(): TemplateResult {
    return spinnerTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-spinner': LibSpinner;
  }
}