# Spec · Check de Resiliencia (F5)

> **Estado:** **TERMINADA** (incr. 1 motor + incr. 2 harness + calibración «F5-cierre»). Validada sobre shibui
> (~102 componentes) desde el dogfood. Motor en `src/checks/resilience.ts`, mecanismo en `src/harness/probe.ts`.
> **Fase:** F5. Comparte el entorno de browser con F3/F4 (harness, incr. 2).
> **Naturaleza:** **universal** — no depende del contrato declarado (como a11y, F4).

---

## Propósito

Verificar que el componente **no se rompe** ante entradas adversas: props basura, props vacías, RTL,
montaje/desmontaje, SSR. Es la tercera capa universal de hanko (contrato es condicional; a11y y resiliencia
son universales).

```
elemento ──► (harness: monta bajo cada escenario, captura errores) ──► ResilienceObservation ──► resilienceCheck()
```

## Política vs mecanismo (igual que F3/F4)

| | Qué es | Dónde | Cuándo |
|---|---|---|---|
| **mecanismo** | montar el elemento bajo cada escenario y capturar si lanza | harness (`@vitest/browser`) | incremento 2 |
| **política** | qué escenarios son obligatorios, cuáles tolerables, cobertura | `resilienceCheck` (motor puro) | **incremento 1 (este)** |

El motor es **agnóstico a los escenarios concretos**: solo lee `survived` por intento. El harness decide qué
escenarios ejecuta. Así el motor no especula sobre el catálogo de pruebas (generalizar desde el uso).

## Superficie pública

```ts
resilienceCheck(observation, options?): ResilienceResult   // src/checks/resilience.ts
```

```ts
ResilienceObservation { tagName; trials?: { scenario; survived; error? }[] }
ResilienceResult      { tagName; pass; violations[]; warnings[]; checked[]; skipped[] }
ResilienceFinding     { scenario; message }
ResilienceOptions     { optional?: string[] }   // escenarios tolerables
```

## La política (incremento 1)

- Cada intento que **no sobrevive** (`survived: false`) es un hallazgo.
- Si su escenario está en `optional` → **warning** (informa, no falla). Si no → **violación**.
- `trials` ausente o vacío → se omite (no es fallo). `checked`/`skipped` reflejan la cobertura.

Escenarios previstos para el harness (no impuestos por el motor): `empty` (sin props), `junk-attrs`
(atributos con valores inválidos), `rtl` (`dir="rtl"`), `remount` (montar/desmontar/remontar), `ssr`
(render a string sin DOM — tolerable si el DS no apunta a SSR).

## Criterios de aceptación (F5 · incremento 1)

1. Un escenario obligatorio roto → violación; uno opcional roto → warning.
2. Todos sobreviven → `pass: true` con `checked` poblado.
3. `trials` ausente/vacío → se omite sin fallar.
4. El mensaje cae al `error` capturado, o a uno por defecto si no lo hay.
5. Tests verdes en `src/checks/resilience.test.ts`.

## Incremento 2 — harness de resiliencia (hecho)

- Monta cada componente bajo los escenarios con `@vitest/browser` y construye la `ResilienceObservation`.
  Compartido con el harness de F3/F4 (ver [`harness.md`](harness.md)).
- **Captura completa de crashes (calibración):** cada trial corre en una ventana que escucha `window`
  (`error` + `unhandledrejection`) además del rechazo de `updateComplete`, así que capta también los throws
  que Lit emite a nivel de ventana (no solo los que rechazan la promesa). Ver `runCapturingWindowErrors` y
  la §Calibración de `harness.md`.
- **Hallazgo:** sobre shibui un montaje adverso-vacío sobrevive limpio salvo 2 crashers en `junk-attrs`; los
  `pageerror` restantes del Trust Report son artefactos del sentinel de `probeReflect` (contrato), no de
  resiliencia.

## Calibración «F5-cierre» — qué hace fallar la resiliencia (decisión 5.1)

Antes, el runner pasaba **todos** los escenarios adversos como `optional` → ningún crash descalificaba el
sello → la capa era **verde por construcción** (informativa, nunca mordía). Es el análogo F5 del viejo proxy
`keyboardReachable` de F4. Calibrado:

- **`remount` es OBLIGATORIO.** Montar→desmontar→montar la MISMA instancia vacía **no depende de datos**: un
  componente sano sobrevive. Un crash ahí es fragilidad de ciclo de vida GENUINA (doble registro, listeners
  filtrados, estado no reinicializado) → descalifica el sello. La capa deja de ser verde por construcción.
- **`empty` · `junk-attrs` · `rtl` siguen `optional`** (`DATA_DEPENDENT_SCENARIOS` en `probe.ts`): se montan
  SIN datos, así que un componente data-driven puede petar por *falta de datos*, no por fragilidad → su crash
  es **warning**, no violación. Evita el falso positivo data-driven (lección #549).
- **`remount` honesto (no doble-cuenta `empty`).** `observeRemount` solo cuenta el fallo del **2º** montaje:
  si el PRIMER montaje vacío ya peta, eso es asunto de `empty` (tolerable) → `remount` lo omite. Así un
  data-driven que no monta vacío **no** se penaliza dos veces. Ver `observeRemount` en `probe.ts`.

> **Limitación conocida (consecuencia de diferir `valid-min`):** como `remount` monta **vacío**, un componente
> data-driven que ni siquiera monta vacío (su 1er montaje peta) **no llega** a ejercitar la fragilidad de
> re-montaje (2º montaje) → para ese subconjunto el gate obligatorio no muerde (su crash de 1er montaje queda
> como warning de `empty`). Es el reverso aceptado de evitar el falso positivo data-driven: distinguir
> «frágil al re-montaje» de «necesita datos» exigiría montar con datos mínimos (`valid-min`, diferido — 5.2).
> Sobre shibui hoy es teórico (ningún componente peta el montaje vacío). Reabrir con `valid-min` si importa.

El cableado vive en `src/report/run.ts`: `resilienceCheck(obs, { optional: [...DATA_DEPENDENT_SCENARIOS] })`.

> **Efecto en el dogfood:** ningún componente de shibui trip­ea `remount` (todos sobreviven a re-montarse
> vacío) → `sellados` estable. Pero el gate ahora **muerde de verdad** (lo prueba la fixture
> `hanko-remount-crasher`): un componente frágil al re-montaje SÍ perdería el sello. Verde honesto, no verde
> por construcción.

## `valid-min` (sembrado de datos mínimos) — DIFERIDO a vNext (decisión 5.2)

Distinguir «frágil» de «necesita datos» exigiría un escenario duro que monte el componente con datos mínimos
por tipo del CEM (`[]`/`{}`/valores mínimos). **Diferido formalmente** (como `focusVisible` en F4): se probó en
su día y **el contrato no mejoró** (el ruido restante era drift del CEM, no fragilidad), y con `remount`
obligatorio la capa ya muerde donde es honesto. Es una decisión escrita, no un olvido. Reabrir solo si aparece
un consumer que necesite distinguir fragilidad real de falta de datos en escenarios data-driven.
