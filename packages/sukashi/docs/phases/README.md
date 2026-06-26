# sukashi — fases de desarrollo

> Plan de obra de `@shibui-ui/sukashi`. Cada fase es un incremento verificable.
> Trunk de integración: **`develop`** (merges `--no-ff`). Tests/builds desde el repo principal.

**Estado actual:** F0 · F1 ✅ hechas · siguiente: F2 (y F4 en paralelo) — ver [`STATUS.md`](../STATUS.md).
**Visual del roadmap:** [`roadmap.html`](roadmap.html) — línea de tiempo F0→F7 (camino crítico + opcionales).

---

## Orden de fases

| Fase | Nombre | Entregable | Estado |
|---|---|---|---|
| **F0** | Andamiaje | `package.json`, `tsconfig`, `vitest`, README; estructura `src/` | ✅ hecha |
| **F1** | Núcleo de composición | `Bitmap`, tabla de patrones, *weave* de 2 capas, `compose`, render SVG/PNG | ✅ hecha |
| **F2** | Ingestión de motivo | rasterizar fuente (glifo/SVG/PNG) → bitmap; alineación de pares | — |
| **F3** | Web component | `<shibui-sukashi>` + Storybook; superposición en vivo (`mix-blend-mode`) | — |
| **F4** | Patrones decorativos | covers generativos (seigaiha, asanoha, sashiko, mon, moiré); capas con cover | — |
| **F5** | Weaves multi-motivo | distintos emparejamientos de capas revelan distintos motivos | — |
| **F6** | (stretch) Refinado | capas con cover + métrica de contraste y *fallback* | — |
| **F4½** | (opcional) Deformación uzumaki | warp en remolino: covers en espiral + deformar/des-deformar capas con Ω | — |
| **F7** | (opcional) Semilla del cielo | sembrar los patrones desde una foto del cielo (kumo), mezclada con la semilla del sistema | — |

> Los adaptadores **opcionales** (F4½, F7) son enchufables: el núcleo solo depende de las interfaces (`SeedSource` y el punto de enganche del transform), nunca de la cámara ni del warp. Ninguno está en el camino crítico.

---

## Detalle por fase

### F0 — Andamiaje
Crear el paquete (espejo del estilo de `packages/hanko`): `package.json` (`@shibui-ui/sukashi`), `tsconfig.json` extendiendo `tsconfig.base.json`, `vitest.config.ts`, README decorativo, y el esqueleto `src/{core,motif,pattern,render,web}` + `index.ts`.
**Hecho cuando:** `type-check` pasa en limpio.

### F1 — Núcleo de composición de capas
`Bitmap` (matriz binaria), tabla de patrones base 2×2, *weave* de 2 capas y `compose` (superposición = OR por bloque), `render` a SVG y Canvas/PNG con fondo transparente y marcas de registro.
Incluye el *seam* `SeedSource` (semilla; default = `systemSeed`) que alimenta el *weave*, y un punto de enganche para transformar capas — preparan los adaptadores opcionales (uzumaki, kumo) sin acoplarlos al núcleo.
**Hecho cuando:** `compose(weave(motivo))` reproduce el motivo dentro de tolerancia; test de independencia (una capa aislada no correlaciona con el motivo) en verde.

### F2 — Ingestión de motivo
`motif/rasterize`: fuente (glifo/kanji, SVG, PNG) → bitmap b/n (threshold/dither). `alignPair` rechaza dimensiones no alineadas (el núcleo solo recibe pares alineados).
**Hecho cuando:** un kanji de ejemplo se rasteriza y compone correctamente.

### F3 — Web component
`<shibui-sukashi>` (Shadow DOM): apila capas con `mix-blend-mode: multiply`; capa superior arrastrable con *snap* a marcas de registro. Story en Storybook.
**Hecho cuando:** arrastrar una capa sobre otra revela el motivo en vivo.

### F4 — Patrones decorativos (covers generativos)
Generadores deterministas: seigaiha, asanoha, sashiko, mon, moiré → halftone. *Weave* con cover: cada capa, vista sola, parece arte (no ruido), manteniendo el reveal.
**Hecho cuando:** capas con cover legibles como patrón + reveal correcto.

### F5 — Weaves multi-motivo
Construcción de 3 capas donde el emparejamiento (pivote + capa B) revela un motivo y (pivote + capa C) revela otro.
**Hecho cuando:** los dos emparejamientos reproducen sus dos motivos respectivos; independencia validada para las tres capas.

### F6 — (stretch) Refinado
Combinar covers (F4) con multi-motivo (F5). Exponer una **métrica de contraste**; bajo umbral → *fallback* y aviso. Reporte HTML en `docs/contrast-report.html`.

### F4½ — (opcional) Deformación uzumaki (渦)
Módulo `src/warp/`: un campo de deflexión en remolino parametrizado por Ω que (1) genera covers en espiral —hermana de seigaiha/moiré— y (2) **deforma** cada capa, reversible des-deformando con −Ω. Una capa deformada solo "encaja" con el Ω correcto.
**Hecho cuando:** `warp(layer, Ω)` y su inverso son fieles dentro de tolerancia; integrado como transform opcional en el render.

### F7 — (opcional) Semilla del cielo (kumo 雲)
Módulo `src/entropy/`: un `SeedSource` alternativo que toma una foto del cielo, la condensa y la **mezcla** con `systemSeed` (nunca lo reemplaza), con *health-test* (detectar imagen congelada) y *fallback* a la semilla del sistema. Da a las capas un origen físico y poético.
**Hecho cuando:** `skySeed` produce semilla mezclada y cae a `systemSeed` si la cámara falla; el `weave` funciona idéntico con cualquiera de los dos.
