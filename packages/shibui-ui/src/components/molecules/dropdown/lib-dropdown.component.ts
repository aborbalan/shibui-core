import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dropdownTemplate } from './lib-dropdown.html';
import dropdownCss from './lib-dropdown.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { DropdownTriggerVariant, DropdownAlign } from './lib-dropdown.types';

/**
 * lib-dropdown — Menú contextual flotante Shibui (SG-25)
 *
 * @prop label          — Texto del trigger (si no hay slot "trigger")
 * @prop variant        — 'default' | 'ghost' | 'filled' | 'kaki'
 * @prop align          — 'left' (default) | 'right'
 * @prop open           — Estado abierto (refleja en atributo)
 * @prop dark           — Menú con tema oscuro
 * @prop min-width      — Ancho mínimo del panel (e.g. '240px')
 * @prop aria-label     — aria-label del trigger (fallback: label)
 *
 * @fires ui-lib-dropdown-toggle — { detail: { open: boolean } }
 * @fires ui-lib-dropdown-item   — { detail: { target: HTMLElement } }  al activar un item
 *
 * @slot trigger  — Contenido personalizado del botón (reemplaza `label`)
 * @slot header   — Cabecera del panel (búsqueda, título)
 * @slot          — Items del menú (.dd-item, .dd-sep, .dd-group-label)
 * @slot footer   — Pie del panel (acciones de confirmación)
 *
 * ─── Clases de item (light DOM, sin shadow) ─────────────────
 * .dd-item           — fila de acción (button o a)
 * .dd-item.is-active — seleccionado
 * .dd-item.is-danger — acción destructiva
 * .dd-item.is-disabled — no interactivo
 * .dd-sep            — separador horizontal (div o hr)
 * .dd-group-label    — etiqueta de sección (div o span)
 *
 * ─── Clases internas de item (requieren CSS global) ─────────
 * .dd-item-icon      — icono a la izquierda
 * .dd-item-body      — wrapper para label + desc de dos líneas
 * .dd-item-label     — primera línea del body
 * .dd-item-desc      — segunda línea (mono, muted)
 * .dd-item-hint      — shortcut a la derecha (margin-left:auto)
 * .dd-item-check     — check de selección (opacity:0 por defecto)
 */
@customElement('lib-dropdown')
export class LibDropdown extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(dropdownCss)}`,
  ];

  @property({ type: String })
  label = 'Opciones';

  @property({ type: String, reflect: true })
  variant: DropdownTriggerVariant = 'default';

  @property({ type: String, reflect: true })
  align: DropdownAlign = 'left';

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: String, attribute: 'min-width' })
  minWidth = '';

  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel = '';

  /* ── Lifecycle ── */
  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('click', this._onOutsideClick);
    window.addEventListener('keydown', this._onWindowKey);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this._onOutsideClick);
    window.removeEventListener('keydown', this._onWindowKey);
  }

  /* ── Toggle ── */
  _toggle(): void {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('ui-lib-dropdown-toggle', {
      detail: { open: this.open },
      bubbles: true,
      composed: true,
    }));
    if (this.open) {
      // Foco al primer item al abrir con teclado
      requestAnimationFrame((): void => {
        const first = this._getItems()[0];
        first?.focus();
      });
    }
  }

  /* ── Outside click ── */
  private _onOutsideClick = (e: Event): void => {
    if (this.open && !e.composedPath().includes(this)) {
      this.open = false;
    }
  };

  /* ── Global Escape ── */
  private _onWindowKey = (e: KeyboardEvent): void => {
    if (this.open && e.key === 'Escape') {
      this.open = false;
      // Devolver foco al trigger
      const trigger = this.shadowRoot?.querySelector<HTMLButtonElement>('.dd-trigger');
      trigger?.focus();
    }
  };

  /* ── Trigger keydown (Arrow Down abre el menú) ── */
  _handleTriggerKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!this.open) this._toggle();
    }
  }

  /* ── Menu keydown (Arrow Up/Down navega entre items) ── */
  _handleMenuKey(e: KeyboardEvent): void {
    const items = this._getItems();
    if (!items.length) return;

    const current = document.activeElement as HTMLElement;
    const idx = items.indexOf(current);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      prev?.focus();
    } else if (e.key === 'Tab') {
      this.open = false;
    }
  }

  /* ── Obtiene los items focusables del slot default ── */
  private _getItems(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    if (!slot) return [];
    return slot.assignedElements({ flatten: true })
      .filter(el =>
        el.classList.contains('dd-item') &&
        !el.classList.contains('is-disabled')
      ) as HTMLElement[];
  }

  /* ── Detecta si un slot con nombre tiene contenido ── */
  _hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }

  protected override render(): TemplateResult {
    return dropdownTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-dropdown': LibDropdown;
  }
}