# 判子 hanko

> Motor de verificación de **confianza** (*trust*) **manifest-driven** para Web Components.
> El sello que estampa cada componente que cumple su contrato declarado.

**Estado:** Hito 1 en curso — F0 mergeado a `main`, F1 implementado (pend. validación).
Construido **desde 0** (no hereda la infra de test de `@shibui-ui/ui`, que es a medida).

> 🔄 **¿Retomando en una sesión nueva de Claude?** Empieza por
> [`docs/phases/README.md → Cómo retomar este proyecto`](docs/phases/README.md): tiene el estado actual,
> el orden de lectura, las reglas del flujo (worktree sin node_modules, commits `--no-verify`, GitFlow) y el
> próximo paso accionable.

---

## Tesis

La IA genera más código del que un humano puede revisar línea a línea → la confianza pasa de la *lectura*
a la *verificación automática*. El humano revisa el **contrato** (el manifest, pequeño y legible); hanko
verifica que la **implementación** lo honra (grande, ilegible).

## Qué verifica / qué no

- **Verifica** (capa mecánica, ~70% de los bugs de componente): contrato (props/eventos/slots/métodos),
  a11y (axe + teclado + foco + ARIA), resiliencia (props basura/vacías, SSR, RTL) y *drift* implementación↔manifest.
- **No verifica:** corrección semántica / de negocio.
- **Emite** un **Trust Report** (JSON + HTML).

## Principios de arquitectura (no negociables)

1. **Genérico de nacimiento.** El `core` **nunca** importa de `@shibui-ui/ui`. Recibe `hanko.config.ts` + el manifest.
2. **CEM es el único idioma del core.** Todo lo ajeno se normaliza en el borde de ingestión (ver caso especial).
3. **Generalizar desde el uso, no especular.** No se añade una opción al core hasta que un consumer real la necesita.
4. **shibui-ui = consumer #1** (≈99 componentes). Uso local primero; publicación a npm diferida.

## Estrategia de validación

- **Suelo (Floor) calibrado al manifest más pobre** (Web Components vanilla): schema CEM válido + `tagName` registrable.
- **Regla de oro: *ausencia ≠ incumplimiento*** — hanko valida **solo lo que el manifest declara**. Lo no declarado
  no se verifica (no es fallo); lo declarado que el runtime contradice **sí** es violación.
- **Niveles incrementales:** Floor (MVP) → Conformance (declarado↔runtime) → Strict (exige completitud, opt-in).

Ver decisión completa en
[`docs/decisions/adr-001-baseline-minima-viable.md`](docs/decisions/adr-001-baseline-minima-viable.md).

## Caso especial (fuera del camino principal)

Componentes **sin manifest** o con **manifest custom no estándar** → documentado y separado del planning del núcleo en
[`docs/special-cases/manifest-ausente-o-custom.html`](docs/special-cases/manifest-ausente-o-custom.html).
Decisión aún **abierta**.

## Documentación

Toda la documentación de hanko —specs, decisiones y fases— vive en **[`docs/`](docs/)**. Índice maestro en
[`docs/README.md`](docs/README.md).

| Documento | Contenido |
|---|---|
| [`docs/phases/`](docs/phases/) | Fases de desarrollo F0–F7 (info de plan de obra) |
| [`docs/decisions/adr-001-baseline-minima-viable.md`](docs/decisions/adr-001-baseline-minima-viable.md) | ADR-001 — estrategia de validación (camino principal) |
| [`docs/specs/`](docs/specs/) | Specs por subsistema (a definir) |
| [`docs/special-cases/manifest-ausente-o-custom.html`](docs/special-cases/manifest-ausente-o-custom.html) | Caso especial — sin manifest / formato custom |
| [`docs/reference/web-components-vs-lit-y-manifest.html`](docs/reference/web-components-vs-lit-y-manifest.html) | Referencia — Web Components vs Lit y el manifest |

> **Nota:** los reports `hanko-brand-concept.html` y `hanko-development-phases.html` viven aún en
> `docs/reports/` de la raíz del monorepo en otra rama; deberán moverse a `docs/phases/` y `docs/reference/`
> de este paquete al integrar, para no quedar huérfanos.

---

## Estructura propuesta (a definir)

```
packages/hanko/
├─ package.json
├─ README.md            ← este fichero
├─ src/                 ← (a definir)
│  ├─ core/             ← lógica genérica; NUNCA importa de shibui
│  ├─ ingest/           ← lectura/normalización de manifest (CEM + adapters)
│  ├─ checks/           ← contrato · a11y · resiliencia · drift
│  └─ report/           ← Trust Report (JSON + HTML)
└─ docs/                ← ✅ creada — specs, decisiones y fases
   ├─ phases/           ← fases de desarrollo F0–F7
   ├─ decisions/        ← ADRs
   ├─ specs/            ← specs por subsistema
   ├─ special-cases/    ← casos especiales (sin manifest / custom)
   └─ reference/        ← material de referencia
```

> Esta estructura es una **propuesta de partida**, no está creada. Se irá definiendo carpeta a carpeta
> a medida que avancemos por las fases.
