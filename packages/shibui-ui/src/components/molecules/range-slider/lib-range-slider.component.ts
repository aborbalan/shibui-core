import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rangeSliderTemplate } from './lib-range-slider.html';
import sliderCss from './lib-range-slider.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type RsSize = 'sm' | 'md' | 'lg';
export type RsTone = 'default' | 'kaki' | 'celadon' | 'error' | 'washi' | 'dark';

export interface RsMark {
  /** Posición 0–100 sobre el track */
  pct: number;
  /** Etiqueta opcional bajo la marca */
  label?: string;
}

/**
 * @element lib-range-slider
 *
 * Control de selección de valor numérico — single, dual y vertical.
 *
 * @prop value      — valor actual (modo single)
 * @prop value-min  — valor inferior (modo dual)
 * @prop value-max  — valor superior (modo dual)
 * @prop dual       — activa dos thumbs para rango min/max
 * @prop vertical   — orientación vertical
 * @prop tooltip    — globito flotante sobre el thumb (solo single horizontal)
 * @prop marks      — JSON string de marcas: '[{"pct":0,"label":"XS"},...]'
 * @prop show-limits — muestra min/max labels bajo el track
 * @prop limit-min / limit-max — texto personalizado de los extremos
 *
 * @fires ui-lib-change — { value } (single) | { valueMin, valueMax } (dual)
 *
 * @example single
 * <lib-range-slider label="Volumen" value="48" unit="%" show-limits></lib-range-slider>
 *
 * @example dual
 * <lib-range-slider dual label="Precio" value-min="120" value-max="480"
 *   unit="€" show-limits limit-min="0 €" limit-max="500 €" tone="kaki">
 * </lib-range-slider>
 *
 * @example vertical
 * <lib-range-slider vertical tone="kaki" value="80" label="Bajo"
 *   style="height:220px"></lib-range-slider>
 */
@customElement('lib-range-slider')
export class LibRangeSlider extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(sliderCss)}`,
  ];

  /* ── Range attrs ─────────────────────────────────────── */
  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  step = 1;

  /* ── Values ──────────────────────────────────────────── */
  /** Valor actual — modo single. */
  @property({ type: Number })
  value = 50;

  /** Límite inferior — modo dual. */
  @property({ type: Number, attribute: 'value-min' })
  valueMin = 25;

  /** Límite superior — modo dual. */
  @property({ type: Number, attribute: 'value-max' })
  valueMax = 75;

  /* ── Modes ───────────────────────────────────────────── */
  @property({ type: Boolean, reflect: true })
  dual = false;

  @property({ type: Boolean, reflect: true })
  vertical = false;

  /* ── Appearance ──────────────────────────────────────── */
  @property({ type: String, reflect: true })
  size: RsSize = 'md';

  @property({ type: String, reflect: true })
  tone: RsTone = 'default';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /* ── Display ─────────────────────────────────────────── */
  @property({ type: String })
  label = '';

  @property({ type: String })
  unit = '';

  @property({ type: Boolean, attribute: 'show-limits' })
  showLimits = false;

  /** Texto personalizado extremo izquierdo/abajo. Por defecto: `min`. */
  @property({ type: String, attribute: 'limit-min' })
  limitMin = '';

  /** Texto personalizado extremo derecho/arriba. Por defecto: `max`. */
  @property({ type: String, attribute: 'limit-max' })
  limitMax = '';

  /* ── Extras ──────────────────────────────────────────── */
  /** Globito flotante sobre el thumb (solo modo single horizontal). */
  @property({ type: Boolean })
  tooltip = false;

  /**
   * Marcas de paso como JSON string.
   * Formato: '[{"pct":0,"label":"XS"},{"pct":25,"label":"S"},...]'
   * `pct` = posición 0–100 sobre el track. `label` es opcional.
   */
  @property({ type: String })
  marks = '';

  /* ── Computed ────────────────────────────────────────── */
  private _pct(v: number): number {
    const clamped = Math.min(Math.max(v, this.min), this.max);
    return ((clamped - this.min) / (this.max - this.min)) * 100;
  }

  private get _parsedMarks(): RsMark[] {
    if (!this.marks) return [];
    try { return JSON.parse(this.marks) as RsMark[]; }
    catch { return []; }
  }

  /* ── Handlers ────────────────────────────────────────── */
  private _onInput(e: Event): void {
    this.value = parseFloat((e.target as HTMLInputElement).value);
    this._dispatchChange();
  }

  private _onInputMin(e: Event): void {
    const v = parseFloat((e.target as HTMLInputElement).value);
    this.valueMin = Math.min(v, this.valueMax - this.step);
    this._dispatchChange();
  }

  private _onInputMax(e: Event): void {
    const v = parseFloat((e.target as HTMLInputElement).value);
    this.valueMax = Math.max(v, this.valueMin + this.step);
    this._dispatchChange();
  }

  private _dispatchChange(): void {
    const detail = this.dual
      ? { valueMin: this.valueMin, valueMax: this.valueMax }
      : { value: this.value };

    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  override render(): TemplateResult {
    return rangeSliderTemplate({
      size:     this.size,
      tone:     this.tone,
      dual:     this.dual,
      vertical: this.vertical,
      disabled: this.disabled,
      tooltip:  this.tooltip,
      min:      this.min,
      max:      this.max,
      step:     this.step,
      value:    this.value,
      valueMin: this.valueMin,
      valueMax: this.valueMax,
      pct:      this._pct(this.value),
      minPct:   this._pct(this.valueMin),
      maxPct:   this._pct(this.valueMax),
      label:        this.label,
      unit:         this.unit,
      showLimits:   this.showLimits,
      limitMinText: this.limitMin  || String(this.min),
      limitMaxText: this.limitMax  || String(this.max),
      marks:        this._parsedMarks,
      onInput:    this._onInput.bind(this),
      onInputMin: this._onInputMin.bind(this),
      onInputMax: this._onInputMax.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-range-slider': LibRangeSlider;
  }
}