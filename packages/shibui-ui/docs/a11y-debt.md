# Deuda de accesibilidad — `@shibui/ui`

Registro de issues de accesibilidad conocidos y aceptados temporalmente. Cada entrada debe incluir la ratio medida, el umbral WCAG, y el motivo por el que está en esta lista en lugar de corregirse.

---

## Contraste de color

### `--text-muted` por debajo de WCAG AA Large (3:1)

**Detectado por:** `scripts/contrast-tokens.test.ts` (2026-05-23)  
**Estado:** Skipped en CI — pendiente de decisión de diseño

| Contexto | Valor texto | Valor fondo | Ratio medida | Umbral |
|---|---|---|---|---|
| `default` | `washi-400` (#B8A99A) | `washi-100` (#F2EDE6) | **2.97:1** | 3:1 |
| `shizen` | `washi-400` (#B8A99A) | `washi-100` (#F2EDE6) | **2.97:1** | 3:1 |
| `wabi` | `washi-600` (#7A6A5C) | `washi-900` (#221C16) | **2.98:1** | 3:1 |
| `sabi` | `washi-400` (#B8A99A) | `washi-50` (#FAF7F4) | **2.41:1** | 3:1 |

**Contextos que sí cumplen:** `kintsugi`, `terminal`, `celadon`

**Causa raíz:**  
`--text-muted` es un token de texto para elementos decorativos (placeholders, metadata, hints). Los valores actuales de la paleta washi crean rangos de contraste de ~2.4–3.0:1 en las combinaciones claro-sobre-claro (sabi) y oscuro-sobre-oscuro (wabi).

**Opciones para resolver:**

1. **Ajustar la paleta** — mover `--text-muted` un paso hacia el extremo en cada contexto:
   - `default/shizen`: `washi-400` → `washi-500` (`#9A8878`) → contraste estimado ~3.5:1
   - `wabi`: `washi-600` → `washi-500` (`#9A8878`) → contraste estimado ~3.8:1
   - `sabi`: `washi-400` → `washi-600` (`#7A6A5C`) → contraste estimado ~4.5:1

2. **Documentar como excepción WCAG** — WCAG 2.1 permite excepciones para texto decorativo y texto en logotipos. Si `--text-muted` se usa exclusivamente para texto decorativo (no para texto informativo), se puede argumentar que está dentro de las excepciones. Requiere una decisión explícita del equipo.

3. **Mantener el skip** — seguir con los tests en skip y revisar en el contexto de una auditoría de accesibilidad más amplia.

**Siguiente paso recomendado:** Revisar en el contexto del color system refactor. El `sabi` case (2.41:1) es el más urgente — `washi-400` sobre `washi-50` tiene poco contraste sin argumento estético claro.
