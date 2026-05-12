import { LitElement, css, unsafeCSS, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import gridCss from './lib-card-grid.css?inline';
import sharedTokens from '../../../../styles/shared/tokens.css?inline';

/**
 * `<lib-component-grid>` — Grid contenedor de `<lib-component-card>`.
 *
 * Gestiona el layout CSS Grid y aplica automáticamente `grid-column: span 2`
 * a las tarjetas con el atributo `featured`.
 *
 * @tag lib-component-grid
 *
 * @slot - Acepta uno o más `<lib-component-card>`.
 *
 * @cssprop --cg-cols   - Grid template columns. Default: `repeat(auto-fill, minmax(280px, 1fr))`.
 * @cssprop --cg-gap    - Gap entre celdas. Default: `1.5px`.
 *
 * @example
 * <lib-component-grid>
 *   <lib-component-card featured num="✦ Kintsugi" name="La cicatriz" name-accent="de oro">
 *     <div slot="preview">...</div>
 *   </lib-component-card>
 *   <lib-component-card num="01–05" name="Buttons" .tags=${[...]}>
 *     <div slot="preview">...</div>
 *   </lib-component-card>
 * </lib-component-grid>
 */
@customElement('lib-component-grid')
export class LibComponentGrid extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(gridCss)}`,
  ];

  protected override render(): TemplateResult {
    return html`
      <div class="grid" part="grid">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-component-grid': LibComponentGrid;
  }
}