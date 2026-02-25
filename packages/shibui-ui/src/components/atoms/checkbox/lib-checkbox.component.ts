import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { template } from './lib-checkbox.html';
import cssStyles from './lib-checkbox.css?inline';

@customElement('lib-checkbox')
export class LibCheckbox extends LitElement {
  static override styles = css`${unsafeCSS(cssStyles)}`;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) icon = 'check'; // Icono por defecto

  protected _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked, value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return template.call(this);
  }
}