# Spec · Empaquetado y desacople (F7)

> **Estado:** ✅ **TERMINADA** — desacople verificable + paquete publicable + emisión Node-ESM validada en un
> proyecto externo. `private` retirado y versión `0.1.0` fijada. El `npm publish` real lo ejecuta un humano/CI
> (este entorno no tiene red/auth); la **automatización del release** y la **provenance** quedan diferidas (ver
> §3 y [ADR-004](../decisions/adr-004-emision-y-publicacion.md)).
> **Fase:** F7. Cierra el principio de arquitectura nº1 (el core no depende de shibui) con un test ejecutable.

---

## 1 · Desacople (genericidad ejecutable)

El principio *"el `core` NUNCA importa de `@shibui-ui/ui`"* deja de ser aspiracional: lo verifica
[`src/genericity.test.ts`](../../src/genericity.test.ts).

- Recorre **todos** los `.ts` de `src/` (incluidos tests).
- Extrae los especificadores de `import` / `export … from` / `import()` / import lateral.
- **Falla** si alguno casa `@shibui-ui/ui` · `@shibui/ui` · `../…/shibui-ui/…`.
- Se **autovalida**: un segundo caso comprueba que el patrón sí detecta un import prohibido (un regex roto
  no pasaría en silencio).

**La comunicación con shibui es solo vía el fichero CEM** — lectura por **ruta** en runtime
(`readFileSync('../shibui-ui/dist/custom-elements.json')`), nunca `import` de código. Por eso el guard
mira imports, no cadenas: el canal CEM queda permitido, el acoplamiento por código prohibido.

> **Excepción deliberada — el dogfood.** Para correr el harness sobre los componentes **vivos** de shibui hay
> que cargar su código (el CEM es metadatos, no instancia nada). Ese único acople vive **fuera de `src/`**, en
> [`dogfood/probe-shibui.ts`](../../dogfood/probe-shibui.ts) (Etapa 1 del Trust Report): el guard cubre solo
> `src/` —el core publicable—, así que el `core` sigue genérico mientras el *tooling* de dogfood —no incluido en
> `files`, no publicable— sí importa shibui. Ver [`harness.md`](harness.md).

## 2 · Paquete publicable

| Pieza | Qué |
|---|---|
| [`src/index.ts`](../../src/index.ts) | **barrel público** (único entry `.`): reexporta core · ingest · checks · report · harness · smoke. El `gate` (F6) se expone aquí; su `Coverage` se reexporta con alias **`BaselineCoverage`** (colisiona con el `Coverage` de `smoke`). |
| [`scripts/build.mjs`](../../scripts/build.mjs) | **build de emisión** (`pnpm build`). **JS:** esbuild empaqueta `src/index.ts` en un único `dist/index.js` ESM autocontenido (sin imports relativos → sin problema de extensiones). **DTS:** `tsc --emitDeclarationOnly` + *fixup* que añade `.js`/`/index.js` a los especificadores (resuelve bajo `nodenext`). `.js.map` autocontenido; sin maps de tsc. |
| [`tsconfig.build.json`](../../tsconfig.build.json) | config del paso DTS (declaraciones, sin maps; excluye tests). |
| `package.json` | `exports`/`main`/`module`/`types` → `dist/`, `files:[dist,README.md]`, `sideEffects:false`, `publishConfig.access:public`, `build`/`prepublishOnly`, keywords/repository. **`private` retirado**, `version: 0.1.0`. |

```bash
pnpm --filter @shibui-ui/hanko build      # emite dist/ (bundle ESM + d.ts con extensiones)
```

**Validado (criterio 7.5):** `npm pack` + instalación del tarball en un proyecto externo (fuera del monorepo)
→ `import` del barrel y ejecución de un check sobre un CEM de muestra en **Node-ESM puro**, más resolución de
tipos bajo `moduleResolution: nodenext`. El emisor `tsc`/bundler anterior (imports sin extensión) fallaba aquí
con `ERR_MODULE_NOT_FOUND`; el bundle de esbuild lo resuelve. Decisión completa en
[ADR-004](../decisions/adr-004-emision-y-publicacion.md).

## 3 · Publicación y qué queda diferido

**El paquete es publicable.** `private` retirado, `version: 0.1.0`, scope `@shibui-ui` (reutiliza el token
`NPM_SECRET` de shibui). Primer publish **manual** (decisión 7.3, ADR-004), sin tocar el semantic-release de
shibui:

```bash
pnpm --filter @shibui-ui/hanko build        # prepublishOnly también lo corre
cd packages/hanko && npm publish --access public
```

Lo ejecuta un humano/CI con red y auth (el entorno de desarrollo aquí tiene interceptación TLS y no está
autenticado). Diferido a vNext:

- **Provenance** (`--provenance`): requiere CI con OIDC; un publish local manual no la genera. Llega al
  automatizar el release.
- **Automatización del release** (semantic-release multi-paquete o workflow propio): se prefirió el publish
  manual como primer paso para no arriesgar el release estable de `@shibui-ui/ui`.
- **Histórico/badges del Trust Report:** diferido a vNext por ADR-003 (ajeno a F7).

## Criterios de aceptación (F7) — ✅

1. `genericity.test.ts` pasa sobre el código actual y su autovalidación detecta un import prohibido (intacto).
2. `src/index.ts` reexporta la superficie pública sin colisiones (gate expuesto; `Coverage`→`BaselineCoverage`).
3. El build emite `dist/` instalable-y-ejecutable en **Node-ESM puro** (bundle ESM + `.d.ts` con extensiones).
4. `npm pack` + instalación en un **proyecto externo** importa y corre el paquete (runtime + tipos `nodenext`).
5. `private` retirado y `version` fijada (`0.1.0`) **tras** la validación externa; ningún workflow auto-publica.
6. Formato de emisión y pipeline de release documentados en [ADR-004](../decisions/adr-004-emision-y-publicacion.md).
