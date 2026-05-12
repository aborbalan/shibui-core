import { html, nothing, TemplateResult } from 'lit';

export type LibRadioSize    = 'sm' | 'md' | 'lg';
export type LibRadioVariant = 'default' | 'kaki' | 'error';

export interface RadioTemplateProps {
  radioId: string;
  name: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  label: string;
  sublabel: string;
  size: LibRadioSize;
  variant: LibRadioVariant;
  onChange: (e: Event) => void;
}

/**
 * Plantilla para lib-radio.
 *
 * Estructura:
 *   label.radio
 *     input[type=radio]   (invisible, capa de interaccion)
 *     span.radio__circle  (visual: circulo + dot interior)
 *     span.radio__label   (label-text + sublabel opcional)
 */
export function radioTemplate(props: RadioTemplateProps): TemplateResult {
  return html`
    <label class="radio">

      <input
        class="radio__input"
        type="radio"
        id="${props.radioId}"
        name="${props.name}"
        value="${props.value}"
        .checked="${props.checked}"
        ?disabled="${props.disabled}"
        @change="${props.onChange}"
      />

      <span class="radio__circle">
        <span class="radio__dot"></span>
      </span>

      ${props.label || props.sublabel
        ? html`
            <span class="radio__label">
              ${props.label
                ? html`<span class="radio__label-text">${props.label}</span>`
                : nothing}
              ${props.sublabel
                ? html`<span class="radio__label-sub">${props.sublabel}</span>`
                : nothing}
            </span>
          `
        : html`<slot></slot>`}

    </label>
  `;
}