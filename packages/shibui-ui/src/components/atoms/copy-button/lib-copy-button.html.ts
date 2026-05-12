import { html, nothing, TemplateResult } from 'lit';

export type LibCopyVariant  = 'ghost' | 'outlined' | 'filled' | 'subtle' | 'on-dark';
export type LibCopySize     = 'sm' | 'md' | 'lg';

export interface CopyButtonTemplateProps {
  value: string;
  variant: LibCopyVariant;
  size: LibCopySize;
  iconOnly: boolean;
  label: string;
  successLabel: string;
  tooltip: boolean;
  copied: boolean;
  disabled: boolean;
  onClick: () => void;
}

/**
 * Plantilla para lib-copy-button.
 *
 * Dos capas internas con crossfade CSS:
 *   .copy-btn__idle   → icono copy  (+ label opcional) — visible en reposo
 *   .copy-btn__copied → icono check (+ label opcional) — visible al copiar
 *
 * El atributo [copied] en :host activa el swap via CSS.
 * El tooltip es opcional y se posiciona en un wrapper.
 */
export function copyButtonTemplate(props: CopyButtonTemplateProps): TemplateResult {
  const btn = html`
    <button
      type="button"
      class="copy-btn"
      aria-label="${props.iconOnly ? 'Copiar al portapapeles' : nothing}"
      ?disabled="${props.disabled}"
      @click="${props.onClick}"
    >
      <span class="copy-btn__idle">
        <lib-icon name="copy" size="${props.size === 'lg' ? 'sm' : 'xs'}"></lib-icon>
        ${!props.iconOnly && props.label
          ? html`<span class="copy-btn__text">${props.label}</span>`
          : nothing}
      </span>

      <span class="copy-btn__copied">
        <lib-icon name="check" size="${props.size === 'lg' ? 'sm' : 'xs'}"></lib-icon>
        ${!props.iconOnly && props.successLabel
          ? html`<span class="copy-btn__text">${props.successLabel}</span>`
          : nothing}
      </span>
    </button>
  `;

  if (!props.tooltip) return btn;

  return html`
    <span class="copy-btn__wrap">
      ${btn}
      <span class="copy-btn__tooltip">Copiado</span>
    </span>
  `;
}