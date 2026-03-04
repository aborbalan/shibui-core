import { html, TemplateResult } from 'lit';
import { LibParallax } from './lib-parallax.component';

export const parallaxTemplate = (_context: LibParallax): TemplateResult => html`
  <div class="parallax-wrapper">
    <slot></slot>
  </div>
`;