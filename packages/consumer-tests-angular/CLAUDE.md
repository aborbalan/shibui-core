# consumer-tests-angular (`@shibui/consumer-tests-angular`) — Fixture Angular

App Angular 21 mínima que sirve de **fixture** para los consumer contract tests de
`@shibui-ui/ui`. NO contiene los tests: los `*.spec.ts` (Playwright) viven en el paquete
hermano `packages/consumer-tests/` y apuntan a este servidor.

> **La documentación completa de los consumer tests (qué prueban, cuándo corren en CI,
> decisiones de fixtures) está en [`../consumer-tests/CLAUDE.md`](../consumer-tests/CLAUDE.md).**
> Este fichero cubre solo lo específico de este workspace Angular.

---

## Por qué es un workspace separado

Angular CLI (`angular.json`, `ng serve/build`) no puede vivir dentro de un paquete que no
controla. Por eso el fixture Angular se aísla aquí, mientras el spec `angular.spec.ts` vive
en `consumer-tests/`. React y Svelte sí van como fixtures internos de `consumer-tests/`.

## Scripts

```bash
pnpm --filter @shibui/consumer-tests-angular serve   # ng serve --port 4201
pnpm --filter @shibui/consumer-tests-angular build   # ng build
```

Prerequisito: `pnpm build:shibui` (el fixture importa `@shibui-ui/ui` desde `dist/`).

---

## Decisiones que NO romper

- **Zoneless explícito.** No hay zone.js (ni en deps ni en polyfills). Arranca con
  `provideZonelessChangeDetection()` y todo el estado es `signal()`. Esto **verifica** que la
  librería (web components Lit) funciona en Angular zoneless — es parte del contrato bajo test,
  no una preferencia. No añadir zone.js.
- **`CUSTOM_ELEMENTS_SCHEMA`** obligatorio en el componente que renderiza tags `lib-*`; sin él,
  el compilador rechaza los elementos desconocidos.
- **`tokens.css` en `angular.json` → `styles[]`.** Sin esa entrada, los tokens semánticos no se
  propagan y el sistema Katachi no funciona en el fixture.
- **Readiness del listener (`window.__modalListenerReady__`).** El listener de
  `ui-lib-modal-close` se monta en `ngAfterViewInit` y expone esa señal; el test la espera antes
  de pulsar Escape. Quitarla reintroduce un timeout flaky de 30s. Ver `src/app/app.ts`.

---

## Instrucciones para Claude

- Si añades un componente core a los fixtures, actualiza también `src/app/app.html` aquí
  (además de los fixtures React/Svelte y el spec en `consumer-tests/`).
- Mantén la paridad de ejes con React/Svelte (registro · props · eventos · slots · katachi) o
  documenta por qué un caso solo aplica a Angular.
- Sigue GitFlow del monorepo (destino `develop`, nunca `main`).
