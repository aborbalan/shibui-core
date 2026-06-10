import { html, TemplateResult } from 'lit';

export type LibCloseVariant =
  | 'ghost'
  | 'subtle'
  | 'outlined'
  | 'filled'
  | 'filled-round'
  | 'error'
  | 'on-dark';

export type LibCloseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LibCloseIcon = 'x' | 'x-circle' | 'x-square';

/** Maps component size → lib-icon size prop */
const ICON_SIZE: Record<LibCloseSize, string> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
  xl: 'md',
};

export interface CloseButtonTemplateProps {
  variant: LibCloseVariant;
  size: LibCloseSize;
  icon: LibCloseIcon;
  disabled: boolean;
  ariaLabel: string;
  onClick: (e: Event) => void;
}

/**
 * Plantilla para lib-close-button.
 *
 * Renderiza un <button> con lib-icon interno.
 * La variante y el tamaño se aplican via :host() selectors en CSS.
 */
export function closeButtonTemplate(props: CloseButtonTemplateProps): TemplateResult {
  return html`
    <button
      type="button"
      class="close-btn"
      part="close-btn"
      aria-label="${props.ariaLabel}"
      ?disabled="${props.disabled}"
      @click="${props.onClick}"
    >
      <lib-icon
        name="${props.icon}"
        size="${ICON_SIZE[props.size]}"
      ></lib-icon>
    </button>
  `;
}