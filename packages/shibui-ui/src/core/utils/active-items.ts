/**
 * active-item.ts — Shibui UI Core
 *
 * Lógica pura de gestión de item activo en listas navegables.
 * Sin dependencias de DOM, framework ni Lit.
 *
 * Consumidores actuales:
 *   - lib-tabs   (variantes: underline · pill · card · outline · vertical)
 *   - lib-header (nav links con estado active)
 */

/* ── Tipos ──────────────────────────────────────────────────── */

export interface ActiveItem {
  id: string;
  disabled?: boolean;
}

export interface ActivateResult {
  /** ID del item que se ha activado */
  id: string;
  /** ID del item que estaba activo antes — undefined si no había ninguno */
  prev: string | undefined;
  /** true si el estado realmente cambió (id !== prev) */
  changed: boolean;
}

export interface KeyboardNavOptions {
  /** Orientación del componente — afecta qué teclas navegan */
  orientation?: "horizontal" | "vertical";
  /** Si true, al llegar al final salta al primero (y viceversa) */
  wrap?: boolean;
}

/* ── 1. Resolución de item activo ───────────────────────────── */

/**
 * Devuelve el ID del item activo dado un array de items y un ID candidato.
 *
 * Reglas:
 * - Si `activeId` existe en el array y no está disabled → lo devuelve
 * - Si `activeId` no existe o está disabled → devuelve el primer item no disabled
 * - Si todos están disabled → devuelve undefined
 *
 * @example
 * const active = resolveActiveId(items, 'tab-2');
 */
export function resolveActiveId<T extends ActiveItem>(
  items: T[],
  activeId: string,
): string | undefined {
  const enabled = items.filter((item) => !item.disabled);
  if (enabled.length === 0) return undefined;

  const candidate = enabled.find((item) => item.id === activeId);
  return candidate ? candidate.id : enabled[0]!.id;
}

/**
 * Devuelve el item completo correspondiente al ID activo.
 * Útil cuando se necesita el objeto entero, no solo el ID.
 */
export function resolveActiveItem<T extends ActiveItem>(
  items: T[],
  activeId: string,
): T | undefined {
  const resolvedId = resolveActiveId(items, activeId);
  return resolvedId ? items.find((item) => item.id === resolvedId) : undefined;
}

/* ── 2. Activación de item ──────────────────────────────────── */

/**
 * Calcula el resultado de activar un nuevo item.
 * No muta nada — devuelve un objeto con los datos necesarios
 * para que el componente actualice su estado y emita el evento.
 *
 * @example
 * const result = activateItem(this.active, 'tab-3');
 * if (result.changed) {
 *   this.active = result.id;
 *   dispatchActiveChange(this, result, 'ui-lib-tab-change');
 * }
 */
export function activateItem(
  currentId: string | undefined,
  nextId: string,
): ActivateResult {
  return {
    id: nextId,
    prev: currentId,
    changed: nextId !== currentId,
  };
}

/* ── 3. Dispatcher de evento ────────────────────────────────── */

/**
 * Emite un CustomEvent con bubbles y composed en el host indicado.
 * Tipado genérico para que el detail sea seguro en cada consumidor.
 *
 * @example
 * // En lib-tabs:
 * dispatchActiveChange(this, result, 'ui-lib-tab-change');
 *
 * // En lib-header:
 * dispatchActiveChange(this, result, 'ui-lib-header-link');
 */
export function dispatchActiveChange<T extends ActivateResult>(
  host: EventTarget,
  result: T,
  eventName: string,
): void {
  host.dispatchEvent(
    new CustomEvent(eventName, {
      detail: { id: result.id, prev: result.prev },
      bubbles: true,
      composed: true,
    }),
  );
}

/* ── 4. Navegación por teclado ──────────────────────────────── */

export type KeyNavDirection = "next" | "prev" | "first" | "last" | null;

/**
 * Interpreta un KeyboardEvent y devuelve la dirección de navegación.
 * Devuelve null si la tecla no es relevante para la navegación.
 *
 * No llama a preventDefault — eso es responsabilidad del componente.
 *
 * @example
 * const dir = getNavDirection(e, { orientation: 'horizontal' });
 * if (dir) {
 *   e.preventDefault();
 *   const nextId = navigateItems(items, currentId, dir);
 *   if (nextId) this._activateTab(nextId);
 * }
 */
export function getNavDirection(
  e: KeyboardEvent,
  options: KeyboardNavOptions = {},
): KeyNavDirection {
  const { orientation = "horizontal" } = options;
  const isVertical = orientation === "vertical";

  switch (e.key) {
    case "ArrowRight":
      return !isVertical ? "next" : null;
    case "ArrowDown":
      return isVertical ? "next" : null;
    case "ArrowLeft":
      return !isVertical ? "prev" : null;
    case "ArrowUp":
      return isVertical ? "prev" : null;
    case "Home":
      return "first";
    case "End":
      return "last";
    default:
      return null;
  }
}

/**
 * Dado el array de items, el ID activo actual y una dirección,
 * devuelve el ID del siguiente item a activar (omitiendo disabled).
 *
 * @example
 * const nextId = navigateItems(items, this.active, 'next', { wrap: true });
 */
export function navigateItems<T extends ActiveItem>(
  items: T[],
  currentId: string,
  direction: KeyNavDirection,
  options: KeyboardNavOptions = {},
): string | undefined {
  if (!direction) return undefined;

  const enabled = items.filter((item) => !item.disabled);
  if (enabled.length === 0) return undefined;

  const { wrap = true } = options;
  const currentIndex = enabled.findIndex((item) => item.id === currentId);

  switch (direction) {
    case "first":
      return enabled[0]!.id;
    case "last":
      return enabled[enabled.length - 1]!.id;

    case "next": {
      if (currentIndex === -1) return enabled[0]!.id;
      const next = currentIndex + 1;
      if (next >= enabled.length)
        return wrap ? enabled[0]!.id : enabled[currentIndex]!.id;
      return enabled[next]!.id;
    }

    case "prev": {
      if (currentIndex === -1) return enabled[enabled.length - 1]!.id;
      const prev = currentIndex - 1;
      if (prev < 0)
        return wrap
          ? enabled[enabled.length - 1]!.id
          : enabled[currentIndex]!.id;
      return enabled[prev]!.id;
    }
  }
}

/* ── 5. Helpers de conveniencia ─────────────────────────────── */

/**
 * Combina getNavDirection + navigateItems en un solo paso.
 * Devuelve el ID del siguiente item o undefined si no hay movimiento.
 *
 * @example
 * // En _handleKey de lib-tabs:
 * _handleKey(e: KeyboardEvent): void {
 *   const nextId = resolveKeyNavigation(e, this.items, this.active, {
 *     orientation: this.variant === 'vertical' ? 'vertical' : 'horizontal',
 *   });
 *   if (nextId) {
 *     e.preventDefault();
 *     this._activateTab(nextId);
 *   }
 * }
 */
export function resolveKeyNavigation<T extends ActiveItem>(
  e: KeyboardEvent,
  items: T[],
  currentId: string,
  options: KeyboardNavOptions = {},
): string | undefined {
  const direction = getNavDirection(e, options);
  if (!direction) return undefined;
  return navigateItems(items, currentId, direction, options);
}
