import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { radioTemplate } from './lib-radio.html';
import styles from './lib-radio.css?inline';

@customElement('lib-radio')
export class LibRadio extends LitElement {
  static override styles = [css`${unsafeCSS(styles)}`];

  @property({ type: String }) override id = `radio-${Math.random().toString(36).slice(2, 9)}`;
  @property({ type: String }) name: string | undefined = undefined;
  @property({ type: String }) value: string | undefined = undefined;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    
    this.dispatchEvent(new CustomEvent('lib-change', {
      detail: { checked: this.checked, value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return radioTemplate(this);
  }
}