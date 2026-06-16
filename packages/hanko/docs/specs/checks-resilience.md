# Spec · Check de Resiliencia (F5)

> **Estado:** v0 (incremento 1) — implementado en `src/checks/resilience.ts`.
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

## Incremento 2 (siguiente) — harness de resiliencia

- Montar cada componente bajo los escenarios con `@vitest/browser`, capturando excepciones de
  `connectedCallback`/render → construir la `ResilienceObservation`. Compartido con el harness de F3/F4
  (ver [`harness.md`](harness.md)).
- Calibrar el catálogo de escenarios y la lista `optional` contra shibui-ui real.
