# shibui-api (`@shibui-ui/api`)

API backend del ecosistema Shibui, construida con **NestJS**. Sirve el contenido del
showcase (about, componentes, tokens, categorías, ejemplos) y la autenticación admin.

> Este README cubre el arranque. Para la arquitectura por dominios, guards, prefijo
> `api/v1`, Docker y despliegue, ver [`CLAUDE.md`](CLAUDE.md).

## Requisitos

- Node ≥ 20 y **pnpm** ≥ 9 (el monorepo usa pnpm workspaces; no usar `npm`).

## Arranque

```bash
# Desde la raíz del monorepo:
pnpm start:api                       # dev server (watch)

# Desde apps/shibui-api:
pnpm --filter @shibui-ui/api start:dev   # dev (watch)
pnpm --filter @shibui-ui/api build       # build de producción
```

## Tests

```bash
pnpm --filter @shibui-ui/api test        # unit
pnpm --filter @shibui-ui/api test:e2e    # e2e
pnpm --filter @shibui-ui/api test:cov    # cobertura
```

## Dominios (`src/domain/`)

`about` · `auth` · `categories` · `components` · `examples` · `tokens` · `users`

Cada dominio sigue el patrón `{domain}.module.ts` + controller + service + entities.
El dominio `components` se alimenta de datos generados (`components.generated.ts`) desde
`@shibui-ui/ui` (ver hook pre-commit en el `CLAUDE.md` raíz).

## Docker / despliegue

Build multi-stage y despliegue de docs vía Firebase Hosting (`ci-api.yml`).
Ver [`CLAUDE.md`](CLAUDE.md) para el detalle.
