import { LitElement, html } from 'lit';
/**
 * Modelo base para componentes de lista.
 * Usamos la configuración estática para evitar errores de decoradores en clases abstractas.
 */
export class LibListModel extends LitElement {
    // Definición estática de propiedades para evitar el error del decorador
    static properties = {
        items: { type: Array },
        loading: { type: Boolean },
        skeletonCount: { type: Number }
    };
    items = [];
    loading = false;
    skeletonCount = 3;
    /**
     * Método opcional: define el aspecto del estado de carga.
     */
    renderSkeleton() {
        return html `<div class="skeleton-default">Loading...</div>`;
    }
    render() {
        return html `
      <div class="list-container ${this.loading ? 'loading' : ''}">
        ${this.loading
            ? Array(this.skeletonCount).fill(0).map(() => this.renderSkeleton())
            : this.items.length > 0
                ? this.items.map((item, index) => this.renderItem(item, index))
                : html `<slot></slot>`}
      </div>
    `;
    }
}
