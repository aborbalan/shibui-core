import { html, TemplateResult } from 'lit';
import type { GadgetFrameTemplateProps } from './lib-gadget-frame.types';

/* ── Inline SVGs de controles (minimize / expand siguen inline — no hay equivalente en lib-icon) ── */

const minimizeSvg = html`
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
       stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <line x1="1" y1="5" x2="9" y2="5"/>
  </svg>
`;

const expandSvg = html`
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
       stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <line x1="1" y1="5" x2="9" y2="5"/>
    <line x1="5" y1="1" x2="5" y2="9"/>
  </svg>
`;

/**
 * Template de lib-gadget-frame.
 *
 * Estructura:
 *   .gadget
 *   ├── .gadget-header        ← drag handle (data-drag-handle)
 *   │   ├── .gadget-header__lead  (icon + title)
 *   │   └── .gadget-header__controls  (minimize + close)
 *   └── .gadget-body          ← slot; oculto cuando minimized
 */
export function gadgetFrameTemplate(props: GadgetFrameTemplateProps): TemplateResult {
  const {
    gadgetTitle,
    icon,
    minimizable,
    closable,
    minimized,
    onMinimize,
    onClose,
  } = props;

  return html`
    <div class="gadget">

      <!-- HEADER — actúa como drag handle -->
      <div class="gadget-header" data-drag-handle>
        <div class="gadget-header__lead">
          ${icon ? html`<lib-icon name="${icon}" size="sm"></lib-icon>` : null}
          <span class="gadget-header__title">${gadgetTitle}</span>
        </div>

        <div class="gadget-header__controls">
          ${minimizable ? html`
            <button
              class="gadget-btn"
              aria-label="${minimized ? 'Expandir gadget' : 'Minimizar gadget'}"
              @click="${(e: Event): void => { e.stopPropagation(); onMinimize(); }}"
            >${minimized ? expandSvg : minimizeSvg}</button>
          ` : null}

          ${closable ? html`
            <lib-close-button
              class="gadget-btn gadget-btn--close"
              size="sm"
              variant="ghost"
              aria-label="Cerrar gadget"
              @click="${(e: Event): void => e.stopPropagation()}"
              @lib-close="${(): void => onClose()}"
            ></lib-close-button>
          ` : null}
        </div>
      </div>

      <!-- BODY — slot principal -->
      <div class="gadget-body">
        <slot></slot>
      </div>

    </div>
  `;
}
