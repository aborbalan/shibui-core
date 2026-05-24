import { html, nothing, TemplateResult } from 'lit';
import type { MetricBarTemplateProps } from './lib-metric-bar.types';

/**
 * Computa el string de valor con unidad.
 * Formato: "value / max unit"  →  "45 / 100 %"  ·  "12.4 / 32 GB"
 */
function buildValueLabel(props: MetricBarTemplateProps): string {
  const unit = props.unit ? ` ${props.unit}` : '';
  return `${props.value} / ${props.max}${unit}`;
}

/**
 * Template para lib-metric-bar.
 * Delega el renderizado completo a lib-progress pasando label y value-label
 * ya computados desde las props de la molécula.
 */
export function metricBarTemplate(props: MetricBarTemplateProps): TemplateResult {
  const valueLabel = props.showValue ? buildValueLabel(props) : nothing;

  return html`
    <lib-progress
      label=${props.label}
      .value=${props.value}
      .max=${props.max}
      tone=${props.tone}
      size=${props.size}
      value-label=${valueLabel}
    ></lib-progress>
  `;
}
