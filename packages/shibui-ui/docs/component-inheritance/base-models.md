# 🏛️ Modelos Base y Genéricos

Para evitar la duplicidad de lógica y garantizar un contrato de datos coherente en toda la librería, utilizamos **Clases Base Abstractas** y **Tipos Genéricos**.

## 🧬 LibListModel<T>

Es el modelo fundamental para cualquier componente que maneje colecciones de datos (listas, grids, tablas).

### ⚙️ Arquitectura Técnica
- **Ubicación:** `src/architecture/models/lib-list.model.ts`
- **Tipo:** Clase Abstracta (no instanciable directamente).
- **Generic `<T>`:** Permite definir qué tipo de objeto contiene la lista (strings, objetos complejos, etc.).

### 📋 Propiedades Heredadas (`static properties`)
Todos los hijos que extiendan este modelo contendrán automáticamente:
- `items: T[]`: El array de datos.
- `loading: boolean`: Estado de carga.
- `skeletonCount: number`: Cantidad de elementos visuales de carga.

---

## 🛠️ Patrón de Extensión (Uso de `super`)

Cuando un componente hereda del modelo, debe seguir estas reglas para asegurar que la lógica base no se rompa:

### 1. Implementación de Métodos Abstractos
El hijo **debe** implementar `renderItem(item: T, index: number)`, que es invocado por el bucle `.map()` del padre.

### 2. Uso de `super.render()`
Si el componente hijo necesita envolver la lista en una estructura específica (como un `<ul>`, `<ol>` o un `<div>` con clases especiales), debe invocar al render del padre:

```typescript
protected override render(): TemplateResult {
  return html`
    <nav class="custom-wrapper">
      ${super.render()} </nav>
  `;
}