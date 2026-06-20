import { html, nothing, TemplateResult } from 'lit';
import type { AlertTemplateProps, AlertType } from './lib-alert.types';

/** Auto-generated heading per type if none is provided. */
const DEFAULT_HEADING: Record<AlertType, string> = {
  default: 'Default',
  info:    'Info',
  warning: 'Warning',
  error:   'Error',
  success: 'Success',
};

/**
 * Template para lib-alert.
 * Estructura: borde izquierdo · [heading DM Mono] · slot (cuerpo) · [botón cerrar]
 */
export function alertTemplate(props: AlertTemplateProps): TemplateResult {
  const displayHeading = props.heading || DEFAULT_HEADING[props.type];

  return html`
    <div class="alert" role="alert" aria-live="polite">

      <div class="alert-content">
        <p class="alert-title">${displayHeading}</p>
        <div class="alert-body">
          <slot></slot>
        </div>
      </div>

      ${props.closable
        ? html`
            <button
              class="alert-close"
              type="button"
              aria-label="Cerrar alerta"
              @click="${props.handleClose}"
            >×</button>`
        : nothing}

    </div>
  `;
}