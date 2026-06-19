# hanko (`@shibui-ui/hanko`) — Motor de verificación de confianza

判子 — El sello que estampa cada Web Component que cumple su **contrato declarado**.
Motor de verificación **manifest-driven**: el humano revisa el contrato (el manifest,
pequeño y legible); hanko verifica que la implementación lo honra (grande, ilegible) y
emite un **Trust Report** (JSON + HTML).

> Construido **desde 0** — NO hereda la infra de test de `@shibui-ui/ui` (que es a medida).
> Para el estado vivo del proyecto (fase actual, próximo paso), la fuente de verdad es
> [`docs/phases/README.md`](docs/phases/README.md), NO este fichero. Aquí va lo estable.

---

## Principios de arquitectura (NO negociables)

1. **El `core` NUNCA importa de `@shibui-ui/ui`.** Recibe `hanko.config.ts` + el manifest.
   Garantizado por un test ejecutable: [`src/genericity.test.ts`](src/genericity.test.ts).
2. **CEM (Custom Elements Manifest) es el único idioma del core.** Todo lo ajeno se
   normaliza en el borde de ingestión (`src/ingest/`).
3. **Generalizar desde el uso, no especular.** No se añade una opción al core hasta que un
   consumer real la necesita.
4. **`shibui-ui` = consumer #1** (~99 componentes). Uso local primero; publicar a npm diferido
   (de ahí `private: true` aún, pese a tener ya metadata npm y barrel público).

**Regla de oro — *ausencia ≠ incumplimiento*:** hanko valida **solo lo que el manifest
declara**. Lo no declarado no se verifica (no es fallo); lo declarado que el runtime
contradice **sí** es violación. Niveles: **Floor** (MVP) → **Conformance** (declarado↔runtime)
→ **Strict** (exige completitud, opt-in). Ver [`docs/decisions/adr-001-baseline-minima-viable.md`](docs/decisions/adr-001-baseline-minima-viable.md).

---

## Estructura (`src/`)

```
src/
  index.ts        → Superficie pública única (exports → este fichero). Tampoco importa shibui.
  core/           → contract (modelo: lo declarado) + runtime (lo observado)
  ingest/         → CEM → modelo (con adapters en el borde)
  checks/         → las 4 capas: floor · contract · a11y · resilience (+ su .test.ts cada una)
  harness/        → observa elementos vivos → observaciones (probe.ts; browser-only en uso)
  report/         → Trust Report: trust-report.ts (agregador puro) + render.ts (JSON/HTML) + run.ts (runner)
  smoke/          → smoke test de extremo a extremo
  genericity.test.ts → guard ejecutable del principio #1
```

Tests `*.test.ts` conviven con su fuente. Los `*.browser.test.ts` corren en navegador.

---

## Scripts

```bash
pnpm --filter @shibui-ui/hanko type-check     # tsc --noEmit
pnpm --filter @shibui-ui/hanko test           # vitest run (node)
pnpm --filter @shibui-ui/hanko test:browser   # vitest --config vitest.browser.config.ts
pnpm --filter @shibui-ui/hanko smoke          # tsx src/smoke/run.ts
pnpm --filter @shibui-ui/hanko report         # tsx src/report/run.ts → genera el Trust Report
pnpm --filter @shibui-ui/hanko build          # tsc -p tsconfig.build.json → emite dist/
```

- `tsconfig.json` = type-check (no emite). `tsconfig.build.json` = emite `dist/` para publicación.

---

## Qué verifica / qué no

- **Verifica** (capa mecánica, ~70% de los bugs de componente): contrato
  (props/eventos/slots/métodos), a11y (axe + teclado + foco + ARIA), resiliencia
  (props basura/vacías, SSR, RTL) y *drift* implementación↔manifest.
- **No verifica:** corrección semántica / de negocio.

---

## Instrucciones para Claude

- **Antes de tocar el core o `index.ts`**, recuerda el principio #1: si añades un import de
  `@shibui-ui/ui` ahí, `genericity.test.ts` debe fallar (y fallará). Es deliberado.
- No dupliques el estado de fases en este fichero ni en commits — vive en `docs/phases/`.
- Toda decisión de arquitectura va como ADR en `docs/decisions/`, no inline en código.
- Sigue GitFlow del monorepo (destino `develop`, nunca `main`). El worktree puede no tener
  `node_modules`; valida lo que puedas con type-check y deja claro qué quedó sin ejecutar.
