import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { parallaxTextStackTemplate } from './lib-parallax-text-stack.html';
import stackCss from './lib-parallax-text-stack.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { ParallaxTextSize, ParallaxTextColor } from './lib-parallax-text-stack.types';

/**
 * lib-parallax-text-stack — Shibui UI
 *
 * Apila líneas tipográficas con parallax horizontal al hacer scroll.
 * Capas pares  → outline (trazo, sin relleno).
 * Capas impares → italic serif (relleno).
 *
 * @prop lines  — Array de strings, una por capa
 * @prop speed  — Factor de velocidad (default 0.15)
 * @prop size   — 'sm' | 'md' | 'lg'(default) | 'xl' | '2xl'
 * @prop color  — 'default' | 'muted' | 'kaki' | 'celadon'
 *
 * IMPORTANTE: el padre debe llevar overflow-x:hidden.
 * El componente NO lo aplica en :host — si lo hiciera, el
 * translateX quedaría clipado y el efecto sería invisible.
 */
@customElement('lib-parallax-text-stack')
export class LibParallaxTextStack extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(stackCss)}`,
  ];

  @property({ type: Array })
  lines: string[] = [];

  @property({ type: Number })
  speed = 0.15;

  @property({ type: String, reflect: true })
  size: ParallaxTextSize = 'lg';

  @property({ type: String, reflect: true })
  color: ParallaxTextColor = 'default';

  /* ── Estado interno ── */
  private _ticking = false;
  private _reducedMotion = false;
  private _motionQuery!: MediaQueryList;

  /* ════════════════════════════════════════
     Ciclo de vida
     ════════════════════════════════════════ */

  override connectedCallback(): void {
    super.connectedCallback();

    this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._reducedMotion = this._motionQuery.matches;
    this._motionQuery.addEventListener('change', this._onMotionChange);

    // { passive: true } — no bloquea el hilo principal
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    this._motionQuery?.removeEventListener('change', this._onMotionChange);
  }

  /**
   * firstUpdated: primer render completado → shadow DOM listo.
   * connectedCallback se dispara ANTES de que Lit renderice,
   * por lo que querySelectorAll('.pts-layer') devuelve vacío ahí.
   */
  override firstUpdated(): void {
    this._applyParallax();
  }

  /* ════════════════════════════════════════
     Manejadores
     ════════════════════════════════════════ */

  private _onMotionChange = (e: MediaQueryListEvent): void => {
    this._reducedMotion = e.matches;
    if (this._reducedMotion) this._resetLayers();
  };

  private _onScroll = (): void => {
    if (this._ticking) return;
    this._ticking = true;
    requestAnimationFrame(() => {
      this._applyParallax();
      this._ticking = false;
    });
  };

  /* ════════════════════════════════════════
     Lógica del efecto
     ════════════════════════════════════════ */

  private _applyParallax(): void {
    if (this._reducedMotion) return;

    // Clase correcta: pts-layer (no parallax-layer del original)
    const layers = this.shadowRoot?.querySelectorAll<HTMLElement>('.pts-layer');
    if (!layers?.length) return;

    const rect     = this.getBoundingClientRect();
    const centerEl = rect.top + rect.height / 2;
    const centerVp = window.innerHeight / 2;
    // offset > 0: componente bajo el centro → capas se separan
    // offset < 0: componente sobre el centro → capas se contraen
    const offset   = centerVp - centerEl;

    layers.forEach((layer, i) => {
      // Capas alternas en direcciones opuestas — efecto acordeón
      const direction = i % 2 === 0 ? 1 : -1;
      const factor    = (i + 1) * this.speed;
      layer.style.transform = `translateX(${offset * factor * direction}px)`;
    });
  }

  private _resetLayers(): void {
    this.shadowRoot
      ?.querySelectorAll<HTMLElement>('.pts-layer')
      .forEach(l => { l.style.transform = ''; });
  }

  protected override render(): TemplateResult {
    return parallaxTextStackTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-parallax-text-stack': LibParallaxTextStack;
  }
}