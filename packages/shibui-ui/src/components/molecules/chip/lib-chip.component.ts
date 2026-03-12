import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { chipTemplate } from './lib-chip.html';
import chipCss from './lib-chip.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { ChipKind, ChipSize, ChipColor } from './lib-chip.types';

/**
 * lib-chip — Chip Shibui (SG-26)
 *
 * Tres familias semánticas controladas por `kind`:
 *   - static  → etiqueta read-only, taxonomía
 *   - toggle  → filtro seleccionable (aria-checkbox)
 *   - input   → tag removible con botón ×
 *
 * @prop kind       — 'static' | 'toggle' | 'input'
 * @prop size       — 'xs' | 'sm' | 'md' | 'lg'
 * @prop color      — 'default' | 'kaki' | 'celadon' | 'error' | 'info' | 'dark'
 * @prop selected   — Estado seleccionado (solo kind=toggle)
 * @prop dot        — Dot de color antes del texto
 * @prop aria-label — Texto accesible del chip
 *
 * @fires ui-lib-chip-toggle  — { detail: { selected: boolean } }  (kind=toggle)
 * @fires ui-lib-chip-remove  — { detail: {} }                     (kind=input)
 *
 * @slot         — Texto/label del chip
 * @slot icon    — Icono a la izquierda del texto
 * @slot avatar  — Avatar circular (solo kind=input, opcionalmente static)
 */
@customElement('lib-chip')
export class LibChip extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(chipCss)}`,
  ];

  @property({ type: String, reflect: true })
  kind: ChipKind = 'static';

  @property({ type: String, reflect: true })
  size: ChipSize = 'md';

  @property({ type: String, reflect: true })
  color: ChipColor = 'default';

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  dot = false;

  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel = '';

  @query('.chip-input')
  declare private _inputEl: HTMLElement | null;

  /* ── Toggle ── */
  _handleToggle(): void {
    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('ui-lib-chip-toggle', {
      detail: { selected: this.selected },
      bubbles: true,
      composed: true,
    }));
  }

  /* ── Remove con animación de salida ── */
  _handleRemove(e: MouseEvent): void {
    e.stopPropagation();
    const el = this._inputEl;
    if (!el) {
      this._emitRemove();
      return;
    }
    el.classList.add('is-removing');
    el.addEventListener('animationend', (): void => {
      this._emitRemove();
    }, { once: true });
  }

  private _emitRemove(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-chip-remove', {
      detail: {},
      bubbles: true,
      composed: true,
    }));
  }

  /* ── Animación de entrada (llamar desde fuera si se crea dinámicamente) ── */
  animateIn(): void {
    const el = this._inputEl ?? this.shadowRoot?.querySelector('.chip, .chip-toggle') as HTMLElement | null;
    if (!el) return;
    el.classList.remove('is-entering');
    void el.offsetWidth; // reflow
    el.classList.add('is-entering');
    el.addEventListener('animationend', (): void => el.classList.remove('is-entering'), { once: true });
  }

  protected override render(): TemplateResult {
    return chipTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-chip': LibChip;
  }
}