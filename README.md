# Shibui Ecosystem

> **渋い** — Librería de componentes UI agnóstica de framework, construida sobre **Web Components + Lit**, con un ecosistema de apps de demostración multi-framework alrededor.

Monorepo gestionado con **pnpm workspaces**. Una sola fuente de verdad (`@shibui-ui/ui`) consumida por apps en React, Angular, Svelte, una app de escritorio Tauri y una API NestJS.

---

## 🧭 Filosofía — *Write Once, Run Everywhere*

En lugar de mantener un set de componentes por framework, escribimos **Web Components nativos** como única fuente de verdad:

- **Core:** [Lit](https://lit.dev) como capa ligera sobre el estándar de Web Components.
- **Agnosticismo:** el código base no depende de ningún framework externo.
- **Contrato:** se extraen metadatos vía JSDoc → **Custom Elements Manifest** (`custom-elements.json`).
- **Wrappers automáticos:** un pipeline genera bindings nativos para React (`@lit/react`), directivas Angular y tipos `.d.ts` para Svelte.

Documentación completa en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 📦 Estructura del monorepo

Workspaces declarados en [`pnpm-workspace.yaml`](pnpm-workspace.yaml):

### `apps/*`

| Workspace | Nombre paquete | Stack | Rol |
|---|---|---|---|
| `app-react` | `app-react` | React 19 + Vite | Showcase de consumo en React |
| `app-angular` | `app-angular` | Angular | Showcase de consumo en Angular |
| `app-svelte` | `app-svelte` | Svelte 5 + Vite | Showcase de consumo en Svelte |
| `app-cv` | `app-cv` | Angular | CV / portfolio (deploy a `shibui-cv`) |
| `app-opencells` | `app-opencells` | OpenCells | Showcase / laboratorio de consumo |
| `app-tauri` | `@shibui/app-tauri` | Tauri 2 + React 19 + **Rust** | App de escritorio nativa |
| `shibui-api` | `@shibui-ui/api` | NestJS | API backend |

### `packages/*`

| Workspace | Nombre paquete | Rol |
|---|---|---|
| `shibui-ui` | `@shibui-ui/ui` | **Librería UI** (Web Components + Lit) — fuente de verdad |
| `sukashi` | `@shibui-ui/sukashi` | 透かし — motor generativo de patrones (demo en `sukashi.web.app`) |
| `hanko` | `@shibui-ui/hanko` | 判子 — motor de verificación de confianza (*trust*) manifest-driven |
| `consumer-tests` | `@shibui/consumer-tests` | Consumer contract tests (React 19 × Svelte 5 × Angular 21) |
| `consumer-tests-angular` | `@shibui/consumer-tests-angular` | Fixture Angular 21 para los consumer tests |

### `cloudflare/*`

| Workspace | Nombre paquete | Rol |
|---|---|---|
| `worker` | `@shibui-api/cf-cache-worker` | Cloudflare Worker de caché |

---

## ✅ Requisitos

| Herramienta | Versión | Necesaria para |
|---|---|---|
| Node.js | ≥ 20 | Todas las apps |
| pnpm | ≥ 9 (`pnpm@9.15.0`) | Todas las apps |
| Rust toolchain estable | última stable | `app-tauri` únicamente |

```bash
# Tauri requiere además:
rustup install stable
```

---

## 🚀 Quick start

```bash
# 1. Instalar dependencias de todos los workspaces
pnpm install

# 2. Build de la librería (las apps la consumen)
pnpm build:shibui

# 3. Arrancar lo que necesites (ver tabla de scripts)
pnpm storybook        # Storybook de @shibui-ui/ui
pnpm dev:all          # React + Svelte + Angular en paralelo
```

> Las apps consumen `@shibui-ui/ui` desde su `dist/`, así que ejecuta `pnpm build:shibui` antes de arrancarlas si has tocado la librería.

---

## 🛠️ Scripts raíz

| Script | Qué hace |
|---|---|
| `pnpm storybook` | Dev Storybook de shibui-ui |
| `pnpm build-storybook` | Build estático del Storybook |
| `pnpm start:react` | Dev app React |
| `pnpm start:svelte` | Dev app Svelte |
| `pnpm start:angular` | Dev app Angular |
| `pnpm start:cv` | Dev app CV (Angular) |
| `pnpm start:opencells` | Dev app OpenCells |
| `pnpm start:api` | Dev server NestJS |
| `pnpm start:tauri` | Dev app Tauri (Vite + ventana nativa) — requiere Rust |
| `pnpm dev:all` | React + Svelte + Angular en paralelo (sin Tauri) |
| `pnpm build:shibui` | Build de `@shibui-ui/ui` |
| `pnpm build:api` · `build:react` · `build:cv` · `build:opencells` | Builds individuales |
| `pnpm type-check` | `tsc --noEmit` sobre shibui-ui |
| `pnpm lint` | ESLint sobre shibui-ui |
| `pnpm test:consumers` | Consumer contract tests (build + Playwright) |
| `pnpm test:consumers:react\|svelte\|angular` | Consumer tests por framework |
| `pnpm worker:cf:dev` · `worker:cf:deploy` | Dev / deploy del Cloudflare Worker |

---

## 🧩 Gestión de dependencias (pnpm)

```bash
pnpm add <dep> --filter <package-name>   # En un workspace específico
pnpm add -w <dep>                        # En root (solo devDeps globales)
pnpm install                             # Resolver todos los workspaces
```

No añadir dependencias al `package.json` raíz salvo devDeps globales (husky, commitlint, concurrently). Cada app/package gestiona las suyas.

---

## 🌿 Flujo de trabajo (GitFlow)

```
main  ←─PR─  develop  ←──  feature/* · fix/* · chore/*
```

- `feature/*` se abre siempre desde `develop` actualizado.
- Merge a `develop` siempre con `--no-ff` (nunca fast-forward).
- `main` solo se actualiza desde `develop` **vía Pull Request** — nunca push directo.

### Conventional Commits

```
<tipo>(<scope>): <descripción en imperativo>
```

Tipos: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`.
El scope es el nombre del package o app (`lib-button`, `shibui-api`, `app-react`…).
Validado por `commitlint` ([`.config/commitlint.config.cjs`](.config/commitlint.config.cjs)).

Guía completa de contribución en [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 🔁 CI/CD — Orchestrator

Punto de entrada único: [`.github/workflows/orchestrator.yml`](.github/workflows/orchestrator.yml).

**Patrón:** `paths-filter` detecta qué cambió → activa solo los pipelines necesarios.

| Cambio en | Pipeline |
|---|---|
| `packages/shibui-ui/**` · `packages/hanko/**` · `packages/consumer-tests*/**` | `ci-lib.yml` + `ci-apps.yml` |
| `apps/app-react\|angular\|svelte/**` | `ci-apps.yml` |
| `apps/app-cv/**` | `ci-apps.yml` (deploy a `shibui-cv.web.app`) |
| `apps/app-opencells/**` | `ci-apps.yml` |
| `apps/shibui-api/**` | `ci-api.yml` |
| `apps/app-tauri/**` | `ci-tauri.yml` (fmt + clippy + tests crate `core/`) |
| `packages/sukashi/**` | `ci-sukashi.yml` (deploy demo a `sukashi.web.app`, solo `main`) |
| `main` + UI cambiada | `release.yml` (tras `ci-lib`) |

Deploy a **Firebase Hosting** (targets en [`.firebaserc`](.firebaserc)). Secretos necesarios: `FIREBASE_TOKEN` (deploys), `VITE_API_URL` (build React), `NPM_SECRET` (publish npm), `DISCORD_WEBHOOK` (notify).

---

## 📚 Documentación

- [`CLAUDE.md`](CLAUDE.md) — contexto operativo del monorepo
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — guía de contribución (PRs, onboarding)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura del ecosistema
- [`docs/gitflow-enforcement.md`](docs/gitflow-enforcement.md) · [`docs/mobile-compatibility.md`](docs/mobile-compatibility.md)
- [`packages/consumer-tests/CLAUDE.md`](packages/consumer-tests/CLAUDE.md) — consumer contract tests
- [`apps/app-tauri/README.md`](apps/app-tauri/README.md) — app de escritorio Tauri
