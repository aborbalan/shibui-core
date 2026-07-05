# Tests — `@shibui-ui/ui`

Dos capas de testing conviven en el paquete:

| Capa | Dónde | Runner | Qué cubre |
|---|---|---|---|
| **Play tests** | `src/**/lib-*.stories.ts` (sección `Tests`, `tags: ['test']`) | Vitest (browser mode) vía addon de Storybook | Render, atributos, estado, lógica por componente |
| **E2E / integración** | esta carpeta `tests/**` | Playwright (`.config/playwright.config.js`) | Comportamiento real contra Storybook (`localhost:6006`), accesibilidad (axe), propagación de eventos |
| **Regresión visual** | `tests/visual/` | Playwright + snapshots | Baselines por katachi (no mover: los snapshots son relativos al spec) |

## Estructura de `tests/` — por atomicidad

Refleja `src/components/{atoms,molecules,organisms}/`:

```
tests/
  atoms/
    lib-button.test.ts
    lib-burger-toggle.test.ts
    lib-close-button-propagation.test.ts
    icon-registry.test.ts          # lib-icon · integridad del registro
  molecules/
    lib-modal.test.ts
    lib-tabs.test.ts
  organisms/
    lib-accordion.test.ts
    lib-drawer.test.ts
    lib-toast-manager.test.ts
  visual/                          # regresión visual (snapshots) — no reubicar
  example.spec.ts                  # boilerplate de Playwright — candidato a borrar
```

> Playwright usa `testDir: ../tests` con descubrimiento recursivo, así que las
> subcarpetas no requieren tocar el config. Los specs navegan a Storybook por
> URL (`page.goto`), sin imports relativos a `src/`.

## Comandos

```bash
pnpm test:stories   # Vitest browser — play tests de src/**/*.stories.ts (lo que corre CI)
pnpm test:e2e       # Playwright — specs de componente (atoms/ molecules/ organisms/)
pnpm test:visual    # Playwright — regresión visual (visual/)
pnpm test:unit      # Vitest Node — solo scripts/
```

> Los specs de `test:e2e` y `test:visual` requieren Storybook corriendo en
> `:6006` (`pnpm storybook`). Hoy CI solo ejecuta `test:stories`; `test:e2e`
> es local/manual. `example.spec.ts` es boilerplate de Playwright (apunta a
> playwright.dev) — candidato a borrar.
