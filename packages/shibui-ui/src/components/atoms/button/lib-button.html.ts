import { html, nothing, TemplateResult } from 'lit';
import type { LibSize, LibVariant } from '../../../types';

export interface ButtonTemplateProps {
  buttonId: string;
  type: 'button' | 'submit' | 'reset';
  disabled: boolean;
  ariaLabel?: string | undefined;
  handleClick: (event: Event) => void;
  variant: LibVariant;
  size: LibSize;
  customPadding?: string | undefined;
}

/**
 * Plantilla base para el componente lib-button.
 * @param props - Propiedades de configuración del botón.
 * @returns TemplateResult para ser renderizado por Lit.
 */
export function buttonTemplate(props: ButtonTemplateProps): TemplateResult {
  return html`
    <button
      id="${props.buttonId}"
      type="${props.type}"
      ?disabled="${props.disabled}"
      aria-label="${props.ariaLabel || nothing}"
      @click="${props.handleClick}"
      style="${props.customPadding ? `--custom-padding: ${props.customPadding}` : ''}"
    >
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </button>
  `;
}
