# Contrato de props — Source of Truth (`@shibui/ui`)

> **Este documento es la fuente de verdad** de QUÉ props transversales usa el design
> system y POR QUÉ. Si un componente nuevo necesita un prop de color, tamaño, estilo o
> contexto, **debe** salir de aquí (o ampliar este contrato vía PR), no inventar el suyo.
>
> Implementación del contrato: [`src/types/index.ts`](../src/types/index.ts).
> Verificación: [`component-props-testing.md`](./component-props-testing.md) (suite C1–C15).
> Mapa de migración histórica: [`prop-migration-map.md`](./prop-migration-map.md).

---

## Principio: ejes ortogonales

El error que motivó este contrato fue meter **conceptos distintos bajo el mismo prop**
(p.ej. `variant` = a veces tratamiento visual, a veces color semántico, a veces estética
de marca). La regla raíz:

> **Un prop = un eje conceptual. Un concepto = un solo prop en todo el DS.**

Cada componente compone los ejes que necesita; nunca redefine su significado.

| Prop | Eje | Tipo | Default | Responde a la pregunta… |
|---|---|---|---|---|
| `size` | dimensión | `LibSize` | `md` | ¿Cómo de grande? |
| `tone` | color **semántico** | `LibTone` | `default` | ¿Qué significa (estado/intención)? |
| `tint` | color **decorativo** | `LibTint` | `neutral` | ¿Qué matiz estético (sin significado)? |
| `surface` | contexto de fondo | `LibSurface` | `default` | ¿Sobre qué superficie vive? |
| `variant` | tratamiento **visual** | `LibVariant` | `solid` | ¿Relleno, borde o fantasma? |
| `theme` | estética **signature** | `Lib<Comp>Theme` | (por comp) | ¿Qué piel de marca? |
| `display` | modo de **render** | `Lib<Comp>Display` | (por comp) | ¿Cómo se dibuja la estructura? |
| `status` | estado de proceso | `LibStatus` | `default` | ¿En qué punto del flujo está? |
| `orientation` | dirección | `LibOrientation` | `horizontal` | ¿Horizontal o vertical? |

---

## Los ejes en detalle

### `size` — dimensión
```ts
type LibSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';   // default 'md'
```
- **Por qué**: una única escala dimensional para todo el DS. Antes había 12 escalas
  distintas para el mismo prop `size`; eran en su mayoría subconjuntos del mismo ladder,
  pero sin canonizar.
- **Regla**: un componente puede soportar un **subconjunto contiguo** (p.ej. `sm·md·lg`),
  pero **nunca** nombres nuevos ni reordenados. `md` es siempre el default.
- **Extensiones documentadas** (no inventar más):
  - `LibOverlaySize = LibSize | 'full'` → dialog, drawer, modal.
  - `LibAvatarSize = LibSize | '2xl'` → avatar (presencia más grande).
  - `LibDisplaySize = LibSize | '2xl'` → tipografía display (parallax-text…).
- **Excepción**: `lib-icon.size` es `string` libre (acepta tokens y px). Documentada.

### `tone` — color semántico
```ts
type LibSemanticTone = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'error';
type LibTone = LibSemanticTone | 'muted';   // default 'default'
```
- **Por qué**: el color que **comunica estado o intención**. Es el eje que más fragmentado
  estaba (vivía dentro de `variant`, `color`, `accent`…). Unificarlo permite que
  `tone="error"` signifique lo mismo en badge, dialog, checkbox o progress.
- **Decisiones de valor**:
  - `danger` → **`error`** (un solo término para el rojo en todo el DS).
  - `neutral` (como tono) → **`default`**.
  - **`muted`**: de-énfasis no semántico (gris bajo contraste). Es parte de `LibTone`
    pero NO de `LibSemanticTone` → componentes puramente semánticos (gauge, sparkline)
    usan `LibSemanticTone` y no aceptan `muted`.
- **Excepción documentada**: `strong` (contraste máximo) en `chip`/`badge`. Es emphasis,
  no semántico; se mantiene como extensión local documentada, no se añade a `LibTone`.

### `tint` — color decorativo
```ts
type LibTint = 'neutral' | 'warm' | 'cool' | 'inverse';   // default 'neutral'
```
- **Por qué**: hay componentes con matices de color **sin significado de estado**
  (avatar, glass-card). Llamarlos `tone` rompía la cohesión (dos significados del mismo
  prop). `tint` reserva `tone` para lo semántico.
- **Cuándo**: tintes estéticos cálido/frío/neutro. Si no hay `success`/`error`, es `tint`.

### `surface` — contexto de fondo
```ts
type LibSurface = 'default' | 'inverse' | 'on-dark';   // default 'default'
```
- **Por qué**: el "modo oscuro/invertido" de un componente es **ortogonal** a su tono y a
  su tratamiento. Antes se colaba como valores `dark`/`inverse`/`on-dark` dentro de
  `tone` o `variant`, mezclando ejes.
- **Mapeo**: `dark`/`on-dark` → `on-dark`; `inverse` → `inverse`.
- **Cuándo**: el componente necesita adaptarse a una superficie oscura sin cambiar su tono.

### `variant` — tratamiento visual
```ts
type LibVariant = 'solid' | 'outlined' | 'ghost' | 'subtle';   // default 'solid'
```
- **Por qué**: `variant` queda **exclusivamente** para el tratamiento de relleno/borde.
  `filled` → `solid`, `outline` → `outlined`. Cualquier otro significado migra a su eje.
- **Regla**: si un valor de `variant` es un color (accent/error) → va a `tone`; si es una
  piel de marca (kintsugi/glitch) → va a `theme`; si es un modo de render
  (lines/grid) → va a `display`.

### `theme` — estética signature
- **Por qué**: las variantes estéticas de marca (kintsugi, celadon, sabi, shizen, enso,
  sumi, kin, shizuku, glitch, washi…) son la identidad visual del componente, no un
  tratamiento genérico. Se sacan de `variant` a un prop `theme` por componente
  (`Lib<Comp>Theme`).
- **Fuera del mandato de cohesión**: cada componente define su propio vocabulario `theme`;
  NO se canoniza (son efectos signature deliberados). Alinea con los efectos kintsugi/
  celadon de la identidad Shibui.
- **Aplica a**: header, sidebar, footer, spinner, burger, text-glitch, background,
  drawer, step, stepper (en migración).

### `display` — modo de render
- **Por qué**: valores que describen **cómo se dibuja la estructura**, no su estilo:
  data-table `lines·grid·striped·borderless`, reading-progress `bar·line·dots·ring`,
  color-picker `inline·trigger`, accordion `flush·separated`. Estaban en `variant`.
- **Regla**: `display` por componente (`Lib<Comp>Display`); no es un eje canónico de
  valores compartidos, pero el **nombre del prop** sí es canónico.

### `status` — estado de proceso
```ts
type LibStatus = 'default' | 'active' | 'success' | 'warning' | 'error';
```
- **Por qué**: progreso en un flujo (step, timeline-item). Distinto de `tone` (color) y de
  presencia (status-dot `online·away·busy·offline`, que es dominio propio y no se canoniza).

### Ejes menores
```ts
type LibOrientation = 'horizontal' | 'vertical';   // default 'horizontal'
type LibShape = 'square' | 'rounded' | 'circle';
```

---

## Reglas de naming de props

1. **Un prop por concepto, tipo único.** Prohibido el patrón "flag-o-valor"
   (`label: string | boolean`). Se separa: `label: string` + `showLabel: boolean`;
   `error: boolean` + `errorMessage: string`; etc.
2. **Sin sentinel `''`.** Un prop opcional es `prop?: LibX` (atributo ausente), no
   `prop: LibX | '' = ''`. El extractor además filtra `''` del manifest.
3. **Orden de uniones canónico**: `string | number` (no `number | string`).
4. **Accesibilidad**: `ariaLabel: string` (default `''`), nunca `string | null`.
5. **Atributo = nombre del prop** (kebab si compuesto). El CSS scoped usa
   `:host([prop="valor"])` con el nombre canónico.

---

## Excepciones documentadas (lista cerrada)

| Excepción | Dónde | Por qué |
|---|---|---|
| `size: '2xl'` | avatar, display | escala de presencia/tipografía mayor |
| `size: 'full'` | dialog, drawer, modal | overlay a pantalla completa |
| `size: string` | icon | acepta tokens y px arbitrarios |
| `tone: 'strong'` | chip, badge | emphasis de contraste máximo (no semántico) |
| presencia (`online…`) | status-dot | dominio propio, no es `status` de flujo |

Cualquier excepción nueva requiere añadirse **aquí** en el mismo PR.

---

## Decisiones registradas (rationale)

| Fecha | Decisión | Por qué |
|---|---|---|
| 2026-06-09 | Estéticas → `theme` (no `variant`) | `variant` debe ser solo tratamiento; las pieles de marca son otro eje |
| 2026-06-09 | `button` split `variant`+`tone` | jerarquía (primary/secondary) mezclaba tratamiento y color |
| 2026-06-09 | Modos de render → `display` | "cómo se dibuja" ≠ "tratamiento visual" |
| 2026-06-09 | Decorativo → `tint` | evitar dos significados de `tone` |
| 2026-06-09 | `surface` como prop dedicado | el contexto oscuro es ortogonal a tone/variant |
| 2026-06-09 | `muted` dentro de `LibTone` | de-énfasis es vocabulario único del DS, no per-componente |
| 2026-06-09 | `danger` → `error` · `neutral` → `default` | un solo término por concepto de color |

---

## Gobernanza — cómo evolucionar este contrato

1. **¿Color con significado?** → `tone` (`LibTone`). ¿Sin significado? → `tint`.
2. **¿Relleno/borde?** → `variant`. **¿Piel de marca?** → `theme`. **¿Modo de dibujo?** → `display`.
3. **¿Fondo oscuro/invertido?** → `surface`, no un valor de tone/variant.
4. **¿Tamaño?** → subconjunto contiguo de `LibSize`; si necesitas otra escala, primero
   pregúntate si es de verdad otro eje.
5. Añadir un valor/eje nuevo = editar `src/types/index.ts` **y** este documento **y**
   (si aplica) la allowlist de la suite de tests, todo en el mismo PR. Que duela ampliarlo
   es intencional: protege la cohesión.

El **extractor** (`scripts/generate-components-api.ts`) y la **suite de tests** (C1–C15)
hacen cumplir este contrato sobre el manifest de forma automática.
