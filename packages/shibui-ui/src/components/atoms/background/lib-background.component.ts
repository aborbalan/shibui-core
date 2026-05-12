import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import backgroundCss from './lib-background.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { backgroundTemplate } from './lib-background.html';
import { BG_CANVAS_VARIANTS } from './lib-background.types';
import type { LibBackgroundVariant } from './lib-background.types';

/**
 * @element lib-background
 *
 * Fondo decorativo con 34 variantes. Úsalo como contenedor raíz
 * de secciones, heroes, cards o paneles. El contenido se coloca
 * en el slot por defecto.
 *
 * @prop {LibBackgroundVariant} variant — Fondo activo (default: 'washi')
 * @prop {boolean}              paused  — Pausa animaciones CSS (a11y)
 *
 * @csspart base    — div de fondo CSS
 * @csspart overlay — div de overlay / grano / animación
 * @csspart canvas  — canvas 2D generativo
 * @csspart content — contenedor del slot
 *
 * @slot — Contenido que se renderiza sobre el fondo
 */
@customElement('lib-background')
export class LibBackground extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(backgroundCss)}`,
  ];

  /* ── Props públicas ── */

  @property({ type: String, reflect: true })
  variant: LibBackgroundVariant = 'washi';

  @property({ type: Boolean, reflect: true })
  paused = false;

  /* ── Canvas internal state ── */

  @query('.bg-canvas') private declare _canvas: HTMLCanvasElement;

  private _raf = 0;
  private _ro: ResizeObserver | null = null;

  /* ── Ciclo de vida ── */

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopCanvas();
  }

  protected override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('variant')) {
      this._stopCanvas();
      if (BG_CANVAS_VARIANTS.has(this.variant)) {
        // Esperar al next tick para que el canvas exista en el DOM
        requestAnimationFrame((): void => this._startCanvas());
      }
    }
  }

  /* ── Canvas lifecycle ── */

  private _stopCanvas(): void {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._ro)  { this._ro.disconnect(); this._ro = null; }
  }

  private _startCanvas(): void {
    const canvas = this._canvas;
    if (!canvas) return;
 
    switch (this.variant) {
      case 'particles':     this._initParticles(canvas);     break;
      case 'rain':          this._initRain(canvas);           break;
      case 'wave-mesh':     this._initWaveMesh(canvas);       break;
      case 'constellation': this._initConstellation(canvas);  break;
      case 'fireflies':     this._initFireflies(canvas);      break;
      case 'ink-wash':      this._initInkWash(canvas);        break;
      default: break;
    }
  }

  /* ── Canvas: Particle Field ── */
  private _initParticles(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    // ✅ Fix: renderRoot es ShadowRoot en runtime — cast explícito para acceder a .host
    const host = ((this.renderRoot as ShadowRoot).host as HTMLElement);
    let W = 0, H = 0;

    const COUNT  = 55;
    // ✅ Fix: tipo explícito string[] — evita string | undefined en el acceso por índice
    const COLORS: string[] = ['rgba(217,114,52,', 'rgba(78,148,130,', 'rgba(250,247,244,'];

    type Particle = { x:number; y:number; r:number; vx:number; vy:number; a:number; c:string };
    let pts: Particle[] = [];

    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
      pts = Array.from({ length: COUNT }, (): Particle => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a:  Math.random() * 0.4 + 0.15,
        // ✅ Fix: COLORS es string[] → el acceso ya no devuelve undefined
        c:  COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'rgba(250,247,244,',
      }));
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          // ✅ Fix: destructurar con ! — los índices son seguros por los límites del bucle
          const pi = pts[i]!;
          const pj = pts[j]!;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(250,247,244,${0.04 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}${p.a})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      this._raf = requestAnimationFrame(draw);
    };

    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  private _initFireflies(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    const host = (this.renderRoot as ShadowRoot).host as HTMLElement;
    let W = 0, H = 0;
 
    const COUNT = 32;
    const COLORS: string[] = [
      'rgba(250,247,244,',
      'rgba(250,247,244,',
      'rgba(217,114,52,',
      'rgba(78,148,130,',
    ];
 
    type Fly = {
      x: number; y: number; r: number;
      a: number; da: number;
      dx: number; dy: number;
      phase: number; col: string;
    };
    let flies: Fly[] = [];
 
    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
      flies = Array.from({ length: COUNT }, (): Fly => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 2 + 0.8,
        a:     Math.random(),
        da:    (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        dx:    (Math.random() - 0.5) * 0.18,
        dy:    -(Math.random() * 0.25 + 0.08),
        phase: Math.random() * Math.PI * 2,
        col:   COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'rgba(250,247,244,',
      }));
    };
 
    const draw = (): void => {
      ctx.fillStyle = 'rgba(8,6,4,0.14)';
      ctx.fillRect(0, 0, W, H);
 
      flies.forEach(f => {
        f.phase += 0.018;
        f.a     += f.da;
        if (f.a > 1 || f.a < 0) { f.da *= -1; f.a = Math.max(0, Math.min(1, f.a)); }
 
        f.x += f.dx + Math.sin(f.phase) * 0.28;
        f.y += f.dy;
 
        if (f.y < -10)     { f.y = H + 10; f.x = Math.random() * W; }
        if (f.x < -10)     f.x = W + 10;
        if (f.x > W + 10)  f.x = -10;
 
        /* Glow halo */
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
        grd.addColorStop(0, `${f.col}${f.a * 0.85})`);
        grd.addColorStop(1, `${f.col}0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
 
        /* Core dot */
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `${f.col}${f.a})`;
        ctx.fill();
      });
 
      this._raf = requestAnimationFrame(draw);
    };
 
    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  private _initInkWash(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    const host = (this.renderRoot as ShadowRoot).host as HTMLElement;
    let W = 0, H = 0, t = 0;
 
    type Blob = { cx: number; cy: number; r: number; speed: number; offset: number; color: string };
    let blobs: Blob[] = [];
 
    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
      const base = Math.min(W, H);
      blobs = [
        { cx: 0.28, cy: 0.42, r: base * 0.24, speed: 1.0,  offset: 0,   color: 'rgba(175,150,120,0.07)' },
        { cx: 0.68, cy: 0.58, r: base * 0.20, speed: 1.3,  offset: 1.2, color: 'rgba(155,135,108,0.06)' },
        { cx: 0.50, cy: 0.28, r: base * 0.17, speed: 0.7,  offset: 2.5, color: 'rgba(184,90,30,0.04)'   },
        { cx: 0.18, cy: 0.72, r: base * 0.15, speed: 1.1,  offset: 3.8, color: 'rgba(78,148,130,0.04)'  },
        { cx: 0.82, cy: 0.32, r: base * 0.13, speed: 0.85, offset: 5.0, color: 'rgba(175,150,120,0.05)' },
      ];
    };
 
    const drawBlob = (b: Blob): void => {
      const pts = 44;
      const phase = t * b.speed + b.offset;
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2;
        const noise =
          Math.sin(angle * 3 + phase) * b.r * 0.14
          + Math.cos(angle * 2 - phase * 0.8) * b.r * 0.09
          + Math.sin(angle * 5 + phase * 1.4) * b.r * 0.05;
        const x = b.cx * W + (b.r + noise) * Math.cos(angle);
        const y = b.cy * H + (b.r + noise) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = b.color;
      ctx.fill();
    };
 
    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FAF7F4';
      ctx.fillRect(0, 0, W, H);
 
      blobs.forEach(drawBlob);
 
      t += 0.0028;
      this._raf = requestAnimationFrame(draw);
    };
 
    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  /* ── Canvas: Rain Lines ── */
  private _initRain(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    const host = (this.renderRoot as ShadowRoot).host as HTMLElement;
    let W = 0, H = 0;

    const COUNT = 40;
    type Drop = { x:number; y:number; len:number; v:number; a:number; col:string };
    let drops: Drop[] = [];

    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
      drops = Array.from({ length: COUNT }, () => ({
        x:   Math.random() * W,
        y:   Math.random() * H - H,
        len: Math.random() * 22 + 8,
        v:   Math.random() * 1.8 + 0.8,
        a:   Math.random() * 0.2 + 0.04,
        col: Math.random() > 0.85 ? 'rgba(217,114,52,' : 'rgba(250,247,244,',
      }));
    };

    const draw = (): void => {
      ctx.fillStyle = 'rgba(14,10,7,0.18)';
      ctx.fillRect(0, 0, W, H);
      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.1, d.y + d.len);
        const g = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
        g.addColorStop(0,   `${d.col}0)`);
        g.addColorStop(0.5, `${d.col}${d.a})`);
        g.addColorStop(1,   `${d.col}0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        d.y += d.v;
        if (d.y > H + d.len) { d.y = -d.len; d.x = Math.random() * W; }
      });
      this._raf = requestAnimationFrame(draw);
    };

    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  /* ── Canvas: Wave Mesh ── */
  private _initWaveMesh(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    const host = (this.renderRoot as ShadowRoot).host as HTMLElement;
    let W = 0, H = 0, t = 0;
    const COLS = 16, ROWS = 10;

    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FAF7F4';
      ctx.fillRect(0, 0, W, H);

      const cw = W / (COLS - 1);
      const ch = H / (ROWS - 1);

      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const wave = Math.sin((c / COLS + t) * Math.PI * 2) * 12
                     + Math.cos((r / ROWS + t * 0.7) * Math.PI * 2) * 8;
          const x = c * cw;
          const y = r * ch + wave;
          c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(160,140,118,${0.08 + Math.sin(r / ROWS * Math.PI) * 0.06})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      for (let c = 0; c < COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const wave = Math.sin((c / COLS + t) * Math.PI * 2) * 12
                     + Math.cos((r / ROWS + t * 0.7) * Math.PI * 2) * 8;
          const x = c * cw;
          const y = r * ch + wave;
          r === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(160,140,118,${0.06 + Math.sin(c / COLS * Math.PI) * 0.04})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      t += 0.003;
      this._raf = requestAnimationFrame(draw);
    };

    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  /* ── Canvas: Constellation ── */
  private _initConstellation(canvas: HTMLCanvasElement): void {
    const ctx  = canvas.getContext('2d')!;
    const host = (this.renderRoot as ShadowRoot).host as HTMLElement;
    let W = 0, H = 0;

    const COUNT = 70;
    type Star = { x:number; y:number; r:number; a:number; pa:number; ps:number; col:number[] };
    let stars: Star[] = [];

    const resize = (): void => {
      W = canvas.width  = host.clientWidth;
      H = canvas.height = host.clientHeight;
      stars = Array.from({ length: COUNT }, (): Star => ({
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   Math.random() * 1.2 + 0.2,
        a:   Math.random() * 0.5 + 0.1,
        pa:  Math.random() * Math.PI * 2,
        ps:  Math.random() * 0.008 + 0.002,
        col: Math.random() > 0.9
          ? [217, 114, 52]
          : Math.random() > 0.85
            ? [78, 148, 130]
            : [250, 247, 244],
      }));
    };

    const draw = (): void => {
      ctx.fillStyle = 'rgba(10,8,6,0.22)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          // ✅ Fix: destructurar con ! — índices seguros por los límites del bucle
          const si = stars[i]!;
          const sj = stars[j]!;
          const dx = si.x - sj.x;
          const dy = si.y - sj.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(si.x, si.y);
            ctx.lineTo(sj.x, sj.y);
            ctx.strokeStyle = `rgba(250,247,244,${(1 - d / 110) * 0.07})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      stars.forEach(s => {
        s.pa += s.ps;
        const pulse = Math.sin(s.pa) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col.join(',')},${s.a * pulse})`;
        ctx.fill();
        if (s.a > 0.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.col.join(',')},${s.a * 0.06 * pulse})`;
          ctx.fill();
        }
      });

      this._raf = requestAnimationFrame(draw);
    };

    this._ro = new ResizeObserver(resize);
    this._ro.observe(host);
    resize();
    draw();
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return backgroundTemplate({
      variant:  this.variant,
      isCanvas: BG_CANVAS_VARIANTS.has(this.variant),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-background': LibBackground;
  }
}