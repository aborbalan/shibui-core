# Migración a Katachi (形) — guía para apps consumidoras

> **TL;DR** — No hay nada que migrar. Katachi es aditivo: tu app sigue funcionando
> idéntica sin tocar una línea. Esta guía documenta cómo empezar a aprovecharlo
> cuando estés listo.

---

## ¿Qué cambia para mí?

**Nada** — si no usas `data-katachi="x"` o `<lib-canvas>` en tu HTML, tu app
renderiza exactamente igual que antes. El sistema es un **opt-in puro**.

Lo que tu app gana automáticamente al actualizar a la versión con katachi:

- 39 componentes con bloque `KATACHI · ambient context` documentado
- 18 de ellos con overrides que consumen tokens semánticos (`--bg-surface`,
  `--bg-inverse`, `--text-primary`…) en sus estados clave (active, selected,
  checked, etc.)
- Tipo `KatachiId` exportado desde `@shibui/ui` para autocompletar en TS

Si tienes `variant="kintsugi"` o cualquier `variant=""` explícito en tu app,
**sigue funcionando exactamente igual** y siempre gana sobre el contexto
ambient.

---

## Cómo activarlo

### Opción A · Atributo HTML directo

La forma más simple. Funciona en cualquier framework (React, Angular, Svelte,
plain HTML):

```html
<body data-katachi="kintsugi">
  <!-- todo el árbol hereda el contexto -->
</body>
```

```html
<section data-katachi="sabi">
  <!-- solo esta sección -->
</section>
```

### Opción B · Wrapper tipado `<lib-canvas>`

Para autocompletado y type-safety en TS:

```html
<lib-canvas katachi="kintsugi" display="block" pad="xl">
  <lib-card>…</lib-card>
</lib-canvas>
```

```ts
import type { KatachiId } from '@shibui/ui';

const current: KatachiId = 'kintsugi'; // ← autocompleta los 6 ids
```

| Atributo | Valores | Default | Notas |
|----------|---------|---------|-------|
| `katachi` | `'' \| KatachiId` | `''` | wabi · kintsugi · sabi · terminal · shizen · celadon |
| `display` | `'contents' \| 'block' \| 'flex'` | `contents` | `contents` = sin caja, solo contexto |
| `pad`     | `'' \| 'lg' \| 'xl' \| '2xl'` | `''` | shortcut para box modes |
| `min-h`   | `'' \| 'screen'` | `''` | viewport-tall para demo pages |

---

## Recetas comunes

### Full-page kintsugi

```html
<body data-katachi="kintsugi">
  …
</body>
```

### Una sección dentro de una app neutra

```html
<main>
  <header>…</header>
  <section data-katachi="celadon" style="padding: 32px;">
    <lib-card>se ve celadon</lib-card>
  </section>
  <footer>…</footer>
</main>
```

### Katachi anidados

```html
<section data-katachi="kintsugi">
  <lib-card>kintsugi</lib-card>
  <aside data-katachi="terminal">
    <lib-card>terminal (override del descendiente más cercano)</lib-card>
  </aside>
</section>
```

### Cambio dinámico por estado

```tsx
// React
const [theme, setTheme] = useState<KatachiId>('shizen');
return <lib-canvas katachi={theme} display="block">…</lib-canvas>;
```

```ts
// Vanilla
document.body.setAttribute('data-katachi', 'kintsugi');
document.body.removeAttribute('data-katachi'); // volver al default
```

---

## Coexistencia con dark mode

Katachi y `data-theme="dark"` son ortogonales:

```html
<body data-theme="dark" data-katachi="shizen">
  <!-- dark mode + katachi shizen (sin efectos extras) -->
</body>
```

Cada katachi define su propia familia (`light`/`dark`) — algunos son
intrínsecamente oscuros (wabi, kintsugi, terminal, celadon) y otros claros
(sabi, shizen). Si combinas un katachi dark con `data-theme="dark"`, el
katachi gana en los tokens que define.

---

## Mis componentes con `variant="kintsugi"`, ¿siguen funcionando?

Sí. Los selectores `:host([variant="kintsugi"])` (override explícito) y
`:host(:not([variant]))` (ambient katachi) son **mutuamente exclusivos por
construcción**, no por especificidad:

```html
<section data-katachi="terminal">
  <lib-card>terminal (ambient)</lib-card>
  <lib-card variant="kintsugi">kintsugi (el variant explícito gana)</lib-card>
  <lib-card variant="washi">washi (gana también)</lib-card>
</section>
```

No hay riesgo de pisado accidental. Puedes mezclar libremente.

---

## Setup por framework

### React

Ningún cambio adicional. El `<lib-canvas>` está tipado en `custom-elements.d.ts`
del paquete; tu IDE autocompleta `katachi`, `display`, `pad`.

```tsx
import '@shibui/ui';
import type { KatachiId } from '@shibui/ui';

function App() {
  return (
    <lib-canvas katachi="kintsugi" display="block" pad="xl">
      <lib-card>…</lib-card>
    </lib-canvas>
  );
}
```

### Angular

`CUSTOM_ELEMENTS_SCHEMA` ya habilita los `<lib-*>`. Las directivas generadas
para frameworks Angular cubren los nuevos atributos automáticamente:

```html
<lib-canvas katachi="celadon" display="block">
  <lib-card>…</lib-card>
</lib-canvas>
```

### Svelte

`shibui-elements.d.ts` extiende `svelte/elements` con los nuevos atributos.
Sin cambios adicionales:

```svelte
<lib-canvas katachi="sabi" display="flex" pad="lg">
  <lib-card>…</lib-card>
</lib-canvas>
```

---

## FAQ

### ¿Puedo definir mi propio katachi?

No es un caso soportado por el sistema actual. Si necesitas una personalidad
visual diferente, abre un issue describiendo el caso de uso. Los 6 contextos
están deliberadamente acotados a las estéticas del design system Shibui.

### ¿Funciona dentro de un Shadow DOM mío?

Sí. Las CSS custom properties atraviesan Shadow DOM por herencia. Si tu app
tiene su propio Web Component que envuelve componentes `lib-*`, los katachi
fluyen sin más:

```html
<my-app-shell data-katachi="kintsugi">
  #shadow-root
    <lib-card>…</lib-card>  <!-- hereda kintsugi -->
</my-app-shell>
```

### ¿Qué pasa con los efectos glass/spotlight en un katachi que los silencia?

El componente sigue renderizando, simplemente sin el efecto. Por ejemplo,
`<lib-glass-card>` dentro de `data-katachi="kintsugi"` se ve como una card
sólida sobre la superficie kintsugi — el `--lib-glass-blur-amount` se setea a
`0px` y el `--lib-glass-bg-opacity` a `0`. Ningún ruido visual.

### ¿Afecta a la accesibilidad?

No introduce cambios de contraste sin testear. Cada katachi mantiene la
relación de contraste WCAG AA entre `--text-primary` y `--bg-base`. Si
detectas un fallo, abre un issue.

### ¿Hay impacto en el bundle?

`_katachi.css` añade ≈300 líneas a `dist/tokens.css` (≈10KB pre-gzip / ≈2KB
gzipped). El `<lib-canvas>` wrapper pesa <1KB minificado. Sin efectos en
runtime — todo es CSS estático.

---

## Referencias

- **Conceptos y contrato** — `src/styles/KATACHI.md`
- **Tokens** — `src/styles/shared/tokens/_katachi.css`
- **Matriz componentes × superficies × efectos** — `src/styles/effects-x-surfaces.md`
- **Storybook** — `Foundations/Katachi (形)` y `Components/Atoms/Canvas`
