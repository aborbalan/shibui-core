# cloudflare/ — Workspace de Cloudflare

Directorio contenedor de los proyectos Cloudflare del monorepo (workspace `cloudflare/*`).

Actualmente hay **un** proyecto:

| Proyecto | Qué es | Doc |
|---|---|---|
| [`worker/`](worker/) | `cf-cache-worker` — reverse proxy con caché en memoria delante de `shibui-api` (Render.com) | [`worker/CLAUDE.md`](worker/CLAUDE.md) |

> El contexto operativo real está en [`worker/CLAUDE.md`](worker/CLAUDE.md). Este fichero solo
> existe para orientar al entrar por el contenedor. Al añadir un nuevo proyecto Cloudflare,
> añádelo a la tabla con su propio CLAUDE.md.
