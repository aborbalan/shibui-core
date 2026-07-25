# lib-background — capa de calidad (anti-tiling + acabado premium)

Documenta las dos técnicas que hacen que los fondos de `lib-background` se vean a la
altura de la app: **motivos NO tileables** (matan la costura y el pixelado) y una
**capa de acabado compartida** (`--bg-*`) de la que todos los temas tiran.

> Fichero fuente: `src/components/atoms/background/lib-background.css`
> Template: `src/components/atoms/background/lib-background.html.ts`

---

## 1. El problema

Un fondo se veía «barato» por tres defectos, todos del *cómo* se genera la textura:

| Defecto | Causa raíz |
|---|---|
| **Costura de baldosa** | SVG ráster como `background-image` con `background-size` fijo + `repeat` → el motivo se corta y reinicia en cada baldosa. |
| **Repetición de «nube»** | `feTurbulence` de baja frecuencia en una baldosa pequeña → las manchas son mayores que la baldosa y se repiten. |
| **Pixelado** | el SVG se rasteriza a su tamaño intrínseco y se ve borroso al ampliar. |

Los temas que **no** tenían el problema (`phosphor`/`crt`/`amber`/`matrix`, `celadon`)
usan solo `repeating-linear-gradient` + `radial-gradient`: vectorial, sin baldosa
ráster, nítido a cualquier DPI y **matemáticamente continuo** por todo el viewport.

---

## 2. Técnica A — motivo NO tileable (`cover` / `100% 100%`)

**Idea clave:** un SVG **de una sola instancia**, `background-repeat: no-repeat`,
escalado con `background-size: cover` (o `100% 100%`) se rasteriza al **tamaño
pintado** — el SVG es resolución-independiente → **mata la costura Y el pixelado a la vez**.

Reglas:

- **Motivos escasos** (grietas kintsugi): componer UN campo grande (~1600×900) con el
  motivo distribuido y centrado en vertical; usar `cover`. Cualquier recorte muestra el
  motivo, sin distorsión.
- **Texturas densas all-over** (craquelado, hojas, arena rastrillada): rellenar un campo
  grande (~1400×850) con densidad uniforme; usar `cover`. Un recorte cualquiera sigue
  siendo denso, sin repetición.
- **Manchas de turbulencia** (foxed/rust/koke/komorebi): una sola instancia de la
  turbulencia de baja frecuencia a escala viewport (`cover; no-repeat`); el grano fino de
  alta frecuencia SÍ puede seguir en `repeat` (cose sin costura por `stitchTiles`).

Los SVG grandes se generan **offline** con dev-tools deterministas (scripts de
generación en el scratchpad de trabajo, no versionados) — solo la data-URI final se
publica en el CSS. Ver los comentarios de cada tema (`kintsugi-veins`, `craquele`,
`wakaba`, `karesansui`).

> Gotcha CSS: la data-URI SVG va en `url("…")` con **comillas dobles** porque los
> atributos del SVG usan comillas simples. `#` en `url(#id)` de un filtro se codifica
> `%23`.

---

## 3. Técnica B — capa de acabado compartida (`--bg-*`)

Una capa `.bg-finish` (siempre presente en temas no-canvas, `z-index` entre `.bg-overlay`
y `.bg-content`) da el toque premium **uniforme** del que todos los temas tiran:

| Custom property | Rol | Default |
|---|---|---|
| `--bg-grain` | intensidad del grano fino (0..1) | `0.6` |

**Grano de material que se INTEGRA con el fondo (no flota encima).** Detalles clave:

- El grano va **directo en `.bg-finish`** (hermano de `.bg-base` en el stacking context
  del host), **no** en un pseudo-elemento aislado. Un `::before`/`::after` con
  `mix-blend-mode` queda aislado dentro de su propia capa y **blendea contra la nada** →
  el ruido se pinta *encima* y se lee como estática de TV. Como hermano, el `multiply`
  blendea de verdad contra `.bg-base`.
- `:host { isolation: isolate }` acota ese blend al componente (no tiñe lo que haya
  detrás del host).
- El ruido es de **alta frecuencia** y **casi-blanco** (`feComponentTransfer` lo aprieta a
  `[0.84,1]`, alfa forzado a 1) con `mix-blend-mode: multiply`. Física resultante:
  - sobre superficie **clara** → oscurece apenas = grano de papel sutil, mata el banding;
  - sobre superficie **oscura** → `negro × ~1 ≈ negro` = **se desvanece solo**, sin
    puntear. Por eso **no hay que apagarlo tema-a-tema en los oscuros**.

### Ajuste por tema

```css
/* apagar el grano donde ya hay textura/identidad propia */
:host([theme="phosphor"]) { --bg-grain: 0; }   /* CRT: ya tiene scanlines */
:host([theme="celadon"])  { --bg-grain: 0; }   /* cerámica jade limpia */

/* subirlo en un tema claro que aguante más textura */
:host([theme="washi-weave"]) { --bg-grain: 0.9; }
```

Temas con grano apagado por default: `phosphor`, `crt`, `amber`, `matrix`, `scan`,
`glitch`, `static` (CRT/ruido) y `celadon` (identidad ya sellada). Los oscuros no
necesitan apagado explícito: el `multiply` los deja limpios solo.

---

## 4. Qué NO tocar

`terminal` (phosphor/crt/amber/matrix), `celadon`, los 8 gradientes puros
(aurora-light, kaki-glow, celadon-mist, noctiluca, horizon, sakura, twilight, jade-deep)
y los fondos canvas ya estaban a nivel — solo reciben (o no) el grano compartido.
