# sukashi — fases de desarrollo

> Plan de obra de `@shibui-ui/sukashi`. Cada fase es un incremento verificable.
> Trunk de integración: **`develop`** (merges `--no-ff`). Tests/builds desde el repo principal.

**Estado actual:** F0 · F1 · F2 · F3 · F4 · F4½ · F5 · F6 · F7 ✅ — **plan F0→F7 completo**, sin fases pendientes (ver [`STATUS.md`](../STATUS.md)).
**Visual del roadmap:** [`roadmap.html`](roadmap.html) — línea de tiempo F0→F7 (camino crítico + opcionales).

---

## Orden de fases

| Fase | Nombre | Entregable | Estado |
|---|---|---|---|
| **F0** | Andamiaje | `package.json`, `tsconfig`, `vitest`, README; estructura `src/` | ✅ hecha |
| **F1** | Núcleo de composición | `Bitmap`, tabla de patrones, *weave* de 2 capas, `compose`, render SVG/PNG | ✅ hecha |
| **F2** | Ingestión de motivo | rasterizar fuente (glifo/SVG/PNG) → bitmap; alineación de pares | ✅ hecha |
| **F3** | Web component + demo | `<shibui-sukashi>` + web de demo propia (sukashi.web.app); superposición en vivo (`mix-blend-mode`) | ✅ hecha |
| **F4** | Patrones decorativos | covers generativos (seigaiha, asanoha, sashiko, mon, moiré); capas con cover + métrica | ✅ hecha |
| **F5** | Weaves multi-motivo | distintos emparejamientos de capas revelan distintos motivos | ✅ hecha |
| **F6** | (stretch) Refinado | multi-motivo con cover + métrica de contraste/fidelidad y *fallback* + reporte HTML | ✅ hecha |
| **F4½** | (opcional) Deformación uzumaki | warp en remolino: covers en espiral + deformar/des-deformar capas con Ω | ✅ hecha |
| **F7** | (opcional) Semilla del cielo | sembrar los patrones desde una foto del cielo (kumo), mezclada con la semilla del sistema | ✅ hecha |

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

### F3 — Web component + web de demo
`<shibui-sukashi>` (Shadow DOM): apila capas con `mix-blend-mode: multiply`; capa superior arrastrable con *snap* a marcas de registro.
En vez de Storybook, **web de demo propia** en `demo/` (Vite + TS, sin dependencia de `@shibui-ui/ui`) desplegada en **sukashi.web.app** (target Firebase `sukashi`): showcase con selector de motivo, reveal arrastrable y vista de capas por separado.
**Hecho cuando:** arrastrar una capa sobre otra revela el motivo en vivo.

### F4 — Patrones decorativos (covers generativos)
Generadores deterministas: seigaiha, asanoha, sashiko, mon, moiré → halftone (trama Bayer). `kasaneCoverWeave` elige por celda la tesela que mejor reproduce el cover en ambas capas, exponiendo una **métrica** (`contrast` · `fidelity` · `belowThreshold` · `warnings`). Cada capa, vista sola, lleva la textura del patrón —no ruido— manteniendo el reveal exacto.
**Hecho cuando:** capas con cover legibles como patrón + reveal correcto. Detalle y compromiso (densidad fija 50% → textura, no tono) en [`../patterns.md`](../patterns.md).

### F5 — Weaves multi-motivo ✅
`core/multiweave`: `kasaneMultiWeave(motifs)` teje **un pivote + un pétalo por motivo**; `compose([pivots[i], petals[i]])` revela `motifs[i]`. El conjunto base de patrones es cerrado bajo complemento, así que cada capa vista sola queda uniforme (independencia marginal).

**Seguridad — sin reutilización de pivote (default).** Por defecto cada secreto usa un **pivote independiente**, de modo que ningún subconjunto de capas filtra nada: es un reparto k-de-2 propio por motivo. El modo `sharedPivot: true` reutiliza un único pivote (más compacto, una capa menos) pero introduce la fuga clásica de *two-time pad* — quien tenga dos pétalos obtiene `motivo_i XOR motivo_j`. Esto honra el diseño original ("la capa pivote no se reutiliza; el núcleo lo impide"): la reutilización ya no es el comportamiento por defecto, sino una opción explícita y etiquetada.

**Hecho cuando:** cada par reproduce su motivo (error 0); independencia marginal de cada capa (χ²); y la superposición de dos pétalos **no** reconstruye `motivo_i XOR motivo_j` en modo default (sí en `sharedPivot`, verificado como fuga conocida). ✅ 7 tests en `core/multiweave.test.ts`.

### F6 — (stretch) Refinado ✅
`core/multicover`: `kasaneMultiCoverWeave(motifs, { cover })` generaliza `kasaneCoverWeave` (F4) al reparto multi-motivo de F5 — **cada capa guiada por su cover**. El revelado sigue siendo estructural (contraste ≈ 0.5 por emparejamiento); lo que varía con los covers es la **fidelidad** de cada capa. Hereda la garantía de F5: por defecto **pivote independiente por secreto** (cada par es un `kasaneCoverWeave` propio, sin fuga cruzada); `sharedPivot: true` reutiliza un pivote común guiado por su cover. La **métrica** expone `contrast[]` (por par), `pivotFidelity[]` y `petalFidelity[]`; bajo umbral marca `warnings` y, con `fallback: true`, cae a capas ruido (`kasaneMultiWeave`) conservando el reveal exacto. `render/renderContrastReport` vuelca la métrica a HTML; `scripts/gen-contrast-report.ts` (`pnpm --filter @shibui-ui/sukashi report`) genera `docs/contrast-report.html`.
**Hecho cuando:** métrica expuesta; bajo umbral → *fallback* + aviso; reporte HTML; sin fuga cruzada por defecto. ✅ 11 tests (`core/multicover.test.ts` + `render/report.test.ts`).

### F4½ — (opcional) Deformación uzumaki (渦) ✅
Módulo `src/warp/`: un campo de deflexión en remolino parametrizado por Ω (giro angular dependiente del radio, `falloff(ρ)=(1−ρ)²`) que (1) genera covers en espiral —`spiral`, hermana de seigaiha/moiré, registrada como cover `uzumaki`— y (2) **deforma** cada capa (`warpAll`), reversible des-deformando con −Ω (`unwarpAll`). Como `compose` conmuta con un remap idéntico, `compose(warpAll(L,Ω)) === warp(compose(L),Ω)` (exacto): la superposición revela el motivo girado y `unwarpAll` lo endereza. **Ω es estética/ofuscación, NO la clave.** Detalle en [`../warp.md`](../warp.md).
**Hecho cuando:** `warp(layer, Ω)` y su inverso son fieles dentro de tolerancia; warp puro y testeable en node, re-exportado en el barrel y usado en la demo (cover Uzumaki + deslizador Ω). ✅ 9 tests (`src/warp/uzumaki.test.ts`).

### F7 — (opcional) Semilla del cielo (kumo 雲) ✅
Módulo `src/entropy/`: `openSky(capture)` toma una foto del cielo, la condensa (SHA-256) y la **mezcla por XOR** con `systemSeed` (`mixSeed`, **nunca lo reemplaza** — al ser XOR sobre un CSPRNG no degrada aunque el cielo sea pobre), con *health-test* (imagen congelada / entropía baja) y *fallback* a la semilla del sistema. El adaptador de cámara `cameraSky` (browser-only) queda fuera del barrel node; el núcleo solo conoce la interfaz `SkyCapture` y es testeable en node. Detalle en [`../entropy.md`](../entropy.md).
**Hecho cuando:** `openSky` produce semilla mezclada y cae a `systemSeed` si la cámara falla; el `weave` funciona idéntico con cualquiera de los dos. ✅ 27 tests (`src/entropy/*.test.ts`, incl. weave-compat error 0).
