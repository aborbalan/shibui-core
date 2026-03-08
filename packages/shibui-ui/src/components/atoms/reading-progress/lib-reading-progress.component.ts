import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state }              from 'lit/decorators.js';
import { readingProgressTemplate }                          from './lib-reading-progress.html';
import componentCss                                         from './lib-reading-progress.css?inline';
import sharedTokens                                         from '../../../styles/shared/tokens.css?inline';

export type ReadingProgressVariant = 'bar' | 'line' | 'dots' | 'ring' | 'vertical';
export type ReadingProgressTone    = 'kaki' | 'celadon' | 'ink' | 'kintsugi';


/**
 * @element lib-reading-progress
 *
 * Cinco variantes de progreso de lectura — todas se alimentan del mismo
 * valor interno `_progress` (0-100) calculado con scroll.
 *
 * Variantes
 * ─────────
 * bar      → 2px debajo del nav. El HOST es el elemento visual.
 *            Coloca el componente DENTRO de un contenedor con
 *            position:relative; overflow:hidden.
 *
 * line     → 1px, más sutil. Mismos requisitos de posicionamiento.
 *
 * dots     → fila de N puntos. Display inline-flex. Va dentro del nav.
 *
 * ring     → anillo SVG. Display inline-flex. Va junto al brand.
 *
 * vertical → barra fija en el margen izquierdo de la ventana.
 *            Se posiciona sola con position:fixed.
 *
 * @attr {ReadingProgressVariant} variant    — bar · line · dots · ring · vertical
 * @attr {ReadingProgressTone}    tone       — kaki · celadon · ink
 * @attr {string}                 target     — selector CSS del contenedor scrollable.
 *                                             Si se omite, trackea window.
 * @attr {number}                 dots-count — número de puntos (variant=dots, default: 5)
 * @attr {number}                 ring-size  — diámetro del anillo en px (variant=ring, default: 28)
 */
@customElement('lib-reading-progress')
export class LibReadingProgress extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /* ── Props ───────────────────────────────────────────── */

  @property({ type: String, reflect: true })
  variant: ReadingProgressVariant = 'bar';

  @property({ type: String, reflect: true })
  tone: ReadingProgressTone = 'kaki';

  /** Selector CSS del elemento scrollable que se quiere observar.
   *  Si está vacío, escucha el scroll de window. */
  @property({ type: String })
  target = '';

  @property({ type: Number, attribute: 'dots-count' })
  dotsCount = 5;

  @property({ type: Number, attribute: 'ring-size' })
  ringSize = 28;

  /* ── Estado interno ──────────────────────────────────── */

  @state()
  private _progress = 0;

  /* ── Elemento scrollable resuelto ───────────────────── */

  private _scrollEl: Element | Window | null = null;

  /* ── Lifecycle ───────────────────────────────────────── */

  override connectedCallback(): void {
    super.connectedCallback();
    this._bindScroll();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unbindScroll();
  }

  override updated(changed: Map<string, unknown>): void {
    /* Si cambia el target, revinculamos el listener */
    if (changed.has('target')) {
      this._unbindScroll();
      this._bindScroll();
    }
  }

  /* ── Scroll binding ──────────────────────────────────── */

  private _bindScroll(): void {
    if (this.target) {
      /* Esperamos al primer update para que el DOM esté disponible */
      this.updateComplete.then(() => {
        const el = document.querySelector(this.target);
        if (el) {
          this._scrollEl = el;
          el.addEventListener('scroll', this._onScroll, { passive: true });
          this._calculate(el);
        }
      });
    } else {
      this._scrollEl = window;
      window.addEventListener('scroll', this._onScroll, { passive: true });
      this._calculate(window);
    }
  }

  private _unbindScroll(): void {
    if (!this._scrollEl) return;
    this._scrollEl.removeEventListener('scroll', this._onScroll);
    this._scrollEl = null;
  }

  /* ── Cálculo de progreso ─────────────────────────────── */

  private _onScroll = (): void => {
    if (this._scrollEl) this._calculate(this._scrollEl);
  };

  private _calculate(source: Element | Window): void {
    let p: number;

    if (source instanceof Window) {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
    } else {
      const { scrollTop, scrollHeight, clientHeight } = source as Element;
      const total = scrollHeight - clientHeight;
      p = total > 0 ? Math.min(1, Math.max(0, scrollTop / total)) : 0;
    }

    const pct = Math.round(p * 100);
    if (pct === this._progress) return;
    this._progress = pct;

    /* Actualiza el host directamente para bar / line / vertical
       para evitar un re-render completo en cada frame de scroll */
    this._applyHostStyle();
  }

  /* Aplica width / height al host en lugar de forzar un re-render
     para las variantes cuyo elemento visual ES el host */
  private _applyHostStyle(): void {
    const v = this.variant;
    if (v === 'bar' || v === 'line') {
      this.style.width = `${this._progress}%`;
      /* Activa el destello solo cuando hay progreso real y no está al 100% */
      const active = this._progress > 1 && this._progress < 100;
      this.toggleAttribute('active', active);
    } else if (v === 'vertical') {
      this.style.height = `${this._progress}%`;
    }
  }

  /* ── Render ──────────────────────────────────────────── */

  override render(): TemplateResult {
    return readingProgressTemplate({
      variant:   this.variant,
      progress:  this._progress,
      dotsCount: this.dotsCount,
      ringSize:  this.ringSize,
    });
  }

  /* ── Public API ──────────────────────────────────────── */

  /** Devuelve el progreso actual (0-100) */
  get progress(): number {
    return this._progress;
  }

  /** Fuerza un recálculo inmediato del progreso */
  recalculate(): void {
    if (this._scrollEl) this._calculate(this._scrollEl);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-reading-progress': LibReadingProgress;
  }
}