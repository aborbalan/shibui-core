import { html, nothing, TemplateResult } from 'lit';
import type { ColorPickerVariant, ColorInputMode, SwatchRow, SwatchColor } from './lib-color-picker.types';

/* ── Icono ↺ inline para el mode button ── */
const ROTATE_SVG = html`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 2.5A4.5 4.5 0 1 0 11 6"/>
  <path d="M10 .5v2h2"/>
</svg>`;

/* ── Caret-down para trigger ── */
const CARET_SVG = html`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 4l3 3 3-3"/>
</svg>`;

/* ────────────────────────────────────────────
   Interfaces de props para cada sub-sección
   ──────────────────────────────────────────── */

export interface PickerPanelProps {
  hex:          string;
  r: number; g: number; b: number;
  h: number; s: number; l: number;
  alpha:        number;   // 0–100
  inputMode:    ColorInputMode;
  savedColors:  string[];
  showAlpha:    boolean;
  /** Callbacks */
  onCanvasMousedown: (e: MouseEvent) => void;
  onHueInput:        (e: Event) => void;
  onAlphaInput:      (e: Event) => void;
  onModeToggle:      () => void;
  onHexInput:        (e: Event) => void;
  onRgbInput:        (rIdx: 0|1|2, e: Event) => void;
  onHslInput:        (cIdx: 0|1|2, e: Event) => void;
  onAlphaNumInput:   (e: Event) => void;
  onSaveColor:       () => void;
  onSavedClick:      (hex: string) => void;
  onCancel:          () => void;
  onApply:           () => void;
}

export interface SwatchGridProps {
  rows:     SwatchRow[];
  selected: string;
  onSelect: (color: SwatchColor) => void;
}

/* ────────────────────────────────────────────
   Swatch grid template
   ──────────────────────────────────────────── */
export function swatchGridTemplate(props: SwatchGridProps): TemplateResult {
  const { rows, selected, onSelect } = props;
  return html`
    <div class="cp-swatches">
      ${rows.map(row => html`
        <div class="cp-swatches-row">
          <span class="cp-swatches-label">${row.label}</span>
          ${row.colors.map(c => html`
            <div
              class="cp-swatch ${c.value.toLowerCase() === selected.toLowerCase() ? 'is-selected' : ''}"
              style="background:${c.value};"
              data-name="${c.name ?? ''}"
              @click="${(): void => onSelect(c)}"
              role="button"
              aria-label="${c.name ?? c.value}"
            ></div>
          `)}
        </div>
      `)}
    </div>
  `;
}

/* ────────────────────────────────────────────
   Picker panel template (canvas + sliders + inputs + saved + actions)
   ──────────────────────────────────────────── */
export function pickerPanelTemplate(p: PickerPanelProps): TemplateResult {
  const { hex, r, g, b, h, s, l, alpha, inputMode, savedColors, showAlpha } = p;

  /* Thumb position: x = saturation %, y = inverted lightness % */
  const thumbX = s;
  const thumbY = 100 - l;

  const cssColor = alpha < 100
    ? `rgba(${r},${g},${b},${(alpha / 100).toFixed(2)})`
    : hex;

  const alphaGradient =
    `linear-gradient(to right, transparent, hsl(${h},${s}%,${l}%))`;

  /* Inputs según el modo */
  const inputsBlock: TemplateResult = inputMode === 'hex'
    ? html`
        <div class="cp-input-group" style="flex:3">
          <input class="cp-input" type="text" .value="${hex}" maxlength="7"
            @input="${p.onHexInput}">
          <span class="cp-input-label">HEX</span>
        </div>
        ${showAlpha ? html`
          <div class="cp-input-group" style="flex:1">
            <input class="cp-input" type="number" .value="${String(Math.round(alpha))}" min="0" max="100"
              @input="${p.onAlphaNumInput}">
            <span class="cp-input-label">A%</span>
          </div>` : nothing}
      `
    : inputMode === 'rgb'
    ? html`
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(r)}" min="0" max="255" @input="${(e: Event): void => p.onRgbInput(0, e)}"><span class="cp-input-label">R</span></div>
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(g)}" min="0" max="255" @input="${(e: Event): void => p.onRgbInput(1, e)}"><span class="cp-input-label">G</span></div>
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(b)}" min="0" max="255" @input="${(e: Event): void => p.onRgbInput(2, e)}"><span class="cp-input-label">B</span></div>
        ${showAlpha ? html`<div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(Math.round(alpha))}" min="0" max="100" @input="${p.onAlphaNumInput}"><span class="cp-input-label">A%</span></div>` : nothing}
      `
    : html`
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(h)}" min="0" max="360" @input="${(e: Event): void => p.onHslInput(0, e)}"><span class="cp-input-label">H</span></div>
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(s)}" min="0" max="100" @input="${(e: Event): void => p.onHslInput(1, e)}"><span class="cp-input-label">S%</span></div>
        <div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(l)}" min="0" max="100" @input="${(e: Event): void => p.onHslInput(2, e)}"><span class="cp-input-label">L%</span></div>
        ${showAlpha ? html`<div class="cp-input-group" style="flex:1"><input class="cp-input" type="number" .value="${String(Math.round(alpha))}" min="0" max="100" @input="${p.onAlphaNumInput}"><span class="cp-input-label">A%</span></div>` : nothing}
      `;

  return html`
    <!-- Canvas 2D -->
    <div class="cp-canvas"
      style="background: hsl(${h},100%,50%);"
      @mousedown="${p.onCanvasMousedown}"
    >
      <div class="cp-thumb"
        style="left:${thumbX}%;top:${thumbY}%;background:${cssColor};"
      ></div>
    </div>

    <!-- Sliders -->
    <div class="cp-sliders">
      <div class="cp-preview-dot">
        <div class="cp-preview-color" style="background:${cssColor};"></div>
      </div>
      <div class="cp-sliders-stack">
        <input type="range" class="cp-range cp-range-hue"
          min="0" max="360" .value="${String(h)}"
          @input="${p.onHueInput}">
        ${showAlpha ? html`
          <div class="cp-alpha-wrap" style="height:10px;">
            <div class="cp-alpha-checker">
              <input type="range" class="cp-range cp-range-alpha"
                min="0" max="100" .value="${String(Math.round(alpha))}"
                style="background:${alphaGradient};"
                @input="${p.onAlphaInput}">
            </div>
          </div>` : nothing}
      </div>
    </div>

    <!-- Inputs -->
    <div class="cp-inputs-wrap">
      <button class="cp-mode-btn" title="Cambiar modo" @click="${p.onModeToggle}">
        ${ROTATE_SVG}
      </button>
      <div style="display:flex;gap:var(--lib-space-xs);flex:1;">
        ${inputsBlock}
      </div>
    </div>

    <!-- Saved colors -->
    <div class="cp-saved">
      <span class="cp-saved-label">Guardados</span>
      ${savedColors.map(sc => html`
        <div class="cp-swatch cp-swatch-sm"
          style="background:${sc};"
          data-name="${sc}"
          @click="${(): void => p.onSavedClick(sc)}"
        ></div>
      `)}
      <button class="cp-saved-add" title="Guardar color actual" @click="${p.onSaveColor}">+</button>
    </div>

    <!-- Actions -->
    <div class="cp-actions">
      <button class="cp-btn cp-btn-cancel" @click="${p.onCancel}">Cancelar</button>
      <button class="cp-btn cp-btn-ok" @click="${p.onApply}">Aplicar</button>
    </div>
  `;
}

/* ────────────────────────────────────────────
   Root template — inline vs trigger
   ──────────────────────────────────────────── */

export interface ColorPickerRootProps extends PickerPanelProps {
  variant:    ColorPickerVariant;
  label:      string;
  panelOpen:  boolean;
  onTriggerClick: () => void;
}

export function colorPickerTemplate(props: ColorPickerRootProps): TemplateResult {
  const { variant, /*label,*/ hex, alpha, panelOpen, onTriggerClick } = props;

  const panel = html`
    <div class="cp ${variant === 'trigger' && panelOpen ? 'is-open' : ''}">
      ${pickerPanelTemplate(props)}
    </div>
  `;

  if (variant === 'inline') {
    return panel;
  }

  /* Trigger variant — botón + panel flotante */
  const cssColor = alpha < 100
    ? `rgba(${props.r},${props.g},${props.b},${(alpha / 100).toFixed(2)})`
    : hex;

  return html`
    <div class="cp-trigger-wrap">
      <button
        class="cp-trigger ${panelOpen ? 'is-open' : ''}"
        @click="${onTriggerClick}"
        aria-expanded="${panelOpen}"
        aria-haspopup="true"
      >
        <div class="cp-trigger-dot">
          <div class="cp-trigger-color" style="background:${cssColor};"></div>
        </div>
        <span>${hex.toUpperCase()}</span>
        ${CARET_SVG}
      </button>
      ${panel}
    </div>
  `;
}