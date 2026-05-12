import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { progressTemplate } from './lib-progress.html';
import progressCss from './lib-progress.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { ProgressSize, ProgressTone, ProgressSegment } from './lib-progress.types';

/**
 * @element lib-progress
 *
 * Barra de progreso lineal del sistema Shibui.
 *
 * Modos:
 *  - Simple bar          → valor 0-100 con prop `value`
 *  - Con meta            → añade `label` y/o `value-label`
 *  - Multi-segmento      → prop `segments` (JSON)
 *
 * @attr value          — Valor actual (0–max). Default 0.
 * @attr max            — Valor máximo. Default 100.
 * @attr size           — xs · sm · md · lg · xl. Default md.
 * @attr tone           — default · kaki · celadon · error. Default default.
 * @attr indeterminate  — Duración desconocida; animación continua.
 * @attr striped        — Relleno con diagonales sutiles.
 * @attr square         — Bordes rectos (radius-sm) en lugar de full.
 * @attr label          — Etiqueta sobre la barra.
 * @attr value-label    — Texto libre junto al label (ej: "3.4 MB / 7 MB").
 * @attr show-value     — Muestra el % calculado junto al label (ignorado si value-label está presente).
 * @attr sub            — Texto secundario bajo la barra (DM Mono, 10px).
 * @attr segments       — JSON: ProgressSegment[]. Activa modo multi-segmento.
 */
@customElement('lib-progress')
export class LibProgress extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(progressCss)}`,
  ];

  /* ── Bar config ── */
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max   = 100;

  @property({ type: String, reflect: true }) size: ProgressSize = 'md';
  @property({ type: String, reflect: true }) tone: ProgressTone = 'default';

  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) striped       = false;
  @property({ type: Boolean, reflect: true }) square        = false;

  /* ── Meta ── */
  @property({ type: String }) label       = '';
  @property({ type: String, attribute: 'value-label' }) valueLabel = '';
  @property({ type: String }) sub         = '';
  @property({ type: Boolean, attribute: 'show-value' }) showValue  = false;

  /* ── Multi-segment (JSON string) ── */
  @property({ type: String }) segments = '';

  /* ── a11y ── */
  @property({ type: String, attribute: 'aria-label' }) override ariaLabel: string | null = null;

  override render(): TemplateResult {
    const percent = this.indeterminate
      ? 100
      : Math.min(Math.max((this.value / (this.max || 100)) * 100, 0), 100);

    let parsedSegments: ProgressSegment[] = [];
    if (this.segments) {
      try {
        parsedSegments = JSON.parse(this.segments) as ProgressSegment[];
      } catch {
        console.warn('[lib-progress] Invalid JSON in `segments` prop.');
      }
    }

    return progressTemplate({
      percent,
      size:          this.size,
      tone:          this.tone,
      indeterminate: this.indeterminate,
      striped:       this.striped,
      square:        this.square,

      label:      this.label,
      valueLabel: this.valueLabel,
      sub:        this.sub,
      showValue:  this.showValue,

      segments: parsedSegments,

      ariaLabel: this.ariaLabel ?? this.label,
      rawValue:  this.value,
      max:       this.max,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-progress': LibProgress;
  }
}