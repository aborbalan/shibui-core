# Handoff · Calibrar el harness de hanko (reflect/slots async de Lit)

> **Para una sesión nueva, en frío.** Objetivo: arreglar la calibración del harness de runtime
> para que el Trust Report deje de dar ~98/102 componentes "sin sello" por un **falso positivo**.
> Trabajo en `packages/hanko/`. Stack: pnpm workspaces, TS, vitest, Playwright/chromium.
> GitFlow del repo: ramas desde `develop`, merge `--no-ff`, nunca a `main` directo.

> **▶ Rama de trabajo:** `fix/hanko-github-issues-user-agent` — **seguir aquí**.
> `git checkout fix/hanko-github-issues-user-agent && git pull`. Esta rama tiene la PR #544 (fix
> User-Agent) abierta hacia `develop` y, además, este handoff + el diagrama de flujo. Continúa la
> calibración en ella (o, si prefieres aislar, ramifica desde aquí). No mezclar con `main`.

---

## 1. El problema (qué se observó)

Al correr el Trust Report real sobre shibui-ui (`pnpm --filter @shibui-ui/hanko report:full`)
y luego el dry-run del emisor de issues:

```
hanko issues · [dry-run] 98 sin sello → 98 a crear
```

**102 componentes · 4 sellados · 98 sin sello.** Desglose por capa de los 98:

- `contract`: **98** (todos) ← dominante
- `a11y`: 29 · `resilience`: 0 · `floor`: 0

Y casi todos los 98 por **el mismo** hallazgo, repetido en toda la librería:

```
contract/reflect: la prop "X" declara reflects:true pero no se refleja a su atributo en runtime
```

Eso no son 98 bugs distintos: es **un artefacto sistemático único**.

## 2. Causa raíz (confirmada)

`probeReflect` en [`src/harness/probe.ts`](src/harness/probe.ts) (~líneas 76-97) lee el atributo
**síncronamente justo después** de asignar la propiedad:

```ts
const before = el.getAttribute(attr);
(el as ...)[prop] = 'hanko-probe';   // set de la propiedad
const after = el.getAttribute(attr); // ← lee YA, mismo tick
if (after !== null && after !== before) reflecting.push(prop);
```

Pero los componentes de shibui son **LitElement**, y Lit **refleja prop→atributo de forma
asíncrona**, dentro del ciclo de update (microtask siguiente, en `performUpdate`/`updated`).
Al leer en el mismo tick, `after === before` SIEMPRE → toda prop reflejada se marca como
"no refleja" → `contractCheck` lo reporta como violación en los 98.

El propio código ya lo admite — [`dogfood/browser-glue.ts:18-23`](dogfood/browser-glue.ts):
> *"el sondeo de reflect puede quedar corto. Afinarlo (esperar `updateComplete`) es trabajo de
> calibración del harness."*

**El mismo problema afecta a los slots:** `readSlots` (probe.ts ~100-104) lee el shadow DOM
síncronamente tras `appendChild`, pero Lit lo renderiza async → los slots quedan `undefined`
(se omiten por la regla de oro). Awaitar `updateComplete` arregla **reflect Y slots a la vez**.

## 3. Evidencia de que es falso positivo

- shibui-ui tiene un **`test:conformance reflect`** que **pasa en CI** → la reflexión SÍ funciona
  en runtime. Si fuera un bug real, ese test fallaría.
- El patrón es idéntico en 98/102 componentes (improbable como bug real; típico de timing).
- `resilience: 0` y `floor: 0` fallos → solo "fallan" las capas que leen estado async demasiado pronto.

## 4. El fix

Esperar el ciclo de update de Lit antes de leer atributos/shadow DOM reflejados.
LitElement expone **`el.updateComplete`** (un `Promise<boolean>`). Plan:

1. **`observeRuntime` → async.** Tras `document.body.appendChild(el)`, hacer
   `await elUpdateComplete(el)` antes de `readSlots` y `probeReflect`.
2. **`probeReflect` → async.** Entre el set de la prop y la lectura del atributo:
   `(el as ...)[prop] = sentinel; await elUpdateComplete(el); const after = el.getAttribute(attr);`
3. Helper defensivo (el harness es **genérico**, no todo custom element es Lit):
   ```ts
   async function elUpdateComplete(el: unknown): Promise<void> {
     const uc = (el as { updateComplete?: unknown }).updateComplete;
     if (uc && typeof (uc as Promise<unknown>).then === 'function') {
       await uc;
     } else {
       // no-Lit: cede un microtask por si hay reflexión en rAF/setTimeout(0)
       await new Promise((r) => requestAnimationFrame(() => r(undefined)));
     }
   }
   ```
   > Mantener el helper en el core **sin importar Lit** (duck-typing por `updateComplete`).
   > Respeta `src/genericity.test.ts` (el core no importa shibui ni Lit).

4. **Frontera async ya está limpia:** `window.__hankoProbe.observe` en
   [`dogfood/browser-glue.ts:51`](dogfood/browser-glue.ts) **ya es `async`** y hace
   `await observeA11y(...)`. Solo hay que cambiar `const runtime = observeRuntime(tag)` por
   `const runtime = await observeRuntime(tag)`. No hay más callers en cadena.

### Calibración secundaria (menor, valorar en el mismo PR o aparte)

- **Sentinel tipado:** `probeReflect` asigna el string `'hanko-probe'` a CUALQUIER prop. Para una
  prop booleana/numérica/enum, el converter de Lit puede no producir un atributo "cambiado" aunque
  refleje. Considerar: leer el tipo declarado del CEM y usar un sentinel coherente (bool→`true`,
  number→`1`, enum→primer valor válido), o detectar reflexión de otra forma. Documentar lo que se decida.
- **Throws async de resiliencia (RELACIONADO, opcional):** `observeResilience` usa try/catch
  **síncrono**; los componentes data-driven (stepper/charts/tabs…) petan al montarse vacíos pero
  Lit lanza async → el try/catch no lo captura y `resilience` sale optimista en falso (los crashes
  solo aparecen en `report-full.html` vía `page.on('pageerror')`). Mismo origen (Lit async). Si se
  ataca, awaitar `updateComplete` dentro de cada trial y atribuir el throw a su escenario.

## 5. Ficheros

- `src/harness/probe.ts` — `observeRuntime` + `probeReflect` (+ `readSlots`) → async; helper `elUpdateComplete`.
- `dogfood/browser-glue.ts` — `await observeRuntime(...)`.
- `src/harness/probe.test.ts` / `probe.browser.test.ts` — ajustar a la firma async; añadir caso de
  un elemento Lit-like con reflexión async (fake con `updateComplete` que resuelve tras setear el attr).
- (Quizá) `src/report/observations.ts` / runner — sin cambios de tipo: `ComponentRuntime` no cambia de forma.

## 6. Verificación

1. `pnpm --filter @shibui-ui/hanko type-check` limpio.
2. `pnpm --filter @shibui-ui/hanko test` (incluye probe + genericity) verde.
3. `pnpm --filter @shibui-ui/hanko test:browser` (vitest browser) verde.
4. **End-to-end real:** `pnpm --filter @shibui-ui/hanko report:full` y luego
   `pnpm --filter @shibui-ui/hanko issues --dry-run`. **Criterio de éxito:** el nº de "sin sello"
   **cae drásticamente** (de 98 a un puñado). Los que queden deben ser señal real:
   - los **29 de a11y**,
   - contrato genuino, p.ej. `lib-burger :: contract/property: propiedad declarada "_labelText"
     ausente` (una prop **privada** declarada en el CEM = smell real del manifest).
5. Revisar `hanko-report/report-full.html` para los diagnósticos de navegador (pageerror) que sí son reales.

> ⚠️ **Entorno (Windows del usuario):** el `fetch` de Node falla TLS contra api.github.com
> (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, AV/proxy que intercepta). Esto NO afecta a la calibración del
> harness (es Playwright/chromium local, no red a GitHub). Solo importa si se prueba el emisor de issues
> de verdad: usar `NODE_EXTRA_CA_CERTS` o `NODE_TLS_REJECT_UNAUTHORIZED=0`. CI (Ubuntu) no se ve afectado.

## 7. Qué se desbloquea después

Con el harness calibrado, el **emisor de issues** (ya en `develop`, PR #542 + fix User-Agent #544)
pasa a ser útil: el dry-run mostrará un nº tratable de componentes realmente sin sello, y *ahí* sí
tiene sentido crear issues. Antes de lanzarlo masivo conviene un **rollout escalonado**: añadir un
flag `--limit N` y/o `--tag <name>` al runner (`src/report/issues-run.ts`) para crear por tandas.
También revisitar las 2 limitaciones v0 documentadas en `docs/specs/github-issues.md` (updateIssue
pisa labels manuales; solo lista issues abiertos → recrea los cerrados a mano).

## 8. Referencias

- Plumbing GitHub validado (smoke test create→update→close contra shibui-core #543, cerrado).
- PRs: #542 (emisor opt-in, MERGED a develop) · #544 (fix User-Agent, OPEN→develop).
- Specs: `docs/specs/harness.md` · `docs/specs/checks-contract.md` · `docs/specs/github-issues.md`.
- Tracker de fases (mantener al cerrar): `docs/phases/development-phases.html`.
- Reporte visual del emisor: `docs/reference/github-issues-flow.html`.
