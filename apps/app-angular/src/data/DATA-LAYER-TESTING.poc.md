# POC — Capa de tests para la capa de datos (Angular → React → Svelte)

> Documento de propuesta. No es código todavía: comenta la viabilidad y el enfoque de
> empezar a testear la **capa de datos** (services/clients que hablan con la API Shibui),
> arrancando como **POC en Angular** y replicando luego en React y Svelte.

---

## Por qué

Las tres apps consumen la misma API pero **cada una mantiene su propia copia de los DTOs**
(no hay paquete de contrato compartido — `packages/api-contract` sigue WIP). Eso significa que
un cambio de shape en la API (como el reciente bloque `api` en `ComponentDto`, o el listado que
ahora **omite** `api`) puede romper silenciosamente un consumidor sin que nada lo detecte.

Una capa de tests sobre la capa de datos da una red barata y de alto valor:

- **Fija el contrato** que cada app espera (URL, método, desempaquetado del `ApiEnvelope`,
  shape del DTO, campos opcionales como `api?`).
- **Cubre el manejo de errores** (los services Angular hacen `catchError(() => of([]))` /
  `of(null)`; conviene garantizar ese fallback).
- **Es rápida y determinista**: se mockea HTTP, no se toca red ni la API real.
- **Documenta** cómo se consume cada endpoint.

No cubre UI ni integración end-to-end — solo el "puerto" de datos, que es justo donde el
contrato duplicado es frágil.

---

## Estado del tooling por app

| App | Runner hoy | Mock HTTP disponible | Tests de capa de datos hoy |
|---|---|---|---|
| **Angular** | `ng test` con **Vitest** (builder `@angular/build:unit-test`; `@types/jasmine` sigue en devDeps por legacy) | `HttpClientTestingModule` + `HttpTestingController` (nativo Angular) | ❌ (hay `.spec.ts` de componentes UI, no de `data/services`) |
| **React** | `vitest` | **MSW** (`msw` ya instalado, handlers en `src/test/mocks/`) | ✅ **ya existe** — `data/api/domain/about/api/about.api.test.ts` y `…/hooks/useAbout.test.ts` |
| **Svelte** | — (sin runner) | — | ❌ (no hay tooling de test aún) |

**Observación clave:** React ya tiene el patrón que queremos generalizar. La POC de Angular puede
**inspirarse en él**, y Svelte sería el que más bootstrap necesita.

---

## Qué testear (capa de datos de componentes)

Tomando `data/services/components.service.ts` como sujeto:

- `getCategoriesWithComponents()` → llama a `GET /api/v1/categories/with-components`, desempaqueta
  `envelope.data`, devuelve el array. En error → `[]`.
- `getBySlug(slug)` → llama a `GET /api/v1/components/slug/:slug`, devuelve el `ComponentDto`
  **incluyendo `api`** cuando viene. En error → `null`.
- (Análogo para `tokens.service.ts`.)

Casos mínimos por método: **happy path** (URL correcta + unwrap + shape), **incluye `api`**
(props/slots/events presentes en el detalle), y **error** (fallback `[]`/`null`).

---

## POC en Angular (enfoque recomendado)

Usar el camino **idiomático y de fricción cero** para services con `HttpClient`:
`HttpClientTestingModule` + `HttpTestingController`. No requiere red, no requiere MSW.

### Alcance de la POC
- `apps/app-angular/src/data/services/components.service.spec.ts` *(nuevo)* — cubre
  `getCategoriesWithComponents` y `getBySlug` (happy / con `api` / error).
- (Opcional, para validar el patrón en 2 services) `tokens.service.spec.ts`.

### Ejemplo de spec
```ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentsService } from './components.service';
import { environment } from '@env/environment';

describe('ComponentsService', () => {
  let svc: ComponentsService;
  let http: HttpTestingController;
  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    svc = TestBed.inject(ComponentsService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('getBySlug desempaqueta el envelope e incluye el bloque api', () => {
    let result: unknown;
    svc.getBySlug('lib-button').subscribe((c) => (result = c));

    const req = http.expectOne(`${base}/api/v1/components/slug/lib-button`);
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      data: {
        slug: 'lib-button', tagName: 'lib-button', name: 'Button', /* …campos… */
        api: { props: [{ name: 'variant', type: 'string' }], slots: [], events: [] },
      },
      meta: { timestamp: '', path: '' },
    });

    expect((result as any).api.props[0].name).toBe('variant');
  });

  it('getCategoriesWithComponents devuelve [] ante error', () => {
    let result: unknown;
    svc.getCategoriesWithComponents().subscribe((r) => (result = r));
    http.expectOne(`${base}/api/v1/categories/with-components`).flush('boom', {
      status: 500, statusText: 'Server Error',
    });
    expect(result).toEqual([]);
  });
});
```

### Cómo correr
- `pnpm --filter app-angular test` (`ng test`).

> **Decisión abierta — runner Angular**: `ng test` (Jasmine/Karma) es lo idiomático y ya está
> cableado. Pero `vitest` ya figura en devDeps de Angular; si se prefiere unificar en Vitest en
> las 3 apps, Angular ≥20 admite `@angular/build:unit-test` con Vitest. Para una POC rápida,
> **Jasmine + HttpTestingController** es el menor esfuerzo; la unificación en Vitest puede ser un
> follow-up si gusta el resultado.

---

## Replicar después

### React (ya tiene el patrón)
- Copiar el enfoque de `about` al dominio `components`: `components.api.test.ts` (MSW mockea
  `with-components` y `slug/:slug`, verifica unwrap + `api?`) y `useComponents.test.ts` (verifica
  que `useComponentBySlug` pega al endpoint `slug` y que `initialData` del caché funciona).
- Tooling ya listo (vitest + MSW + handlers en `src/test/mocks/`). Esfuerzo bajo.

### Svelte (necesita bootstrap)
- Añadir `vitest` + script `test`. La capa de datos es `fetch` puro (`lib/api/client.ts` +
  `lib/api/components.ts`), así que basta con mockear `global.fetch` (o usar MSW node) — **no**
  hace falta `@testing-library/svelte` para testear la capa de datos pura.
- Tests: `components.test.ts` (URL + unwrap de `ApiEnvelope` + shape, incl. `api`).

---

## Decisiones abiertas

1. **Runner Angular**: Jasmine/`ng test` (rápido para POC) vs migrar a Vitest (unifica las 3).
2. **Estrategia de mock unificada**: ¿MSW en las 3 (un set de handlers reutilizable) o el mock
   idiomático de cada stack (HttpTestingController en Angular, MSW en React/Svelte)? MSW
   compartido acercaría a un "contrato común" mientras no exista `api-contract`.
3. **Fixtures compartidas**: ¿merece la pena un set de fixtures de respuestas de la API común a
   las 3 apps (mismo JSON), para detectar drift de shape de forma homogénea?

---

## Recomendación

Arrancar la **POC en Angular con `HttpTestingController`** (1–2 spec files, sin tooling nuevo),
validar valor y ergonomía, y si convence, replicar en React (trivial, patrón existente) y
bootstrapear Svelte. Dejar la unificación de runner/mocks (Vitest + MSW en las 3) como decisión
posterior a la luz de la POC.
