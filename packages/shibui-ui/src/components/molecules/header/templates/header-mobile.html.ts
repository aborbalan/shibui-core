import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import type { NavLink, DropdownItem, HeaderAction } from '../lib-header.types';

/* ══════════════════════════════════════
   HAMBURGER BUTTON
   ══════════════════════════════════════ */

export function renderHamburger(ctx: LibHeader): TemplateResult {
  const isLight = ['classic', 'centered', 'mega', 'minimal', 'shrink'].includes(ctx.variant);
  const color   = isLight
    ? 'var(--color-washi-600, #7A6A5C)'
    : 'rgba(250,247,244,0.5)';

  return html`
    <button
      class="hdr-burger"
      aria-label="${ctx._mobileOpen ? 'Cerrar menú' : 'Abrir menú'}"
      aria-expanded="${ctx._mobileOpen}"
      aria-controls="hdr-mobile-drawer"
      @click="${(): void => ctx._toggleMobile()}"
    >
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none"
        stroke="${color}" stroke-width="1.6" stroke-linecap="round">
        <line class="hdr-burger-top" x1="0" y1="1"  x2="20" y2="1"/>
        <line class="hdr-burger-mid" x1="0" y1="7"  x2="20" y2="7"/>
        <line class="hdr-burger-bot" x1="0" y1="13" x2="20" y2="13"/>
      </svg>
    </button>`;
}

/* ══════════════════════════════════════
   MOBILE DRAWER
   ══════════════════════════════════════ */

export function renderMobileDrawer(ctx: LibHeader): TemplateResult {
  if (!ctx._mobileOpen) return html``;

  return html`
    <!-- Backdrop -->
    <div
      class="hdr-mobile-backdrop"
      @click="${(): void => ctx._closeMobile()}"
      aria-hidden="true"
    ></div>

    <!-- Drawer panel -->
    <nav
      id="hdr-mobile-drawer"
      class="hdr-mobile-drawer ${ctx._mobileOpen ? 'is-open' : ''}"
      aria-label="Menú principal"
    >
      <!-- Links principales -->
      <div class="hdr-mobile-links">
        ${(ctx.links ?? []).map((link: NavLink) => html`
          <a
            href="${link.href ?? '#'}"
            class="hdr-mobile-link"
            @click="${(e: Event): void => {
              e.preventDefault();
              ctx._onLinkClick(link.id);
            }}"
          >
            ${link.label}
            ${link.dropdown?.length ? html`
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <polyline points="1,1 5,5 9,1"/>
              </svg>` : nothing}
          </a>

          <!-- Sub-items — siempre visibles en móvil -->
          ${link.dropdown?.length ? html`
            <div class="hdr-mobile-sub">
              ${link.dropdown.map((item: DropdownItem) => html`
                <a href="${item.href ?? '#'}" class="hdr-mobile-sub-link">
                  › ${item.label}
                </a>
              `)}
            </div>
          ` : nothing}
        `)}

        <!-- Mega columns — accordion plano en móvil -->
        ${ctx.megaColumns?.length ? html`
          <div class="hdr-mobile-sub" style="margin-top:0;">
            ${ctx.megaColumns.map(col => html`
              <p class="hdr-mobile-col-title">${col.title}</p>
              ${col.items.map(item => html`
                <a href="${item.href ?? '#'}" class="hdr-mobile-sub-link">
                  › ${item.label}
                </a>
              `)}
            `)}
          </div>
        ` : nothing}
      </div>

      <!-- Divider -->
      <div class="hdr-mobile-divider"></div>

      <!-- Actions / CTAs -->
      <div class="hdr-mobile-actions">
        ${ctx.loginLabel ? html`
          <a href="${ctx.loginHref ?? '#'}" class="hdr-mobile-login">
            ${ctx.loginLabel}
          </a>
        ` : nothing}

        ${(ctx.actions ?? []).map((action: HeaderAction) => html`
          <a
            href="${action.href ?? '#'}"
            class="hdr-mobile-cta"
            @click="${(e: Event): void => {
              e.preventDefault();
              ctx._onActionClick(action);
            }}"
          >
            ${action.label}
          </a>
        `)}

        ${ctx.contactLabel ? html`
          <a href="${ctx.contactHref ?? '#'}" class="hdr-mobile-login">
            ${ctx.contactLabel} →
          </a>
        ` : nothing}
      </div>

      <!-- Footer del drawer -->
      <div class="hdr-mobile-footer">
        <span>${ctx.brandName}</span>
        <button
          class="hdr-mobile-close"
          aria-label="Cerrar menú"
          @click="${(): void => ctx._closeMobile()}"
        >✕</button>
      </div>
    </nav>`;
}