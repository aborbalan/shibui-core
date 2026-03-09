import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import toastManagerCss from './lib-toast-manager.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import '../../molecules/lib-alert/lib-alert.component';
import type { AlertType } from 'src/components/molecules/lib-alert/lib-alert.types.ts';
import { AlertCloseDetail } from 'src/components/molecules/lib-alert/lib-alert.types';

/* AlertType importado desde types, no desde el componente */

/* ── Interfaz pública de cada toast ── */
export interface Toast {
  id:        string;
  message:   string;
  type:      AlertType;
  heading?:  string;      /* Override del título — si no se pasa usa el tipo */
  duration?: number;      /* ms. 0 = persistente. Default: 5000 */
}

/**
 * @element lib-toast-manager
 *
 * Contenedor fijo de notificaciones efímeras.
 * Usa `lib-alert` internamente con `closable` siempre activo.
 *
 * @method add(config)     — Añade un toast. Acepta Omit<Toast, 'id'>.
 * @method dismiss(id)     — Elimina un toast por id (con animación de salida).
 * @method dismissAll()    — Elimina todos los toasts activos.
 */
@customElement('lib-toast-manager')
export class LibToastManager extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(toastManagerCss)}`,
  ];

  @state() private _toasts: Toast[] = [];

  /* ──────────────────────────────────────────────────────────
     API PÚBLICA
  ─────────────────────────────────────────────────────────── */

  public add(config: Omit<Toast, 'id'>): void {
    const id: string = crypto.randomUUID();
    this._toasts = [...this._toasts, { ...config, id }];

    if (config.duration !== 0) {
      setTimeout((): void => this._dismissWithAnimation(id), config.duration ?? 5000);
    }
  }

  public dismiss(id: string): void {
    this._dismissWithAnimation(id);
  }

  public dismissAll(): void {
    this._toasts.forEach(t => this._dismissWithAnimation(t.id));
  }

  /* ──────────────────────────────────────────────────────────
     ANIMACIÓN DE SALIDA
     Aplica .is-leaving → espera la transición → elimina del array
  ─────────────────────────────────────────────────────────── */
  private _dismissWithAnimation(id: string): void {
    const el = this.renderRoot.querySelector<HTMLElement>(`[data-toast-id="${id}"]`);

    if (el) {
      el.classList.add('is-leaving');
      /* duration-base = 200ms + pequeño margen */
      el.addEventListener('animationend', (): void => {
        this._removeToast(id);
      }, { once: true });
    } else {
      /* Si el elemento ya no está en el DOM, borramos directamente */
      this._removeToast(id);
    }
  }

  private _removeToast(id: string): void {
    this._toasts = this._toasts.filter((t: Toast): boolean => t.id !== id);
  }

  /* ──────────────────────────────────────────────────────────
     RENDER
  ─────────────────────────────────────────────────────────── */
  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this._toasts,
        (toast: Toast): string => toast.id,
        (toast: Toast): TemplateResult => html`
          <lib-alert
            data-toast-id="${toast.id}"
            type="${toast.type}"
            heading="${toast.heading ?? ''}"
            closable
            @ui-lib-alert-close="${(_e: CustomEvent<AlertCloseDetail>): void => this.dismiss(toast.id)}"
          >
            ${toast.message}
          </lib-alert>
        `
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-toast-manager': LibToastManager;
  }
}