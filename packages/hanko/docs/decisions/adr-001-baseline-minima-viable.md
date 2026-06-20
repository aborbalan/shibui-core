# hanko · ADR-001 — Baseline mínima viable calibrada al manifest más pobre

> **Estado:** Aceptada (planificación) · **Fecha:** 2026-06-14 · **Ámbito:** hanko (trust engine manifest-driven)
> **Relacionado:** [`../reference/web-components-vs-lit-y-manifest.html`](../reference/web-components-vs-lit-y-manifest.html) · patrón de niveles de *Cohesión de props* (Nivel 1/2/3)

---

## Contexto

hanko es un motor de verificación de confianza **manifest-driven** para Web Components. Su entrada es el
**Custom Elements Manifest (CEM)** (`custom-elements.json`, schema 1.0.0) generado por `cem analyze`.

> **Alcance de este ADR (camino principal):** todo lo que sigue asume que el componente trae un **CEM**.
> Ese es el camino feliz y el único que cubre el planning del núcleo (fases F0–F7). Los componentes **sin
> manifest** o con un **formato de manifest custom no estándar** son un **caso especial separado**,
> documentado aparte en [`../special-cases/manifest-ausente-o-custom.html`](../special-cases/manifest-ausente-o-custom.html).
> No se mezclan aquí para no contaminar el planning del camino feliz.

Dos caminos de autoría alimentan el mismo manifest:

- **Web Components vanilla** (`HTMLElement` + JSDoc) → manifest **potencialmente parcial**: la riqueza depende
  de la disciplina de anotación del autor (`@attr`, `@fires`, `@csspart`…).
- **Lit Elements** (`@property`, `@customElement`) → manifest **rico por defecto**: los decoradores declarativos
  exponen props, tipos, reflect, eventos y slots sin esfuerzo extra.

> Nota: un Lit Element **es** un Web Component. La distinción solo existe en *authoring-time*. En runtime ambos son
> Custom Elements estándar idénticos, y hanko opera sobre el **manifest** y el **elemento del DOM**, no sobre el código fuente.

## Problema

¿Sobre qué nivel de información del manifest se diseña la primera versión de hanko, dado que vanilla y Lit
aportan cantidades de información muy distintas?

## Decisión

**La base mínima viable (el *suelo* obligatorio) se calibra al productor que menos información da: los Web Components
vanilla.** Una vez ese suelo es sólido, se escala por niveles hacia validaciones más ricas.

Esto se apoya en una regla central que evita que "diseñar para el más pobre" degrade el motor:

### Regla de oro: **ausencia ≠ incumplimiento**

| Situación | Interpretación de hanko |
|---|---|
| El manifest **no declara** X (p.ej. eventos) | **No verificable** → no es un fallo. hanko no valida lo que no existe. |
| El manifest **declara** X y el runtime lo **contradice** | **Violación** → fallo de conformidad. |

La validación es **condicional a lo presente**: hanko valida *solo lo que el manifest declara*. Así, un manifest
rico (Lit) **se gana** una validación más estricta por aportar más, y uno pobre (vanilla parco) **pasa** sin quedar
excluido — sin que el motor se vuelva inútil.

## Modelo escalonado (incremental)

Mismo patrón que la *Cohesión de props* (Nivel 1/2/3). Cada nivel se aborda **solo cuando el anterior funciona**.

| Nivel | Nombre | Qué exige | Quién pasa | Fase |
|---|---|---|---|---|
| **0** | **Floor** (obligatorio) | tagName válido + schema CEM bien formado | Todos | **MVP** |
| **1** | **Conformance** (condicional) | lo *declarado* en el manifest coincide con el runtime | Todos, valida según riqueza | Siguiente |
| **2** | **Strict** (opt-in) | exige declarar props/eventos/tipos completos | Quien quiera el sello alto (Lit lo cumple fácil) | Futuro |

### Alcance del MVP (Nivel 0 — Floor)

Lo mínimo que cualquier Web Component vanilla puede satisfacer:

1. El manifest existe y conforma al schema CEM 1.0.0.
2. Hay al menos una declaración `customElement: true` con `tagName` válido.
3. El `tagName` declarado se corresponde con un Custom Element registrable/registrado.
4. (Condicional) Si hay `members` con `attribute`, el reflect declarado es coherente con el elemento real.

> El MVP **no** exige que el componente declare eventos, slots ni tipos de unión. Si los declara, se validan
> (Nivel 1); si no, se omiten sin penalizar.

## Consecuencias

**Positivas**
- Un solo motor sirve para vanilla y Lit sin ramas de código por tecnología de autoría.
- El suelo es alcanzable por el ecosistema más amplio posible → máxima adopción inicial.
- La riqueza de Lit no se desperdicia: se aprovecha en niveles superiores de forma incremental.
- Roadmap claro y verificable: cada nivel es un hito con criterio de cierre propio.

**Negativas / a vigilar**
- Un vanilla mal anotado producirá un sello "válido pero pobre". hanko valida fielmente un contrato parcial;
  comunicar la *cobertura* del sello (qué se verificó vs qué se omitió) será importante para no dar falsa confianza.
- Riesgo de que "ausencia ≠ violación" se confunda con permisividad. Mitigación: el nivel **Strict** opt-in
  convierte la ausencia en fallo para quien busca el sello alto.

## Caso especial (separado de este ADR)

La **política para un Web Component sin manifest CEM**, o con un **formato de manifest custom no estándar**,
queda **fuera del alcance de este ADR** por decisión explícita: pertenece a otro plano (ingestión no estándar),
no al planning del camino feliz CEM/manifest.

Se documenta de forma independiente —análisis, modelo de ingestión, propuesta y salvaguardas— en:

➜ **[`../special-cases/manifest-ausente-o-custom.html`](../special-cases/manifest-ausente-o-custom.html)**

Esa decisión sigue **abierta**; el documento aporta la propuesta (adapter en el borde para formatos custom;
carril degradado sin sello de conformidad cuando no hay manifest), pendiente de cerrarse en su propio ADR
cuando toque, tras estabilizar el Floor.

---

_Decisión registrada como parte de la planificación de hanko. Sin código aún._
