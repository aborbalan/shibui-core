import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { parallaxTemplate } from './lib-parallax.html';
import parallaxCss from './lib-parallax.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { ParallaxAxis } from './lib-parallax.types';

/**
 * lib-parallax-container
 *
 * Aplica desplazamiento parallax a los hijos directos del slot
 * al hacer scroll. El efecto es 0 cuando el elemento está centrado
 * en el viewport, y se desplaza proporcionalmente al alejarse del centro.
 *
 * Cada hijo puede sobrescribir el multiplicador con `data-parallax-factor`.
 * Ejemplo: `<div data-parallax-factor="0.3">fondo lento</div>`
 *          `<div data-parallax-factor="2">elemento rápido</div>`
 *
 * @prop speed  — Multiplicador de desplazamiento base (default 0.2)
 * @prop axis   — Eje del efecto: 'y' | 'x' | 'xy' (default 'y')
 * @prop clamp  — Máximo desplazamiento en px (0 = sin límite, default 0)
 *
 * @cssvar --parallax-speed — Alternativa CSS al prop speed (no reactivo)
 *
 * @slot — Elementos a desplazar. Cada hijo acepta data-parallax-factor.
 */
@customElement('lib-parallax-container')
export class LibParallaxContainer extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(parallaxCss)}`,
  ];

  /** Multiplicador de desplazamiento base */
  @property({ type: Number })
  speed = 0.2;

  /** Eje sobre el que opera el efecto */
  @property({ type: String, reflect: true })
  axis: ParallaxAxis = 'y';

  /** Máximo desplazamiento absoluto en px (0 = sin límite) */
  @property({ type: Number })
  clamp = 0;

  private _observer: IntersectionObserver | null = null;
  private _isVisible = false;
  private _ticking = false;
  private _reducedMotion = false;

  /* ── Lifecycle ── */
  override connectedCallback(): void {
    super.connectedCallback();
    // matchMedia para prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._reducedMotion = mq.matches;
    mq.addEventListener('change', (e: MediaQueryListEvent): void => {
      this._reducedMotion = e.matches;
      if (this._reducedMotion) this._resetTransforms();
    });

    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._setupObserver();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    this._observer?.disconnect();
    this._observer = null;
  }

  /* ── IntersectionObserver — activa/desactiva will-change ── */
  private _setupObserver(): void {
    this._observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const entry = entries[0];
        if (!entry) return;
        this._isVisible = entry.isIntersecting;
        // Sincroniza el atributo [visible] → activa/desactiva will-change via CSS
        if (this._isVisible) {
          this.setAttribute('visible', '');
          // Calcular posición inicial al entrar en viewport
          requestAnimationFrame((): void => this._applyParallax());
        } else {
          this.removeAttribute('visible');
        }
      },
      { threshold: 0.01 },
    );
    this._observer.observe(this);
  }

  /* ── Scroll handler con rAF throttle ── */
  private _onScroll = (): void => {
    if (!this._isVisible || this._reducedMotion) return;
    if (this._ticking) return;
    this._ticking = true;
    requestAnimationFrame((): void => {
      this._applyParallax();
      this._ticking = false;
    });
  };

  /**
   * Cálculo del desplazamiento parallax.
   *
   * Fórmula: centerOffset = distancia entre el centro del elemento
   * y el centro del viewport. Cuando el elemento está centrado en
   * pantalla → offset = 0, sin desplazamiento.
   * Cuando el elemento sube por encima → offset negativo → el elemento
   * se desplaza hacia arriba (más rápido o más lento que el scroll).
   *
   * Esto es más correcto que `(scrollY - offsetTop) * speed` porque:
   * 1. No depende del offsetParent (fiable en Shadow DOM)
   * 2. El punto neutro es el centro visual, no el top de la página
   */
  private _applyParallax(): void {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;

    const rect         = this.getBoundingClientRect();
    const centerOffset = (rect.top + rect.height / 2) - (window.innerHeight / 2);

    const elements = slot.assignedElements() as HTMLElement[];

    elements.forEach((el): void => {
      const factor = parseFloat(el.dataset['parallaxFactor'] ?? '1');
      const move   = centerOffset * this.speed * factor;
      const clamped = this.clamp > 0
        ? Math.min(Math.max(move, -this.clamp), this.clamp)
        : move;

      switch (this.axis) {
        case 'x':
          el.style.transform = `translate3d(${clamped}px, 0, 0)`;
          break;
        case 'xy':
          el.style.transform = `translate3d(${clamped}px, ${clamped}px, 0)`;
          break;
        case 'y':
        default:
          el.style.transform = `translate3d(0, ${clamped}px, 0)`;
      }
    });
  }

  /** Limpia los transforms (p.ej. al activar prefers-reduced-motion en runtime) */
  private _resetTransforms(): void {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
    const elements = slot?.assignedElements() as HTMLElement[] | undefined;
    elements?.forEach((el): void => { el.style.transform = ''; });
  }

  protected override render(): TemplateResult {
    return parallaxTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-parallax-container': LibParallaxContainer;
  }
}