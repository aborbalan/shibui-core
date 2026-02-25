import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component'; // Aseguramos la importación del icono
import { closeButtonTemplate } from './lib-close-button.html';
import cssStyles from './lib-close-button.css?inline';

export type LibCloseVariant = 'neutral' | 'primary' | 'success' | 'danger' | 'ghost' | 'white';

@customElement('lib-close-button')
export class LibCloseButton extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String, reflect: true }) variant: LibCloseVariant = 'neutral';
  @property({ type: String, reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  handleClick():void {
    this.dispatchEvent(new CustomEvent('lib-close', {
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return closeButtonTemplate(this);
  }
}