# Spec · Empaquetado y desacople (F7)

> **Estado:** v0 (incremento 1) — desacople verificable + paquete publicable. El `npm publish` real queda
> **diferido** (decisión del plan: hasta validar el uso local / dogfood).
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

## 2 · Paquete publicable

| Pieza | Qué |
|---|---|
| [`src/index.ts`](../../src/index.ts) | **barrel público**: reexporta core · ingest · checks · report · harness · smoke |
| [`tsconfig.build.json`](../../tsconfig.build.json) | build de emisión → `dist/` (`.js` + `.d.ts` + maps), excluye tests |
| `package.json` | `exports`/`main`/`module`/`types` → `dist/`, `files`, `sideEffects:false`, `publishConfig.access:public`, `build`/`prepublishOnly`, keywords/repository |

```bash
pnpm --filter @shibui-ui/hanko build      # emite dist/
```

## 3 · Qué queda DIFERIDO (no se hace aún)

- **`npm publish` real**: el paquete sigue `private: true` (pestillo de seguridad). Publicar exige quitarlo,
  versionar (≥ `0.1.0`/`1.0.0`) y credenciales — **tras** validar el harness en navegador y dogfoodear shibui.
- **Bundler para ESM-Node nativo**: el build con `tsc` (moduleResolution `bundler`) emite imports
  **sin extensión** → sirve a consumidores con bundler (Vite, el propio shibui), pero un Node ESM puro
  necesitaría `.js` explícitas. Evaluar `tsup` al publicar. No se especula ahora.

## Criterios de aceptación (F7 · incremento 1)

1. `genericity.test.ts` pasa sobre el código actual y su autovalidación detecta un import prohibido.
2. `src/index.ts` reexporta la superficie pública sin colisiones de nombres.
3. `tsconfig.build.json` emite `dist/` con tipos, excluyendo tests.
4. `package.json` describe los entry points (`exports`/`types`/`files`) y mantiene `private: true`.
5. El `npm publish` real y la elección de bundler quedan documentados como diferidos.
