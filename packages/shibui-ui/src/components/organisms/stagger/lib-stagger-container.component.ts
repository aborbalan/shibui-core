import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { staggerTemplate } from './lib-stagger-container.html';
import staggerCss from './lib-stagger.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { StaggerDirection, StaggerEasing } from './lib-stagger-container.types';

/** Mapeo dirección → valor CSS de transform inicial */
const DIRECTION_MAP: Record<StaggerDirection, string> = {
  up:    'translateY(var(--lib-space-lg))',
  down:  'translateY(calc(-1 * var(--lib-space-lg)))',
  left:  'translateX(var(--lib-space-lg))',
  right: 'translateX(calc(-1 * var(--lib-space-lg)))',
  fade:  'none',
};

/** Mapeo easing → token CSS */
const EASING_MAP: Record<StaggerEasing, string> = {
  default: 'var(--ease-default)',
  out:     'var(--ease-out)',
  bounce:  'var(--ease-bounce)',
};

/**
 * lib-stagger-container
 *
 * Anima los hijos directos en cascada al entrar en el viewport.
 * Usa IntersectionObserver para activar y CSS custom properties
 * individuales para los delays de cada item.
 *
 * @prop delay      — ms entre cada item (default 100)
 * @prop duration   — duración de la animación en ms (default 600)
 * @prop direction  — 'up' | 'down' | 'left' | 'right' | 'fade'
 * @prop easing     — 'default' | 'out' | 'bounce'
 * @prop threshold  — fracción del elemento visible para disparar (default 0.15)
 * @prop once       — animar solo la primera vez (default true)
 *
 * @fires ui-lib-stagger-visible — cuando el contenedor entra en viewport
 * @fires ui-lib-stagger-hidden  — cuando vuelve a salir (si once=false)
 *
 * @slot — Items a animar (cada hijo directo recibe su propio delay)
 */
@customElement('lib-stagger-container')
export class LibStaggerContainer extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(staggerCss)}`,
  ];

  @property({ type: Number })
  delay = 100;

  @property({ type: Number })
  duration = 600;

  @property({ type: String, reflect: true })
  direction: StaggerDirection = 'up';

  @property({ type: String })
  easing: StaggerEasing = 'out';

  @property({ type: Number })
  threshold = 0.15;

  @property({ type: Boolean })
  once = true;

  @queryAssignedElements({ flatten: true })
  declare private _items: HTMLElement[];

  private _observer: IntersectionObserver | null = null;

  /* ── Lifecycle ── */

  /**
   * firstUpdated: el DOM ya está renderizado y el slot poblado.
   * Es el momento correcto para iniciar el observer,
   * a diferencia de connectedCallback que dispara antes del render.
   */
  override firstUpdated(): void {
    this._applyCssVars();
    this._setupObserver();

    // Escuchar cambios en el slot (items añadidos dinámicamente)
    const slot = this.shadowRoot?.querySelector('slot');
    slot?.addEventListener('slotchange', (): void => {
      this._applyCssVars();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
  }

  /* ── Props → CSS custom properties en :host ── */
  override updated(): void {
    this.style.setProperty('--_stagger-from',     DIRECTION_MAP[this.direction]);
    this.style.setProperty('--_stagger-ease',     EASING_MAP[this.easing]);
    this.style.setProperty('--_stagger-duration', `${this.duration}ms`);
  }

  /* ── Asigna --_stagger-delay individual a cada item ── */
  private _applyCssVars(): void {
    this._items.forEach((el, i): void => {
      el.style.setProperty('--_stagger-delay', `${i * this.delay}ms`);
    });
  }

  /* ── IntersectionObserver ── */
  private _setupObserver(): void {
    this._observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        entries.forEach((entry): void => {
          if (entry.isIntersecting) {
            this.setAttribute('visible', '');
            this.dispatchEvent(new CustomEvent('ui-lib-stagger-visible', {
              bubbles: true, composed: true,
            }));
            if (this.once) {
              this._observer?.disconnect();
              this._observer = null;
            }
          } else if (!this.once) {
            this.removeAttribute('visible');
            this.dispatchEvent(new CustomEvent('ui-lib-stagger-hidden', {
              bubbles: true, composed: true,
            }));
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: '0px 0px -40px 0px', // Dispara un poco antes de llegar al borde
      },
    );
    this._observer.observe(this);
  }

  protected override render(): TemplateResult {
    return staggerTemplate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-stagger-container': LibStaggerContainer;
  }
}