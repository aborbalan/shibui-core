import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export const skeletonTemplate = (width: string, height: string): TemplateResult => {
  const styles = {
    width: width,
    height: height
  };

  return html`
    <div class="skeleton" style=${styleMap(styles)} aria-hidden="true"></div>
  `;
};