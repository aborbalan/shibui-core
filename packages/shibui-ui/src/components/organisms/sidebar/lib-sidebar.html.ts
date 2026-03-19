import { html, nothing, TemplateResult } from 'lit';
import type { SidebarLink } from '../../../types';

export interface SidebarTemplateProps {
  /* Header */
  logoMark:   string;
  brandName:  string;
  /* Search */
  showSearch:          boolean;
  searchPlaceholder:   string;
  /* Nav */
  links:  SidebarLink[];
  active: string;
  /* User footer */
  userName:    string;
  userRole:    string;
  userAvatar:  string;
  userInitials:string;
  showUserAction: boolean;
  /* State */
  variant:    string;
  collapsed:  boolean;
  mobileOpen: boolean;
  /* Handlers */
  onLinkClick:   (id: string) => void;
  onUserAction:  () => void;
  onSearchInput: (q: string) => void;
  onOverlayClick: () => void;
  onToggleClick:  () => void;
}

/* ── SVG icons inline — no lib-icon dependency for shell elements ── */
const svgSearch = html`
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <circle cx="7" cy="7" r="5"/><line x1="11" y1="11" x2="14" y2="14"/>
  </svg>`;

const svgLogout = html`
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M6 2H3a1 1 0 00-1 1v8a1 1 0 001 1h3"/>
    <polyline points="10,4 12,7 10,10"/>
    <line x1="4" y1="7" x2="12" y2="7"/>
  </svg>`;

const svgMenu = html`
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <line x1="2" y1="4" x2="14" y2="4"/>
    <line x1="2" y1="8" x2="14" y2="8"/>
    <line x1="2" y1="12" x2="14" y2="12"/>
  </svg>`;

const svgClose = html`
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <line x1="2" y1="2" x2="12" y2="12"/>
    <line x1="12" y1="2" x2="2" y2="12"/>
  </svg>`;

/* ── Badge ── */
function renderBadge(badge: string | number | undefined): TemplateResult | typeof nothing {
  if (badge === undefined || badge === null || badge === '') return nothing;
  if (badge === 'dot') {
    return html`<span class="sb-badge sb-badge--dot" aria-hidden="true"></span>`;
  }
  const n = typeof badge === 'number' ? badge : parseInt(String(badge), 10);
  const cls = (!isNaN(n) && n > 9) || isNaN(n) ? 'sb-badge--kaki' : 'sb-badge--muted';
  return html`<span class="sb-badge ${cls}">${badge}</span>`;
}

/* ── Header ── */
function renderHeader(p: SidebarTemplateProps): TemplateResult {
  const isGlitch = p.variant === 'glitch';
  const isKintsugi = p.variant === 'kintsugi';

  return html`
    <div class="sb-header" part="header">
      <div class="sb-logo-mark" part="logo-mark">
        ${isKintsugi
          ? html`<span>${p.logoMark}</span>`
          : p.logoMark}
      </div>
      ${isGlitch
        ? html`<span class="sb-brand">⌗ ${p.brandName.toUpperCase()}</span>
                <span class="sb-version">v0.1</span>`
        : html`<span class="sb-brand">${p.brandName}</span>`}
    </div>
  `;
}

/* ── Search ── */
function renderSearch(p: SidebarTemplateProps): TemplateResult | typeof nothing {
  if (!p.showSearch) return nothing;
  return html`
    <div class="sb-search" part="search">
      <div class="sb-search-inner">
        ${svgSearch}
        <input
          class="sb-search-input"
          type="search"
          placeholder="${p.searchPlaceholder}"
          aria-label="Buscar"
          @input="${(e: Event): void =>
            p.onSearchInput((e.target as HTMLInputElement).value)}"
        />
        <span class="sb-search-kbd">⌘K</span>
      </div>
    </div>
  `;
}

/* ── Nav ── */
function renderNav(p: SidebarTemplateProps): TemplateResult {
  const isGlitch = p.variant === 'glitch';

  return html`
    <nav class="sb-nav" part="nav" aria-label="Navegación principal">
      <div class="sb-indicator" part="indicator"></div>

      ${p.links.map(link => html`
        ${link.group ? html`
          <div class="sb-group" part="group">
            ${isGlitch ? `// ${link.group}` : link.group}
          </div>
        ` : nothing}

        <button
          class="sb-link ${link.id === p.active ? 'is-active' : ''}"
          part="link${link.id === p.active ? ' link-active' : ''}"
          data-id="${link.id}"
          ?disabled="${link.disabled}"
          aria-current="${link.id === p.active ? 'page' : nothing}"
          @click="${(): void => { if (!link.disabled) p.onLinkClick(link.id); }}"
        >
          <span class="sb-link-icon">
            <lib-icon name="${link.icon}" size="sm"></lib-icon>
          </span>

          ${isGlitch
            ? html`<span class="sb-link-prefix">›</span>`
            : nothing}

          <span class="sb-link-label">${link.label}</span>

          ${renderBadge(link.badge)}
        </button>
      `)}
    </nav>
  `;
}

/* ── User footer ── */
function renderUser(p: SidebarTemplateProps): TemplateResult {
  const isDark = p.variant === 'dark' || !p.variant;

  return html`
    <div class="sb-user" part="user">
      <div class="sb-user-avatar" part="user-avatar">
        ${p.userAvatar
          ? html`<img src="${p.userAvatar}" alt="${p.userName}">`
          : p.userInitials || p.userName.slice(0, 1)}
      </div>

      <div class="sb-user-info">
        <div class="sb-user-name">${p.userName}</div>
        ${p.userRole ? html`<div class="sb-user-role">${p.userRole}</div>` : nothing}
      </div>

      ${isDark
        ? html`<span class="sb-user-dot" aria-hidden="true"></span>`
        : p.showUserAction
          ? html`
              <button
                class="sb-user-action"
                aria-label="Acción de usuario"
                @click="${p.onUserAction}"
              >${svgLogout}</button>`
          : nothing}
    </div>
  `;
}

/* ── Template principal ── */
export function sidebarTemplate(p: SidebarTemplateProps): TemplateResult {
  return html`
    <div
      class="sb-overlay ${p.mobileOpen ? 'is-open' : ''}"
      @click="${p.onOverlayClick}"
      aria-hidden="true"
    ></div>

    <aside
      class="sidebar
        ${p.mobileOpen ? 'is-open' : ''}
        ${p.collapsed  ? 'is-collapsed' : ''}"
      part="sidebar"
    >
      ${renderHeader(p)}
      ${renderSearch(p)}
      ${renderNav(p)}
      ${renderUser(p)}
    </aside>

    <button
      class="sb-toggle"
      aria-label="${p.mobileOpen ? 'Cerrar menú' : 'Abrir menú'}"
      aria-expanded="${p.mobileOpen}"
      @click="${p.onToggleClick}"
    >${p.mobileOpen ? svgClose : svgMenu}</button>
  `;
}