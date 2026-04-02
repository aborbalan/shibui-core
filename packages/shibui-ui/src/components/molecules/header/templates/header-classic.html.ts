import { html, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import { renderLogo, renderLinks, renderActions } from './header-shared.html';
import { renderHamburger, renderMobileDrawer }    from './header-mobile.html';

/**
 * Template compartido por las variantes de layout simple:
 * classic · dark · transparent · kintsugi · glitch · minimal · shrink
 *
 * Estructura: logo | nav | actions | hamburger (móvil)
 */
export function renderClassic(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr">
      ${renderLogo(ctx)}
      <nav class="hdr-nav">${renderLinks(ctx, ctx.links)}</nav>
      ${renderActions(ctx)}
      ${renderHamburger(ctx)}
    </div>
    ${renderMobileDrawer(ctx)}`;
}