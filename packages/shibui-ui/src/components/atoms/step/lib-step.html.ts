import { html, nothing, svg, TemplateResult } from 'lit';

export type LibStepStatus      = 'pending' | 'active' | 'completed' | 'error';
export type LibStepOrientation = 'horizontal' | 'vertical';
export type LibStepVariant     = 'default' | 'minimal' | 'kintsugi';
export type LibStepSize        = 'sm' | 'md' | 'lg';

export interface StepTemplateProps {
  index:       number;
  status:      LibStepStatus;
  label:       string;
  sub:         string;
  last:        boolean;
  orientation: LibStepOrientation;
}

/* ── SVG icons ─────────────────────────────────────────────── */
const iconCheck = svg`
  <svg class="step-icon" viewBox="0 0 12 12" aria-hidden="true">
    <polyline points="2,6 5,9 10,3"/>
  </svg>
`;

const iconError = svg`
  <svg class="step-icon" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round"
       aria-hidden="true">
    <line x1="7" y1="3" x2="7" y2="7.5"/>
    <circle cx="7" cy="10" r="0.75" fill="currentColor" stroke="none"/>
  </svg>
`;

function nodeContent(props: StepTemplateProps): TemplateResult {
  if (props.status === 'completed') return iconCheck;
  if (props.status === 'error')     return iconError;
  return html`${props.index}`;
}

/**
 * Template para lib-step.
 *
 * Estructura (orientación horizontal):
 *   .step-node     — círculo/cuadrado con número o icono
 *   .step-connector— línea que conecta con el siguiente paso (oculta en [last])
 *   .step-text     — label + sub
 *
 * Estructura (orientación vertical):
 *   .step-node
 *   .step-connector (vertical)
 *   .step-body
 *     .step-title
 *     .step-content  ← <slot> para contenido descriptivo
 */
export function stepTemplate(props: StepTemplateProps): TemplateResult {
  const isVertical = props.orientation === 'vertical';

  return html`
    <div
      class="step-inner"
      role="listitem"
      aria-current=${props.status === 'active' ? 'step' : nothing}
    >
      <div class="step-node" aria-hidden="true">
        ${nodeContent(props)}
      </div>

      ${!props.last ? html`<div class="step-connector" aria-hidden="true"></div>` : nothing}

      ${isVertical
        ? html`
          <div class="step-body">
            <p class="step-title">${props.label}</p>
            ${props.sub ? html`<p class="step-sub">${props.sub}</p>` : nothing}
            <div class="step-content"><slot></slot></div>
          </div>
        `
        : html`
          <div class="step-text">
            <span class="step-label">${props.label}</span>
            ${props.sub ? html`<span class="step-sub">${props.sub}</span>` : nothing}
          </div>
        `
      }
    </div>
  `;
}