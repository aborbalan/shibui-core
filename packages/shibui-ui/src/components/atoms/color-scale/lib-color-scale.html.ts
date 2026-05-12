import { html, nothing, TemplateResult } from 'lit';
import type { LibColorScale } from './lib-color-scale.component';
import type { ColorStep } from './lib-color-scale.types';

/**
 * Determina si el label del paso debe mostrarse en color claro u oscuro
 * según el luminance aproximado del paso (por encima de 500 → oscuro, por debajo → claro).
 */
function labelColor(step: number): string {
  return step <= 400
    ? 'rgba(26,20,14,0.45)'   /* sobre claro */
    : 'rgba(250,247,244,0.55)'; /* sobre oscuro */
}

export function colorScaleTemplate(ctx: LibColorScale): TemplateResult {
  const steps = ctx.steps ?? [];
  const first = steps[0];
  const last  = steps[steps.length - 1];

  return html`
    <div class="scale-wrap">

      <!-- Swatches -->
      <div class="scale-track">
        ${steps.map((s: ColorStep) => html`
          <div
            class="scale-swatch"
            style="background:${s.oklch ?? s.hex};"
            title="${ctx.name}-${s.step} · ${s.hex}"
          >
            <span class="scale-swatch-label" style="color:${labelColor(s.step)};">
              ${s.step}
            </span>
          </div>
        `)}
      </div>

      <!-- Extreme labels -->
      ${ctx.showLabels && first && last ? html`
        <div class="scale-legends">
          <span class="scale-legend">
            ${ctx.name}-${first.step} · ${first.hex}
          </span>
          <span class="scale-legend scale-legend--right">
            ${ctx.name}-${last.step} · ${last.hex}
          </span>
        </div>
      ` : nothing}

    </div>
  `;
}