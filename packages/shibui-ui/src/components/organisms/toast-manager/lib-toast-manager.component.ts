import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import toastStyles from './lib-toast-manager.css?inline';
import { AlertType } from '../../molecules/lib-alert/lib-alert.component'; 

export interface Toast {
  id: string;
  message: string;
  type: AlertType;
  duration?: number;
}

@customElement('lib-toast-manager')
export class LibToastManager extends LitElement {
  static override styles = [css`${unsafeCSS(toastStyles)}` || []];

  @state() protected _toasts: Toast[] = [];

  /**
   * Añade una notificación. 
   * Retornamos void explícitamente para la pipe.
   */
  public add(config: Omit<Toast, 'id'>): void {
    const id: string = crypto.randomUUID();
    const newToast: Toast = { ...config, id };
    
    this._toasts = [...this._toasts, newToast];

    if (config.duration !== 0) {
      // Tipamos el retorno del timer
      setTimeout((): void => this.dismiss(id), config.duration ?? 5000);
    }
  }

  /**
   * Elimina una notificación.
   * Tipamos el parámetro y el retorno.
   */
  public dismiss(id: string): void {
    this._toasts = this._toasts.filter((t: Toast): boolean => t.id !== id);
  }

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this._toasts,
        (toast: Toast): string => toast.id,
        (toast: Toast): TemplateResult => html`
          <lib-alert 
            .type="${toast.type}" 
            closable 
            @lib-alert-close="${(): void => this.dismiss(toast.id)}"
          >
            ${toast.message}
          </lib-alert>
        `
      )}
    `;
  }
}