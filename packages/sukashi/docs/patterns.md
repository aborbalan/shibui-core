# F4 — Patrones decorativos (covers generativos)

> Cómo `pattern/` genera texturas tradicionales y cómo `core/` las teje en capas que,
> vistas solas, parecen arte y, superpuestas, siguen revelando el motivo.

---

## 1. Generadores de patrón (`src/pattern/`)

Cada generador es una función pura y determinista `(PatternOptions) → Bitmap`:

```ts
import { seigaiha, asanoha, sashiko, mon, moire } from '@shibui-ui/sukashi';

const cover = seigaiha({ width: 96, height: 96, scale: 12, seed: 0 });
```

| Generador | Motivo | Notas |
|---|---|---|
| `seigaiha` | 青海波 olas — arcos concéntricos escalonados | rejilla escalonada + bandas radiales |
| `asanoha` | 麻の葉 hoja de cáñamo — retícula isométrica | tres familias de líneas a 0°/60°/120° |
| `sashiko` | 刺し子 pespuntes — rejilla discontinua | el más disperso (ver §3) |
| `mon` | 家紋 emblema heráldico radial | k pétalos + anillo + punto central |
| `moire` | モアレ interferencia de dos retículas | `scale` ≈ periodo; `seed` desafina el ángulo |

Internamente, cada patrón define un **campo continuo** de densidad y lo convierte a bitmap
binario por **trama ordenada** (Bayer 4×4, `halftone`). La densidad local de tinta aproxima
el campo → textura de semitono determinista y teselable. `seed` desplaza fase/ángulo;
`scale` fija el tamaño del módulo.

El registro `PATTERNS_BY_NAME` permite elegir un patrón por etiqueta; `KATACHI` aporta tonos
tradicionales (sumi, washi, kaki, celadon) para teñir los covers al renderizar.

## 2. Capas con cover (`kasaneCoverWeave`)

```ts
const { layers, metric } = kasaneCoverWeave(motif, { cover });
```

A diferencia de `kasaneWeave` —que elige cada tesela base al azar y deja cada capa como
ruido uniforme— `kasaneCoverWeave` elige, **por celda**, la tesela que mejor reproduce el
cover. Para cada celda se evalúan las 6 teselas base y se queda con la de menor error
combinado frente a **ambos** covers (capa A y capa B); los empates se rompen prefiriendo el
mejor ajuste de la capa A. Acepta un único `cover` (aplicado a ambas capas) o un par
`{ a, b }`.

El **revelado es estructural**: una celda de fondo usa la misma tesela en las dos capas
(superposición 50%); una de tinta usa teselas complementarias (superposición 100%). Por eso
`reconstructError(compose(layers), motif) === 0` **siempre**, sea cual sea el cover.

### Métrica (`metric`)

| Campo | Significado |
|---|---|
| `contrast` | densidad(tinta) − densidad(fondo) en la superposición; estructuralmente ≈ 0.5 |
| `fidelity` | `[A, B]` fracción de subpíxeles de cada capa que coinciden con su cover (0..1) |
| `belowThreshold` | true si `contrast < minContrast` o alguna fidelidad < `minFidelity` |
| `warnings` | mensajes legibles de los umbrales incumplidos |

Umbrales configurables: `minContrast` (default 0.4), `minFidelity` (default 0.5).

## 3. Compromiso honesto

Cada bloque de 2×2 subpíxeles lleva **siempre 2 celdas de tinta** (50% de densidad fija).
Eso garantiza el revelado exacto, pero implica que el cover **no puede aportar tono**
(claroscuro): solo se expresa a través de la *disposición* de la tinta. Consecuencias:

- Los patrones de **línea/rejilla cerca del 50% de densidad** (asanoha, moiré, mon) se tejen
  con buena fidelidad (≈ 0.70–0.79 en la capa A).
- Los patrones con **grandes zonas sólidas o muy dispersas** (seigaiha relleno, sashiko)
  pierden su contraste tonal y se leen como *ritmo/textura* más que como una estampa nítida
  (sashiko ≈ 0.57, el más débil).
- En todos los casos la fidelidad supera con holgura la línea base del ruido (≈ 0.50): cada
  capa lleva **estructura visible**, no ruido uniforme.
- El sesgo de revelado se concentra en la **capa B** (la A se mantiene fiel a su cover incluso
  bajo el motivo).

Un esquema con más subpíxeles por celda (tono real de semitono) queda para una iteración
futura; el núcleo actual prioriza el revelado garantizado.
