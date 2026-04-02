import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import { renderLogo, renderLinks, renderActions } from './header-shared.html';
import { renderHamburger, renderMobileDrawer }    from './header-mobile.html';

/**
 * Template variante centered:
 * [nav-izquierda] | [logo-central] | [nav-derecha + actions]
 * En móvil colapsa a: [logo] | [hamburger]
 */
export function renderCentered(ctx: LibHeader): TemplateResult {
  const mid        = Math.floor(ctx.links.length / 2);
  const leftLinks  = ctx.links.slice(0, mid);
  const rightLinks = ctx.links.slice(mid);

  return html`
    ${ctx.announcement ? html`
      <div class="hdr-announcement">
        <span>${ctx.announcement}</span>
        ${ctx.announcementHref
          ? html`<a href="${ctx.announcementHref}">Ver →</a>`
          : nothing}
      </div>` : nothing}

    <div class="hdr">
      <nav class="hdr-nav hdr-nav--centered-left">
        ${renderLinks(ctx, leftLinks)}
      </nav>
      ${renderLogo(ctx)}
      <nav class="hdr-nav hdr-nav--right">
        ${renderLinks(ctx, rightLinks)}
        ${renderActions(ctx)}
      </nav>
      ${renderHamburger(ctx)}
    </div>
    ${renderMobileDrawer(ctx)}`;
}