import { LitElement, html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import styles from './lib-stagger.css?inline';

@customElement('lib-stagger-container')
export class LibStaggerContainer extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number }) delay: number = 100;

  // Forzamos la búsqueda de todos los elementos asignados al slot
  @queryAssignedElements({ flatten: true }) _items!: Array<HTMLElement>;

  private _observer?: IntersectionObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupObserver();
  }

  private _setupObserver(): void {
    this._observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("🚀 Stagger: ¡Contenedor visible! Animando...");
            this._applyStagger();
            this.setAttribute('visible', '');
            this._observer?.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Empezar a animar un poco antes de que entre del todo
      }
    );
    this._observer.observe(this);
  }

  private _applyStagger(): void {
    console.log(`📦 Animando ${this._items.length} elementos`);
    this._items.forEach((el, index) => {
      el.style.setProperty('--stagger-delay', `${index * this.delay}ms`);
    });
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}