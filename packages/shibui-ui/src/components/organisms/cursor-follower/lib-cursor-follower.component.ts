import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import cursorCss from './lib-cursor-follower.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { CURSOR_MODES } from './lib-cursor-follower.types';
import type { CursorMode, CursorState } from './lib-cursor-follower.types';

/**
 * @element lib-cursor-follower
 *
 * Cursor personalizado con tres capas: dot exacto, ring con lerp e inercia,
 * y label contextual. Detecta automáticamente el tipo de elemento bajo el cursor.
 *
 * Coloca el componente una sola vez al inicio del <body>. Se encarga de ocultar
 * el cursor nativo del documento.
 *
 * @prop {CursorMode} mode    — ink · minimal · kaki · ghost (default: 'ink')
 * @prop {number}     lerp    — Factor de interpolación del ring 0–1 (override del modo)
 * @prop {boolean}    trail   — Activa la cola de tinta al mover rápido
 *
 * @method setMode(mode)   — Cambia el modo en tiempo de ejecución
 * @method toggleTrail()   — Activa/desactiva el trail
 *
 * @csspart dot   — El punto exacto
 * @csspart ring  — El anillo con lag
 * @csspart label — La etiqueta contextual
 */
@customElement('lib-cursor-follower')
export class LibCursorFollower extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(cursorCss)}`,
  ];

  /* ── Props ── */

  @property({ type: String, reflect: true })
  mode: CursorMode = 'ink';

  @property({ type: Number })
  lerp = 0;                 // 0 = usar el del modo

  @property({ type: Boolean })
  trail = false;

  /* ── Estado interno del cursor (no reactivo — actualizado en rAF) ── */

  /** Posición exacta del ratón */
  private _mouse  = { x: -200, y: -200 };
  /** Posición interpolada del ring */
  private _lerped = { x: -200, y: -200 };

  /** Estado contextual actual */
  private _curstate: CursorState = 'hidden';

  /** Anclajes para el trail */
  private _lastTrail  = { x: 0, y: 0, t: 0 };
  private _rafId      = 0;

  /* ── Refs a los elementos del shadow ── */

  private get _dot():   HTMLElement { return this.shadowRoot!.querySelector('.cur-dot')   as HTMLElement; }
  private get _ring():  HTMLElement { return this.shadowRoot!.querySelector('.cur-ring')  as HTMLElement; }
  private get _label(): HTMLElement { return this.shadowRoot!.querySelector('.cur-label') as HTMLElement; }

  /* ── Lifecycle ── */

  override connectedCallback(): void {
    super.connectedCallback();
    // Ocultar cursor nativo
    document.documentElement.style.cursor = 'none';

    window.addEventListener('mousemove',  this._onMove,   { passive: true });
    window.addEventListener('mouseleave', this._onLeave,  { passive: true });
    window.addEventListener('mouseenter', this._onEnter,  { passive: true });
    window.addEventListener('mousedown',  this._onDown,   { passive: true });
    window.addEventListener('mouseup',    this._onUp,     { passive: true });
    window.addEventListener('mouseover',  this._onOver,   { passive: true });

    this._rafId = requestAnimationFrame(this._loop);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.documentElement.style.cursor = '';

    window.removeEventListener('mousemove',  this._onMove);
    window.removeEventListener('mouseleave', this._onLeave);
    window.removeEventListener('mouseenter', this._onEnter);
    window.removeEventListener('mousedown',  this._onDown);
    window.removeEventListener('mouseup',    this._onUp);
    window.removeEventListener('mouseover',  this._onOver);

    cancelAnimationFrame(this._rafId);
  }

  /** Aplica el modo visual al dot y ring */
  override updated(changed: Map<string, unknown>): void {
    if (changed.has('mode')) {
      this._applyMode();
    }
  }

  /* ── API pública ── */

  /** Cambia el modo en tiempo de ejecución */
  public setMode(mode: CursorMode): void {
    this.mode = mode;
  }

  /** Activa o desactiva el trail de tinta */
  public toggleTrail(): void {
    this.trail = !this.trail;
    this._lastTrail = { x: this._mouse.x, y: this._mouse.y, t: performance.now() };
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return html`
      <div class="cur-dot"  part="dot"></div>
      <div class="cur-ring" part="ring"></div>
      <div class="cur-label" part="label"></div>
    `;
  }

  /* ── Event handlers ── */

  private _onMove = (e: MouseEvent): void => {
    this._mouse.x = e.clientX;
    this._mouse.y = e.clientY;

    // Dot sigue instantáneamente
    const dot = this._dot;
    if (dot) {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    }

    // Label sigue al dot
    const label = this._label;
    if (label?.classList.contains('is-visible')) {
      label.style.left = `${e.clientX}px`;
      label.style.top  = `${e.clientY}px`;
    }

    // Trail
    if (this.trail) this._maybeSpawnTrail(e.clientX, e.clientY);

    // Si estaba oculto, restaurar
    if (this._curstate === 'hidden') this._setState('default');
  };

  private _onLeave  = (): void => { this._setState('hidden'); };
  private _onEnter  = (): void => { this._setState('default'); };
  private _onDown   = (): void => { this._setState('press'); };
  private _onUp     = (): void => {
    // Volver al estado previo al press
    const el = document.elementFromPoint(this._mouse.x, this._mouse.y);
    this._setState(this._detectState(el));
  };

  private _onOver = (e: MouseEvent): void => {
    if (this._curstate === 'press') return; // no interrumpir press

    const el = e.target as Element | null;
    const state = this._detectState(el);
    this._setState(state);

    // Zona oscura — el ring adapta el color
    const isDark = !!el?.closest('[data-cursor-zone="dark"]');
    this.toggleAttribute('dark-zone', isDark);

    // Label contextual
    const labelAnchor = el?.closest('[data-cursor-label]') as HTMLElement | null;
    const label = this._label;
    if (label) {
      if (labelAnchor?.dataset['cursorLabel']) {
        label.textContent = labelAnchor.dataset['cursorLabel'];
        label.classList.add('is-visible');
        label.style.left = `${this._mouse.x}px`;
        label.style.top  = `${this._mouse.y}px`;
      } else {
        label.classList.remove('is-visible');
      }
    }
  };

  /* ── Loop de animación del ring ── */

  private _loop = (): void => {
    const factor = this.lerp > 0
      ? this.lerp
      : CURSOR_MODES[this.mode].lerpFactor;

    this._lerped.x += (this._mouse.x - this._lerped.x) * factor;
    this._lerped.y += (this._mouse.y - this._lerped.y) * factor;

    const ring = this._ring;
    if (ring) {
      ring.style.left = `${this._lerped.x}px`;
      ring.style.top  = `${this._lerped.y}px`;
    }

    this._rafId = requestAnimationFrame(this._loop);
  };

  /* ── Helpers ── */

  private _detectState(el: Element | null): CursorState {
    if (!el) return 'default';

    // Texto editable / seleccionable
    const textZone = el.closest('[data-cursor-zone="text"]');
    if (textZone && el.matches('p, h1, h2, h3, h4, h5, h6, em, strong, span:not(.cursor-zone-label)')) {
      return 'text';
    }

    // Elemento interactivo
    if (el.matches('a, button, input, select, textarea, [role="button"], [data-interactive], .interactive')) {
      return 'hover';
    }
    if (el.closest('a, button, [role="button"]')) {
      return 'hover';
    }

    return 'default';
  }

  private _setState(state: CursorState): void {
    if (this._curstate === state) return;
    this._curstate = state;
    this.setAttribute('curstate', state);
  }

  /** Aplica los estilos base del modo al dot y ring */
  private _applyMode(): void {
    const m = CURSOR_MODES[this.mode];
    if (!m) return;

    const dot  = this._dot;
    const ring = this._ring;
    if (!dot || !ring) return;

    dot.style.background = m.dotBg;
    dot.style.width      = m.dotSize;
    dot.style.height     = m.dotSize;

    ring.style.border     = m.ringBorder;
    ring.style.background = m.ringBg;
    ring.style.width      = m.ringSize;
    ring.style.height     = m.ringSize;
    ring.style.mixBlendMode = m.ringMix;
  }

  /** Genera partículas de tinta proporcionales a la velocidad */
  private _maybeSpawnTrail(x: number, y: number): void {
    const now  = performance.now();
    const dx   = x - this._lastTrail.x;
    const dy   = y - this._lastTrail.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt   = Math.max(1, now - this._lastTrail.t);
    const speed = dist / dt;

    if (dist > 4) {
      this._spawnTrailParticle(x, y, speed);
      this._lastTrail = { x, y, t: now };
    }
  }

  private _spawnTrailParticle(x: number, y: number, speed: number): void {
    const size = Math.max(2, Math.min(8, speed * 1.5));
    const isLight = this.mode === 'ghost';
    const color = isLight
      ? 'rgba(250,247,244,0.4)'
      : 'var(--color-kaki-500)';

    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
      animation: lib-ink-fade ${600 + speed * 50}ms cubic-bezier(0.2, 0, 0.8, 1) forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

/* Keyframe global para las partículas de trail */
if (!document.head.querySelector('#lib-cursor-keyframes')) {
  const s = document.createElement('style');
  s.id = 'lib-cursor-keyframes';
  s.textContent = `
    @keyframes lib-ink-fade {
      0%   { opacity: 0.4; transform: translate(-50%,-50%) scale(1);   }
      100% { opacity: 0;   transform: translate(-50%,-50%) scale(0.2); }
    }
  `;
  document.head.appendChild(s);
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-cursor-follower': LibCursorFollower;
  }
}