# cf-cache-worker — Proxy caché de Cloudflare Workers

Worker de Cloudflare que actúa como **reverse proxy con caché en memoria** delante de `shibui-api` (Render.com). Reduce latencia y descarga la API de Render, que tiene cold starts frecuentes en el plan gratuito.

Desplegado en Cloudflare Workers como `shibui-api-cache`.

---

## Arquitectura

```
Cliente
  ↓
Cloudflare Worker (cf-cache-worker)
  ↓ GET → cachea en memoryCache (TTL 1h)
  ↓ POST/PUT/PATCH/DELETE → pasa directo sin cachear
shibui-api (https://shibui-core.onrender.com)
```

**Caché**: `Map<string, CacheEntry>` en memoria del isolate. TTL de 1 hora (`3600 * 1000 ms`). La clave es `pathname + search` de la URL (ignora el host).

**Header de diagnóstico**: toda respuesta incluye `X-Cache: HIT` o `X-Cache: MISS`.

---

## Comportamiento

- **GET**: comprueba `memoryCache`. Si hay entrada válida (no expirada), devuelve directamente con `X-Cache: HIT`. Si no, fetch al origin, guarda la respuesta en caché y devuelve con `X-Cache: MISS`.
- **No-GET**: pasa directo al origin con el método, headers y body originales. No se cachea nunca.
- **Errores del origin**: si `originResponse.ok` es `false`, se retorna la respuesta del origin sin cachear.
- **Headers filtrados**: al reenviar al origin se bloquean `host`, `cf-connecting-ip` y `x-forwarded-for` para no exponer la IP del cliente ni confundir al origin.

---

## Limitaciones importantes

**La caché es por isolate, no global.** Cloudflare Workers puede crear múltiples isolates en paralelo para un mismo Worker; cada uno tiene su propio `memoryCache` Map. Esto significa que la caché no es compartida entre instancias. Para caché compartida real habría que usar KV o Cache API de Cloudflare (actualmente no configurados — el `wrangler.toml` indica "Sin KV ni R2, usamos la Cache API nativa del Worker").

---

## Configuración (`wrangler.toml`)

```toml
name = "shibui-api-cache"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ORIGIN = "https://shibui-core.onrender.com"
```

`env.ORIGIN` es la URL base de `shibui-api`. En desarrollo local, `wrangler dev` usa el valor del `[vars]` salvo que se sobreescriba con un `.dev.vars`.

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `ORIGIN` | URL base de shibui-api (sin trailing slash) | Sí |

En producción se configura en el dashboard de Cloudflare o sobreescribiendo el `[vars]` del `wrangler.toml` antes del deploy.

---

## Scripts

```bash
# Desde cloudflare/worker:
pnpm dev           # wrangler dev — servidor local en http://localhost:8787

# Desde la raíz del monorepo:
pnpm --filter @shibui-api/cf-cache-worker dev        # Dev local
pnpm --filter @shibui-api/cf-cache-worker cf:deploy  # Deploy a Cloudflare
```

El deploy requiere autenticación con `wrangler login` o la variable `CLOUDFLARE_API_TOKEN` en el entorno.

---

## Modificar el TTL o la lógica de caché

El TTL está en `src/index.ts` como constante:

```typescript
const TTL = 3600 * 1000; // 1 hora en ms
```

Para invalidar la caché manualmente en producción es necesario hacer un redeploy (no hay endpoint de purga). Si se necesita invalidación selectiva, valorar migrar `memoryCache` a la **Cache API nativa** de Workers (`caches.default`) que sí permite purga por URL.
