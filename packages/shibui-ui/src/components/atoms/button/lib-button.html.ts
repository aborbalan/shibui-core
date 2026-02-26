import { html, TemplateResult } from 'lit';
import type { LibSize, LibVariant } from '../../../types';

export interface ButtonTemplateProps {
  buttonId: string;
  type: 'button' | 'submit' | 'reset';
  disabled: boolean;
  ariaLabel?: string | undefined;
  handleClick: (event: Event) => void;
  variant: LibVariant;
  size: LibSize;
  glass: boolean;
  customPadding?: string | undefined;
}

/**
 * Plantilla base para el componente lib-button.
 * @param props - Propiedades de configuración del botón.
 * @returns TemplateResult para ser renderizado por Lit.
 */
export function buttonTemplate(props: ButtonTemplateProps): TemplateResult {

  const innerButton = html`     <button
        id="${props.buttonId}"
        type="${props.type}"
        ?disabled="${props.disabled}"
        @click="${props.handleClick}"
      >
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </button>`

  return html`
  ${props.glass 
    ? html`<div class="glass-container ${props.glass ? 'is-glass' : ''} ${props.variant}">${innerButton}</div>`
    : html`<div class="solid-container ${props.variant}">${innerButton}</div>`
  }
    
  `;
}