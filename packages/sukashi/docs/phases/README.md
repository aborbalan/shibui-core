# sukashi — fases de desarrollo

> Plan de obra de `@shibui-ui/sukashi`. Cada fase es un incremento verificable.
> Trunk de integración: **`develop`** (merges `--no-ff`). Tests/builds desde el repo principal.

**Estado actual:** ⏳ F0 pendiente (próximo paso accionable).

---

## Orden de fases

| Fase | Nombre | Entregable | Estado |
|---|---|---|---|
| **F0** | Andamiaje | `package.json`, `tsconfig`, `vitest`, README; estructura `src/` | ⏳ pendiente |
| **F1** | Núcleo de composición | `Bitmap`, tabla de patrones, *weave* de 2 capas, `compose`, render SVG/PNG | — |
| **F2** | Ingestión de motivo | rasterizar fuente (glifo/SVG/PNG) → bitmap; alineación de pares | — |
| **F3** | Web component | `<shibui-sukashi>` + Storybook; superposición en vivo (`mix-blend-mode`) | — |
| **F4** | Patrones decorativos | covers generativos (seigaiha, asanoha, sashiko, mon, moiré); capas con cover | — |
| **F5** | Weaves multi-motivo | distintos emparejamientos de capas revelan distintos motivos | — |
| **F6** | (stretch) Refinado | capas con cover + métrica de contraste y *fallback* | — |

---

## Detalle por fase

### F0 — Andamiaje
Crear el paquete (espejo del estilo de `packages/hanko`): `package.json` (`@shibui-ui/sukashi`), `tsconfig.json` extendiendo `tsconfig.base.json`, `vitest.config.ts`, README decorativo, y el esqueleto `src/{core,motif,pattern,render,web}` + `index.ts`.
**Hecho cuando:** `type-check` pasa en limpio.

### F1 — Núcleo de composición de capas
`Bitmap` (matriz binaria), tabla de patrones base 2×2, *weave* de 2 capas y `compose` (superposición = OR por bloque), `render` a SVG y Canvas/PNG con fondo transparente y marcas de registro.
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
