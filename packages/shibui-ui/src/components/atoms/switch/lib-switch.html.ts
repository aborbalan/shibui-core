import { html, nothing, TemplateResult } from 'lit';

export type LibSwitchVariant = 'default' | 'kintsugi';
export type LibSwitchSize    = 'sm' | 'md' | 'lg';

export interface SwitchTemplateProps {
  switchId:  string;
  checked:   boolean;
  disabled:  boolean;
  label:     string;
  sub:       string;
  handleChange: (e: Event) => void;
}

/**
 * Template para lib-switch.
 *
 * Estructura:
 *   label.sw
 *     input[type=checkbox]  — oculto, accesible
 *     span.sw-track
 *       span.sw-thumb
 *     span.sw-label          — (opcional) si hay label
 *       span.sw-label-text
 *       span.sw-label-sub    — (opcional) si hay sub
 *
 * El estado visual (checked, disabled, variant, size) se controla
 * íntegramente desde :host([attr]) en el CSS — el template es estático.
 */
export function switchTemplate(props: SwitchTemplateProps): TemplateResult {
  return html`
    <label class="sw" for=${props.switchId}>
      <input
        id=${props.switchId}
        class="sw-input"
        type="checkbox"
        ?checked=${props.checked}
        ?disabled=${props.disabled}
        aria-checked=${props.checked ? 'true' : 'false'}
        @change=${props.handleChange}
      >
      <span class="sw-track" aria-hidden="true">
        <span class="sw-thumb"></span>
      </span>
      ${props.label ? html`
        <span class="sw-label">
          <span class="sw-label-text">${props.label}</span>
          ${props.sub ? html`<span class="sw-label-sub">${props.sub}</span>` : nothing}
        </span>
      ` : nothing}
    </label>
  `;
}