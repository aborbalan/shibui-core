import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import type { NavLink, DropdownItem, HeaderAction, BreadcrumbItem } from '../lib-header.types';

/* ══════════════════════════════════════
   SVG HELPERS (cambiar a iconos phosfor)
   ══════════════════════════════════════ */

export const svgChevron = html`
  <svg class="hdr-link-chevron" width="9" height="6" viewBox="0 0 10 6"
    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <polyline points="1,1 5,5 9,1"/>
  </svg>`;

export const svgSearch = html`
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <circle cx="7" cy="7" r="5"/><line x1="11" y1="11" x2="14" y2="14"/>
  </svg>`;

export const svgBell = html`
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M8 1a5 5 0 00-5 5v2l-1 2v1h12v-1l-1-2V6A5 5 0 008 1z"/>
    <path d="M6 13a2 2 0 004 0"/>
  </svg>`;

/* ══════════════════════════════════════
   LOGO MARK
   ══════════════════════════════════════ */

export function renderLogoMark(ctx: LibHeader): TemplateResult {
  if (ctx.variant === 'kintsugi') {
    return html`
      <div class="hdr-logo-mark">
        <span class="hdr-logo-mark-text">${ctx.logoMark}</span>
      </div>`;
  }
  return html`<div class="hdr-logo-mark">${ctx.logoMark}</div>`;
}

/* ══════════════════════════════════════
   LOGO
   ══════════════════════════════════════ */

export function renderLogo(ctx: LibHeader): TemplateResult {
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

/* ══════════════════════════════════════
   DROPDOWN (desktop)
   ══════════════════════════════════════ */

export function renderDropdown(_ctx: LibHeader, link: NavLink): TemplateResult {
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

/* ══════════════════════════════════════
   NAV LINKS (desktop)
   ══════════════════════════════════════ */

export function renderLinks(ctx: LibHeader, links: NavLink[]): TemplateResult {
  return html`
    ${links.map(link =>
      link.dropdown?.length
        ? renderDropdown(ctx, link)
        : html`
            <a href="${link.href || '#'}"
              class="hdr-link ${link.active ? 'is-active' : ''}"
              @click="${(e: Event): void => {
                e.preventDefault();
                ctx._onLinkClick(link.id);
              }}"
            >
              ${ctx.variant === 'glitch' ? html`<span>&gt;</span>` : nothing}
              ${link.label}
            </a>`
    )}`;
}

/* ══════════════════════════════════════
   ACTIONS (desktop)
   ══════════════════════════════════════ */

const ACTION_VARIANT_MAP: Record<string, string> = {
  classic:     'kaki',
  centered:    'outline',
  dark:        'kaki',
  transparent: 'kaki',
  kintsugi:    'kintsugi',
  glitch:      'glitch',
  mega:        'kaki',
  shrink:      'kaki',
  minimal:     '',
};

export function renderActions(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr-actions">
      ${ctx.loginLabel ? html`
        <a href="${ctx.loginHref || '#'}" class="hdr-login">${ctx.loginLabel}</a>
      ` : nothing}

      ${ctx.actions.map((action: HeaderAction) => {
        const cls = action.variant
          ? `hdr-action--${action.variant}`
          : `hdr-action--${ACTION_VARIANT_MAP[ctx.variant] || 'kaki'}`;
        return html`
          <a href="${action.href || '#'}"
            class="hdr-action ${cls}"
            @click="${(e: Event): void => {
              e.preventDefault();
              ctx._onActionClick(action);
            }}"
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

/* ══════════════════════════════════════
   BREADCRUMBS (app-bar)
   ══════════════════════════════════════ */

export function renderBreadcrumbs(items: BreadcrumbItem[]): TemplateResult {
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