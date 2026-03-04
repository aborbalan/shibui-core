import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import alertStyles from './lib-alert.css?inline';
import { template } from './lib-alert.html'; 

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@customElement('lib-alert')
export class LibAlert extends LitElement {
  static override styles = [css`${unsafeCSS(alertStyles ?? '')}`];

  @property({ type: String, reflect: true }) 
  type: AlertType = 'info';

  @property({ type: Boolean, reflect: true }) 
  glass = false;

  @property({ type: Boolean }) 
  closable = false;

  /**
   * Cambiamos 'close()' por 'handleClose()' para coincidir con el template
   * y emitir el evento correcto que el ToastManager escucha.
   */
  public handleClose(): void {
    const event = new CustomEvent('lib-alert-close', {
      bubbles: true,
      composed: true,
      detail: { type: this.type }
    });
    this.dispatchEvent(event);
  }

  protected override render(): TemplateResult {
    return template(this);
  }
}