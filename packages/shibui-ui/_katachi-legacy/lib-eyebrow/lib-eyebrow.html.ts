/* @legacy-katachi-reference
 * ─────────────────────────────────────────────────────────────
 * Este archivo es una COPIA de referencia del estado anterior al
 * sistema katachi sellado. NO se importa ni se compila.
 * Documenta cómo se definían los estilos palette-named por variant.
 * ───────────────────────────────────────────────────────────── */
import { html, type TemplateResult, nothing } from 'lit';
import type { LibEyebrow } from './lib-eyebrow.component';

export function renderEyebrow(ctx: LibEyebrow): TemplateResult {
  return html`
    <span class="eb" part="base">
      <slot></slot>
      ${ctx.num
        ? html`<span class="eb-num-badge" part="badge">${ctx.num}</span>`
        : nothing
      }
    </span>
  `;
}
