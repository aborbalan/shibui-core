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

## MCP — servidores declarados

`.mcp.json` en la raíz declara tres servidores en **project scope**. La primera vez que se
abre el repo, Claude Code los muestra como `⏸ Pending approval`: hay que aprobarlos una vez
desde una sesión interactiva (`claude`). No añaden dependencias al `package.json`.

| Servidor | Qué aporta | Cuándo usarlo |
|---|---|---|
| `angular-cli` | Oficial de Angular 21 (va dentro del CLI). `search_documentation`, `get_best_practices`, `list_projects`, `ai_tutor`, `onpush_zoneless_migration` | Antes de escribir Angular en `app-angular` o `app-cv`. Preferirlo a buscar en la web |
| `svelte` | Oficial de Svelte 5. `list-sections`, `get-documentation`, `svelte-autofixer`, `playground-link` | Antes de escribir Svelte en `app-svelte`, y **siempre** para revisar código Svelte generado |
| `chrome-devtools` | Oficial del equipo Chrome DevTools. DOM, consola, red, performance y capturas sobre un Chrome real | Verificación visual de cualquier app. Sustituye al apaño de Chrome headless a mano y esquiva el Browser pane congelado |
| `shibui-cem` | `cem` de bennypowers sobre el manifiesto de `@shibui-ui/ui`. Es el único que conoce los ~1.700 puntos de API de la librería | **Validar markup `lib-*` antes de darlo por bueno**, en la librería y en las apps consumidoras |

### `shibui-cem` — qué esperar y qué no

Es un **linter de uso del design system**, no un servidor de documentación. Expone cuatro
tools y el reparto de calidad es muy desigual:

- **`validate_html` es la buena.** Valida markup contra el manifiesto y nombra el fallo:
  `<lib-footer variant="sabi">` → `Unknown attribute 'variant' for element <lib-footer>`.
  Sin falso positivo con la forma correcta (`theme`). Cubre justo la trampa de los 13
  componentes que aceptan `variant` frente a los 12 que aceptan `theme`, sin solape.
- **`generate_html` no es de fiar.** Genera el elemento vacío, sin atributos, y su propio
  bloque «What to Avoid» repite ese mismo HTML como ejemplo de lo que no hay que hacer.
  Lo único aprovechable es el «Element Overview» del final, que sí lista la API real.
- El detalle por elemento vive en *resources* (`cem://elements`, ~10k tokens y solo
  resúmenes), no en tools: **no sirve para ahorrar contexto**, solo para validar.

**Requisito:** lee `packages/shibui-ui/dist/custom-elements.json`, que es build output
gitignorado. En un clon fresco no existe → generar con `pnpm --filter @shibui-ui/ui analyze`.
La lanzadera falla ruidosamente si falta o está vacío, a propósito: un servidor que valida
contra un manifiesto vacío aprobaría cualquier cosa en silencio.

**Trampa de nombres:** el binario `cem` del PATH es `@custom-elements-manifest/analyzer`
(el que usa el script `analyze`), que es **otra herramienta distinta**. Por eso la lanzadera
invoca el entry JS `node_modules/@pwrs/cem/bin/cem.js` y nunca el comando `cem`.

Regla general: si la duda es sobre **la API de un framework**, preguntar a su servidor MCP
antes que tirar de memoria del modelo — las tres apps van en versiones muy recientes
(Angular 21.2, Svelte 5.55, React 19.2).

**React no tiene servidor MCP oficial** — el equipo de React no publica ninguno. Se cubre
con `chrome-devtools` para la parte de navegador; para la API de React 19 no hay atajo,
se lee el código o la documentación.

Las tools experimentales del servidor de Angular (`build`, `test`, `e2e`, `devserver.*`)
están detrás del flag `-E` y **no** están activadas a propósito: los builds se lanzan con
los scripts de pnpm, no desde el agente.

### Requisito de entorno: `MCP_TIMEOUT`

El servidor de Angular tarda **~41 s** en responder al `initialize` (medido: 37 s de silencio
que no son Console Ninja —cuesta 0,4 s—, ni analytics, ni el update-notifier). El timeout de
arranque por defecto de Claude Code son 30 s, así que **sin subirlo el servidor sale
`✘ failed`**. Está puesto en `MCP_TIMEOUT` de la settings.json de usuario; si en otra máquina
`angular-cli` falla y los otros dos conectan, es esto.

### Detalles de arranque (verificados)

- **Las rutas de las lanzaderas usan `${CLAUDE_PROJECT_DIR:-.}` y funcionan.** El `:-.` no es
  decorativo: **sin el valor por defecto**, Claude Code aborta el servidor con
  `Missing environment variables: CLAUDE_PROJECT_DIR`. Con él, resuelve. Si un servidor de
  estos falla, mirar el timeout antes que la ruta — es la causa mucho más probable.
- **`angular-cli` no se invoca directo**, va por la lanzadera `scripts/mcp/angular-mcp.mjs`.
  Dos motivos, los dos comprobados: el CLI necesita arrancar dentro de `apps/app-angular` o
  `list_projects` no encuentra el `angular.json`, y `ng.js` está parcheado por la extensión
  Console Ninja, que imprime un banner **por stdout** que rompería el framing JSON-RPC. La
  lanzadera fija el cwd y desvía a stderr todo lo que no sea JSON.
  **La extensión ya está desinstalada, pero el parche sigue en el `ng.js`** (verificado
  2026-08-03: línea 2 en `app-angular` y en `app-cv`) — la lanzadera sigue haciendo falta,
  no la retires por creerla obsoleta.
- **Desde un worktree, `angular-cli` no arranca**: los worktrees no tienen `node_modules`
  (ver «Entorno de ejecución» más abajo). La lanzadera falla con un mensaje explícito en vez
  de colgarse. `svelte` y `chrome-devtools` sí funcionan desde cualquier sitio porque van por npx.
- **`find_examples` no aparece en la lista de tools**: el servidor de Angular lo registra solo
  con Node >= 22.16 y el entorno va con 22.13. Las otras cinco tools sí están.
- **`chrome-devtools` lleva `--no-performance-crux`** a propósito: sin ese flag, las tools de
  performance mandan las URLs trazadas a la API CrUX de Google. Quitarlo solo si hace falta
  contrastar con datos de usuario real.

Existe además config espejo en `apps/app-{angular,svelte,react}/.vscode/mcp.json` para
VS Code y Copilot. Ojo al formato: allí la clave raíz es `servers`, aquí es `mcpServers`.

---

## Consumo de `@shibui-ui/ui` desde las apps

Las apps consumidoras **no estilan** los componentes `lib-*`. Son Web Components de Lit con
Shadow DOM: una regla desde fuera no atraviesa el límite, así que además de saltarse la
convención **no funciona**.

- ¿Hace falta que se vea distinto? Añadir variante/prop **en `packages/shibui-ui`**.
- ¿Distinguir instancias? Por contenido/slots (un icono, otro texto), no por CSS en el host.
- Lo único admisible alrededor de un `lib-*` es **layout**: `display`, `gap`, `grid`, tamaño
  del contenedor.

---

## Monorepo

Gestionado con **pnpm workspaces** (pnpm@9.15.0, Node >=20).

Workspaces declarados en `pnpm-workspace.yaml`:
- `apps/*` — app-react, app-angular, app-svelte, app-cv, app-torii, app-tauri, shibui-api (`@shibui-ui/api`)
- `packages/*` — shibui-ui (`@shibui-ui/ui`), sukashi (`@shibui-ui/sukashi`), hanko (`@shibui-ui/hanko`), consumer-tests (`@shibui/consumer-tests`), consumer-tests-angular
- `cloudflare/*` — cf-cache-worker (`@shibui-api/cf-cache-worker`)

> `app-tauri` requiere **Rust toolchain estable** (`rustup install stable`) además de Node+pnpm. Es una app de escritorio Tauri 2 + React 19 con backend Rust (`crate core/`).

TypeScript base compartido en `tsconfig.base.json`.  
Path alias `@shibui-ui/ui` → `packages/shibui-ui/dist/index.d.ts`.

---

## Entorno de ejecución — Windows + worktrees

> Se trabaja desde el **repo principal** `D:\PROYECTOS\shibui-ecosystem`. Los worktrees de
> `.claude/worktrees/` sirven para **escribir** código, no para construirlo.

- **Un worktree nace sin `node_modules`.** `node_modules` está gitignored y `git worktree add`
  solo materializa ficheros trackeados. No es un bug ni cosa de Windows.
- **`pnpm install` completo cuelga** en el worktree (EPERM en la fase de link). Sí funciona
  `pnpm install --lockfile-only` (~12 s), que basta para arreglos de dependencias.
- **No dar por bueno un `build` o `type-check` corrido desde un worktree.** Escribir el código
  en la rama y dejar la verificación a la CI o al usuario desde el principal.

### ⛔ Junctions — dos trampas, una destructiva

Para construir desde un worktree se junctan los `node_modules` del principal:

1. **NUNCA retirar un junction con `rm -rf` ni `Remove-Item -Recurse`.** Siguen el enlace y
   **borran el `node_modules` del repo principal**, que en esta máquina no se puede reinstalar
   porque el install cuelga. Retirarlos con `.Delete()` de PowerShell filtrando por
   `LinkType -eq 'Junction'`, o con `cmd /c rmdir`.
2. **Junctar de más mide el árbol equivocado.** `apps/<app>/node_modules/@shibui-ui/ui` es un
   symlink a `<principal>/packages/shibui-ui`: junctar la carpeta entera arrastra la librería
   del principal, que suele ir en **otra rama con un `dist` viejo**. El síntoma es un
   diagnóstico convencido y falso sobre código que en tu rama está bien. Junctar dentro cada
   entrada **excepto** `@shibui-ui`.

### Verificación visual

El **Browser pane** (`mcp__Claude_Browser`) tiene el compositor congelado: `screenshot` da
timeout, `requestAnimationFrame` no dispara nunca y las transiciones CSS se quedan a `t=0`
→ **`getComputedStyle` devuelve valores intermedios estancados**: medir color o transform de
un elemento con `transition` da resultados falsos. Para comprobación visual, `chrome-devtools`.

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
| `pnpm start:torii` | Dev app torii (hub del ecosistema) |
| `pnpm start:api` | Dev server NestJS |
| `pnpm start:tauri` | Dev app Tauri (Vite + ventana nativa) — requiere Rust |
| `pnpm dev:all` | Las tres apps web frontend en paralelo (sin Tauri) |
| `pnpm build:shibui` | Build de `@shibui-ui/ui` |
| `pnpm build:api` | Build de `@shibui-ui/api` |
| `pnpm build:react` | Build app React |
| `pnpm build:cv` | Build app CV |
| `pnpm build:torii` | Build app torii |
| `pnpm type-check` | `tsc --noEmit` sobre shibui-ui |
| `pnpm lint` | ESLint sobre shibui-ui |
| `pnpm test:consumers` | Consumer contract tests (React × Svelte × Angular) |
| `pnpm test:consumers:react` · `:svelte` · `:angular` | Consumer tests por framework |
| `pnpm worker:cf:dev` · `worker:cf:deploy` | Dev/deploy del Cloudflare cache worker |
| `pnpm --silent kura <cmd>` | CLI de Firebase Hosting (ver abajo) |

---

## kura — el CLI de Firebase Hosting

`packages/kura` responde sin abrir la consola de Firebase lo que antes había que mirar a mano:
qué hay publicado en cada uno de los nueve sitios, si el build local coincide con lo servido,
y si lo desplegado se llevó por delante la configuración de la API.

```bash
pnpm --silent kura targets   # sin red ni credenciales
pnpm --silent kura status    # + qué hay publicado
pnpm --silent kura verify    # comprueba por HTTP lo que se sirve
pnpm --silent kura sites     # inventario: declarados sin crear y huérfanos
```

**`--silent` no es cosmético:** sin él, pnpm escribe su banner en stdout y rompe el NDJSON.

`kura --help --format json` devuelve la superficie completa —comandos, flags y códigos de
salida— con banderas `network`, `credentials` y `mutates` por comando, pensadas para decidir
qué es seguro ejecutar sin leer prosa. `targets` no toca nada; `deploy` y `sites create`
mutan, simulan por defecto y exigen `--execute`.

**Nunca ejecutes `kura deploy --live`**: publicar en estos sitios es publicar en internet y lo
autoriza el usuario en cada ocasión.

Detalle y trampas en [`packages/kura/CLAUDE.md`](packages/kura/CLAUDE.md); estado vivo en
[`packages/kura/docs/HANDOFF.md`](packages/kura/docs/HANDOFF.md).

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
| `apps/app-torii/**` | `ci-apps.yml` (deploy a `shibui-torii.web.app`) |
| `apps/shibui-api/**` | `ci-api.yml` |
| `apps/app-tauri/**` | `ci-tauri.yml` (fmt + clippy + tests sobre crate `core/`) |
| `packages/sukashi/**` | `ci-sukashi.yml` (type-check + tests; deploy demo a `sukashi.web.app` solo en `main`) |
| `main` + UI cambiada | `release.yml` (tras `ci-lib` exitoso) |

Override manual disponible vía `workflow_dispatch` con flags `force_ui`, `force_react`, `force_angular`, `force_svelte`, `force_cv`, `force_torii`, `force_api`, `force_tauri`, `force_sukashi`, `force_hanko_issues`.

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
