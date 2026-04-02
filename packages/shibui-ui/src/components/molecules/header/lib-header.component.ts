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
 * Mobile: breakpoint 640px — drawer vertical compartido por todas las variantes.
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

  /* ── Scroll states ── */
  @property({ type: Boolean, reflect: true })
  shrunk = false;

  @property({ type: Boolean, reflect: true })
  scrolled = false;

  /* ── Internal ── */
  @state() _megaOpen    = false;
  @state() _mobileOpen  = false;

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

  /* ── Mobile drawer ── */
  _toggleMobile(): void {
    this._mobileOpen = !this._mobileOpen;
  }

  _closeMobile(): void {
    this._mobileOpen = false;
  }

  /* ── Event dispatchers ── */
  _onLinkClick(id: string): void {
    this._closeMobile();
    this.dispatchEvent(new CustomEvent('ui-lib-header-link', {
      detail: { id }, bubbles: true, composed: true,
    }));
  }

  _onActionClick(action: HeaderAction): void {
    this._closeMobile();
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