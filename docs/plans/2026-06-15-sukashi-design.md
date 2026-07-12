# sukashi — biblioteca de patrones decorativos por capas (diseño)

> Fecha: 2026-06-15 · Paquete: `@shibui-ui/sukashi` · Estado: **implementado** (documento histórico de diseño)
>
> ⚠️ Este documento es el **plan de diseño original** y se conserva como registro histórico.
> El paquete ya está implementado y desplegado (F0→F8 completadas). Para el estado y la
> estructura reales, ver [`packages/sukashi/docs/STATUS.md`](../../packages/sukashi/docs/STATUS.md)
> y [`packages/sukashi/docs/phases/README.md`](../../packages/sukashi/docs/phases/README.md).
> La estructura final añadió los módulos `entropy/`, `warifu/` y `warp/` (no previstos aquí) y
> no incluye la carpeta `stories/` que planteaba este diseño.

## Resumen

`sukashi` (透かし — *sukashi-e*: calado y marcas de agua decorativas) es una primitiva estética
de shibui-ui para **componer patrones decorativos por capas**. Genera capas (transparencias) con
texturas tradicionales —seigaiha, asanoha, sashiko, mon— que, al **superponerse**, producen un
**moiré** del que emerge un motivo. Incluye un web component `<shibui-sukashi>` para superposición
interactiva y export a SVG/PNG para impresión sobre acetato.

## Objetivos

- Componer *N* capas decorativas a partir de un motivo y un conjunto de patrones.
- Revelar un motivo emergente al **superponer** las capas (arte de moiré).
- Soportar *weaves* **multi-motivo**: distintos emparejamientos de capas revelan distintos motivos.
- Ser exportable a impresión (acetato) y visualizable en vivo en el navegador.

## Arquitectura (capas)

- `core/` — motor de composición de capas. Estrategias de *weave*: `kasane` (2 capas),
  `threshold` (k de n) y multi-motivo. Puro, sin DOM, **nunca importa `@shibui-ui/ui`**.
  Opera sobre `Bitmap` binario.
- `motif/` — borde de ingestión: rasteriza una fuente (glifo/kanji, SVG, PNG) a un `Bitmap` b/n.
- `pattern/` — covers generativos: seigaiha, asanoha, sashiko, mon, moiré (halftone); paleta katachi.
- `render/` — exporta cada capa a SVG y Canvas/PNG con fondo transparente y marcas de registro.
- `web/` — `<shibui-sukashi>`: superposición en vivo (`mix-blend-mode`) y arrastre con alineación.
- `index.ts` — API pública.

## Flujo

`motivo(s) + patrones` → `motif` (rasteriza/alinea) → `core` (compone capas) → `render` (export)
→ `web` / impresión (superponer).

## Manejo de errores

Dimensiones de motivos no alineadas → error en `motif`; entrada no binaria → dither; **métrica de
contraste** con *fallback*; expansión de resolución → escalado distinto display/print; deriva de
alineación → marcas de registro + *snap*.

## Testing (vitest)

Invariantes de composición; *property-based* (componer las capas reproduce el/los motivos dentro de
tolerancia); *snapshot* visual del render; interacción del web component en Storybook.

## Fases

F0 scaffold · F1 core (composición + render) · F2 `motif` · F3 web component + Storybook ·
F4 `pattern` (covers generativos) · F5 *weaves* multi-motivo · **F6 (stretch)** capas refinadas +
métrica de contraste.

## Estructura

```
packages/sukashi/
├─ package.json        @shibui-ui/sukashi — patrones decorativos por capas
├─ README.md
├─ src/
│  ├─ core/            motor de composición de capas
│  ├─ motif/           rasteriza fuente → bitmap
│  ├─ pattern/         covers generativos (seigaiha, sashiko, mon, moiré)
│  ├─ render/          export SVG/Canvas/PNG (+ marcas de registro)
│  ├─ web/             <shibui-sukashi> custom element
│  └─ index.ts         API pública
├─ stories/            Storybook
└─ docs/               reportes .html
```
