import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { headerTemplate }   from './lib-header.html';
import headerCss             from './lib-header.css?inline';
import sharedTokens          from '../../../styles/shared/tokens.css?inline';
import type {
  HeaderVariant, NavLink, HeaderAction, BreadcrumbItem,
} from './lib-header.types';

export interface MegaColumn {
  title: string;
  items: { label: string; href?: string }[];
}

export interface MegaCta {
  label: string; title: string; desc: string;
  href?: string; cta: string;
}

/**
 * lib-header — Shibui UI · SG-66
 *
 * 10 variantes: classic · dark · centered · transparent · kintsugi ·
 *               glitch · mega · minimal · shrink · app-bar
 *
 * @prop variant          — HeaderVariant
 * @prop logo-mark        — Carácter del mark (default '渋')
 * @prop brand-name       — Texto de marca (default 'shibui')
 * @prop brand-tagline    — Subtítulo del logo (variante shrink)
 * @prop logo-href        — URL del logo
 * @prop version          — Badge de versión (variante dark)
 * @prop links            — NavLink[] — nav principal
 * @prop actions          — HeaderAction[] — botones CTA
 * @prop login-label      — Texto del link de login
 * @prop login-href       — URL del login
 * @prop contact-label    — Texto del contacto (variante minimal)
 * @prop contact-href     — URL del contacto
 * @prop announcement     — Texto del topbar anuncio (variante centered)
 * @prop announcement-href — URL del anuncio
 * @prop mega-columns     — MegaColumn[] (variante mega)
 * @prop mega-cta         — MegaCta (variante mega)
 * @prop breadcrumbs      — BreadcrumbItem[] (variante app-bar)
 * @prop show-search      — Muestra la barra de búsqueda (app-bar)
 * @prop search-placeholder — Placeholder del input
 * @prop notifications    — Muestra el dot de notificación
 * @prop user-name        — Nombre del usuario (app-bar avatar)
 * @prop user-initials    — Iniciales del avatar
 * @prop compact          — App-bar compacto 44px + dark
 * @prop shrunk           — Fuerza estado comprimido (shrink) — auto vía scroll
 *
 * @fires ui-lib-header-link   — { id }
 * @fires ui-lib-header-action — { label, href }
 * @fires ui-lib-header-search — { query }
 */
@customElement('lib-header')
export class LibHeader extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(headerCss)}`,
  ];

  /* ── Variant ── */
  @property({ type: String, reflect: true })
  variant: HeaderVariant = 'classic';

  /* ── Logo ── */
  @property({ type: String, attribute: 'logo-mark' })
  logoMark = '渋';

  @property({ type: String, attribute: 'brand-name' })
  brandName = 'shibui';

  @property({ type: String, attribute: 'brand-tagline' })
  brandTagline = '';

  @property({ type: String, attribute: 'logo-href' })
  logoHref = '#';

  @property({ type: String })
  version = '';

  /* ── Nav ── */
  @property({ type: Array })
  links: NavLink[] = [];

  @property({ type: Array })
  actions: HeaderAction[] = [];

  @property({ type: String, attribute: 'login-label' })
  loginLabel = '';

  @property({ type: String, attribute: 'login-href' })
  loginHref = '';

  @property({ type: String, attribute: 'contact-label' })
  contactLabel = '';

  @property({ type: String, attribute: 'contact-href' })
  contactHref = '';

  /* ── Centered announcement ── */
  @property({ type: String })
  announcement = '';

  @property({ type: String, attribute: 'announcement-href' })
  announcementHref = '';

  /* ── Mega-nav ── */
  @property({ type: Array, attribute: 'mega-columns' })
  megaColumns: MegaColumn[] = [];

  @property({ type: Object, attribute: 'mega-cta' })
  megaCta: MegaCta | null = null;

  /* ── App-bar ── */
  @property({ type: Array })
  breadcrumbs: BreadcrumbItem[] = [];

  @property({ type: Boolean, attribute: 'show-search' })
  showSearch = false;

  @property({ type: String, attribute: 'search-placeholder' })
  searchPlaceholder = 'Buscar…';

  @property({ type: Boolean })
  notifications = false;

  @property({ type: String, attribute: 'user-name' })
  userName = '';

  @property({ type: String, attribute: 'user-initials' })
  userInitials = '';

  @property({ type: Boolean, reflect: true })
  compact = false;

  /* ── Scroll states (reflect for CSS targeting) ── */
  @property({ type: Boolean, reflect: true })
  shrunk = false;

  @property({ type: Boolean, reflect: true })
  scrolled = false;

  /* ── Internal ── */
  @state() _megaOpen = false;

  /* ── Lifecycle ── */
  override connectedCallback(): void {
    super.connectedCallback();
    if (this.variant === 'transparent' || this.variant === 'shrink') {
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
  }

  /* ── Scroll handler ── */
  private _onScroll = (): void => {
    const y = window.scrollY;
    if (this.variant === 'transparent') this.scrolled = y > 20;
    if (this.variant === 'shrink')      this.shrunk   = y > 60;
  };

  /* ── Mega-nav ── */
  _openMega():  void { this._megaOpen = true; }
  _closeMega(): void { this._megaOpen = false; }

  /* ── Event dispatchers ── */
  _onLinkClick(id: string): void {
    this.dispatchEvent(new CustomEvent('ui-lib-header-link', {
      detail: { id }, bubbles: true, composed: true,
    }));
  }

  _onActionClick(action: HeaderAction): void {
    this.dispatchEvent(new CustomEvent('ui-lib-header-action', {
      detail: { label: action.label, href: action.href },
      bubbles: true, composed: true,
    }));
  }

  _onSearch(query: string): void {
    this.dispatchEvent(new CustomEvent('ui-lib-header-search', {
      detail: { query }, bubbles: true, composed: true,
    }));
  }

  protected override render(): TemplateResult {
    return headerTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-header': LibHeader;
  }
}