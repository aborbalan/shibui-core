# Shibui Ecosystem — Root Context

> Para convenciones de contribución orientadas a humanos (pull requests, onboarding), ver `CONTRIBUTING.md`.
> Este fichero es contexto operativo para Claude Code.

---

## CodeGraph — cargar al arrancar

Las tools `codegraph_*` llegan **deferred** (no cargadas al inicio de sesión).
Antes de cualquier trabajo **estructural** (buscar símbolos, callers/impact,
entender un módulo), cargarlas con `ToolSearch` query `"codegraph"` y preferirlas
a `Grep`/`Read` para preguntas estructurales (qué llama a qué, qué rompe, dónde
se define, firma). Ver la sección CodeGraph del `CLAUDE.md` global para el detalle
de cuándo usar cada tool.

---

## Monorepo

Gestionado con **pnpm workspaces** (pnpm@9.15.0, Node >=20).

Workspaces declarados en `pnpm-workspace.yaml`:
- `apps/*` — app-react, app-angular, app-svelte, app-cv, app-opencells, app-tauri, shibui-api (`@shibui-ui/api`)
- `packages/*` — shibui-ui (`@shibui-ui/ui`), sukashi (`@shibui-ui/sukashi`), hanko (`@shibui-ui/hanko`), consumer-tests (`@shibui/consumer-tests`), consumer-tests-angular
- `cloudflare/*` — cf-cache-worker (`@shibui-api/cf-cache-worker`)

> `app-tauri` requiere **Rust toolchain estable** (`rustup install stable`) además de Node+pnpm. Es una app de escritorio Tauri 2 + React 19 con backend Rust (`crate core/`).

TypeScript base compartido en `tsconfig.base.json`.  
Path alias `@shibui-ui/ui` → `packages/shibui-ui/dist/index.d.ts`.

---

## Gestión de dependencias (pnpm)

```bash
# Instalar en un workspace específico
pnpm add <dep> --filter <package-name>

# Instalar en root (solo devDeps globales)
pnpm add -w <dep>

# Resolver todos los workspaces
pnpm install
```

No añadir dependencias al `package.json` raíz salvo que sean devDeps globales (husky, commitlint, concurrently).  
Cada app/package gestiona las suyas.

---

## Scripts raíz

| Script | Qué hace |
|---|---|
| `pnpm storybook` | Dev Storybook de shibui-ui |
| `pnpm build-storybook` | Build estático de Storybook |
| `pnpm start:react` | Dev app React |
| `pnpm start:svelte` | Dev app Svelte |
| `pnpm start:angular` | Dev app Angular |
| `pnpm start:cv` | Dev app CV (Angular) |
| `pnpm start:opencells` | Dev app OpenCells |
| `pnpm start:api` | Dev server NestJS |
| `pnpm start:tauri` | Dev app Tauri (Vite + ventana nativa) — requiere Rust |
| `pnpm dev:all` | Las tres apps web frontend en paralelo (sin Tauri) |
| `pnpm build:shibui` | Build de `@shibui-ui/ui` |
| `pnpm build:api` | Build de `@shibui-ui/api` |
| `pnpm build:react` | Build app React |
| `pnpm build:cv` | Build app CV |
| `pnpm build:opencells` | Build app OpenCells |
| `pnpm type-check` | `tsc --noEmit` sobre shibui-ui |
| `pnpm lint` | ESLint sobre shibui-ui |
| `pnpm test:consumers` | Consumer contract tests (React × Svelte × Angular) |
| `pnpm test:consumers:react` · `:svelte` · `:angular` | Consumer tests por framework |
| `pnpm worker:cf:dev` · `worker:cf:deploy` | Dev/deploy del Cloudflare cache worker |

---

## Git Hooks (Husky)

**pre-commit:**
1. `pnpm --filter @shibui-ui/ui type-check`
2. Si cambió algún `packages/shibui-ui/src/components/**/*.component.ts`, regenera el
   manifiesto y los datos de la API (`analyze` + `generate:components-api`) y añade
   `apps/shibui-api/src/domain/components/data/components.generated.ts` al commit.
3. `lint-staged` (en `packages/shibui-ui`)
4. `stylelint --fix` sobre `src/**/*.css`

**commit-msg:**  
`commitlint` con config en `.config/commitlint.config.cjs`

**pre-push:**  
GitFlow guard — bloquea el push directo a `main` (solo se actualiza desde `develop` vía PR).

---

## GitFlow

```
feature/* · fix/* · chore/*  ──►  develop  ──PR──►  main
```

- `feature/*` siempre se abre desde `develop` actualizado
- No se inicia una feature nueva sin haber mergeado la anterior a `develop`
- Merge a `develop` siempre con `--no-ff`
- Solo `develop` → `main` via PR, nunca directo

Ramas válidas para CI: `main`, `develop`, `feature/**`, `fix/**`, `chore/**`

Worktree directory (directorio de worktrees del proyecto): **`.claude/worktrees/`** — usar siempre ese, no crear `.worktrees/` ni `worktrees/`.

### ⛔ GitFlow es ABSOLUTO — override sobre cualquier skill/plugin

> Esta regla tiene prioridad máxima y **anula** cualquier protocolo de integración
> de plugins (incluido `godmode:merge-protocol`, que asume `main`/`master` como
> trunk de destino). Si un skill propone mergear hacia `main` o usar `git branch -d`
> sin pasar por `develop`, esa instrucción queda **invalidada** por esta sección.

Trunk de integración por defecto = **`develop`**, NUNCA `main`/`master`.

Reglas no negociables, sin excepción y sin "atajos":

1. **El destino de merge de cualquier `feature/**`, `fix/**` o `chore/**` es `develop`.**
   Jamás `main`. Si una skill detecta el trunk con `git merge-base HEAD main`,
   ignóralo y usa `develop`.
2. **Todo merge a `develop` es `--no-ff`.** Nunca fast-forward.
3. **`main` solo se actualiza desde `develop` y solo vía Pull Request.** Nunca un
   merge/push directo a `main`, ni siquiera local, ni siquiera "porque los tests
   están verdes".
4. **No borrar la rama de feature automáticamente** (`git branch -d/-D`) sin
   confirmación explícita del usuario.
5. Ante cualquier ambigüedad sobre el destino de integración → **preguntar**, no
   asumir `main`.

---

## Conventional Commits

```
<tipo>(<scope>): <descripción en imperativo>
```

| Tipo | Cuándo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `style` | Formato sin lógica |
| `refactor` | Refactorización sin cambio de comportamiento |
| `test` | Tests |
| `chore` | Mantenimiento (deps, config) |

El scope es el nombre del package o app: `lib-button`, `shibui-api`, `app-react`…

---

## CI/CD — Orchestrator

Punto de entrada único: `.github/workflows/orchestrator.yml`

**Patrón:** `paths-filter` detecta qué cambió → activa solo los pipelines necesarios.

| Cambio detectado en | Pipeline activado |
|---|---|
| `packages/shibui-ui/**` · `packages/hanko/**` · `packages/consumer-tests*/**` | `ci-lib.yml` + `ci-apps.yml` |
| `apps/app-react\|angular\|svelte/**` | `ci-apps.yml` |
| `apps/app-cv/**` | `ci-apps.yml` (deploy a `shibui-cv.web.app`) |
| `apps/app-opencells/**` | `ci-apps.yml` |
| `apps/shibui-api/**` | `ci-api.yml` |
| `apps/app-tauri/**` | `ci-tauri.yml` (fmt + clippy + tests sobre crate `core/`) |
| `packages/sukashi/**` | `ci-sukashi.yml` (type-check + tests; deploy demo a `sukashi.web.app` solo en `main`) |
| `main` + UI cambiada | `release.yml` (tras `ci-lib` exitoso) |

Override manual disponible vía `workflow_dispatch` con flags `force_ui`, `force_react`, `force_angular`, `force_svelte`, `force_cv`, `force_opencells`, `force_api`, `force_tauri`, `force_sukashi`, `force_hanko_issues`.

Secretos necesarios en GitHub repo: `FIREBASE_TOKEN` (deploys Firebase), `VITE_API_URL` (build React en `ci-apps.yml`), `NPM_SECRET` (publish en `release.yml`), `DISCORD_WEBHOOK` (`notify.yml`).

### Consumer Contract Tests — ejecución selectiva

Los consumer tests (React × Svelte × Angular, ~2min) solo corren si se cumplen **dos condiciones a la vez**:

**1. Qué cambió** (`ui_behavior = true`):
- TypeScript de componentes: `packages/shibui-ui/src/**/*.ts`
- Tokens katachi/semánticos: `src/styles/shared/tokens/_katachi.css` · `_semantic.css`
- Ficheros de consumer-tests: `packages/consumer-tests/**` · `packages/consumer-tests-angular/**`
- CSS scoped a Shadow DOM **excluido** — los tests no validan estilos internos.

**2. Contexto de ejecución**:
- ✅ PR hacia `develop` o `main`
- ✅ Push directo a `develop` o `main`
- ✅ `workflow_dispatch` manual
- ❌ Push a `feature/**`, `fix/**`, `chore/**`

Ver documentación completa en `packages/consumer-tests/CLAUDE.md`.
