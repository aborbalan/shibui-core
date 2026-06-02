# Celadon · 青磁 — Katachi (tema) y decoraciones

> Referencia del katachi **celadon**: identidad visual, tokens y la capa de 10
> decoraciones cerámicas. Para la auditoría de cobertura por componente ver
> `celadon-audit.md`; para el registro de superficies×efectos ver
> `effects-x-surfaces.md`; para el handoff de diseño original ver
> `celadon-effects-spec.md` y el prototipo `celadon-taxonomy.html`.

---

## 1. Identidad

Celadon es un katachi **oscuro** (`family: dark`) inspirado en la cerámica
celadon coreana (青磁, *seiji*): una glasura jade honda, fría y serena sobre la
que la luz, el agua y el craquelé del esmalte cobran protagonismo.

| Propiedad | Valor |
|---|---|
| `--katachi-id` | `celadon` |
| `--katachi-family` | `dark` |
| Acento | `--color-celadon-400` (`#4E9482`) |
| Activación | `data-katachi="celadon"` en cualquier ancestro |
| Efecto signature | decoraciones de agua/cerámica (craquelé, niebla, marea…) + **sombra jade** ambiental |

La activación es **contextual**: basta con un ancestro `data-katachi="celadon"`
y todos los componentes descendientes adaptan su superficie por herencia de
custom properties a través del Shadow DOM. Ningún componente necesita una prop
de variante para tomar la identidad celadon.

```html
<div data-katachi="celadon">
  <lib-card>…</lib-card>      <!-- jade oscuro + sombra jade, automático -->
  <lib-button>…</lib-button>  <!-- reflejo + iridescencia en hover -->
</div>
```

---

## 2. Tokens semánticos (`_katachi.css`)

Colores del prototipo, en oklch. Definidos bajo `[data-katachi="celadon"]`.

| Token | Valor | Uso |
|---|---|---|
| `--bg-base` | `oklch(13.5% 0.022 180deg)` | Fondo de página |
| `--bg-surface` | `oklch(18.5% 0.026 178deg)` | Superficie |
| `--bg-elevated` | `oklch(23% 0.030 178deg)` | Superficie elevada |
| `--bg-inverse` | `oklch(92% 0.040 180deg)` | Inverso (claro) |
| `--text-primary` | `oklch(92% 0.040 180deg)` | Texto principal (jade pálido) |
| `--text-secondary` | `oklch(70% 0.038 177deg)` | Texto secundario |
| `--text-muted` | `oklch(58% 0.036 176deg)` | Texto atenuado |
| `--text-accent` / `--text-link` | `--color-celadon-400` / `-300` | Acento / enlace |
| `--border-subtle` / `-default` / `-strong` | `21%` / `27%` / `34%` (jade) | Bordes |

### Sombra jade (ambiental, sistémica)

Override de `--shadow-*` con sombra teñida en jade frío y honda (no negro puro).
Es la única decoración celadon que llega a **todos** los componentes sin opt-in.

```css
--shadow-md:
  0 2px 8px  oklch(5% 0.042 178deg / 0.62),
  0 1px 2px  oklch(7% 0.050 172deg / 0.50);
--shadow-lg:
  0 4px 12px oklch(5% 0.042 178deg / 0.72),
  0 10px 32px oklch(7% 0.052 172deg / 0.48);
```

---

## 3. Paleta extendida (`_palette.css`)

La escala `--color-celadon-50…600` ya existía. Las decoraciones añaden:

| Token | Valor | Uso |
|---|---|---|
| `--color-celadon-glint` | `oklch(98% 0.012 172deg)` | Realce especular (gotas, glaze) |
| `--color-celadon-opal` | `oklch(65% 0.08 196deg)` | Azul frío para iridescencia (hue-shift) |
| `--color-celadon-250` | `oklch(75.8% 0.048 169.2deg)` | Interpolación 200↔300 (realce craquelé) |
| `--celadon-shadow-deep` | `oklch(5% 0.04 178deg)` | Fisura del craquelé / sombra de gota |
| `--celadon-water` | `oklch(51% 0.057 169deg)` | Cuerpo de agua / frente de marea |
| `--celadon-water-deep` | `oklch(40% 0.050 172deg)` | Agua honda / fondo de marea |

Tokens compuestos de efecto en `_effects.css`: `--lib-celadon-glaze`,
`--lib-celadon-depth`, `--lib-celadon-mist`, `--lib-celadon-iridescence`.

---

## 4. Las 10 decoraciones

| # | Decoración | Tipo | Mecanismo |
|---|---|---|---|
| 1 | **Craquelé** (氷裂) | estática · generativa | Red de grietas (fisura hundida + borde que capta luz). SVG generado por `celadon-generative.ts` (PRNG determinista). |
| 2 | **Translucencia** | estática | Esmalte vidrioso vía API glass (opt-in). |
| 3 | **Condensación** | estática · generativa | Micro-gotas con especular + menisco + sombra. SVG generativo. |
| 4 | **Marea** | animada | Oleaje que viaja: dos ondas en paralaje (máscara `repeat-x` desplazada un periodo) + cresta. |
| 5 | **Reflejo** | animada | Banda de luz difusa que barre el vidriado (`glaze-sweep`). |
| 6 | **Niebla** | animada | Tres blobs jade borrosos que derivan con `mix-blend-mode: screen` (9/12/15s). |
| 7 | **Iridescencia** | hover | Overlay diagonal opalescente (hue-shift `celadon-400`→`opal`). |
| 8 | **Profundidad** | estática | Masa de agua oscura hundida en la base. |
| 9 | **Sombra jade** | estática · ambiental | `box-shadow` teñido en jade (override `--shadow-*`). |
| 10 | **Menisco** | estática | Curva cóncava de tensión superficial + línea capilar. |

### Arquitectura

- **Tokens** (paleta + paints): en `_palette.css` / `_effects.css`, entran en el
  bundle global `tokens.css` (heredan a todos los componentes).
- **Capa estructural** `.fx-*`: en `src/styles/shared/celadon-decorations.css`,
  importada por `?inline` **sólo** en los componentes piloto (no infla al resto).
- **Generadores**: `src/styles/shared/celadon-generative.ts` (craquelé y
  condensación, portados del prototipo, deterministas por semilla).
- **Helper de capas**: `src/styles/shared/celadon-decorations.ts`
  (`celadonDecorationLayers(decoration)`).

### Gate "solo-celadon"

Las capas `.fx-*` usan `display: var(--lib-celadon-fx-display, none)`. El katachi
celadon pone el token a `block`; fuera de celadon el fallback `none` las oculta.
Cross-browser, sin JS ni `:host-context`. (`lib-footer[variant="celadon"]` lo
habilita localmente al ser un contexto celadon en sí mismo.)

---

## 5. Activación y cobertura por componente

Tres mecanismos:

| Mecanismo | Cómo | Componentes |
|---|---|---|
| **Ambiental** | sin prop, por `data-katachi="celadon"` | **todos** (tema oscuro + sombra jade) |
| **Opt-in capas** | prop `decoration="…"` | `lib-card` (Surface), `lib-header` / `lib-footer` (Bar) |
| **Opt-in contexto** | hover, sin prop | `lib-button`, `lib-chip`, `lib-status-dot` |

```html
<!-- Surface: capas opt-in via prop -->
<div data-katachi="celadon">
  <lib-card decoration="craquelure mist depth reflejo">…</lib-card>
</div>

<!-- Bar -->
<lib-header variant="celadon" decoration="tide condensation depth">…</lib-header>
<lib-footer variant="celadon" decoration="tide condensation depth">…</lib-footer>
```

Valores de `decoration` (separados por espacio): `craquelure` · `condensation` ·
`depth` · `mist` · `reflejo` · `iridescence` · `tide` · `meniscus`.

### Paridad con kintsugi

Para coherencia, celadon tiene un bloque de tratamiento análogo (en jade) en los
**mismos 11 componentes** que reciben kintsugi (oro): `button`, `select`, `tabs`,
`range-slider`, `quote`, `step`, `display-heading`, `divider`, `eyebrow`, `kbd`,
`lib-counter` — además de `chip`, `status-dot` y `skeleton`.

---

## 6. Accesibilidad

`@media (prefers-reduced-motion: reduce)` desactiva las decoraciones animadas
(marea, niebla, reflejo, shimmer de menisco) y conserva las estáticas (craquelé,
condensación, profundidad, sombra jade). El craquelé despeja el centro con una
máscara radial para no competir con el contenido.

---

## 7. Ficheros

| Fichero | Contenido |
|---|---|
| `shared/tokens/_katachi.css` | Bloque `[data-katachi="celadon"]` (tema oscuro + sombra jade + gate) |
| `shared/tokens/_palette.css` | Escala celadon + tokens de decoración |
| `shared/tokens/_effects.css` | Paints compuestos (glaze, depth, mist, iridescence) |
| `shared/celadon-decorations.css` | Capa estructural `.fx-*` (opt-in) |
| `shared/celadon-generative.ts` | Generadores craquelé / condensación |
| `shared/celadon-decorations.ts` | Helper de capas + tipo `CeladonDecoration` |

---

*Decoraciones celadon — documentado 2026-05-31.*
