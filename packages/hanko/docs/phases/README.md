# Fases de desarrollo — hanko

> 🖼️ **Vista visual:** [`development-phases.html`](development-phases.html) — timeline de los 3 hitos y las 8 fases.

Plan de obra en **8 fases** agrupadas en **3 hitos**. Cada fase tiene criterio de cierre propio y solo se
aborda cuando la anterior está estable.

> Esfuerzo estimado F0–F6 ≈ **12–16 días**. **Arranque acordado = F0 + F1 + F2** en la primera tanda
> (el primer sello valida la tesis del producto).

---

## Hito 1 — Cimientos e ingestión

### F0 · Cimientos + modelo de datos
Esqueleto del paquete, tooling de test desde 0 (NO heredar la infra a medida de `@shibui-ui/ui`), y el
**modelo de datos del contrato**: la forma normalizada en que hanko representa internamente un componente
leído del CEM. Todo lo demás cuelga de aquí.

### F1 · Ingestión del manifest
Lectura del `custom-elements.json` (CEM) → modelo de datos interno. Define el borde de ingestión donde,
más adelante, encajarán los adapters de formatos no estándar (ver `../special-cases/`).

### F2 · Smoke / primer sello
Validación mínima end-to-end sobre **10 → 99 componentes** de shibui-ui. Emite el primer sello aunque sea
básico. **Hito que valida la tesis**: ¿el flujo manifest → verificación → sello funciona a escala real?

---

## Hito 2 — Capas de verificación

### F3 · Contrato
Verifica props / eventos / slots / métodos declarados contra el runtime. Aquí vive la **regla de oro**
(*ausencia ≠ incumplimiento*) y los niveles Floor → Conformance → Strict del [ADR-001](../decisions/adr-001-baseline-minima-viable.md).

### F4 · Accesibilidad (a11y)
axe + navegación por teclado + foco + ARIA. Pruebas **universales** (no dependen del contrato declarado).

### F5 · Resiliencia
Props basura / vacías, SSR, RTL. El componente no debe romperse ante entradas adversas.

---

## Hito 3 — Reporte y desacople

### F6 · Trust Report + gates de CI
Reporte de confianza (**JSON + HTML**) con procedencia y cobertura del sello. Gates que fallan el build
cuando un componente no cumple su nivel exigido.

### F7 · Desacople + publicación npm (diferida)
Garantizar que el `core` no depende de shibui y publicar `@shibui-ui/hanko` como paquete independiente.
**Diferida** hasta validar el uso local.

---

## Estado

| Fase | Estado |
|---|---|
| F0 | 🟡 piezas completas (modelo de datos + tsconfig + Vitest + primer test + [ADR-002](../decisions/adr-002-estrategia-testing.md)); falta solo ejecutar `type-check`/`test` desde el repo principal |
| F1–F7 | ⬜ no iniciadas |

> El detalle de cada fase se desarrollará en `phases/fN-titulo.md` conforme la abordemos.
