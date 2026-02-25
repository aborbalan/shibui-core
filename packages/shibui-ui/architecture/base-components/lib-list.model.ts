import { LitElement, html, TemplateResult, nothing } from 'lit';

/**
 * Modelo base para componentes de lista.
 * Usamos la configuración estática para evitar errores de decoradores en clases abstractas.
 */
export abstract class LibListModel<T> extends LitElement {
  
  // Definición estática de propiedades para evitar el error del decorador
  static override properties = {
    items: { type: Array },
    loading: { type: Boolean },
    skeletonCount: { type: Number }
  };

  items: T[] = [];
  loading = false;
  skeletonCount = 3;

  /**
   * Método obligatorio: define cómo se renderiza cada ítem.
   */
  protected abstract renderItem(item: T, index: number): TemplateResult | typeof nothing;
  /**
   * Método opcional: define el aspecto del estado de carga.
   */
  protected renderSkeleton(): TemplateResult {
    return html`<div class="skeleton-default">Loading...</div>`;
  }

  protected override render(): TemplateResult {
    return html`
      <div class="list-container ${this.loading ? 'loading' : ''}">
        ${this.loading 
          ? Array(this.skeletonCount).fill(0).map(() => this.renderSkeleton())
          : this.items.length > 0 
            ? this.items.map((item, index) => this.renderItem(item, index))
            : html`<slot></slot>` 
        }
      </div>
    `;
  }
}