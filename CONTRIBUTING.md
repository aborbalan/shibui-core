# Guía de contribución — Shibui Ecosystem

## Prerequisitos

| Herramienta | Versión mínima | Necesaria para |
|---|---|---|
| Node.js | ≥ 20 | Todas las apps |
| pnpm | ≥ 9 | Todas las apps |
| Rust toolchain estable | última stable | `app-tauri` únicamente |

Para instalar Rust: `rustup install stable`  
Para instalar Tauri CLI: `cargo install tauri-cli` (o viene incluido vía `@tauri-apps/cli` en el package.json de la app).

---

## Flujo de ramas (GitFlow)

```
main        → Producción. Solo recibe merges desde develop via PR.
develop     → Integración. Rama base para todo el desarrollo.
feature/*   → Una rama por componente o tarea. Se abre desde develop.
```

**Regla de oro:** no se inicia una `feature/*` nueva sin haber mergeado la anterior a `develop`.

### Ciclo de vida de una rama

```bash
# 1. Abrir rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/lib-[nombre]

# 2. Desarrollar

# 3. Ritual de cierre (obligatorio)
git push origin feature/lib-[nombre]
git checkout develop
git merge --no-ff feature/lib-[nombre]
git push origin develop
```

---

## Convención de commits

Usamos **Conventional Commits** validado por `commitlint` (config en `.config/commitlint.config.cjs`).

```
<tipo>(<scope>): <descripción en imperativo>
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nuevo componente o funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato, sin lógica |
| `refactor` | Refactorización sin cambio de comportamiento |
| `test` | Añadir o modificar tests |
| `chore` | Tareas de mantenimiento (deps, config) |

### Ejemplos

```bash
feat(lib-button): add size prop with sm/md/lg variants
fix(lib-input): correct focus ring token reference
docs(CLAUDE): add framework integration section
chore(deps): update lit to 3.2.1
refactor(lib-badge): extract template to html.ts
feat(app-tauri): add ProcessesGadget with sysinfo integration
fix(app-tauri): correct list_dir sorting for hidden files
```

---

## Checklist — componente nuevo - libreria de componentes

Seguir este orden sin saltarse pasos:

- [ ] Rama `feature/lib-[nombre]` abierta desde `develop` actualizado
- [ ] Carpeta creada en `src/components/[atoms|molecules|organisms]/lib-[nombre]/`
- [ ] `lib-[nombre].component.ts` — LitElement con `@customElement`, `@property` y `render()`
- [ ] `lib-[nombre].html.ts` — template function pura (`TemplateResult`)
- [ ] `lib-[nombre].css` — estilos con `@layer tokens, reset, components` y tokens `--lib-*`
- [ ] `lib-[nombre].stories.ts` — historia de Storybook con Args
- [ ] `lib-[nombre].types.ts` — tipos del contrato de props (recomendado; ~60% de componentes lo tiene)
- [ ] Componente registrado en el barrel de su capa / `packages/shibui-ui/src/index.ts` (no hay `index.ts` por componente salvo excepciones en organisms)
- [ ] `pnpm type-check` pasa sin errores
- [ ] `pnpm lint` pasa sin errores
- [ ] Story visible y funcional en Storybook
- [ ] Ritual de cierre ejecutado (push + merge a `develop`)

---

## Desarrollo en app-tauri

`app-tauri` tiene un stack mixto: frontend React (TypeScript) + backend Rust. Los comandos difieren del resto de apps:

```bash
# Arrancar con ventana nativa (Vite + Tauri):
pnpm --filter @shibui/app-tauri tauri dev
# o desde raíz:
pnpm start:tauri

# Solo frontend (sin ventana nativa, útil para UI):
pnpm --filter @shibui/app-tauri dev

# Tests de la crate Rust:
cd apps/app-tauri && cargo test
```

Para añadir un comando Tauri nuevo:
1. Implementar la función en `core/src/system.rs` o `core/src/fs.rs`
2. Registrarla en `src-tauri/src/lib.rs` con `#[tauri::command]`
3. Invocarla desde el frontend con `invoke('nombre_comando')` de `@tauri-apps/api/core`

Ver [`apps/app-tauri/src-tauri/README.md`](apps/app-tauri/src-tauri/README.md) para la referencia completa de comandos y structs.

---

## CI/CD

El orquestador (`.github/workflows/orchestrator.yml`) se ejecuta en cada push a
`main`, `develop`, `feature/**`, `fix/**`, `chore/**` y en cada PR hacia `develop`
o `main`. Un `paths-filter` decide qué pipelines corren según lo que cambió.

```
pnpm install → type-check + lint → build → tests → deploy (Firebase / npm)
```

- **Firebase Hosting** — despliega el Storybook (`ci-lib.yml`) y las apps (`ci-apps.yml`, `ci-api.yml`, `ci-sukashi.yml`) en `develop`/`main`.
- **Publish npm** — `release.yml` publica `@shibui-ui/ui` al mergear a `main` (tras `ci-lib` exitoso).
- **Secretos necesarios** — `FIREBASE_TOKEN`, `VITE_API_URL`, `NPM_SECRET`, `DISCORD_WEBHOOK` en GitHub repository secrets.

Ningún código llega a `main` sin pasar type-check y lint en CI.