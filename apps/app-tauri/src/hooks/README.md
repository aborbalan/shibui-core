# hooks — Hooks de React compartidos

Hooks reutilizables que no pertenecen a un área concreta. (Los hooks específicos de autenticación viven en [`../core/hooks/`](../core/README.md).)

> Un "custom hook" es una función que empieza por `use…` y encapsula lógica con estado para reutilizarla entre componentes.

---

## `useGadgetLayout.ts`

Gestiona la **disposición del grid de gadgets** del dashboard (posición y tamaño de cada widget) y la **persiste** en `localStorage`.

```typescript
const { layout, setLayout, resetLayout } = useGadgetLayout();
```

| Devuelve | Qué es |
|----------|--------|
| `layout` | Array de posiciones (`{ i, x, y, w, h, … }`) que `react-grid-layout` entiende. |
| `setLayout` | Actualiza el layout (se llama cuando el usuario arrastra/redimensiona). Guarda en `localStorage` automáticamente. |
| `resetLayout` | Vuelve al `DEFAULT_LAYOUT`. Lo usa el botón "reset layout" del dashboard. |

### Detalles que conviene conocer

- **Clave de persistencia**: `shibui-dashboard-layout` en `localStorage`.
- **Migración automática**: al cargar, si el layout guardado **no contiene todos** los gadgets del `DEFAULT_LAYOUT` (porque se añadió uno nuevo desde la última vez), se descarta el guardado y se vuelve al por defecto. Así un gadget nuevo nunca queda "huérfano" sin posición.
- El `DEFAULT_LAYOUT` está definido en el propio fichero: si añades un gadget, **añade también su fila aquí** (ver [`../gadgets/README.md`](../gadgets/README.md) → "Añadir un gadget nuevo").
