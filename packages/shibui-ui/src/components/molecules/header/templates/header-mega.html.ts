import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import { renderLogo, renderActions, svgChevron } from './header-shared.html';
import { renderHamburger, renderMobileDrawer }                from './header-mobile.html';

/**
 * Template variante mega:
 * Panel full-width al hover sobre el link con dropdown.
 * En móvil el panel se oculta y el drawer cubre los mega-columns.
 */
export function renderMega(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr">
      ${renderLogo(ctx)}
      <nav class="hdr-nav">
        ${ctx.links.map(link =>
          link.dropdown?.length
            ? html`
                <div
                  class="hdr-dd"
                  @mouseenter="${(): void => ctx._openMega()}"
                  @mouseleave="${(): void => ctx._closeMega()}"
                >
                  <span class="hdr-link">
                    ${link.label} ${svgChevron}
                  </span>
                </div>`
            : html`<a href="${link.href || '#'}" class="hdr-link">${link.label}</a>`
        )}
      </nav>
      ${renderActions(ctx)}
      ${renderHamburger(ctx)}
    </div>

    <!-- Overlay detrás del panel -->
    <div
      class="hdr-mega-overlay ${ctx._megaOpen ? 'is-open' : ''}"
      @mouseenter="${(): void => ctx._closeMega()}"
    ></div>

    <!-- Panel full-width -->
    <div
      class="hdr-mega-panel ${ctx._megaOpen ? 'is-open' : ''}"
      @mouseenter="${(): void => ctx._openMega()}"
      @mouseleave="${(): void => ctx._closeMega()}"
    >
      <div class="hdr-mega-inner">
        ${ctx.megaColumns.map(col => html`
          <div>
            <div class="hdr-mega-group-title">${col.title}</div>
            ${col.items.map(item => html`
              <a href="${item.href || '#'}" class="hdr-mega-link">${item.label}</a>
            `)}
          </div>
        `)}
        ${ctx.megaCta ? html`
          <div class="hdr-mega-cta">
            <div class="hdr-mega-cta-label">${ctx.megaCta.label}</div>
            <div class="hdr-mega-cta-title">${ctx.megaCta.title}</div>
            <div class="hdr-mega-cta-desc">${ctx.megaCta.desc}</div>
            <a href="${ctx.megaCta.href || '#'}"
              class="hdr-action hdr-action--kaki"
              style="height:32px;font-size:8px;"
            >${ctx.megaCta.cta}</a>
          </div>
        ` : nothing}
      </div>
    </div>

    ${renderMobileDrawer(ctx)}`;
}