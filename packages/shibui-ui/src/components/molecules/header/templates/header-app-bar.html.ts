import { html, nothing, TemplateResult } from 'lit';
import type { LibHeader } from '../lib-header.component';
import type { HeaderAction } from '../lib-header.types';
import { renderBreadcrumbs, svgSearch, svgBell } from './header-shared.html';

/**
 * Template variante app-bar:
 * logomark | breadcrumbs | search | spacer | actions | notif | avatar
 * No usa el drawer móvil — sus acciones son contextuales.
 * En móvil: breadcrumbs se truncan, search colapsa a icono.
 */
export function renderAppBar(ctx: LibHeader): TemplateResult {
  return html`
    <div class="hdr">

      <!-- Logo mark (sin texto) -->
      <div class="hdr-logo-mark" style="flex-shrink:0;"></div>

      <!-- Breadcrumbs -->
      ${ctx.breadcrumbs.length ? renderBreadcrumbs(ctx.breadcrumbs) : nothing}

      <!-- Divider — oculto en móvil -->
      <div class="hdr-divider hdr-divider--desktop"></div>

      <!-- Search — full en desktop, icono en móvil -->
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

      <!-- Context actions — ocultos en móvil -->
      ${ctx.actions.length ? html`
        <div class="hdr-actions hdr-actions--desktop">
          ${ctx.actions.map((action: HeaderAction) => html`
            <a href="${action.href || '#'}"
              class="hdr-action ${action.variant === 'outline'
                ? 'hdr-action--outline' : 'hdr-action--kaki'}"
              style="height:32px;font-size:8px;"
            >${action.label}</a>
          `)}
        </div>
      ` : nothing}

      <!-- Status (compact mode) — oculto en móvil -->
      ${ctx.compact ? html`
        <div class="hdr-status hdr-status--desktop">
          <div class="hdr-status-dot"></div>
          <span class="hdr-status-text">Online · 42ms</span>
        </div>
      ` : nothing}

      <div class="hdr-divider"></div>

      <!-- Notificaciones -->
      <div class="hdr-notif">
        ${svgBell}
        ${ctx.notifications ? html`<span class="hdr-notif-dot"></span>` : nothing}
      </div>

      <!-- Avatar -->
      <div class="hdr-avatar">${ctx.userInitials || ctx.userName.slice(0, 1)}</div>

    </div>`;
}