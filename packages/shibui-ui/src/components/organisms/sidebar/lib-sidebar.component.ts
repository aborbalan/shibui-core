import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import type { SidebarLink, SidebarSocial } from './lib-sidebar.types';
import { sidebarTemplate }                  from './lib-sidebar.html';
import componentCss                          from './lib-sidebar.css?inline';
import sharedTokens                          from '../../../styles/shared/tokens.css?inline';

export interface UiSidebarNavigateDetail {
  id: string;
  previous: string;
}

export interface UiSidebarCvDetail {
  href: string;
}

/**
 * @element lib-sidebar
 *
 * @fires ui-lib-navigate  - Al cambiar de sección. Detail: { id, previous }
 * @fires ui-lib-cv-click  - Al pulsar el botón de CV. Detail: { href }
 *
 * @attr {string}            name        - Nombre completo mostrado en el perfil
 * @attr {string}            initials    - Iniciales del avatar (si no hay avatar-src)
 * @attr {string}            avatar-src  - URL de imagen de avatar
 * @attr {string}            role        - Rol / cargo
 * @attr {string}            status      - Texto de disponibilidad
 * @attr {boolean}           show-status - Muestra el indicador de estado (default: true)
 * @attr {string}            active      - ID del enlace activo
 * @attr {string}            cv-label    - Texto del botón de CV (vacío = oculto)
 * @attr {string}            cv-href     - URL del archivo CV
 */
@customElement('lib-sidebar')
export class LibSidebar extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /* ── Props públicas ──────────────────────────────────── */

  @property({ type: String })
  name = '';

  @property({ type: String })
  initials = '';

  @property({ type: String, attribute: 'avatar-src' })
  avatarSrc = '';

  @property({ type: String })
  override role = '';

  @property({ type: String })
  status = '';

  @property({ type: Boolean, attribute: 'show-status', reflect: true })
  showStatus = true;

  @property({ type: Array })
  links: SidebarLink[] = [];

  @property({ type: Array })
  socials: SidebarSocial[] = [];

  @property({ type: String, reflect: true })
  active = '';

  @property({ type: String, attribute: 'cv-label' })
  cvLabel = 'Descargar CV';

  @property({ type: String, attribute: 'cv-href' })
  cvHref = '';

  /* ── Estado interno ──────────────────────────────────── */

  @state()
  private _mobileOpen = false;

  /* ── Queries ─────────────────────────────────────────── */

  @query('.sb-indicator')
  declare private _indicator: HTMLElement;

  @query('.sb-nav')
  declare private _nav: HTMLElement;

  /* ── Lifecycle ───────────────────────────────────────── */

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('active') || changed.has('links')) {
      this._moveIndicator();
    }
  }

  /* ── Render ──────────────────────────────────────────── */

  override render(): TemplateResult {
    return sidebarTemplate({
      name:        this.name,
      initials:    this.initials,
      avatarSrc:   this.avatarSrc,
      role:        this.role,
      status:      this.status,
      showStatus:  this.showStatus,
      links:       this.links,
      active:      this.active,
      socials:     this.socials,
      cvLabel:     this.cvLabel,
      cvHref:      this.cvHref,
      mobileOpen:  this._mobileOpen,
      onLinkClick: this._handleLinkClick.bind(this),
      onCvClick:   this._handleCvClick.bind(this),
      onOverlayClick: this._handleClose.bind(this),
      onToggleClick:  this._handleToggle.bind(this),
    });
  }

  /* ── Indicator ───────────────────────────────────────── */

  private _moveIndicator(): void {
    // Use requestAnimationFrame to ensure DOM is painted
    requestAnimationFrame(() => {
      const nav = this._nav;
      const indicator = this._indicator;
      if (!nav || !indicator) return;

      const activeBtn = nav.querySelector<HTMLElement>('.sb-link.is-active');
      if (!activeBtn) {
        indicator.classList.remove('visible');
        return;
      }

      const navTop  = nav.getBoundingClientRect().top;
      const btnRect = activeBtn.getBoundingClientRect();

      indicator.style.top    = `${btnRect.top - navTop + nav.scrollTop}px`;
      indicator.style.height = `${btnRect.height}px`;
      indicator.classList.add('visible');
    });
  }

  /* ── Handlers ────────────────────────────────────────── */

  private _handleLinkClick(id: string): void {
    const previous = this.active;
    this.active = id;

    this.dispatchEvent(
      new CustomEvent<UiSidebarNavigateDetail>('ui-lib-navigate', {
        detail: { id, previous },
        bubbles: true,
        composed: true,
      }),
    );

    // Auto-close on mobile after navigation
    if (this._mobileOpen) {
      this._mobileOpen = false;
    }
  }

  private _handleCvClick(): void {
    this.dispatchEvent(
      new CustomEvent<UiSidebarCvDetail>('ui-lib-cv-click', {
        detail: { href: this.cvHref },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleClose(): void {
    this._mobileOpen = false;
  }

  private _handleToggle(): void {
    this._mobileOpen = !this._mobileOpen;
  }

  /* ── Public API ──────────────────────────────────────── */

  /** Abre el sidebar en mobile */
  open(): void {
    this._mobileOpen = true;
  }

  /** Cierra el sidebar en mobile */
  close(): void {
    this._mobileOpen = false;
  }

  /** Navega programáticamente a una sección */
  navigateTo(id: string): void {
    this._handleLinkClick(id);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-sidebar': LibSidebar;
  }
}