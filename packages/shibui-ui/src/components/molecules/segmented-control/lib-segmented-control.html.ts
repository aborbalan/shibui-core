import { html, nothing, TemplateResult } from 'lit';
import { map } from 'lit/directives/map.js';
import type { SegmentedOption, SegmentedTemplateProps } from './lib-segmented-control.types';

/**
 * Template del componente lib-segmented-control.
 *
 * El thumb se posiciona via `style` calculado en el componente
 * (offsetLeft / offsetWidth del option activo).
 * La variante ghost oculta el thumb con CSS y usa un ::after de línea.
 */
export function segmentedTemplate(props: SegmentedTemplateProps): TemplateResult {
  const {
    options, value, variant, size, full,
    iconOnly, disabled, glitch, thumbStyle, onSelect,
  } = props;

  const isGhost      = variant === 'ghost';
  //const isUnderline  = variant === 'underline' || variant === 'dark-underline';
  //const isPill       = variant === 'pill' || variant === 'dark-pill';

  const trackCls = [
    'seg',
    `seg-${variant}`,
    size !== 'md' ? `seg-${size}` : '',
    full     ? 'seg-full'      : '',
    iconOnly ? 'seg-icon-only' : '',
    glitch   ? 'seg-glitch'    : '',
  ].filter(Boolean).join(' ');

  return html`
    <div
      class="${trackCls}"
      role="radiogroup"
      aria-disabled="${disabled}"
    >
      <!-- Thumb — indicador animado de selección -->
      ${isGhost ? nothing : html`<div class="seg-thumb" style="${thumbStyle}"></div>`}

      <!-- Opciones -->
      ${map(options, (opt: SegmentedOption) => {
        const isActive   = opt.value === value;
        const isDisabled = opt.disabled ?? false;

        const optCls = [
          'seg-option',
          isActive   ? 'is-active'   : '',
          isDisabled ? 'is-disabled' : '',
        ].filter(Boolean).join(' ');

        return html`
          <div
            class="${optCls}"
            role="radio"
            aria-checked="${isActive}"
            aria-disabled="${isDisabled}"
            data-label="${opt.label}"
            data-value="${opt.value}"
            @click="${(e: MouseEvent): void => {
              if (disabled || isDisabled) return;
              onSelect(opt, e);
            }}"
          >
            <!-- Icono Phosphor (slot reutilizando lib-icon) -->
            ${opt.icon
              ? html`<span class="seg-icon">
                  <lib-icon name="${opt.icon}" size="xs"></lib-icon>
                </span>`
              : nothing}

            <!-- Label — oculto si icon-only -->
            ${iconOnly
              ? nothing
              : html`<span class="seg-label">${opt.label}</span>`}

            <!-- Badge numérico opcional -->
            ${opt.badge != null
              ? html`<span class="seg-badge-dot">${opt.badge}</span>`
              : nothing}
          </div>
        `;
      })}
    </div>
  `;
}