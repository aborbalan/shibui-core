# CI/CD Workflows — Shibui Ecosystem

Punto de entrada único: `orchestrator.yml`. Los pipelines de CI son
`workflow_call` (reusables) invocados por el orquestador. `notify.yml` es la
excepción: se dispara por `workflow_run` cuando el orquestador termina, no es
un `workflow_call`.

---

## Mapa de workflows

```
orchestrator.yml          ← único trigger externo (push / PR / dispatch)
  ├── ci-lib.yml           ← UI library: quality + build + tests + deploy Storybook + hanko (test/seal/report)
  ├── ci-apps.yml          ← Apps: build React/Angular/Svelte/CV/torii + deploy Firebase
  ├── ci-api.yml           ← NestJS API: lint + build + test + deploy docs (Firebase Hosting)
  ├── ci-tauri.yml         ← Rust core: fmt + clippy + cargo test
  ├── ci-sukashi.yml       ← Sukashi: type-check + tests + deploy demo (sukashi.web.app, solo main)
  ├── ci-kura.yml          ← kura: type-check + tests + humo del CLI. NO despliega
  └── release.yml          ← NPM publish (solo main + ci-lib exitoso)

notify.yml                 ← workflow_run: notifica a Discord al completar el orquestador
```

---

## Orquestador: cómo decide qué corre

`dorny/paths-filter` compara el diff del push/PR contra patrones de rutas.
Los outputs del job `detect-changes` son la API pública hacia los pipelines.

### Filtros definidos

| Output | Rutas vigiladas | Uso |
|---|---|---|
| `ui` | `packages/shibui-ui/**` · `packages/hanko/**` · `packages/consumer-tests/**` · `packages/consumer-tests-angular/**` | Activa `ci-lib.yml` completo |
| `ui_behavior` | `packages/shibui-ui/src/**/*.ts` · tokens `_katachi.css` · `_semantic.css` · `packages/consumer-tests/**` · `packages/consumer-tests-angular/**` | Activa solo los Consumer Contract Tests dentro de ci-lib |
| `react` | `apps/app-react/**` | Activa ci-apps para React |
| `angular` | `apps/app-angular/**` | Activa ci-apps para Angular |
| `svelte` | `apps/app-svelte/**` | Activa ci-apps para Svelte |
| `cv` | `apps/app-cv/**` | Activa ci-apps para CV (deploy a `shibui-cv`) |
| `torii` | `apps/app-torii/**` | Activa ci-apps para torii |
| `api` | `apps/shibui-api/**` | Activa ci-api |
| `tauri` | `apps/app-tauri/**` | Activa ci-tauri |
| `sukashi` | `packages/sukashi/**` | Activa ci-sukashi (type-check + tests; deploy demo solo en main) |
| `kura` | `packages/kura/**` | Activa ci-kura (type-check + tests + humo del CLI, sin red ni secretos) |

Cada output tiene lógica OR con su flag `force_*` de `workflow_dispatch`.

---

## ci-lib.yml: jobs y condiciones

```
quality            → siempre (type-check + lint)
build-ui           → siempre (needs: quality)
test-stories       → siempre (needs: quality, paralelo con build-ui)
test-consumers     → CONDICIONAL (needs: build-ui) ← ver abajo
deploy-storybook   → solo develop/main (needs: build-ui)
hanko-test         → tests del harness de confianza (packages/hanko)
hanko-seal         → genera/sella el Trust Report (needs: hanko-test)
deploy-hanko-report→ publica el Trust Report (needs: hanko-seal)
```

### Consumer Contract Tests — doble filtro

Los tests de integración con React/Svelte/Angular (~2min) son los más costosos.
Se ejecutan solo si **ambas condiciones** son verdaderas:

**Condición 1 — qué cambió** (`inputs.ui_behavior == 'true'`):  
Ficheros que afectan el contrato observable desde fuera. CSS scoped a Shadow DOM
excluido: los tests no validan estilos internos de componentes.

**Condición 2 — contexto** (`inputs.event` / `inputs.ref`):  
Solo en PRs, pushes a `develop`/`main`, o `workflow_dispatch` manual.  
En pushes a `feature/**` / `fix/**` se omiten para no penalizar el desarrollo.

```yaml
if: |
  inputs.ui_behavior == 'true' &&
  (inputs.event == 'pull_request' ||
   inputs.event == 'workflow_dispatch' ||
   inputs.ref == 'refs/heads/develop' ||
   inputs.ref == 'refs/heads/main')
```

---

## Overrides manuales

`workflow_dispatch` expone estos flags booleanos:

| Flag | Efecto |
|---|---|
| `force_ui` | Activa ci-lib + consumer tests (como si ui_behavior fuera true) |
| `force_react` | Activa ci-apps para React |
| `force_angular` | Activa ci-apps para Angular |
| `force_svelte` | Activa ci-apps para Svelte |
| `force_cv` | Activa ci-apps para CV |
| `force_torii` | Activa ci-apps para torii |
| `force_api` | Activa ci-api |
| `force_tauri` | Activa ci-tauri |
| `force_sukashi` | Activa ci-sukashi |
| `force_kura` | Activa ci-kura |
| `force_hanko_issues` | Activa la emisión de issues del harness hanko en ci-lib |

---

## Secretos requeridos

| Secreto | Usado en |
|---|---|
| `FIREBASE_TOKEN` | `ci-apps.yml` (deploy) · `ci-lib.yml` (deploy Storybook + hanko report) · `ci-api.yml` (deploy docs) · `ci-sukashi.yml` (deploy demo) |
| `VITE_API_URL` | `ci-apps.yml` (build React) |
| `NPM_SECRET` | `release.yml` (`NODE_AUTH_TOKEN` para publish) |
| `DISCORD_WEBHOOK` | `notify.yml` |
