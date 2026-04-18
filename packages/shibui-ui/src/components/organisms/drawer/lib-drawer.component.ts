import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { drawerTemplate } from './lib-drawer.html';
import drawerCss from './lib-drawer.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { DrawerPlacement, DrawerSize, DrawerVariant } from './lib-drawer.types';

/**
 * lib-drawer — Shibui UI · SG-59
 *
 * @prop open         — Abre / cierra el drawer
 * @prop placement    — 'right'(default) | 'left' | 'top' | 'bottom'
 * @prop size         — 'sm' | 'md'(default) | 'lg' | 'xl' | 'full'
 * @prop variant      — 'default' | 'dark' | 'kintsugi' | 'kintsugi-dark' | 'glitch' | 'glitch-dark'
 * @prop label        — Texto del título (también rellenable via slot[name="title"])
 * @prop eyebrow      — Texto del eyebrow (también via slot[name="eyebrow"])
 * @prop subtitle     — Texto del subtítulo (también via slot[name="subtitle"])
 * @prop drawer-label — Aria-label del dialog (default = label)
 *
 * @slot              — Contenido del body
 * @slot title        — Reemplaza el título
 * @slot eyebrow      — Reemplaza el eyebrow
 * @slot subtitle     — Reemplaza el subtítulo
 * @slot footer       — Botones de pie (oculto si vacío)
 *
 * @fires ui-lib-drawer-close — Cuando el drawer se cierra (backdrop, Escape, botón X)
 */
@customElement('lib-drawer')
export class LibDrawer extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(drawerCss)}`,
  ];

  /* ── Identificador único para aria ── */
  readonly _uid: string = (globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] ?? Math.random())
  .toString(36)
  .slice(0, 5);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, reflect: true })
  placement: DrawerPlacement = 'right';

  @property({ type: String, reflect: true })
  size: DrawerSize = 'md';

  @property({ type: String, reflect: true })
  variant: DrawerVariant = 'default';

  @property({ type: String })
  label = '';

  @property({ type: String })
  eyebrow = '';

  @property({ type: String })
  subtitle = '';

  @property({ type: String, attribute: 'drawer-label' })
  drawerLabel = '';

  /* ════════════════════════════════════════
     Ciclo de vida
     ════════════════════════════════════════ */

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeyDown);
    // Restaurar scroll por si se destruye mientras está abierto
    document.body.style.overflow = '';
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (!changed.has('open')) return;

    if (this.open) {
      document.body.style.overflow = 'hidden';
      // Dar foco al panel para que los eventos de teclado funcionen
      requestAnimationFrame(() => {
        const panel = this.shadowRoot?.querySelector<HTMLElement>('.dr');
        panel?.focus();
      });
    } else {
      document.body.style.overflow = '';
    }

    // Sync aria-label si no se pasó drawer-label explícito
    if (!this.drawerLabel) {
      this.drawerLabel = this.label || 'Panel';
    }
  }

  /* ════════════════════════════════════════
     API pública
     ════════════════════════════════════════ */

  /** Cierra el drawer y emite el evento */
  _close(): void {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new CustomEvent('ui-lib-drawer-close', {
      bubbles: true,
      composed: true,
    }));
  }

  /* ════════════════════════════════════════
     Focus trap
     ════════════════════════════════════════ */

  private _getFocusable(): HTMLElement[] {
    const selector = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>(selector) ?? []
    );
  }

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (!this.open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this._close();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = this._getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      const active = this.shadowRoot?.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (active === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (active === last)  { e.preventDefault(); first?.focus(); }
      }
    }
  };

  /* ════════════════════════════════════════
     Render
     ════════════════════════════════════════ */
  protected override render(): TemplateResult {
    return drawerTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-drawer': LibDrawer;
  }
}