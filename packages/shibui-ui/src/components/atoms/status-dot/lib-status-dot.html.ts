import { html, nothing, TemplateResult } from 'lit';

export type LibStatusDotStatus = 'online' | 'away' | 'busy' | 'offline';
export type LibStatusDotSize   = 'sm' | 'md' | 'lg';

const LABEL_TEXT: Record<LibStatusDotStatus, string> = {
  online:  'Online',
  away:    'Away',
  busy:    'Busy',
  offline: 'Offline',
};

export interface StatusDotTemplateProps {
  status:   LibStatusDotStatus;
  size:     LibStatusDotSize;
  bordered: boolean;
  label:    boolean;
}

/**
 * Renderiza el wrapper con el punto central y, opcionalmente, el label inline.
 *
 * Estructura:
 *   .sd-wrap   — posiciona los anillos (::before / ::after) para online·mizu
 *     .sd      — el punto coloreado y animado
 *   .sd-label  — (opcional) texto inline con color del estado
 */
export function statusDotTemplate(props: StatusDotTemplateProps): TemplateResult {
  return html`
    <span class="sd-root">
      <span
        class="sd-wrap"
        role="img"
        aria-label=${LABEL_TEXT[props.status]}
      >
        <span class="sd ${props.bordered ? 'sd--bordered' : ''}"></span>
      </span>
      ${props.label ? html`
        <span class="sd-label">${LABEL_TEXT[props.status]}</span>
      ` : nothing}
    </span>
  `;
}