import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formFieldTemplate } from './lib-form-field.html';
import cssStyles from './lib-form-field.css?inline';

@customElement('lib-form-field')
export class LibFormField extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) label = '';
  @property({ type: String, attribute: 'helper-text' }) helperText = '';
  @property({ type: String, attribute: 'error-text' }) errorText = '';
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: Boolean, reflect: true }) required = false;

  protected override render(): TemplateResult {
    return formFieldTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-form-field': LibFormField;
  }
}