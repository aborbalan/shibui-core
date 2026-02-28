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
  glass: boolean;
  customPadding?: string | undefined;
}
    
/**
 * Plantilla base para el componente lib-button.
 * Renderiza un único <button> estilizado vía :host() selectors.
 */
export function buttonTemplate(props: ButtonTemplateProps): TemplateResult {
  return html`
    <button
      id="${props.buttonId}"
      type="${props.type}"
      ?disabled="${props.disabled}"
      aria-label="${props.ariaLabel ?? nothing}"
      style="${props.customPadding ? `padding: ${props.customPadding}` : nothing}"
      @click="${props.handleClick}"
      class="btn"
    >fsdfsdfds
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </button>
  `;
}