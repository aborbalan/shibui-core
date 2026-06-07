# Shibui Ecosystem — Root Context

> Para convenciones de contribución orientadas a humanos (pull requests, onboarding), ver `CONTRIBUTING.md`.
> Este fichero es contexto operativo para Claude Code.

---

## Monorepo

Gestionado con **pnpm workspaces** (pnpm@9.15.0, Node >=20).

Workspaces declarados en `pnpm-workspace.yaml`:
- `apps/*` — app-react, app-angular, app-svelte, app-cv, app-tauri, shibui-api
- `packages/*` — shibui-ui (`@shibui/ui`), api-contract ⚠️ WIP — no usable
- `cloudflare/*` — cf-cache-worker

> `app-tauri` requiere **Rust toolchain estable** (`rustup install stable`) además de Node+pnpm. Es una app de escritorio Tauri 2 + React 19 con backend Rust (`crate core/`).

> `packages/api-contract` está en desarrollo activo pero no es consumible todavía. No integrarlo en sugerencias ni en imports.

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
| `pnpm start:react` | Dev app React |
| `pnpm start:svelte` | Dev app Svelte |
| `pnpm start:angular` | Dev app Angular |
| `pnpm start:cv` | Dev app CV (Angular) |
| `pnpm start:api` | Dev server NestJS |
| `pnpm start:tauri` | Dev app Tauri (Vite + ventana nativa) — requiere Rust |
| `pnpm dev:all` | Las tres apps web frontend en paralelo (sin Tauri) |
| `pnpm build:shibui` | Build de `@shibui/ui` |
| `pnpm type-check` | `tsc --noEmit` sobre shibui-ui |
| `pnpm lint` | ESLint sobre shibui-ui |

---

## Git Hooks (Husky)

**pre-commit:**
1. `pnpm --filter @shibui-ui/ui type-check`
2. `lint-staged` (en `packages/shibui-ui`)
3. `stylelint --fix` sobre `src/**/*.css`

**commit-msg:**  
`commitlint` con config en `.config/commitlint.config.cjs`

---

## GitFlow

```
main → develop → feature/*
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
| `packages/shibui-ui/**` | `ci-lib.yml` + `ci-apps.yml` |
| `apps/app-react\|angular\|svelte/**` | `ci-apps.yml` |
| `apps/app-cv/**` | `ci-apps.yml` (deploy a `shibui-cv.web.app`) |
| `apps/shibui-api/**` | `ci-api.yml` |
| `apps/app-tauri/**` | `ci-tauri.yml` (fmt + clippy + tests sobre crate `core/`) |
| `main` + UI cambiada | `release.yml` (tras `ci-lib` exitoso) |

Override manual disponible vía `workflow_dispatch` con flags `force_ui`, `force_react`, `force_angular`, `force_svelte`, `force_cv`, `force_api`.

Secretos necesarios en GitHub repo: `FIREBASE_TOKEN`

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
