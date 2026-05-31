import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import { renderLogo, renderLinks, renderActions } from './header-shared.html';
import { renderHamburger, renderMobileDrawer }    from './header-mobile.html';
import {
  celadonDecorationLayers,
  parseDecorations,
} from '../../../../styles/shared/celadon-decorations';

/**
 * Template compartido por las variantes de layout simple:
 * classic · dark · transparent · minimal · shrink
 *
 * Estructura: logo | nav | actions | hamburger (móvil)
 */
export function renderClassic(ctx: LibHeader): TemplateResult {
  const hasDecoration = parseDecorations(ctx.decoration).length > 0;
  return html`
    <div class="hdr">
      ${hasDecoration
        ? html`<div class="hdr-fx" aria-hidden="true">
            ${celadonDecorationLayers(ctx.decoration)}
          </div>`
        : nothing}
      ${renderLogo(ctx)}
      <nav class="hdr-nav">${renderLinks(ctx, ctx.links)}</nav>
      ${renderActions(ctx)}
      ${renderHamburger(ctx)}
    </div>
    ${renderMobileDrawer(ctx)}`;
}