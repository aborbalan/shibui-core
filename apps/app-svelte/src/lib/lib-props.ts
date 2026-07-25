/**
 * Action para pasar props complejas (arrays, objetos, números) a un
 * custom element `lib-*`.
 *
 * Los atributos HTML solo transportan strings, y Svelte pinta atributo —no
 * propiedad— mientras el elemento no esté actualizado. Como `@shibui-ui/ui`
 * se importa dinámicamente en `App.svelte`, en el primer render los `lib-*`
 * todavía son elementos desconocidos: un array acabaría serializado como
 * `[object Object]`.
 *
 * ```svelte
 * <lib-data-table use:libProps={{ columns, data }}></lib-data-table>
 * ```
 */
export function libProps(node: HTMLElement, props: Record<string, unknown>) {
  let current = props;

  const assign = (values: Record<string, unknown>): void => {
    for (const [key, value] of Object.entries(values)) {
      (node as unknown as Record<string, unknown>)[key] = value;
    }
  };

  void customElements.whenDefined(node.localName).then(() => assign(current));

  return {
    update(next: Record<string, unknown>): void {
      current = next;
      if (customElements.get(node.localName)) assign(next);
    },
  };
}
