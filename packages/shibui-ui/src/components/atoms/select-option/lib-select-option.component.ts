import { LitElement, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { template } from './lib-select-option.html';
import cssStyles from './lib-select-option.css?inline';


@customElement('lib-select-option')
export class LibSelectOption extends LitElement {
    static override styles = unsafeCSS(cssStyles);

  /** El valor interno que representará esta opción en el Select padre */
  @property({ type: String, reflect: true }) value = '';

  /** Estado de selección */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Estado deshabilitado */
  @property({ type: Boolean, reflect: true }) disabled = false;

// lib-select-option.component.ts
protected override render(): TemplateResult {
    return template.call(this);
  }

  protected _handleOptionClick(): void {
    if (this.disabled) return;
    console.log('📢 Hijo: Clic detectado. Enviando valor:', this.value);
    // Lanzamos un evento personalizado que burbujea hasta el padre
    this.dispatchEvent(new CustomEvent('option-selected', {
      detail: { 
        value: this.value,
        label: this.innerText // O el contenido del slot
      },
      bubbles: true,    // Importante: permite que el evento suba por el DOM
      composed: true    // Importante: permite que el evento atraviese el Shadow DOM
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-select-option': LibSelectOption;
  }
}

