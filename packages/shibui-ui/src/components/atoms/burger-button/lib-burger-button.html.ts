import { html, nothing, TemplateResult } from 'lit';
import type { LibBurger } from './lib-burger-button.component';

/* SVG ghost lines para la variante glitch */
const glitchGhost: TemplateResult = html`
  <div class="burger-ghost">
    <svg class="ghost-a" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <line x1="12" y1="19" x2="40" y2="19" stroke="rgba(217,114,52,0.6)"  stroke-width="1.5"/>
      <line x1="12" y1="26" x2="40" y2="26" stroke="rgba(217,114,52,0.6)"  stroke-width="1.5"/>
      <line x1="12" y1="33" x2="40" y2="33" stroke="rgba(217,114,52,0.6)"  stroke-width="1.5"/>
    </svg>
    <svg class="ghost-b" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <line x1="12" y1="19" x2="40" y2="19" stroke="rgba(78,148,130,0.4)"  stroke-width="1"/>
      <line x1="12" y1="26" x2="40" y2="26" stroke="rgba(78,148,130,0.4)"  stroke-width="1"/>
      <line x1="12" y1="33" x2="40" y2="33" stroke="rgba(78,148,130,0.4)"  stroke-width="1"/>
    </svg>
  </div>`;

/* Las tres líneas internas */
const lines: TemplateResult = html`
  <div class="burger-lines">
    <span class="burger-line"></span>
    <span class="burger-line"></span>
    <span class="burger-line"></span>
  </div>`;

/* Botón principal */
function burgerBtn(ctx: LibBurger): TemplateResult {
  return html`
    <button
      class="burger"
      part="burger"
      aria-label="${ctx.ariaLabel || 'Menú'}"
      aria-expanded="${ctx.open}"
      @click="${(): void => ctx._handleClick()}"
    >
      ${ctx.variant === 'glitch' ? glitchGhost : nothing}
      ${lines}
    </button>`;
}

export function burgerTemplate(ctx: LibBurger): TemplateResult {
  /* Sin label — renderiza solo el botón */
  if (!ctx.label) return burgerBtn(ctx);

  /* Con label — wrapper flex */
  return html`
    <div
      class="burger-wrap"
      part="wrap"
      @click="${(): void => ctx._handleClick()}"
    >
      <button
        class="burger"
        part="burger"
        aria-label="${ctx.ariaLabel || 'Menú'}"
        aria-expanded="${ctx.open}"
        @click="${(e: MouseEvent): void => e.stopPropagation()}"
      >
        ${ctx.variant === 'glitch' ? glitchGhost : nothing}
        ${lines}
      </button>
      <span class="burger-label" part="label">${ctx._labelText}</span>
    </div>`;
}