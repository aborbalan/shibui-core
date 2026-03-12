import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { buttonLiquidTemplate } from './lib-liquid-button.html';
import liquidCss from './lib-liquid-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { LIQUID_PALETTES } from './lib-liquid-button.types';
import type { LiquidVariant, LiquidSize } from './lib-liquid-button.types';

/* ============================================================
   WaterPhysics — clase interna de física de canvas
   Portada desde el SG-41 (vanilla JS → TypeScript puro)
   ============================================================ */
class WaterPhysics {
  private btn:        HTMLElement;
  private canvas:     HTMLCanvasElement;
  private ctx:        CanvasRenderingContext2D;

  /* Colores */
  private wr: number; private wg: number; private wb: number;
  private rr: number; private rg: number; private rb: number;

  /* Estado */
  private fill       = 0;
  private targetFill = 0;
  private fillSpeed  = 0.032;
  private shimmerX   = -1;
  private t          = 0;
  private hovered    = false;
  private raf        = 0;

  /* Física de onda */
  private readonly A  = 3.5;
  private readonly f1 = 0.038;
  private readonly f2 = 0.063;
  private readonly s1 = 1.8;
  private readonly s2 = 1.2;

  private W = 0;
  private H = 0;

  private ripples: Array<{
    x: number; y: number;
    radius: number; maxRadius: number;
    speed: number; lineWidth: number;
    opacity: number;
  }> = [];

  constructor(
    btn: HTMLElement,
    canvas: HTMLCanvasElement,
    water: [number, number, number],
    ripple: [number, number, number],
  ) {
    this.btn    = btn;
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d')!;
    [this.wr, this.wg, this.wb] = water;
    [this.rr, this.rg, this.rb] = ripple;

    this.resize();
    this.loop();
  }

  /* ── Dimensiones con DPR ── */
  resize(): void {
    const r   = this.btn.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.W = r.width;
    this.H = r.height;
    this.canvas.width          = this.W * dpr;
    this.canvas.height         = this.H * dpr;
    this.canvas.style.width    = `${this.W}px`;
    this.canvas.style.height   = `${this.H}px`;
    this.ctx.scale(dpr, dpr);
  }

  /* ── Spawn de ripple ── */
  spawnRipple(
    x: number, y: number,
    { speed = 2.2, maxR, lineWidth = 1.2 }:
    { speed?: number; maxR?: number; lineWidth?: number } = {},
  ): void {
    const diag = Math.sqrt(this.W ** 2 + this.H ** 2);
    this.ripples.push({
      x, y,
      radius:    0,
      maxRadius: maxR ?? diag * 0.72,
      speed,
      lineWidth,
      opacity:   0,
    });
  }

  /* ── Eventos públicos — llamados por el componente Lit ── */
  onMouseEnter(x: number, y: number): void {
    this.hovered    = true;
    this.targetFill = 1;
    this.fillSpeed  = 0.028;
    this.shimmerX   = -0.3;

    this.spawnRipple(x, y, { speed: 3.2, lineWidth: 1.8 });
    setTimeout((): void => this.spawnRipple(x, y, { speed: 2.0, lineWidth: 1.1 }), 80);
    setTimeout((): void => this.spawnRipple(x, y, { speed: 1.3, lineWidth: 0.7 }), 180);
  }

  onMouseLeave(): void {
    this.hovered    = false;
    this.targetFill = 0;
    this.fillSpeed  = 0.048;
  }

  onMouseDown(cx: number, cy: number): void {
    for (let i = 0; i < 3; i++) {
      setTimeout((): void => {
        this.spawnRipple(cx, cy, {
          speed:     4 - i * 0.8,
          maxR:      this.W * 0.5,
          lineWidth: 2 - i * 0.4,
        });
      }, i * 40);
    }
  }

  /* ── Dibujo ── */
  private drawWave(): void {
    const { ctx, W, H, A, f1, f2, s1, s2, t, wr, wg, wb, fill } = this;
    if (fill <= 0.001) return;

    const baseY = H * (1 - fill);

    /* Cuerpo sinusoidal */
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, baseY);
    for (let x = 0; x <= W; x++) {
      const y = baseY
        + A * Math.sin(x * f1 + t * s1)
        + A * 0.45 * Math.sin(x * f2 - t * s2);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();

    /* Gradiente vertical */
    const grad = ctx.createLinearGradient(0, baseY - A * 2, 0, H);
    grad.addColorStop(0,   `rgba(${wr},${wg},${wb},0.82)`);
    grad.addColorStop(0.4, `rgba(${wr},${wg},${wb},0.92)`);
    grad.addColorStop(1,   `rgba(${wr},${wg},${wb},0.98)`);
    ctx.fillStyle = grad;
    ctx.fill();

    /* Shimmer diagonal */
    if (this.shimmerX > -0.5 && this.shimmerX < 1.5) {
      const sx = W * this.shimmerX;
      const sg = ctx.createLinearGradient(sx - 40, 0, sx + 40, 0);
      sg.addColorStop(0,   'rgba(255,255,255,0)');
      sg.addColorStop(0.5, 'rgba(255,255,255,0.12)');
      sg.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, Math.max(0, baseY - 4), W, H - Math.max(0, baseY - 4));
    }
  }

  private drawRipples(): void {
    const { ctx, rr, rg, rb } = this;
    this.ripples = this.ripples.filter(r => r.opacity > 0 || r.radius === 0);

    for (const r of this.ripples) {
      r.radius += r.speed;
      r.opacity = Math.max(0, 1 - r.radius / r.maxRadius);

      /* Anillo principal */
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${r.opacity * 0.9})`;
      ctx.lineWidth   = r.lineWidth;
      ctx.stroke();

      /* Segundo anillo interior más fino */
      if (r.radius > 6) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rr},${rg},${rb},${r.opacity * 0.4})`;
        ctx.lineWidth   = r.lineWidth * 0.5;
        ctx.stroke();
      }
    }

    /* Limpiar ripples agotados */
    this.ripples = this.ripples.filter(r => r.opacity > 0);
  }

  /* ── Loop principal ── */
  private loop(): void {
    const tick = (): void => {
      this.raf = requestAnimationFrame(tick);
      const { ctx, W, H } = this;
      this.t += 0.04;

      /* Lerp fill */
      const diff = this.targetFill - this.fill;
      this.fill += diff * this.fillSpeed * 2.8;
      if (Math.abs(diff) < 0.0005) this.fill = this.targetFill;

      /* Shimmer avanza */
      if (this.hovered && this.shimmerX < 1.6) {
        this.shimmerX += 0.012;
      }

      /* Skip si todo en reposo */
      if (this.fill <= 0.001 && this.ripples.length === 0) return;

      ctx.clearRect(0, 0, W, H);
      this.drawWave();
      this.drawRipples();
    };
    this.raf = requestAnimationFrame(tick);
  }

  /* ── Cleanup ── */
  destroy(): void {
    cancelAnimationFrame(this.raf);
  }
}


/* ============================================================
   LIB-BUTTON-LIQUID — Web Component
   ============================================================ */

/**
 * Botón con física de agua en canvas.
 *
 * @prop variant  — 'ink' | 'washi' | 'kaki' | 'celadon' | 'ghost' | 'danger'
 * @prop size     — 'sm' | 'md' | 'lg'
 * @prop disabled — bloquea interacción y detiene el canvas
 * @prop loading  — muestra spinner, bloquea interacción
 * @prop dark     — ajusta colores en surface oscura
 * @prop block    — ancho 100%
 *
 * Slots: default · prefix · suffix
 * @fires ui-lib-click — {detail: { originalEvent: MouseEvent }}
 */
@customElement('lib-button-liquid')
export class LibButtonLiquid extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(liquidCss)}`,
  ];

  @property({ type: String, reflect: true })
  variant: LiquidVariant = 'ink';

  @property({ type: String, reflect: true })
  size: LiquidSize = 'md';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  block = false;

  @query('.btn')
  declare private _btn: HTMLButtonElement;

  private _physics: WaterPhysics | null = null;
  private _canvas:  HTMLCanvasElement   | null = null;
  private _ro:      ResizeObserver      | null = null;

  /* ── Lifecycle ── */

  override firstUpdated(): void {
    this._initCanvas();
  }

  override updated(changed: Map<string, unknown>): void {
    /* Si cambia la variante, reconstruir physics con nueva paleta */
    if (changed.has('variant')) {
      this._destroyCanvas();
      this._initCanvas();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._destroyCanvas();
    this._ro?.disconnect();
  }

  /* ── Canvas setup ── */

  private _initCanvas(): void {
    if (!this._btn) return;

    /* Crear canvas y añadirlo como primer hijo del botón (bajo .btn-inner) */
    const canvas   = document.createElement('canvas');
    this._canvas   = canvas;
    this._btn.insertBefore(canvas, this._btn.firstChild);

    const palette  = LIQUID_PALETTES[this.variant];
    this._physics  = new WaterPhysics(this._btn, canvas, palette.water, palette.ripple);

    /* ResizeObserver para adaptar canvas al tamaño real del botón */
    this._ro = new ResizeObserver((): void => this._physics?.resize());
    this._ro.observe(this._btn);
  }

  private _destroyCanvas(): void {
    this._physics?.destroy();
    this._physics = null;
    this._canvas?.remove();
    this._canvas = null;
    this._ro?.disconnect();
    this._ro = null;
  }

  /* ── Eventos del canvas — llamados desde el template ── */

  _onMouseEnter(e: MouseEvent): void {
    if (this.disabled || this.loading) return;
    const rect = this._btn.getBoundingClientRect();
    this._physics?.onMouseEnter(e.clientX - rect.left, e.clientY - rect.top);
  }

  _onMouseLeave(): void {
    this._physics?.onMouseLeave();
  }

  _onMouseDown(e: MouseEvent): void {
    if (this.disabled || this.loading) return;
    const rect = this._btn.getBoundingClientRect();
    this._physics?.onMouseDown(e.clientX - rect.left, e.clientY - rect.top);

    this.dispatchEvent(new CustomEvent('ui-lib-click', {
      detail: { originalEvent: e },
      bubbles: true,
      composed: true,
    }));
  }

  /* ── Render ── */
  protected override render(): TemplateResult {
    return buttonLiquidTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-button-liquid': LibButtonLiquid;
  }
}