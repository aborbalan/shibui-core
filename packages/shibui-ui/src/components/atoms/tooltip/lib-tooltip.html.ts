import { html, nothing, TemplateResult } from 'lit';
import type { TooltipPosition, TooltipVariant, TooltipSize } from './lib-tooltip.component';

export interface TooltipTemplateProps {
  position: TooltipPosition;
  variant:  TooltipVariant;
  size:     TooltipSize;
  instant:  boolean;
  open:     boolean;
  content:  string;
  tipId:    string;
}

/** Calcula las clases del wrapper a partir de las props. */
function wrapperClass(props: TooltipTemplateProps): string {
  const parts = ['tip-wrap'];
  if (props.size    !== 'md')   parts.push(`tip-${props.size}`);
  if (props.variant !== 'dark') parts.push(`tip-${props.variant}`);
  if (props.instant)            parts.push('tip-instant');
  if (props.open)               parts.push('is-open');
  return parts.join(' ');
}

export function tooltipTemplate(props: TooltipTemplateProps): TemplateResult {
  return html`
    <div
      class="${wrapperClass(props)}"
      data-pos="${props.position}"
      part="wrapper"
    >
      <!-- Trigger — el consumidor pone aquí su elemento -->
      <slot aria-describedby="${props.tipId}"></slot>

      <!-- Burbuja flotante -->
      <span
        id="${props.tipId}"
        class="tip-bubble"
        role="tooltip"
        part="bubble"
      >
        <!-- Texto simple via prop -->
        ${props.content ? props.content : nothing}
        <!-- Contenido rico via slot nombrado -->
        <slot name="content"></slot>
      </span>
    </div>
  `;
}