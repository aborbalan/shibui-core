# Documentación de hanko

Hogar único de toda la documentación de hanko: specs, decisiones, fases de desarrollo y referencia.

## Mapa

| Carpeta | Qué contiene |
|---|---|
| [`phases/`](phases/) | **Fases de desarrollo** F0–F7 — el plan de obra. |
| [`decisions/`](decisions/) | **ADRs** — decisiones de arquitectura cerradas o aceptadas. |
| [`specs/`](specs/) | **Specs** por subsistema (core, ingest, checks, report). Se van añadiendo. |
| [`special-cases/`](special-cases/) | **Casos especiales** fuera del camino principal CEM/manifest. |
| [`reference/`](reference/) | **Referencia** — material de fondo (Web Components, Lit, manifest). |

## Estado actual

- ✅ `decisions/adr-001-baseline-minima-viable.md` — estrategia de validación (Floor + niveles).
- ✅ `decisions/adr-002-estrategia-testing.md` — tooling de test (Vitest, dos niveles, desde 0).
- ✅ `specs/data-model.md` — modelo de datos del contrato (F0).
- ✅ `specs/ingest.md` — ingestión CEM → modelo (F1).
- ✅ `specs/smoke.md` — smoke / primer sello: Floor + cobertura (F2).
- 🟡 `specs/checks-contract.md` — verificación de contrato declarado ↔ runtime (F3, incr. 1).
- ✅ `special-cases/manifest-ausente-o-custom.html` — sin manifest / formato custom (decisión **abierta**).
- ✅ `reference/web-components-vs-lit-y-manifest.html` — fundamentos (WC vs Lit y el manifest).
- ✅ `reference/runner-y-comunicacion.html` — cómo funciona el runner y cómo se comunican hanko ↔ shibui-ui.
- ✅ `reference/como-funciona-el-check-de-contrato.html` — el mecanismo del check de contrato de F3.
- 🟡 `phases/` — índice F0–F7 + tracker visual `development-phases.html` (F3 en curso).

## Convención

- **Decisiones** → `decisions/adr-NNN-titulo-kebab.md` (formato ADR ligero).
- **Specs** → `specs/<subsistema>.md` (inputs/outputs/restricciones/criterios de aceptación).
- **Fases** → `phases/fN-titulo.md` para el detalle de cada fase; `phases/README.md` como índice.
