# hanko · ADR-004 — Formato de emisión y publicación npm

> **Estado:** Aceptada · **Fecha:** 2026-06-22 · **Fase:** F7 (desacople + publicación npm)
> **Relacionado:** [`adr-003-gate-regresion.md`](adr-003-gate-regresion.md) · [`../specs/packaging.md`](../specs/packaging.md)

---

## Contexto

F7 cierra el plan publicando `@shibui-ui/hanko` como paquete independiente. El andamiaje (barrel
público, metadata npm, guard de genericidad ejecutable) ya estaba (incr. 1, PR #530); faltaban tres
decisiones para que el paquete **instale-y-corra en un proyecto externo** y se publique sin romper nada:

1. **Formato de emisión.** El build previo (`tsc -p tsconfig.build.json`, `moduleResolution: bundler`)
   emitía imports relativos **sin extensión** (`export * from './core/contract'`). Eso sirve a
   consumidores **con bundler** (Vite, el propio shibui), pero **Node-ESM puro exige `.js` explícitas** →
   `ERR_MODULE_NOT_FOUND`. El criterio de aceptación de F7 es justo «se usa en un proyecto externo».
2. **Superficie pública.** El barrel reexporta core·ingest·checks·report·harness·smoke. Quedaba un cabo
   suelto de F6: `gate.ts` (`gateAgainstBaseline`/`reportCoverage`/`baselineFromReport`) **no** estaba en
   la superficie. Y el harness es **browser-only en uso**.
3. **Pipeline de release.** `release.yml` publica **solo** `@shibui-ui/ui` (semantic-release + `npm
   publish --provenance`, token `NPM_SECRET`), y es estable. No conviene arriesgarlo en el primer publish.

El **core publicable no tiene dependencias de runtime** (`package.json` no declara `dependencies`;
axe-core/playwright son devDeps que solo usa el harness en navegador y el dogfood, ambos inyectados o
fuera de `src/`). El barrel solo arrastra `import type` del harness → sin side-effects ni deps de DOM.

## Decisión

### 1 · Formato de emisión — bundle ESM (esbuild) + `.d.ts` con extensiones

- **JS:** [`scripts/build.mjs`](../../scripts/build.mjs) empaqueta `src/index.ts` en **un único fichero
  ESM autocontenido** (`dist/index.js`) con **esbuild** (`bundle: true`, `format: 'esm'`,
  `platform: 'neutral'`). Al no quedar imports relativos, **desaparece el problema de extensiones**. El
  harness se inlinea sin arrastrar axe/playwright (solo `import type`).
- **DTS:** `tsc --emitDeclarationOnly` emite el árbol `.d.ts`; un *fixup* reescribe los especificadores
  relativos añadiendo `.js` (fichero) o `/index.js` (directorio) **comprobando el disco**, para que el
  tipado resuelva también bajo `moduleResolution: nodenext`, no solo `bundler`.
- **Maps:** el `.js.map` lo emite esbuild **autocontenido** (`sourcesContent: true`). **No** se emiten
  declaration-maps ni source-maps de tsc: el tarball no incluye `src/` (`files: [dist, README.md]`), así
  que apuntarían a fuentes ausentes.
- **esbuild directo, no `tsup`.** `tsup` no estaba instalado → añadirlo exigía regenerar el lockfile
  (cuelgue de `pnpm install` en Windows) y bloqueaba la validación. esbuild **ya era devDep**; es lo que
  `tsup` envuelve por dentro. **Cero dependencias nuevas, cero cambio de lockfile.**

### 2 · Superficie pública — barrel único, gate expuesto, harness incluido, sin `bin`

- **Un solo entry** (`exports["."]`). No se abren subpaths.
- **`gate.ts` pasa a ser API pública** (coherente con exponer `buildTrustReport`): un consumidor que
  adopte hanko construye su Trust Report y protege su propio suelo con `gateAgainstBaseline`. Su tipo
  `Coverage` colisiona en el barrel raíz con el `Coverage` de `smoke` → se reexporta con alias
  **`BaselineCoverage`** (evita TS2308 sin renombrar el tipo de origen).
- **El harness se queda en el barrel principal** (no subpath). Es browser-only en uso, pero importarlo en
  Node es inofensivo (solo `import type`, sin ejecución top-level de DOM). Se prioriza simplicidad de
  superficie sobre aislar el harness.
- **Las CLIs (`smoke`/`report`/`gate`/`issues`) NO se exponen como `bin`.** Siguen como scripts `tsx`.

### 3 · Pipeline de release — primer publish MANUAL

- **Primer publish a mano** (`npm publish --access public`, versión `0.1.0`) para validar el tarball
  end-to-end **sin tocar** el semantic-release de shibui. La automatización se evalúa después.
- **Provenance diferida.** `--provenance` exige un entorno CI con OIDC; un publish local manual **no**
  puede generarla. Se añadirá al automatizar el release (CI). El de shibui (`@shibui-ui/ui`) queda intacto.
- **Versión `0.1.0`** (pre-1.0: la API aún puede moverse). **Scope `@shibui-ui`** ya existe
  (shibui publica como `@shibui-ui/ui`); se reutiliza scope + token `NPM_SECRET`. `publishConfig.access:
  public` ya estaba.

## Consecuencias

- **El paquete instala-y-corre en un proyecto externo Node-ESM** (runtime + tipos `nodenext`), validado
  con `npm pack` + instalación en un proyecto throwaway antes de quitar `private` (criterio 7.5).
- **`private: true` retirado** — el acto deliberado de F7. Ningún workflow auto-publica hanko
  (`release.yml` está acotado a `packages/shibui-ui`), así que quitarlo es seguro.
- **Genericidad intacta:** `src/genericity.test.ts` sigue verde (el core no importó shibui al empaquetar).
- **Pendiente menor:** el `npm publish` real lo ejecuta un humano/CI con red y auth (este entorno tiene
  interceptación TLS y no está autenticado). Provenance llega con la automatización.
- **Fuera de alcance (diferido a vNext):** histórico/badges del Trust Report (ADR-003) y la automatización
  del release (semantic-release multi-paquete o workflow propio).

## Alternativas consideradas

- **`tsup`** (formato): descartado por no estar instalado → nudo de lockfile en Windows; esbuild directo
  logra lo mismo sin deps nuevas.
- **`tsc` con `moduleResolution: NodeNext`** + extensiones `.js` a mano en el código fuente: frágil
  (toca todos los imports, fácil de romper en mantenimiento).
- **Dejar el build `tsc`/bundler como estaba**: no instala-y-corre en Node pelado → incumple el criterio.
- **Extender semantic-release a multi-paquete** o **workflow de release propio**: más completo, pero
  arriesga el release ya estable de shibui o duplica infra; se prefiere el publish manual como primer paso.
