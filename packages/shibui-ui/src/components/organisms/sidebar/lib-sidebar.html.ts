import { html, nothing, TemplateResult } from 'lit';
import type { SidebarLink, SidebarSocial } from './lib-sidebar.types';

export interface SidebarTemplateProps {
  /* Profile */
  name: string;
  initials: string;
  avatarSrc: string;
  role: string;
  status: string;
  showStatus: boolean;
  /* Nav */
  links: SidebarLink[];
  active: string;
  /* Footer */
  socials: SidebarSocial[];
  cvLabel: string;
  cvHref: string;
  /* State */
  mobileOpen: boolean;
  /* Handlers */
  onLinkClick: (id: string) => void;
  onCvClick: () => void;
  onOverlayClick: () => void;
  onToggleClick: () => void;
}

/* ── Profile ───────────────────────────────────────────── */
function renderProfile(p: SidebarTemplateProps): TemplateResult {
  return html`
    <div class="sb-profile">
      <div class="sb-avatar">
        ${p.avatarSrc
          ? html`<img src="${p.avatarSrc}" alt="${p.name}">`
          : html`${p.initials || p.name.slice(0, 2)}`
        }
      </div>
      <div class="sb-name">${p.name}</div>
      ${p.role ? html`<div class="sb-role">${p.role}</div>` : nothing}
      ${p.showStatus && p.status ? html`
        <div class="sb-status">
          <span class="sb-status-dot"></span>
          ${p.status}
        </div>
      ` : nothing}
    </div>
  `;
}

/* ── Nav links ─────────────────────────────────────────── */
function renderLinks(p: SidebarTemplateProps): TemplateResult {
  return html`
    ${p.links.map(link => html`
      <button
        class="sb-link ${link.id === p.active ? 'is-active' : ''}"
        data-id="${link.id}"
        @click="${():void => p.onLinkClick(link.id)}"
      >
        <span class="sb-link-icon">
          <lib-icon name="${link.icon}" size="sm"></lib-icon>
        </span>
        ${link.label}
        ${link.number ? html`<span class="sb-link-num">${link.number}</span>` : nothing}
      </button>
    `)}
  `;
}

/* ── Footer ────────────────────────────────────────────── */
function renderFooter(p: SidebarTemplateProps): TemplateResult {
  return html`
    <div class="sb-footer">
      ${p.socials.length > 0 ? html`
        <div class="sb-socials">
          ${p.socials.map(s => html`
            <a
              class="sb-social"
              href="${s.href}"
              aria-label="${s.label}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <lib-icon name="${s.icon}" size="sm"></lib-icon>
            </a>
          `)}
        </div>
      ` : nothing}

      ${p.cvLabel ? html`
        <a
          class="sb-cv"
          href="${p.cvHref || '#'}"
          @click="${(e: Event):void => { if (!p.cvHref) e.preventDefault(); p.onCvClick(); }}"
        >
          <lib-icon name="download-simple" size="sm"></lib-icon>
          ${p.cvLabel}
        </a>
      ` : nothing}
    </div>
  `;
}

/* ── Template principal ─────────────────────────────────── */
export function sidebarTemplate(p: SidebarTemplateProps): TemplateResult {
  return html`
    <!-- Mobile overlay -->
    <div
      class="sb-overlay ${p.mobileOpen ? 'is-open' : ''}"
      @click="${p.onOverlayClick}"
      aria-hidden="true"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar ${p.mobileOpen ? 'is-open' : ''}">

      ${renderProfile(p)}

      <nav class="sb-nav" aria-label="Navegación principal">
        <div class="sb-indicator" id="sb-indicator"></div>
        ${renderLinks(p)}
      </nav>

      ${renderFooter(p)}

    </aside>

    <!-- Mobile toggle FAB -->
    <button
      class="sb-toggle"
      aria-label="${p.mobileOpen ? 'Cerrar menú' : 'Abrir menú'}"
      aria-expanded="${p.mobileOpen}"
      @click="${p.onToggleClick}"
    >
      <lib-icon name="${p.mobileOpen ? 'x' : 'list'}" size="md"></lib-icon>
    </button>
  `;
}