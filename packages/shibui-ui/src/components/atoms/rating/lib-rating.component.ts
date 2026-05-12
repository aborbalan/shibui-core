import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ratingTemplate } from './lib-rating.html';
import ratingCss from './lib-rating.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { RatingSize, RatingColor, RatingIcon } from './lib-rating.types';

/**
 * lib-rating — Shibui UI · SG-19
 *
 * @prop value       — Valor actual (0–max). Soporta decimales en readonly para half-star.
 * @prop max         — Máximo de items (default 5)
 * @prop size        — 'xs' | 'sm' | 'md'(default) | 'lg' | 'xl'
 * @prop color       — 'gold'(default) | 'kaki' | 'washi' | 'celadon'
 * @prop icon        — 'star'(default) | 'heart' | 'diamond'
 * @prop readonly    — Solo display, sin interacción
 * @prop disabled    — Opacity 0.4, sin interacción
 * @prop show-count  — Muestra el valor numérico junto a las estrellas
 * @prop count       — Número de reseñas a mostrar junto al valor numérico
 *
 * @fires ui-lib-rating-change — { detail: { value: number, prev: number } }
 */
@customElement('lib-rating')
export class LibRating extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(ratingCss)}`,
  ];

  @property({ type: Number, reflect: true })
  value = 0;

  @property({ type: Number })
  max = 5;

  @property({ type: String, reflect: true })
  size: RatingSize = 'md';

  @property({ type: String, reflect: true })
  color: RatingColor = 'gold';

  @property({ type: String })
  icon: RatingIcon = 'star';

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, attribute: 'show-count' })
  showCount = false;

  @property({ type: Number })
  count: number | null = null;

  /* ── Estado interno de hover ── */
  @state() _hoverValue = 0;

  /* ── ID del timeout de pop animation ── */
  private _popTimer: ReturnType<typeof setTimeout> | null = null;

  /* ════════════════════════════════════════
     Manejadores de eventos (llamados desde html.ts)
     ════════════════════════════════════════ */

  _onEnter(pos: number): void {
    if (this.readonly || this.disabled) return;
    this._hoverValue = pos;
  }

  _onLeave(): void {
    this._hoverValue = 0;
  }

  _onClick(pos: number): void {
    if (this.readonly || this.disabled) return;

    /* Toggle: clic en la estrella activa → reset a 0 */
    const prev = this.value;
    this.value = this.value === pos ? 0 : pos;

    /* Animación pop */
    this._triggerPop(pos);

    this.dispatchEvent(new CustomEvent('ui-lib-rating-change', {
      detail: { value: this.value, prev },
      bubbles: true,
      composed: true,
    }));
  }

  _onKeyItem(e: KeyboardEvent, pos: number): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onClick(pos);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      this._focusItem(pos + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusItem(pos - 1);
    }
  }

  /* ── Focus al item por posición ── */
  private _focusItem(pos: number): void {
    const clamped = Math.min(Math.max(1, pos), this.max);
    const items = this.shadowRoot?.querySelectorAll<HTMLElement>('.rt-item:not(.rt-item-half)');
    items?.[clamped - 1]?.focus();
  }

  /* ── Añade clase is-pop y la quita tras la animación ── */
  private _triggerPop(pos: number): void {
    if (this._popTimer) clearTimeout(this._popTimer);

    const items = this.shadowRoot?.querySelectorAll<HTMLElement>('.rt-item');
    items?.forEach((el, idx) => {
      if (idx + 1 <= pos) el.classList.add('is-pop');
    });

    this._popTimer = setTimeout(() => {
      items?.forEach(el => el.classList.remove('is-pop'));
    }, 350);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._popTimer) clearTimeout(this._popTimer);
  }

  protected override render(): TemplateResult {
    return ratingTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-rating': LibRating;
  }
}