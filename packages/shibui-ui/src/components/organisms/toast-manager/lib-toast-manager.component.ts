import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import toastStyles from './lib-toast-manager.css?inline';
// CORRECCIÓN: Ruta ajustada a la realidad de tu carpeta
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

  public add(config: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    const newToast: Toast = { ...config, id };
    
    this._toasts = [...this._toasts, newToast];

    if (config.duration !== 0) {
      setTimeout(() => this.dismiss(id), config.duration ?? 5000);
    }
  }

  public dismiss(id: string): void {
    this._toasts = this._toasts.filter((t) => t.id !== id);
  }

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this._toasts,
        (toast) => toast.id,
        (toast) => html`
          <lib-alert 
            .type="${toast.type}" 
            closable 
            @lib-alert-close="${() => this.dismiss(toast.id)}"
          >
            ${toast.message}
          </lib-alert>
        `
      )}
    `;
  }
}