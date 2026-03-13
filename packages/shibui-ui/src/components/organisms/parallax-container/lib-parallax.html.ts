import { html, TemplateResult } from 'lit';
import type { LibParallaxContainer } from './lib-parallax.component';

// _ctx disponible para futuras extensiones del template (slot named, etc.)
export function parallaxTemplate(_ctx: LibParallaxContainer): TemplateResult {
  return html`
    <div class="parallax-wrapper" part="wrapper">
      <slot></slot>
    </div>
  `;
}