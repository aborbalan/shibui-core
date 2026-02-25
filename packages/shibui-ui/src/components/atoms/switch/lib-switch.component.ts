import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { htmlTemplate } from './lib-switch.html';
import cssStyles from './lib-switch.css?inline';

@customElement('lib-switch')
export class LibSwitch extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';

  handleToggle(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return htmlTemplate(this);
  }
}