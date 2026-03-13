import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { horizontalScrollTemplate } from './lib-horizontal-scroll-section.html';
import sectionCss from './lib-horizontal-scroll-section.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { HorizontalScrollProgressEvent } from './lib-horizontal-scroll-section.types';

/**
 * lib-horizontal-scroll-section
 *
 * Convierte scroll vertical en desplazamiento horizontal sticky.
 * El bloque ocupa `scrollDuration` vh de altura — esa "duración"
 * determina cuánto debe bajar el usuario para ver todo el contenido.
 *
 * @prop scroll-duration  — Multiplicador de vh (default 3 → 300vh)
 * @prop padding-inline   — Padding lateral en vw (default 10 → 10vw)
 * @prop show-progress    — Muestra barra de progreso y contador (default true)
 *
 * @fires ui-lib-scroll-progress — { detail: HorizontalScrollProgressEvent }
 *
 * @slot — Items del carrusel horizontal (flex-shrink: 0 automático)
 *
 * @cssvar --_scroll-height   — Sobreescribe la altura total del bloque
 * @cssvar --_gap             — Gap entre items (default: calc(--lib-space-xl * 2))
 * @cssvar --_padding-inline  — Padding lateral en vw (sincronizado con el prop)
 */
@customElement('lib-horizontal-scroll-section')
export class LibHorizontalScrollSection extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(sectionCss)}`,
  ];

  /** Cuántas veces la altura del viewport dura el efecto (default: 3 → 300vh) */
  @property({ type: Number, attribute: 'scroll-duration' })
  scrollDuration = 3;

  /** Padding lateral en vw aplicado a ambos lados del track (default: 10) */
  @property({ type: Number, attribute: 'padding-inline' })
  paddingInline = 10;

  /** Muestra la barra de progreso y el contador de porcentaje */
  @property({ type: Boolean, attribute: 'show-progress' })
  showProgress = true;

  @query('.horizontal-content') declare private _content: HTMLElement;
  @query('.progress-fill')      declare private _progressFill: HTMLElement;
  @query('.counter')            declare private _counter: HTMLElement;

  private _ticking = false;
  private _ro: ResizeObserver | null = null;

  /* ── Lifecycle ── */
  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    this._ro?.disconnect();
  }

  override firstUpdated(): void {
    // ResizeObserver: recalcula si cambia el viewport o el contenido
    this._ro = new ResizeObserver((): void => {
      // Forzar recálculo en el siguiente frame
      if (!this._ticking) {
        requestAnimationFrame((): void => {
          this._calculate();
          this._ticking = false;
        });
        this._ticking = true;
      }
    });
    this._ro.observe(this);
  }

  /* ── Props → CSS custom properties ── */
  override updated(): void {
    this.style.setProperty('--_scroll-height', `${this.scrollDuration * 100}vh`);
    this.style.setProperty('--_padding-inline', String(this.paddingInline));
  }

  /* ── Scroll handler — con rAF throttle ── */
  private _onScroll = (): void => {
    if (this._ticking) return;
    this._ticking = true;
    requestAnimationFrame((): void => {
      this._calculate();
      this._ticking = false;
    });
  };

  /* ── Cálculo core ── */
  private _calculate(): void {
    if (!this._content || !this._progressFill || !this._counter) return;

    const rect          = this.getBoundingClientRect();
    const scrollable    = rect.height - window.innerHeight;

    // Solo actualiza mientras el bloque está sticky en pantalla
    if (rect.top > 0 || rect.bottom < window.innerHeight) return;

    const scrolled  = -rect.top;
    const progress  = Math.min(Math.max(scrolled / scrollable, 0), 1);

    // maxMove: cuántos px debe desplazarse el track.
    // scrollWidth incluye el padding-left; el padding-right se añade manualmente
    // porque CSS no lo suma al scrollWidth del flex container.
    const paddingRight = window.innerWidth * (this.paddingInline / 100);
    const maxMove = this._content.scrollWidth - window.innerWidth + paddingRight;

    // Mutar el DOM directamente — sin Lit reactivity para mantener 60fps
    this._content.style.transform      = `translateX(-${progress * maxMove}px)`;
    this._progressFill.style.width     = `${progress * 100}%`;
    this._counter.textContent          = `${Math.round(progress * 100)}%`;

    // Emitir evento solo cuando hay cambio real (evita flooding)
    this.dispatchEvent(new CustomEvent<HorizontalScrollProgressEvent>(
      'ui-lib-scroll-progress',
      {
        detail: { progress, percent: Math.round(progress * 100) },
        bubbles: true,
        composed: true,
      },
    ));
  }

  protected override render(): TemplateResult {
    return horizontalScrollTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-horizontal-scroll-section': LibHorizontalScrollSection;
  }
}