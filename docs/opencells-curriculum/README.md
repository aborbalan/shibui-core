# Currículo de Open Cells — material de referencia

> Este material **ya no gobierna ninguna app del repo**. Se conserva como referencia.

Nació como el plan de un proyecto guiado para aprender Open Cells: Claude hacía la
plomería, el usuario escribía el código del framework hito a hito, y cada hito cerraba con
un post de LinkedIn. La app que lo alojaba era `apps/app-opencells`.

Esa app pasó a ser **`apps/app-torii`**, el hub del ecosistema, y con ello el pacto de
tutor quedó derogado: torii se escribe entera, como producto. El currículo se guarda aquí
para la futura app de aprendizaje, que podrá además usar torii como implementación de
referencia de las mismas ideas (routing por nombre, channels, page controllers).

| Fichero | Qué es |
|---|---|
| [`CURRICULUM.md`](CURRICULUM.md) | Los 6 hitos, el modo de trabajo y el protocolo de continuidad |
| [`HANDOFF.md`](HANDOFF.md) | Estado vivo en el momento del congelado — describe el esqueleto de `app-opencells`, no el de torii |
| `linkedin/` | Carpeta de los posts de la serie |

**Lo que ha caducado dentro de estos ficheros:** las rutas `apps/app-opencells/**`, los
scripts `pnpm start:opencells` / `build:opencells`, el target de Firebase `opencells` y el
site `shibui-showcase-opencells.web.app`. Sus equivalentes actuales son `apps/app-torii/**`,
`pnpm start:torii` / `build:torii`, el target `torii` y `shibui-torii.web.app`.

También ha caducado el «gotcha» de que `@open-cells/core` publica su runtime sin tipos: era
cierto en `1.1.2`, y desde `1.2.0` el paquete trae `types/index.d.ts`.
