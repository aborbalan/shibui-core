import { html, TemplateResult } from 'lit';

export interface AccordionTemplateProps {
  onToggle: (e: Event) => void;
}

/**
 * Plantilla para lib-accordion.
 *
 * El organismo es un contenedor de slot: no renderiza items propios,
 * solo orquesta el comportamiento exclusive y aplica variantes via CSS.
 */
export function accordionTemplate(props: AccordionTemplateProps): TemplateResult {
  return html`
    <div class="accordion__root" @accordion-toggle=${props.onToggle}>
      <slot></slot>
    </div>
  `;
}