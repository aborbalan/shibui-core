import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import pickerCss from './lib-color-picker.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { colorPickerTemplate, swatchGridTemplate } from './lib-color-picker.html';
import { SHIBUI_SWATCHES } from './lib-color-picker.types';
import type {
  ColorPickerVariant,
  ColorInputMode,
  SwatchRow,
  SwatchColor,
  ColorState,
} from './lib-color-picker.types';

/* ──────────────────────────────────────
   Color conversion utilities
   ────────────────────────────────────── */
function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const k  = (n: number): number => (n + h / 30) % 12;
  const a  = sl * Math.min(ll, 1 - ll);
  const f  = (n: number): number =>
    ll - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + ([f(0), f(8), f(4)] as number[])
    .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255; const gn = g / 255; const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0; let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn)      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else                 h = ((rn - gn) / d + 4) / 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function isValidHex(v: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

/**
 * @element lib-color-picker
 *
 * Selector de color con canvas 2D (saturación/luminosidad), slider de tono,
 * slider de opacidad, inputs HEX/RGB/HSL intercambiables y colores guardados.
 *
 * @prop {string}             value     — Color inicial en HEX (#RRGGBB)
 * @prop {ColorPickerVariant} variant   — inline · trigger (default: inline)
 * @prop {boolean}            show-alpha— Mostrar slider y campo de opacidad
 * @prop {boolean}            dark      — Modo oscuro
 * @prop {boolean}            disabled  — Desactivado
 * @prop {string}             label     — Texto del trigger (variant=trigger)
 * @prop {string}             saved     — Colores guardados iniciales (JSON array)
 *
 * @fires ui-lib-change       — {detail: {value: string, hex: string, r, g, b, h, s, l, alpha}}
 * @fires ui-lib-apply        — Igual a change pero solo al pulsar "Aplicar"
 * @fires ui-lib-swatch-click — {detail: {value: string, name?: string}} al clickar un swatch
 *
 * @method getValue()   — Devuelve el color actual como {hex, r, g, b, h, s, l, alpha}
 * @method setValue(hex)— Establece el color programáticamente
 */
@customElement('lib-color-picker')
export class LibColorPicker extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(pickerCss)}`,
  ];

  /* ── Props ── */

  @property({ type: String })
  value = '#B85A1E';

  @property({ type: String, reflect: true })
  variant: ColorPickerVariant = 'inline';

  @property({ type: Boolean, reflect: true, attribute: 'show-alpha' })
  showAlpha = false;

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  label = '';

  /** Colores guardados iniciales — JSON array, e.g. '["#B85A1E","#357164"]' */
  @property({ type: String })
  saved = '';

  /* ── Internal state ── */

  @state() private _cs: ColorState = { h: 25, s: 70, l: 36, alpha: 100 };
  @state() private _inputMode: ColorInputMode = 'hex';
  @state() private _open = false;
  @state() private _savedColors: string[] = [];

  /** Color anterior al abrir, para cancelar */
  private _prevCs: ColorState = { ...this._cs };

  /** Dragging en el canvas */
  private _dragging = false;

  /* ── Lifecycle ── */

  override connectedCallback(): void {
    super.connectedCallback();
    this._initFromValue(this.value);

    if (this.saved) {
      try { this._savedColors = JSON.parse(this.saved) as string[]; }
      catch { /* ignore */ }
    }

    document.addEventListener('mouseup',   this._onDocMouseUp);
    document.addEventListener('mousemove', this._onDocMouseMove);
    document.addEventListener('click',     this._onDocClick);
    document.addEventListener('keydown',   this._onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('mouseup',   this._onDocMouseUp);
    document.removeEventListener('mousemove', this._onDocMouseMove);
    document.removeEventListener('click',     this._onDocClick);
    document.removeEventListener('keydown',   this._onKeyDown);
  }

  /* ── API pública ── */

  /** Devuelve el color actual en todos los formatos */
  public getValue(): { hex: string; r: number; g: number; b: number; h: number; s: number; l: number; alpha: number } {
    return this._buildColorResult();
  }

  /** Establece el color desde hex */
  public setValue(hex: string): void {
    this._initFromValue(hex);
    this.requestUpdate();
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    const res = this._buildColorResult();

    return colorPickerTemplate({
      variant:   this.variant,
      label:     this.label || res.hex,
      panelOpen: this._open,
      hex: res.hex, r: res.r, g: res.g, b: res.b,
      h: res.h, s: res.s, l: res.l,
      alpha: res.alpha,
      inputMode:   this._inputMode,
      savedColors: this._savedColors,
      showAlpha:   this.showAlpha,

      onTriggerClick:    (): void                        => this._togglePanel(),
      onCanvasMousedown: (e: MouseEvent): void           => this._startCanvasDrag(e),
      onHueInput:        (e: Event): void                => this._onHueInput(e),
      onAlphaInput:      (e: Event): void                => this._onAlphaSliderInput(e),
      onModeToggle:      (): void                        => this._cycleMode(),
      onHexInput:        (e: Event): void                => this._onHexInput(e),
      onRgbInput:        (idx: 0|1|2, e: Event): void   => this._onRgbInput(idx, e),
      onHslInput:        (idx: 0|1|2, e: Event): void   => this._onHslInput(idx, e),
      onAlphaNumInput:   (e: Event): void                => this._onAlphaNumInput(e),
      onSaveColor:       (): void                        => this._saveCurrentColor(),
      onSavedClick:      (hex: string): void             => this._applySavedColor(hex),
      onCancel:          (): void                        => this._cancel(),
      onApply:           (): void                        => this._apply(),
    });
  }

  /* ── Canvas drag ── */

  private _startCanvasDrag(e: MouseEvent): void {
    this._dragging = true;
    this._updateFromCanvasEvent(e);
  }

  private _onDocMouseMove = (e: MouseEvent): void => {
    if (!this._dragging) return;
    this._updateFromCanvasEvent(e);
  };

  private _onDocMouseUp = (): void => { this._dragging = false; };

  private _updateFromCanvasEvent(e: MouseEvent): void {
    const canvas = this.shadowRoot?.querySelector('.cp-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left)  / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    this._cs = {
      ...this._cs,
      s: Math.round(x * 100),
      l: Math.round((1 - y) * 100),
    };
    this._emitChange();
  }

  /* ── Sliders ── */

  private _onHueInput(e: Event): void {
    this._cs = { ...this._cs, h: parseInt((e.target as HTMLInputElement).value) };
    this._emitChange();
  }

  private _onAlphaSliderInput(e: Event): void {
    this._cs = { ...this._cs, alpha: parseInt((e.target as HTMLInputElement).value) };
    this._emitChange();
  }

  /* ── Input mode ── */

  private _cycleMode(): void {
    const modes: ColorInputMode[] = ['hex', 'rgb', 'hsl'];
    const i = modes.indexOf(this._inputMode);
    this._inputMode = modes[(i + 1) % modes.length]!;
  }

  /* ── Text inputs ── */

  private _onHexInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    if (isValidHex(v)) {
      const hsl = hexToHsl(v);
      this._cs = { ...this._cs, ...hsl };
      this._emitChange();
    }
  }

  private _onRgbInput(idx: 0|1|2, e: Event): void {
    const val = parseInt((e.target as HTMLInputElement).value) || 0;
    const clamped = Math.max(0, Math.min(255, val));
    const { r, g, b } = hexToRgb(this._buildHex());
    const rgb: [number, number, number] = [r, g, b];
    rgb[idx] = clamped;
    const hex = '#' + (rgb as number[]).map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    const hsl = hexToHsl(hex);
    this._cs = { ...this._cs, ...hsl };
    this._emitChange();
  }

  private _onHslInput(idx: 0|1|2, e: Event): void {
    const val = parseInt((e.target as HTMLInputElement).value) || 0;
    const maxes: [number, number, number] = [360, 100, 100];
    const clamped = Math.max(0, Math.min(maxes[idx]!, val));
    const next = { ...this._cs };
    if (idx === 0) next.h = clamped;
    else if (idx === 1) next.s = clamped;
    else next.l = clamped;
    this._cs = next;
    this._emitChange();
  }

  private _onAlphaNumInput(e: Event): void {
    const val = parseInt((e.target as HTMLInputElement).value) || 0;
    this._cs = { ...this._cs, alpha: Math.max(0, Math.min(100, val)) };
    this._emitChange();
  }

  /* ── Saved colors ── */

  private _saveCurrentColor(): void {
    const hex = this._buildHex();
    if (!this._savedColors.includes(hex)) {
      this._savedColors = [...this._savedColors, hex];
    }
  }

  private _applySavedColor(hex: string): void {
    this._initFromValue(hex);
    this._emitChange();
  }

  /* ── Panel (trigger mode) ── */

  private _togglePanel(): void {
    if (this._open) {
      this._cancel();
    } else {
      this._prevCs = { ...this._cs };
      this._open = true;
    }
  }

  private _cancel(): void {
    this._cs = { ...this._prevCs };
    this._open = false;
  }

  private _apply(): void {
    this._open = false;
    this.dispatchEvent(new CustomEvent('ui-lib-apply', {
      detail: this._buildColorResult(),
      bubbles: true,
      composed: true,
    }));
  }

  /* ── Close on outside click / Escape ── */

  private _onDocClick = (e: MouseEvent): void => {
    if (this.variant !== 'trigger' || !this._open) return;
    if (!this.contains(e.target as Node) && !(this.shadowRoot?.contains(e.target as Node) ?? false)) {
      this._cancel();
    }
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._open) this._cancel();
  };

  /* ── Helpers ── */

  private _initFromValue(hex: string): void {
    if (!isValidHex(hex)) return;
    const hsl = hexToHsl(hex);
    this._cs = { ...this._cs, ...hsl };
  }

  private _buildHex(): string {
    return hslToHex(this._cs.h, this._cs.s, this._cs.l);
  }

  private _buildColorResult(): { hex: string; r: number; g: number; b: number; h: number; s: number; l: number; alpha: number } {
    const hex = this._buildHex();
    const { r, g, b } = hexToRgb(hex);
    return { hex, r, g, b, ...this._cs };
  }

  private _emitChange(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail: this._buildColorResult(),
      bubbles: true,
      composed: true,
    }));
  }
}

/* ──────────────────────────────────────
   Swatch-only component
   ────────────────────────────────────── */

/**
 * @element lib-color-swatches
 *
 * Cuadrícula de swatches de color. Puede usarse de forma independiente o
 * para mostrar la paleta del design system.
 *
 * @prop {boolean} dark
 * @prop {string}  value — Color seleccionado (hex)
 *
 * @fires ui-lib-swatch-click — {detail: {value, name}}
 */
@customElement('lib-color-swatches')
export class LibColorSwatches extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(pickerCss)}`,
  ];

  @property({ type: Boolean, reflect: true }) dark     = false;
  @property({ type: String })                 value    = '';
  @property({ type: String })                 rowsJson = '';

  protected override render(): TemplateResult {
    let rows: SwatchRow[] = SHIBUI_SWATCHES;
    if (this.rowsJson) {
      try { rows = JSON.parse(this.rowsJson) as SwatchRow[]; } catch { /* ignore */ }
    }
    return swatchGridTemplate({
      rows,
      selected: this.value,
      onSelect: (c: SwatchColor): void => {
        this.value = c.value;
        this.dispatchEvent(new CustomEvent('ui-lib-swatch-click', {
          detail: c, bubbles: true, composed: true,
        }));
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-color-picker':  LibColorPicker;
    'lib-color-swatches': LibColorSwatches;
  }
}