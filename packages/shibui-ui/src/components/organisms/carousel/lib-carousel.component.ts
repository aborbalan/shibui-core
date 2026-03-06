import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { carouselTemplate } from './lib-carousel.html';
import type { LibCarouselMode } from './lib-carousel.html';
import carouselCss from './lib-carousel.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type { LibCarouselMode };

/**
 * @element lib-carousel
 *
 * Carousel agnóstico. El consumer pasa los slides directamente como hijos.
 * El componente gestiona la navegación, animación y accesibilidad.
 *
 * Modos:
 * - slide : transform translateX (default)
 * - fade  : crossfade por opacidad
 *
 * @slot (default)   — slides del carousel
 * @slot thumbnail   — tira de miniaturas (opcional, modo fade)
 *
 * @fires ui-lib-slide-change — `{ current: number, total: number }`
 *
 * @example — slide default (1 visible)
 * <lib-carousel dots counter>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </lib-carousel>
 *
 * @example — cards (3 visibles)
 * <lib-carousel peek="3" counter>
 *   <div class="mi-card">...</div>
 *   ...
 * </lib-carousel>
 *
 * @example — fade con thumbnails
 * <lib-carousel mode="fade" dots arrows="false">
 *   <div>Slide 1</div>
 *   <img slot="thumbnail" src="..." alt="">
 * </lib-carousel>
 */
@customElement('lib-carousel')
export class LibCarousel extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(carouselCss)}`,
  ];

  /**
   * Mecanismo de transición.
   * - slide : desplazamiento horizontal (transform)
   * - fade  : crossfade por opacidad
   */
  @property({ type: String, reflect: true })
  mode: LibCarouselMode = 'slide';

  /**
   * Número de slides visibles simultáneamente.
   * peek=1 (default): carousel estándar.
   * peek=3: card carousel con tres columnas.
   */
  @property({ type: Number, reflect: true })
  peek = 1;

  /** Muestra flechas de navegación prev/next (solo en modo slide). */
  @property({ type: Boolean, reflect: true })
  arrows = true;

  /** Muestra dots de navegación. */
  @property({ type: Boolean, reflect: true })
  dots = true;

  /** Muestra contador numérico. */
  @property({ type: Boolean, reflect: true })
  counter = false;

  /** Navegación circular (el último slide vuelve al primero). */
  @property({ type: Boolean, reflect: true })
  loop = false;

  /**
   * Intervalo de autoplay en milisegundos.
   * 0 = desactivado (default).
   */
  @property({ type: Number })
  autoplay = 0;

  /* ── Internal state ─────────────────────────────────── */
  private _current = 0;
  private _total   = 0;
  private _autoplayTimer: ReturnType<typeof setInterval> | undefined;

  @query('.cr-track')
  private _trackEl!: HTMLElement;

  @queryAssignedElements()
  private _slides!: Array<HTMLElement>;

  @queryAssignedElements({ slot: 'thumbnail' })
  private _thumbs!: Array<HTMLElement>;

  /* ── Lifecycle ──────────────────────────────────────── */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearAutoplay();
  }

  override render(): TemplateResult {
    return carouselTemplate({
      mode:        this.mode,
      current:     this._current,
      total:       this._total,
      peek:        this.peek,
      arrows:      this.arrows,
      dots:        this.dots,
      counter:     this.counter,
      loop:        this.loop,
      handlePrev:  this._prev.bind(this),
      handleNext:  this._next.bind(this),
      handleDot:   this._goTo.bind(this),
      handleSlot:  this._onSlotChange.bind(this),
      handleThumb: this._onThumbSlotChange.bind(this),
      handleKey:   this._onKeyDown.bind(this),
    });
  }

  /* ── Slot handlers ──────────────────────────────────── */
  private _onSlotChange(): void {
    this._total = this._slides.length;
    this._applyState(this._current, false);   // sin animación en init
    this._syncThumbs();
    this.requestUpdate();
    this._clearAutoplay();
    this._startAutoplay();
  }

  private _onThumbSlotChange(): void {
    this._syncThumbs();
  }

  /* ── Navigation ─────────────────────────────────────── */
  private _prev(): void {
    if (this._current === 0) {
      if (this.loop) this._goTo(this._total - 1);
    } else {
      this._goTo(this._current - 1);
    }
  }

  private _next(): void {
    if (this._current === this._total - 1) {
      if (this.loop) this._goTo(0);
    } else {
      this._goTo(this._current + 1);
    }
  }

  private _goTo(index: number): void {
    if (!this._total) return;
    const clamped = Math.max(0, Math.min(index, this._total - 1));
    this._applyState(clamped, true);
    this._syncThumbs();
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent<{ current: number; total: number }>('ui-lib-slide-change', {
        detail:   { current: this._current, total: this._total },
        bubbles:  true,
        composed: true,
      })
    );
  }

  /* ── Apply visual state ─────────────────────────────── */
  private _applyState(index: number, animate: boolean): void {
    this._current = index;

    if (this.mode === 'fade') {
      this._applyFade();
    } else {
      this._applySlide(animate);
    }
  }

  private _applySlide(animate: boolean): void {
    if (!this._trackEl) return;

    if (!animate) {
      this._trackEl.style.transition = 'none';
      // Forzar reflow para que se aplique sin transición
      void this._trackEl.offsetHeight;
    } else {
      this._trackEl.style.transition = '';
    }

    if (this.peek === 1) {
      this._trackEl.style.transform = `translateX(-${this._current * 100}%)`;
    } else {
      const slide = this._slides[0];
      if (!slide) return;
      const slideW = slide.offsetWidth;
      const gap    = parseFloat(getComputedStyle(this._trackEl).gap) || 16;
      this._trackEl.style.transform =
        `translateX(-${this._current * (slideW + gap)}px)`;
    }
  }

  private _applyFade(): void {
    this._slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === this._current);
    });
  }

  /* ── Thumbnails ─────────────────────────────────────── */
  private _syncThumbs(): void {
    this._thumbs.forEach((t, i) => {
      t.classList.toggle('is-active', i === this._current);
      t.addEventListener('click', () => this._goTo(i), { once: false });
    });
  }

  /* ── Autoplay ───────────────────────────────────────── */
  private _startAutoplay(): void {
    if (!this.autoplay || this.autoplay <= 0) return;
    this._autoplayTimer = setInterval(() => {
      if (this._current === this._total - 1) {
        if (this.loop) this._goTo(0);
      } else {
        this._goTo(this._current + 1);
      }
    }, this.autoplay);
  }

  private _clearAutoplay(): void {
    if (this._autoplayTimer !== undefined) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = undefined;
    }
  }

  /* ── Keyboard ───────────────────────────────────────── */
  private _onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); this._prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); this._next(); }
    if (e.key === 'Home')       { e.preventDefault(); this._goTo(0); }
    if (e.key === 'End')        { e.preventDefault(); this._goTo(this._total - 1); }
  }

  /* ── Public API ─────────────────────────────────────── */
  /** Ir a un slide concreto por índice (0-based). */
  public goTo(index: number): void {
    this._goTo(index);
  }

  /** Ir al siguiente slide. */
  public next(): void {
    this._next();
  }

  /** Ir al anterior slide. */
  public prev(): void {
    this._prev();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-carousel': LibCarousel;
  }
}