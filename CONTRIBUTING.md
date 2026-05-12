# Guía de contribución — Shibui Ecosystem

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
```

---

## Checklist — componente nuevo

Seguir este orden sin saltarse pasos:

- [ ] Rama `feature/lib-[nombre]` abierta desde `develop` actualizado
- [ ] Carpeta creada en `src/components/[atoms|molecules|organisms]/lib-[nombre]/`
- [ ] `index.ts` — barrel export
- [ ] `lib-[nombre].component.ts` — LitElement con `@customElement`, `@property` y `render()`
- [ ] `lib-[nombre].html.ts` — template function pura (`TemplateResult`)
- [ ] `lib-[nombre].css` — estilos con `@layer tokens, reset, components` y tokens `--lib-*`
- [ ] `lib-[nombre].stories.ts` — historia de Storybook con Args
- [ ] Componente registrado en `packages/shibui-ui/src/index.ts`
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Story visible y funcional en Storybook
- [ ] Ritual de cierre ejecutado (push + merge a `develop`)

---

## CI/CD

El pipeline se ejecuta en cada push a `develop` y en cada PR hacia `main`.

```
npm ci → lint → build-storybook → lighthouse → firebase deploy
```

- **Lighthouse CI** — requiere el build de Storybook previo (`storybook-static/`). Config en `.config/lighthouserc.cjs`.
- **Firebase Hosting** — despliega el Storybook como preview en cada PR.
- **Semantic Release** — genera versión y tag en NPM automáticamente al mergear a `main`.
- **Secretos necesarios** — `FIREBASE_TOKEN` en GitHub repository secrets.

Ningún código llega a `main` sin pasar lint y Lighthouse en CI.