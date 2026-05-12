import { html, TemplateResult } from 'lit';

export interface AccordionItemTemplateProps {
  label: string;
  open: boolean;
  onToggle: () => void;
}

/** Chevron SVG — rota 180deg via CSS cuando open */
const chevronSvg = html`
  <svg
    class="accordion-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="3,5 8,11 13,5"/>
  </svg>
`;

/**
 * Plantilla para lib-accordion-item.
 *
 * La animacion de apertura usa grid-template-rows: 0fr -> 1fr
 * para evitar calcular alturas dinamicas.
 *
 * El slot default recibe el contenido colapsable.
 */
export function accordionItemTemplate(props: AccordionItemTemplateProps): TemplateResult {
  return html`
    <div class="accordion-item__root">

      <button
        class="accordion-item__trigger"
        type="button"
        aria-expanded="${props.open ? 'true' : 'false'}"
        @click=${props.onToggle}
      >
        <span class="accordion-item__label">${props.label}</span>
        ${chevronSvg}
      </button>

      <div class="accordion-item__body">
        <div class="accordion-item__body-inner">
          <div class="accordion-item__content">
            <slot></slot>
          </div>
        </div>
      </div>

    </div>
  `;
}