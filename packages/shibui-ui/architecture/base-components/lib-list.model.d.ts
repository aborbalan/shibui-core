import { LitElement, TemplateResult, nothing } from 'lit';
/**
 * Modelo base para componentes de lista.
 * Usamos la configuración estática para evitar errores de decoradores en clases abstractas.
 */
export declare abstract class LibListModel<T> extends LitElement {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        loading: {
            type: BooleanConstructor;
        };
        skeletonCount: {
            type: NumberConstructor;
        };
    };
    items: T[];
    loading: boolean;
    skeletonCount: number;
    /**
     * Método obligatorio: define cómo se renderiza cada ítem.
     */
    protected abstract renderItem(item: T, index: number): TemplateResult | typeof nothing;
    /**
     * Método opcional: define el aspecto del estado de carga.
     */
    protected renderSkeleton(): TemplateResult;
    protected render(): TemplateResult;
}
//# sourceMappingURL=lib-list.model.d.ts.map