import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { alertTemplate } from './lib-alert.html';
import alertCss from './lib-alert.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { AlertType, AlertCloseDetail } from './lib-alert.types';

/**
 * @element lib-alert
 *
 * Alerta estática para feedback contextual dentro del layout.
 * A diferencia de los Toasts, pertenece a una sección específica.
 *
 * @attr type     — default · info · warning · error · success
 * @attr heading  — Título override. Si no se pasa, se usa el nombre del tipo.
 * @attr closable — Muestra el botón ×
 * @attr glass    — Activa el efecto Agua (glassmorphism)
 *
 * @fires ui-lib-alert-close — { type } — al pulsar el botón de cierre
 *
 * @slot — Cuerpo del mensaje
 */
@customElement('lib-alert')
export class LibAlert extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(alertCss)}`,
  ];

  @property({ type: String, reflect: true }) type:    AlertType = 'default';
  @property({ type: String })                heading  = '';
  @property({ type: Boolean, reflect: true }) closable = false;
  @property({ type: Boolean, reflect: true }) glass    = false;

  override render(): TemplateResult {
    return alertTemplate({
      type:        this.type,
      heading:     this.heading,
      closable:    this.closable,
      glass:       this.glass,
      handleClose: this._handleClose.bind(this),
    });
  }

  private _handleClose(): void {
    this.dispatchEvent(
      new CustomEvent<AlertCloseDetail>('ui-lib-alert-close', {
        detail:   { type: this.type },
        bubbles:  true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-alert': LibAlert;
  }
}