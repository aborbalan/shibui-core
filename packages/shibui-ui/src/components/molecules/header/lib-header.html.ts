import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader }     from './lib-header.component';
import type { NavLink, DropdownItem, HeaderAction, BreadcrumbItem } from './lib-header.types';

/* ── SVG helpers ── */
const svgChevron = html`
  <svg class="hdr-link-chevron" width="9" height="6" viewBox="0 0 10 6"
    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <polyline points="1,1 5,5 9,1"/>
  </svg>`;

const svgSearch = html`
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <circle cx="7" cy="7" r="5"/><line x1="11" y1="11" x2="14" y2="14"/>
  </svg>`;

const svgBell = html`
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M8 1a5 5 0 00-5 5v2l-1 2v1h12v-1l-1-2V6A5 5 0 008 1z"/>
    <path d="M6 13a2 2 0 004 0"/>
  </svg>`;

/* ── Logo mark ── */
function renderLogoMark(ctx: LibHeader): TemplateResult {
  if (ctx.variant === 'kintsugi') {
    return html`
      <div class="hdr-logo-mark">
        <span class="hdr-logo-mark-text">${ctx.logoMark}</span>
      </div>`;
  }
  return html`<div class="hdr-logo-mark">${ctx.logoMark}</div>`;
}

/* ── Logo (standard) ── */
function renderLogo(ctx: LibHeader): TemplateResult {
  if (ctx.variant === 'glitch') {
    return html`
      <a href="${ctx.logoHref}" class="hdr-logo-glitch">
        ⌗ ${ctx.brandName.toUpperCase()}
        <span class="hdr-logo-glitch-badge">SYS</span>
      </a>`;
  }

  if (ctx.variant === 'minimal') {
    return html`
      <a href="${ctx.logoHref}" class="hdr-logo">
        <span class="hdr-brand-name">${ctx.logoMark}</span>
      </a>`;
  }

  return html`
    <a href="${ctx.logoHref}" class="hdr-logo">
      ${renderLogoMark(ctx)}
      <div>
        <div class="hdr-brand-name">${ctx.brandName}
          ${ctx.variant === 'kintsugi'
            ? html` <em style="font-style:italic;color:var(--color-kaki-400);">金</em>`
            : nothing}
        </div>
        ${ctx.brandTagline && ctx.variant === 'shrink'
          ? html`<div class="hdr-tagline">${ctx.brandTagline}</div>`
          : nothing}
      </div>
      ${ctx.version && ctx.variant === 'dark'
        ? html`<span class="hdr-version">${ctx.version}</span>`
        : nothing}
    </a>`;
}

/* ── Dropdown ── */
function renderDropdown(_ctx: LibHeader, link: NavLink): TemplateResult {
  return html`
    <div class="hdr-dd">
      <span class="hdr-link">
        ${link.label}
        ${svgChevron}
      </span>
      <div class="hdr-dd-menu">
        ${link.dropdown?.map((item: DropdownItem) => html`
          <a href="${item.href || '#'}"
            class="hdr-dd-item ${item.divider ? 'hdr-dd-item--divider' : ''}">
            ${item.label}
          </a>
        `)}
      </div>
    </div>`;
}

/* ── Nav links ── */
function renderLinks(ctx: LibHeader, links: NavLink[]): TemplateResult {
  return html`
    ${links.map(link =>
      link.dropdown?.length
        ? renderDropdown(ctx, link)
        : html`
            <a href="${link.href || '#'}"
              class="hdr-link ${link.active ? 'is-active' : ''}"
              @click="${(e: Event): void => { e.preventDefault(); ctx._onLinkClick(link.id); }}"
            >
              ${ctx.variant === 'glitch' ? html`<span>&gt;</span>` : nothing}
              ${link.label}
            </a>`
    )}`;
}

/* ── Action buttons ── */
function renderActions(ctx: LibHeader): TemplateResult {
  const variantMap: Record<string, string> = {
    classic: 'kaki', centered: 'outline', dark: 'kaki',
    transparent: 'kaki', kintsugi: 'kintsugi', glitch: 'glitch',
    mega: 'kaki', shrink: 'kaki', minimal: '',
  };

  return html`
    <div class="hdr-actions">
      ${ctx.loginLabel ? html`
        <a href="${ctx.loginHref || '#'}" class="hdr-login">${ctx.loginLabel}</a>
      ` : nothing}

      ${ctx.actions.map((action: HeaderAction) => {
        const cls = action.variant
          ? `hdr-action--${action.variant}`
          : `hdr-action--${variantMap[ctx.variant] || 'kaki'}`;
        return html`
          <a href="${action.href || '#'}"
            class="hdr-action ${cls}"
            @click="${(e: Event): void => { e.preventDefault(); ctx._onActionClick(action); }}"
          >${action.label}</a>`;
      })}

      ${ctx.variant === 'glitch' ? html`
        <div class="hdr-online">● online</div>
      ` : nothing}

      ${ctx.variant === 'minimal' && ctx.contactLabel ? html`
        <a href="${ctx.contactHref || '#'}" class="hdr-contact">${ctx.contactLabel} →</a>
      ` : nothing}
    </div>`;
}

/* ── Breadcrumbs (app-bar) ── */
function renderBreadcrumbs(items: BreadcrumbItem[]): TemplateResult {
  return html`
    <nav class="hdr-breadcrumbs" aria-label="breadcrumb">
      ${items.map((item, i) => html`
        ${i > 0 ? html`<span class="hdr-breadcrumb-sep">/</span>` : nothing}
        ${i < items.length - 1
          ? html`<a href="${item.href || '#'}" class="hdr-breadcrumb-link">${item.label}</a>`
          : html`<span class="hdr-breadcrumb-current">${item.label}</span>`}
      `)}
    </nav>`;
}

/* ══════════════════════════════════════
   TEMPLATES POR VARIANTE
   ══════════════════════════════════════ */

function renderClassic(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr">
      ${renderLogo(ctx)}
      <nav class="hdr-nav">${renderLinks(ctx, ctx.links)}</nav>
      ${renderActions(ctx)}
    </div>`;
}

function renderCentered(ctx: LibHeader): TemplateResult {
  const mid = Math.floor(ctx.links.length / 2);
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
      <nav class="hdr-nav">${renderLinks(ctx, leftLinks)}</nav>
      ${renderLogo(ctx)}
      <nav class="hdr-nav hdr-nav--right">${renderLinks(ctx, rightLinks)}
        ${renderActions(ctx)}
      </nav>
    </div>`;
}

function renderMega(ctx: LibHeader): TemplateResult {
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
    </div>

    <!-- Overlay -->
    <div class="hdr-mega-overlay ${ctx._megaOpen ? 'is-open' : ''}"
      @mouseenter="${(): void => ctx._closeMega()}">
    </div>

    <!-- Panel -->
    <div class="hdr-mega-panel ${ctx._megaOpen ? 'is-open' : ''}"
      @mouseenter="${(): void => ctx._openMega()}"
      @mouseleave="${(): void => ctx._closeMega()}">
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
            <a href="${ctx.megaCta.href || '#'}" class="hdr-action hdr-action--kaki"
              style="height:32px;font-size:8px;">${ctx.megaCta.cta}</a>
          </div>
        ` : nothing}
      </div>
    </div>`;
}

function renderAppBar(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr">
      <!-- Logo mark -->
      <div class="hdr-logo-mark" style="flex-shrink:0;"></div>

      <!-- Breadcrumbs -->
      ${ctx.breadcrumbs.length ? renderBreadcrumbs(ctx.breadcrumbs) : nothing}

      <!-- Divider -->
      <div class="hdr-divider"></div>

      <!-- Search -->
      ${ctx.showSearch ? html`
        <div class="hdr-search">
          ${svgSearch}
          <input
            type="search"
            placeholder="${ctx.searchPlaceholder}"
            @input="${(e: Event): void =>
              ctx._onSearch((e.target as HTMLInputElement).value)}"
          />
          <span class="hdr-search-kbd">⌘K</span>
        </div>
      ` : nothing}

      <div class="hdr-spacer"></div>

      <!-- Context actions -->
      ${ctx.actions.length ? html`
        <div class="hdr-actions">
          ${ctx.actions.map(action => html`
            <a href="${action.href || '#'}"
              class="hdr-action ${action.variant === 'outline'
                ? 'hdr-action--outline' : 'hdr-action--kaki'}"
              style="height:32px;font-size:8px;"
            >${action.label}</a>
          `)}
        </div>` : nothing}

      <!-- Compact: status -->
      ${ctx.compact ? html`
        <div class="hdr-status">
          <div class="hdr-status-dot"></div>
          <span class="hdr-status-text">Online · 42ms</span>
        </div>
      ` : nothing}

      <!-- Divider -->
      <div class="hdr-divider"></div>

      <!-- Notifications -->
      <div class="hdr-notif">
        ${svgBell}
        ${ctx.notifications ? html`<span class="hdr-notif-dot"></span>` : nothing}
      </div>

      <!-- Avatar -->
      <div class="hdr-avatar">${ctx.userInitials || ctx.userName.slice(0, 1)}</div>
    </div>`;
}

/* ── Template principal (dispatcher) ── */
export function headerTemplate(ctx: LibHeader): TemplateResult {
  switch (ctx.variant) {
    case 'centered':    return renderCentered(ctx);
    case 'mega':        return renderMega(ctx);
    case 'app-bar':     return renderAppBar(ctx);
    // classic, dark, transparent, kintsugi, glitch, minimal, shrink — misma estructura
    default:
      return renderClassic(ctx);
  }
}