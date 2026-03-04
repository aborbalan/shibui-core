import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './lib-parallax.css?inline';
import { parallaxTemplate } from './lib-parallax.html';

@customElement('lib-parallax-container')
export class LibParallax extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Intensidad del efecto (multiplicador) */
  @property({ type: Number }) speed: number = 0.2;

  private _observer?: IntersectionObserver;
  private _isVisible: boolean = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupObserver();
    window.addEventListener('scroll', this._handleScroll, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    window.removeEventListener('scroll', this._handleScroll);
  }

  private _setupObserver(): void {
    this._observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // 1. Obtenemos la primera entrada de forma segura
        const entry = entries[0];
        
        // 2. Si no existe la entrada, abortamos (Guard Clause)
        if (!entry) return;

        // 3. Ahora el compilador sabe que 'entry' es seguro
        this._isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    this._observer.observe(this);
  }
  private _handleScroll = (): void => {
    if (!this._isVisible) return;

    const scrolled = window.scrollY;
    const offset = this.offsetTop;
    const yPos = (scrolled - offset) * this.speed;

    // Aplicamos la transformación a los hijos directos del slot
    const slottedElements = this.shadowRoot
      ?.querySelector('slot')
      ?.assignedElements();

    slottedElements?.forEach((el) => {
      if (el instanceof HTMLElement) {
        // Cada elemento puede tener su propio factor de velocidad vía data-attribute
        const factor = parseFloat(el.dataset.parallaxFactor || '1');
        el.style.transform = `translate3d(0, ${yPos * factor}px, 0)`;
      }
    });
  };

  protected override render(): TemplateResult {
    return parallaxTemplate(this);
  }
}