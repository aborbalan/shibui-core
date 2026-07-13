# shibui-api (`@shibui-ui/api`) — API REST NestJS

API REST que sirve el contenido del showcase de Shibui UI y gestiona el área de administración.

Desplegada en Render.com: `https://shibui-core.onrender.com`

---

## Stack

- **NestJS 11** + **TypeScript estricto**
- **Passport + passport-jwt** — autenticación JWT
- **@nestjs/swagger** + **@scalar/nestjs-api-reference** — documentación OpenAPI (UI Scalar)
- **class-validator** + **class-transformer** — validación y transformación de DTOs
- **Jest** + **Supertest** — unit tests y e2e
- **Docker** — multi-stage build (Node 22 alpine)

---

## Estructura

```
src/
  main.ts                   → Bootstrap, prefijo global, pipes, interceptors, OpenAPI
  app.module.ts             → Módulo raíz — importa todos los dominios
  common/
    filters/
      all-exceptions.filter.ts    → Manejo global de errores (formato unificado)
    guards/
      jwt-auth.guard.ts           → JwtAuthGuard — aplica con @UseGuards(JwtAuthGuard)
    interceptors/
      response.interceptor.ts     → Envuelve todas las respuestas en el envelope estándar
      cache-control.interceptor.ts → Cache-Control por método HTTP
  domain/                   → Un módulo por dominio
    about/
    auth/
    categories/
    components/
    examples/
    tokens/
    users/
  scripts/
    generate-openapi.ts     → Genera openapi.json + index.html en docs-dist/
test/
  app.e2e-spec.ts
  jest-e2e.json
```

### Estructura interna de cada dominio

```
{domain}/
  {domain}.module.ts
  {domain}.controller.ts
  {domain}.service.ts
  dto/
  entities/
```

---

## Configuración global (`main.ts`)

- **Prefijo global:** `api/v1` — todas las rutas son `GET /api/v1/{domain}/...`
- **ValidationPipe:** `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **ResponseInterceptor:** envuelve toda respuesta exitosa en el envelope estándar
- **CacheControlInterceptor:** `GET` → `public, max-age=60, s-maxage=3600, stale-while-revalidate=60` / resto → `no-store`
- **AllExceptionsFilter:** captura cualquier excepción y devuelve el formato de error estándar
- **OpenAPI (Scalar):** disponible en `/api/docs` (tema: saturn)

---

## Formato de respuesta

Todas las respuestas pasan por `ResponseInterceptor` y `AllExceptionsFilter`.

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "path": "/api/v1/about"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Not found",
    "code": "NotFoundException"
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "path": "/api/v1/components/bad-id"
  }
}
```

---

## Auth

Un único usuario administrador, sin base de datos:

- **Email fijo:** `admin@shibui.dev`
- **Password:** variable de entorno `ADMIN_PASSWORD` (fallback: `changeme`)
- **JWT:** firmado con `JWT_SECRET`, expira en 1h
- **Guard:** `JwtAuthGuard` (`src/common/guards/jwt-auth.guard.ts`)

```typescript
// Proteger un endpoint
@UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateComponentDto) { ... }
```

Las rutas públicas (sin guard) no requieren token.

---

## Fuente de datos

**No hay base de datos.** Los datos están hardcodeados en los servicios como propiedades privadas de clase.

Al añadir o modificar datos del dominio `about` (perfil, experiencia, habilidades…), editar directamente `about.service.ts`.

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `JWT_SECRET` | Secreto de firma de JWT | Sí |
| `ADMIN_PASSWORD` | Contraseña del administrador | Sí |
| `PORT` | Puerto del servidor | No (default: 3000) |

---

## Scripts

```bash
pnpm start:api          # Dev con watch (desde raíz del monorepo)

# Desde apps/shibui-api:
pnpm start:dev          # Dev con watch
pnpm start:prod         # Producción (requiere build previo)
pnpm build              # Compila a dist/
pnpm generate:openapi   # Genera docs-dist/openapi.json + index.html
pnpm test               # Unit tests (Jest)
pnpm test:e2e           # E2E tests (Supertest)
```

---

## OpenAPI

El spec se genera con el script `src/scripts/generate-openapi.ts`:

```bash
pnpm generate:openapi
# → docs-dist/openapi.json
# → docs-dist/index.html (copia desde docs-static/)
```

En dev, el spec está disponible en vivo en `http://localhost:3000/api/docs`.

---

## Docker

Multi-stage build (builder + production), Node 22 alpine, puerto 3000.

```bash
docker build -t shibui-api .
docker run -p 3000:3000 \
  -e JWT_SECRET=secret \
  -e ADMIN_PASSWORD=pass \
  shibui-api
```
