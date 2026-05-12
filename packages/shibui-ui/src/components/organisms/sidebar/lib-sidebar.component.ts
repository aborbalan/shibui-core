import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import type { SidebarLink }     from '../../../types';
import { sidebarTemplate }      from './lib-sidebar.html';
import componentCss              from './lib-sidebar.css?inline';
import sharedTokens              from '../../../styles/shared/tokens.css?inline';
import { SidebarVariant } from './lib-sidebar.types';

export interface UiSidebarNavigateDetail {
  id: string;
  previous: string;
}

/**
 * lib-sidebar — Shibui UI · SG-65
 *
 * Estructura: Header(56px logo) · [Search] · Nav · User footer
 *
 * @prop logo-mark         — Carácter del logo mark (default '渋')
 * @prop brand-name        — Nombre de marca (default 'shibui')
 * @prop show-search       — Muestra la barra de búsqueda
 * @prop search-placeholder — Placeholder del input de búsqueda
 * @prop links             — Array de SidebarLink[]
 * @prop active            — ID del link activo
 * @prop user-name         — Nombre del usuario en el footer
 * @prop user-role         — Rol/plan del usuario
 * @prop user-avatar       — URL de imagen del avatar
 * @prop user-initials     — Iniciales de fallback
 * @prop show-user-action  — Muestra el botón de acción (logout icon)
 * @prop variant           — 'dark'(default) | 'light' | 'kintsugi' | 'glitch'
 * @prop collapsed         — Estado inicial colapsado
 *
 * @method toggle()     — Alterna collapsed/expanded (llamar desde topbar)
 * @method navigateTo() — Navega programáticamente a un id
 *
 * @fires ui-lib-navigate    — { id, previous }
 * @fires ui-lib-user-action — void (clic en botón de acción)
 * @fires ui-lib-search      — { query: string }
 */
@customElement('lib-sidebar')
export class LibSidebar extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /* ── Header ── */
  @property({ type: String, attribute: 'logo-mark' })
  logoMark = '渋';

  @property({ type: String, attribute: 'brand-name' })
  brandName = 'shibui';

  /* ── Search ── */
  @property({ type: Boolean, attribute: 'show-search', reflect: true })
  showSearch = false;

  @property({ type: String, attribute: 'search-placeholder' })
  searchPlaceholder = 'Buscar…';

  /* ── Nav ── */
  @property({ type: Array })
  links: SidebarLink[] = [];

  @property({ type: String, reflect: true })
  active = '';

  /* ── User footer ── */
  @property({ type: String, attribute: 'user-name' })
  userName = '';

  @property({ type: String, attribute: 'user-role' })
  userRole = '';

  @property({ type: String, attribute: 'user-avatar' })
  userAvatar = '';

  @property({ type: String, attribute: 'user-initials' })
  userInitials = '';

  @property({ type: Boolean, attribute: 'show-user-action' })
  showUserAction = false;

  /* ── Variant & behavior ── */
  @property({ type: String, reflect: true })
  variant: SidebarVariant = 'dark';

  @property({ type: Boolean, reflect: true })
  collapsed = false;

  /* ── Internal state ── */
  @state() private _mobileOpen = false;

  /* ── Queries ── */
  @query('.sb-indicator') declare private _indicator: HTMLElement;
  @query('.sb-nav')       declare private _nav: HTMLElement;

  /* ── Lifecycle ── */
  override updated(changed: Map<string, unknown>): void {
    if (changed.has('active') || changed.has('links')) {
      this._moveIndicator();
    }
  }

  /* ── Render ── */
  override render(): TemplateResult {
    return sidebarTemplate({
      logoMark:          this.logoMark,
      brandName:         this.brandName,
      showSearch:        this.showSearch,
      searchPlaceholder: this.searchPlaceholder,
      links:             this.links,
      active:            this.active,
      userName:          this.userName,
      userRole:          this.userRole,
      userAvatar:        this.userAvatar,
      userInitials:      this.userInitials,
      showUserAction:    this.showUserAction,
      variant:           this.variant,
      collapsed:         this.collapsed,
      mobileOpen:        this._mobileOpen,
      onLinkClick:       this._handleLink.bind(this),
      onUserAction:      this._handleUserAction.bind(this),
      onSearchInput:     this._handleSearch.bind(this),
      onOverlayClick:    () => { this._mobileOpen = false; },
      onToggleClick:     () => { this._mobileOpen = !this._mobileOpen; },
    });
  }

  /* ── Sliding indicator ── */
  private _moveIndicator(): void {
    requestAnimationFrame(() => {
      const nav = this._nav;
      const ind = this._indicator;
      if (!nav || !ind) return;

      const btn = nav.querySelector<HTMLElement>('.sb-link.is-active');
      if (!btn) { ind.classList.remove('visible'); return; }

      const navTop  = nav.getBoundingClientRect().top;
      const btnRect = btn.getBoundingClientRect();

      ind.style.top    = `${btnRect.top - navTop + nav.scrollTop}px`;
      ind.style.height = `${btnRect.height}px`;
      ind.classList.add('visible');
    });
  }

  /* ── Handlers ── */
  private _handleLink(id: string): void {
    const previous = this.active;
    this.active = id;
    this.dispatchEvent(new CustomEvent<UiSidebarNavigateDetail>('ui-lib-navigate', {
      detail: { id, previous },
      bubbles: true, composed: true,
    }));
    if (this._mobileOpen) this._mobileOpen = false;
  }

  private _handleUserAction(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-user-action', {
      bubbles: true, composed: true,
    }));
  }

  private _handleSearch(query: string): void {
    this.dispatchEvent(new CustomEvent('ui-lib-search', {
      detail: { query },
      bubbles: true, composed: true,
    }));
  }

  /* ── Public API ── */

  /** Alterna collapsed ↔ expanded. Llamar desde el botón hamburger de la topbar. */
  toggle(): void { this.collapsed = !this.collapsed; }

  /** Expande el sidebar */
  expand(): void { this.collapsed = false; }

  /** Colapsa el sidebar a icon rail */
  collapse(): void { this.collapsed = true; }

  /** Navega programáticamente */
  navigateTo(id: string): void { this._handleLink(id); }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-sidebar': LibSidebar;
  }
}