# Audit: Tareas delegables a modelo local (Gemma 3 12B via Ollama)

> Fecha: 2026-06-07  
> Rama analizada: `claude/local-model-task-audit-zlqMG`  
> Base de análisis: 96 `.component.ts`, 95 `.stories.ts`, 110 archivos CSS en `packages/shibui-ui/src/`

---

## Prerequisitos de autonomía

Para que yo (Claude Code) pueda delegar tareas a Gemma sin acción manual del usuario:

```bash
# El usuario debe tener corriendo:
ollama serve
ollama pull gemma3:12b

# Verificación rápida:
curl -s http://localhost:11434/api/generate \
  -d '{"model":"gemma3:12b","prompt":"responde OK","stream":false}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['response'])"
```

Una vez cumplido, el ciclo que yo ejecuto es:

1. `Glob` / `Grep` — localizar archivos objetivo
2. `Read` — leer contenido (máx. 2-3 archivos por llamada)
3. `Bash` — llamar al API de Ollama y parsear la respuesta
4. `Edit` / reporte — aplicar corrección o presentar hallazgo

---

## Resumen ejecutivo

| Estado | Tareas |
|--------|--------|
| **APTO** — bajo riesgo, verificación trivial | 5 |
| **APTO CON REVISIÓN** — requiere confirmación humana antes de editar | 4 |
| **EXCLUIDO** — >2 archivos de contexto o decisión arquitectónica | 3 (listadas al final) |

**Volumen total de instancias identificables hoy:** ~350 checks distribuidos en 96 componentes.  
**Instancias con violaciones reales confirmadas:** 9 `declare global` faltantes · 9+ `reflect: true` faltantes · ~18 colores hardcodeados en 2 archivos CSS.

---

## Tabla comparativa

| # | Tarea | Vol. | Contexto | Verificabilidad | Riesgo | Autonomía | Veredicto |
|---|-------|------|----------|----------------|--------|-----------|-----------|
| 1 | `reflect: true` audit | ~20 instancias | 1 archivo | Fácil (diff) | Medio | **Sí, autónomo** | APTO |
| 2 | `declare global` completeness | 9 faltantes | 1 archivo | Fácil (grep) | Bajo | **Sí, autónomo** | APTO |
| 3 | Hardcoded colors en CSS | ~18 en 2+ archivos | 1 archivo | Fácil (diff) | Bajo | **Sí, autónomo** | APTO |
| 4 | CSS `@layer` header check | 96 archivos | 1 archivo | Trivial | Bajo | **Sí, autónomo** | APTO |
| 5 | CSS header comment block | 96 archivos | 1 archivo | Fácil (plantilla) | Bajo | **Sí, autónomo** | APTO |
| 6 | JSDoc `@slot`/`@fires`/`@csspart` | 96 archivos | 2 archivos | Media | Bajo | Sí, con script | APTO CON REVISIÓN |
| 7 | Union types vs CSS variants | 96 archivos | 2 archivos | Media | Medio | Sí, con script | APTO CON REVISIÓN |
| 8 | Story `argTypes` coverage | 95 archivos | 2 archivos | Media | Bajo | Sí, con script | APTO CON REVISIÓN |
| 9 | Inline px → tokens (sizing) | ~30 archivos | 1 archivo | Media | Bajo | Sí, con script | APTO CON REVISIÓN |
| 10 | Katachi export completeness | 95 archivos | 1 archivo | Trivial | Bajo | **Sí, autónomo** | APTO (gate CI) |

---

## Fichas detalladas

---

### Tarea 1 — `reflect: true` en `@property` booleanos

**Qué hace el modelo:** Lee un `.component.ts`, detecta todos los `@property({ type: Boolean })` que carecen de `reflect: true`, y devuelve la lista de líneas a corregir (o aplica el parche directamente).

**Por qué importa:** Sin `reflect: true`, el atributo HTML no se sincroniza con la propiedad JS. Los selectores CSS como `:host([disabled])` no funcionan aunque el componente tenga la prop.

**Evidencia real del repo:**

```
packages/shibui-ui/src/components/organisms/data-table/lib-data-table.component.ts:62
  @property({ type: Boolean }) selectable = false;    ← sin reflect:true

packages/shibui-ui/src/components/organisms/data-table/lib-data-table.component.ts:67
  @property({ type: Boolean }) toolbar = false;       ← sin reflect:true

packages/shibui-ui/src/components/atoms/label/lib-label.component.ts:21
  @property({ type: Boolean }) required: boolean = false;  ← sin reflect:true
```

Al menos 9 archivos afectados (`data-table`, `stagger-container`, `accordion`, `cursor-follower`, `header`, `range-slider`, `sparkline`, `label` + 1 más).

**Referencia correcta** (`lib-button.component.ts:50`):
```typescript
@property({ type: Boolean, reflect: true })
disabled = false;
```

| Criterio | Valor |
|----------|-------|
| Volumen | ~20 instancias en ~9 archivos |
| Contexto | 1 archivo (`.component.ts`) |
| Verificabilidad | Fácil — diff de `@property({ type: Boolean })` vs `@property({ type: Boolean, reflect: true })` |
| Riesgo si incorrecto | Medio — añadir `reflect: true` donde no procede (props internas) rompe nada, pero el modelo debe entender que solo aplica a props que afectan estilos CSS |
| Autonomía | **Sí, autónomo** |

**Invocación que yo ejecutaría:**

```bash
FILE=$(cat packages/shibui-ui/src/components/organisms/data-table/lib-data-table.component.ts)
RESPONSE=$(curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Analiza este archivo LitElement TypeScript. Lista SOLO las líneas con @property({ type: Boolean }) que NO tienen reflect: true. Para cada una indica: número de línea, nombre de propiedad, y si la propiedad se usa en selectores CSS :host([attr]) (responde 'sí/no' basándote únicamente en el código del archivo). Formato JSON: [{\\\"line\\\": N, \\\"prop\\\": \\\"name\\\", \\\"css_selector_likely\\\": true/false}]\\n\\nARCHIVO:\\n${FILE}\"
}")
echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['response'])"
```

**Criterio de aceptación:** El modelo devuelve JSON parseable con los campos esperados. Yo reviso el JSON y aplico `Edit` solo en los que tienen `css_selector_likely: true`.

---

### Tarea 2 — `declare global { HTMLElementTagNameMap }` completeness

**Qué hace el modelo:** Lee un `.component.ts` y responde si falta el bloque de declaración global. Sin él, las apps TypeScript consumidoras no tienen IntelliSense del elemento.

**Evidencia real del repo:**

```bash
# 9 archivos component.ts sin el bloque:
grep -rL "declare global" packages/shibui-ui/src/components --include="*.component.ts"
```

**Referencia correcta** (`lib-button.component.ts:146`):
```typescript
declare global {
  interface HTMLElementTagNameMap {
    'lib-button': LibButton;
  }
}
```

| Criterio | Valor |
|----------|-------|
| Volumen | 9 archivos faltantes hoy; check preventivo en los 96 restantes |
| Contexto | 1 archivo |
| Verificabilidad | Trivial — grep de `declare global` |
| Riesgo si incorrecto | Bajo — el modelo solo genera el bloque, no modifica lógica. Peor caso: genera el nombre de clase o tag incorrecto → detectable en `type-check` |
| Autonomía | **Sí, autónomo** |

**Invocación que yo ejecutaría:**

Para los 9 archivos identificados con `grep -rL`, el prompt es mínimo:

```bash
CONTENT=$(cat lib-[nombre].component.ts)
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Lee este archivo LitElement. Extrae: (1) el tag name del @customElement, (2) el nombre de la clase exportada. Devuelve SOLO el bloque TypeScript a añadir al final del archivo, sin explicación:\\n\\n${CONTENT}\"
}"
```

**Criterio de aceptación:** El output es el bloque con el tag y clase correctos. Lo verifico contra `@customElement('lib-xxx')` y la clase exportada antes de aplicar `Edit`.

---

### Tarea 3 — Hardcoded color values en CSS de componentes

**Qué hace el modelo:** Lee un archivo CSS de componente y detecta colores hardcodeados (`oklch(...)`, `rgb(...)`, `#rrggbb`) que debería usar tokens semánticos del sistema (`var(--bg-*)`, `var(--text-*)`, `var(--border-*)`).

**Evidencia real del repo** (violaciones confirmadas):

```css
/* packages/shibui-ui/src/components/organisms/dialog/lib-dialog.css:28 */
background: rgb(18, 14, 10, 0);                        /* ← debe ser var(--bg-overlay) */

/* lib-dialog.css:243 */
border-color: oklch(18% 0.02 45deg);                   /* ← debe ser var(--border-subtle) */

/* lib-dialog.css:247 */
color: rgb(250, 247, 244, 0.85);                       /* ← debe ser var(--text-primary) */

/* packages/.../drawer/lib-drawer.css:41 */
background: rgb(26, 20, 14, 0);                        /* ← debe ser var(--bg-overlay) */
background: rgb(26, 20, 14, .45);                      /* ← debe ser var(--bg-overlay) */
```

~18 instancias confirmadas entre `lib-dialog.css` y `lib-drawer.css`. Ambos son organismos complejos donde el token correcto puede requerir juicio.

**Valores LEGÍTIMOS que el modelo no debe reportar:**
- `blur(3px)` en `backdrop-filter`
- `translateY(12px)` en transforms de animación
- `1px` en separadores (`height: 1px`)

| Criterio | Valor |
|----------|-------|
| Volumen | ~18 confirmadas; ~30+ a verificar en organismos restantes |
| Contexto | 1 archivo CSS + lista mental de tokens semánticos (se incluye en el prompt) |
| Verificabilidad | Fácil — el diff muestra el cambio; `type-check` pasa igualmente (es CSS) |
| Riesgo si incorrecto | Bajo — cambio visual si el modelo sugiere el token semántico equivocado, pero es revertible y el visual test en CI lo detecta |
| Autonomía | **Sí, autónomo** |

**Invocación que yo ejecutaría:**

```bash
TOKENS="Tokens semánticos disponibles:
--bg-base, --bg-surface, --bg-elevated, --bg-inverse, --bg-overlay
--text-primary, --text-secondary, --text-muted, --text-inverse, --text-accent
--border-subtle, --border-default, --border-strong, --border-focus
--color-error, --color-warning, --color-success, --color-info"

CSS=$(cat lib-dialog.css)
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Analiza este CSS de un Web Component Lit. Detecta valores de color hardcodeados (oklch, rgb, rgba, #hex) que deberían usar los tokens semánticos listados. NO reportes: blur() en backdrop-filter, translateY/X() en transforms, valores en animaciones @keyframes, ni valores de 1px en height/width de separadores estructurales.\\n\\nTokens disponibles:\\n${TOKENS}\\n\\nDevuelve JSON: [{\\\"line\\\": N, \\\"current\\\": \\\"valor actual\\\", \\\"suggested_token\\\": \\\"var(--...)\\\", \\\"confidence\\\": \\\"alta|media\\\"}]\\n\\nCSS:\\n${CSS}\"
}"
```

**Criterio de aceptación:** Aplico solo sugerencias con `confidence: alta`. Las de `media` las presento al usuario para revisión manual.

---

### Tarea 4 — CSS `@layer` header declaration check

**Qué hace el modelo:** Lee un CSS de componente y verifica que la primera línea sea exactamente `@layer tokens, reset, components;`. Si falta, genera la corrección.

**Por qué es una tarea para el modelo y no un linter:** El formato exacto de la línea varía (espacios, orden de capas, ausencia total) — Stylelint no valida el contenido semántico del `@layer`, solo la sintaxis. El modelo puede además identificar si el archivo tiene capas en orden incorrecto.

**Referencia correcta** (`lib-button.css:1`):
```css
@layer tokens, reset, components;
```

| Criterio | Valor |
|----------|-------|
| Volumen | 96 archivos (check de compliance en todos) |
| Contexto | 1 archivo |
| Verificabilidad | Trivial — comparar línea 1 vs string esperado |
| Riesgo si incorrecto | Bajo para detección; medio si el modelo reordena capas incorrectamente en la corrección |
| Autonomía | **Sí, autónomo** |

**Invocación que yo ejecutaría:**

```bash
# Para detección masiva (sin Gemma, solo Bash):
for f in $(find packages/shibui-ui/src/components -name "*.css"); do
  head -1 "$f" | grep -qF "@layer tokens, reset, components;" || echo "FALTA: $f"
done
```

Para este caso específico, **no necesito a Gemma** — es un grep. Pero si quiero que Gemma también revise el **orden correcto de las capas usadas dentro** del archivo (que `reset` no use propiedades de `components`, etc.), el prompt sería:

```bash
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Revisa este CSS de componente Lit con @layer. Verifica: (1) la primera línea es exactamente '@layer tokens, reset, components;', (2) ninguna regla en @layer reset usa propiedades de layout complejas (display flex/grid con gap, etc.) — solo reset básico (:host display, box-sizing), (3) ninguna regla en @layer components redefine los tokens --lib-*. Devuelve JSON: {\\\"layer_header_ok\\\": bool, \\\"issues\\\": [\\\"descripción\\\"]}\\n\\nCSS:\\n${CSS}\"
}"
```

---

### Tarea 5 — CSS header comment block

**Qué hace el modelo:** Lee un archivo CSS de componente, extrae las variantes (`:host([variant="X"])`), modificadores (`:host([attr])`), y tamaños (`:host([size="X"])`), y genera el bloque de comentario canónico al principio si está ausente o incompleto.

**Plantilla canónica** (de `lib-button.css:3`):
```css
/* ============================================================
   LIB-BUTTON — Shibui UI
   Variantes (rol semántico): primary · secondary · ghost · accent · danger
   Modificadores:             glass · size (sm/md/lg) · disabled · spotlight
   Katachi ambient:           kintsugi · celadon · sabi · terminal
   ============================================================ */
```

| Criterio | Valor |
|----------|-------|
| Volumen | 96 archivos — ~30% sin el bloque o con formato incompleto (estimado) |
| Contexto | 1 archivo CSS |
| Verificabilidad | Fácil — comparar contra la plantilla; verificar que los valores listados coinciden con los selectores del archivo |
| Riesgo si incorrecto | Bajo — es solo un comentario; no afecta compilación ni behavior |
| Autonomía | **Sí, autónomo** |

**Invocación que yo ejecutaría:**

```bash
CSS=$(cat lib-badge.css)
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Lee este CSS de un Web Component Lit. Extrae: (1) nombre del componente (del patrón LIB-xxx o :host), (2) todas las variantes en selectores :host([variant=\\\"X\\\"]), (3) todos los modificadores booleanos :host([attr]), (4) tamaños :host([size=\\\"X\\\"]). Genera SOLO el bloque de comentario CSS siguiendo exactamente esta plantilla (sin nada más):\\n\\n/* ============================================================\\n   LIB-NOMBRE — Shibui UI\\n   Variantes (rol semántico): v1 · v2 · v3\\n   Modificadores: attr1 · attr2 · tamaño (sm/md/lg)\\n   ============================================================ */\\n\\nCSS:\\n${CSS}\"
}"
```

---

### Tarea 6 — JSDoc `@slot`, `@fires`, `@csspart` completeness

**Qué hace el modelo:** Lee el `.component.ts` y el `.html.ts` del mismo componente. Del `.html.ts` extrae los `<slot name="X">` y `<slot>` sin nombre; del `.component.ts` extrae los `dispatchEvent(new CustomEvent('ui-lib-...'))` y el selector `:csspart`. Compara contra los tags JSDoc existentes y genera los que faltan.

**Ejemplo real** (`lib-button.component.ts:10`):
```typescript
/**
 * @tag lib-button
 * @element lib-button
 * @fires ui-lib-click - Evento personalizado disparado al hacer clic.
 * @csspart button - El elemento <button> nativo.
 */
```
El componente también usa `<slot name="prefix">` y `<slot name="suffix">` en `lib-button.html.ts`, pero el JSDoc no documenta `@slot prefix` ni `@slot suffix` — omisión real.

| Criterio | Valor |
|----------|-------|
| Volumen | 96 componentes; estimado ~60% con slots no documentados |
| Contexto | **2 archivos** (`.component.ts` + `.html.ts`) |
| Verificabilidad | Media — requiere comparar slots en template vs `@slot` en JSDoc |
| Riesgo si incorrecto | Bajo — solo documentación; no rompe compilación ni behavior |
| Autonomía | Sí, con script (el script lee los 2 archivos y los concatena para el prompt) |

**Invocación que yo ejecutaría:**

```bash
COMP=$(cat lib-button.component.ts)
HTML=$(cat lib-button.html.ts)

curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Dado este par de archivos LitElement (component + html template), genera los tags JSDoc faltantes para el bloque @customElement.\\n\\nExtrae del .html.ts: todos los <slot name=\\\"X\\\"> → @slot X - descripción breve. Los <slot> sin nombre → @slot (unnamed) - Contenido principal.\\nExtrae del .component.ts: todos los dispatchEvent con CustomEvent → @fires nombre - descripción.\\nCompara contra los @slot/@fires ya presentes en el JSDoc del .component.ts y devuelve SOLO los que faltan.\\n\\nFormato: un tag por línea, listo para insertar en el bloque JSDoc existente.\\n\\n.component.ts:\\n${COMP}\\n\\n.html.ts:\\n${HTML}\"
}"
```

**Criterio de aceptación:** Reviso visualmente los tags generados antes de insertarlos. El nombre de slot debe coincidir exactamente con el del template.

---

### Tarea 7 — Union types vs CSS variant selectors

**Qué hace el modelo:** Lee el `.css` del componente (extrae todos los `:host([variant="X"])`) y el `.types.ts` (extrae el union type `LibXxxVariant = ...`). Detecta si hay variantes en CSS sin tipo declarado, o tipos declarados sin selector CSS correspondiente.

**Por qué es valioso:** Un bug silencioso habitual — añadir un selector CSS de nueva variante y olvidar actualizar el tipo, o viceversa.

| Criterio | Valor |
|----------|-------|
| Volumen | 96 pares archivo; ~10-15% con desincronización estimada |
| Contexto | **2 archivos** (`.css` + `.types.ts`) |
| Verificabilidad | Media — la diferencia es obvia pero requiere entender que algunos tipos son heredados de `src/types/public.ts` (e.g., `LibSize`) |
| Riesgo si incorrecto | Medio — si el modelo propone añadir un tipo que en realidad viene de un type externo, genera ruido pero no rompe |
| Autonomía | Sí, con script |

**Invocación que yo ejecutaría:**

```bash
CSS=$(cat lib-badge.css)
TYPES=$(cat lib-badge.types.ts)
SHARED="LibSize = 'sm' | 'md' | 'lg' | 'xl'  (tipo compartido, no redeclarar)"

curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Compara las variantes de CSS y los tipos TypeScript de este componente Lit.\\n\\nDel CSS extrae todos los valores X en :host([variant=\\\"X\\\"]) y :host([size=\\\"X\\\"]).\\nDel .types.ts extrae todos los valores en los union types.\\nNota: ${SHARED} — no reportes size como problema si ya existe LibSize.\\n\\nDevuelve JSON: {\\\"css_only\\\": [\\\"valores en CSS sin tipo\\\"], \\\"types_only\\\": [\\\"valores en tipo sin selector CSS\\\"], \\\"ok\\\": bool}\\n\\nCSS:\\n${CSS}\\n\\n.types.ts:\\n${TYPES}\"
}"
```

---

### Tarea 8 — Story `argTypes` coverage

**Qué hace el modelo:** Lee el `.component.ts` (extrae todos los `@property`) y el `.stories.ts` (extrae el objeto `argTypes`). Detecta props públicas que no tienen entrada en `argTypes`.

**Ejemplo real** — `lib-button.stories.ts` cubre `variant`, `size`, `disabled`, `glass`, `spotlight`, pero no `type` ni `custom-padding` (dos props válidas que no aparecen en los controles de Storybook).

| Criterio | Valor |
|----------|-------|
| Volumen | 95 story files; ~40% con props no cubiertas en argTypes (estimado) |
| Contexto | **2 archivos** (`.component.ts` + `.stories.ts`) |
| Verificabilidad | Media — algunas props intencionalmente omitidas de `argTypes` (ej. internas, IDs de accesibilidad) |
| Riesgo si incorrecto | Bajo — solo añade controles en Storybook; no afecta el componente |
| Autonomía | Sí, con script |

**Invocación que yo ejecutaría:**

```bash
COMP=$(cat lib-button.component.ts)
STORY=$(cat lib-button.stories.ts)

curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Lista las props @property del .component.ts que NO aparecen en argTypes del .stories.ts. Excluye props que claramente son internas o de accesibilidad: aria-label, id, role, tabindex, cualquier prop con nombre que empiece por '_'. Para cada prop faltante, sugiere el tipo de control Storybook apropiado: 'boolean' para Boolean, 'select' para union type string, 'text' para string libre, 'number' para Number. Devuelve JSON: [{\\\"prop\\\": \\\"nombre\\\", \\\"type\\\": \\\"boolean|select|text|number\\\", \\\"options\\\": [\\\"...\\\"] o null}]\\n\\n.component.ts:\\n${COMP}\\n\\n.stories.ts:\\n${STORY}\"
}"
```

---

### Tarea 9 — Hardcoded px values → tokens de espaciado

**Qué hace el modelo:** Lee un CSS de componente y detecta valores en `px` que corresponden a la escala 4pt del sistema (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`) y deberían usar tokens `--lib-space-*`. Excluye valores legítimamente hardcodeados: transforms, alturas de 1px, tamaños fijos de icono/avatar, valores en `@keyframes`.

**Evidencia real** — `lib-dialog.css` tiene `width: 36px`, `height: 36px`, `width: 28px`, `height: 28px` que son tamaños de botones de cierre. Si la escala 4pt incluye 36px (no está en la escala base), probablemente sea un valor fijo legítimo. El modelo debe identificar solo los que caen en la escala.

Tokens disponibles:
```
--lib-space-xs: 4px
--lib-space-sm: 8px
--lib-space-md: 16px
--lib-space-lg: 24px
--lib-space-xl: 32px
--lib-space-2xl: 48px
--lib-space-3xl: 64px
```

| Criterio | Valor |
|----------|-------|
| Volumen | ~30 archivos con px hardcodeados; ~15 instancias candidatas reales |
| Contexto | 1 archivo CSS |
| Verificabilidad | Media — el modelo puede confundir tamaños fijos de UI con espaciados |
| Riesgo si incorrecto | Bajo — si sustituye un px legítimo por token incorrecto, el visual test lo detecta |
| Autonomía | Sí, con script |

**Invocación que yo ejecutaría:**

```bash
SCALE="Escala 4pt: 4px=var(--lib-space-xs), 8px=var(--lib-space-sm), 16px=var(--lib-space-md), 24px=var(--lib-space-lg), 32px=var(--lib-space-xl), 48px=var(--lib-space-2xl), 64px=var(--lib-space-3xl)"

CSS=$(cat lib-dialog.css)
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"${SCALE}\\n\\nAnaliza este CSS. Para cada valor en px en propiedades gap/padding/margin/top/left/right/bottom: si coincide con la escala 4pt, sugiere el token correspondiente. NO reportes: transform translateX/Y, height/width de 1px o 2px (separadores), valores en @keyframes, border-radius, font-size. Devuelve JSON: [{\\\"line\\\": N, \\\"property\\\": \\\"gap\\\", \\\"current\\\": \\\"16px\\\", \\\"token\\\": \\\"var(--lib-space-md)\\\"}]\\n\\nCSS:\\n${CSS}\"
}"
```

---

### Tarea 10 — Katachi export completeness (gate CI)

**Qué hace el modelo:** Lee un `.stories.ts` y verifica que exporta exactamente los 6 contextos Katachi: `KatachiShizen`, `KatachiWabi`, `KatachiKintsugi`, `KatachiCeladon`, `KatachiSabi`, `KatachiTerminal`.

**Estado actual:** Los 95 story files tienen los 6 exports (confirmado por `grep -rL "KatachiShizen"` = 0 resultados). Esta tarea es por tanto útil como **gate preventivo** en nuevos componentes, no como corrección de deuda existente.

| Criterio | Valor |
|----------|-------|
| Volumen | 95 archivos (0 violaciones hoy; relevante en cada nuevo componente) |
| Contexto | 1 archivo |
| Verificabilidad | Trivial — lista de 6 strings fijos |
| Riesgo si incorrecto | Bajo — solo detección; si el modelo da falso positivo, un grep lo desmiente en segundos |
| Autonomía | **Sí, autónomo** (y se puede hacer con grep puro — ver nota) |

**Nota:** Para este check en concreto, **un script Bash es más eficiente que llamar a Gemma**. La única razón para usar el modelo es si quieres que además verifique que el `renderContent` del helper muestra el espectro completo (todos los variants), no solo una instancia mínima. Eso sí requiere juicio semántico.

**Invocación que yo ejecutaría (versión semántica):**

```bash
STORY=$(cat lib-badge.stories.ts)
curl -s http://localhost:11434/api/generate -d "{
  \"model\": \"gemma3:12b\",
  \"stream\": false,
  \"prompt\": \"Lee este story file de Storybook para un Web Component Lit. Verifica: (1) exporta KatachiShizen, KatachiWabi, KatachiKintsugi, KatachiCeladon, KatachiSabi, KatachiTerminal (los 6), (2) el renderContent pasado a createKatachiStories muestra más de una variante del componente (no solo un ejemplo mínimo). Devuelve JSON: {\\\"all_six_exports\\\": bool, \\\"missing\\\": [], \\\"render_content_complete\\\": bool, \\\"render_content_note\\\": \\\"qué muestra\\\"}\\n\\nSTORY:\\n${STORY}\"
}"
```

---

## Tareas excluidas

### Consumer contract test generation
- Requiere: fixture del framework + spec del componente + patrones de test existentes = mínimo 4 archivos
- Decisión arquitectónica: qué ejes verificar (registration, props, events, slots, katachi)
- **Excluida**

### Migración de tokens (palette → semántico)
- Requiere coordinar `_palette.css`, `_semantic.css`, `_katachi.css` + todos los archivos del componente
- La equivalencia de tokens tiene casos límite documentados en `KATACHI.md` — requiere conocimiento del sistema completo
- **Excluida**

### Refactorización de template functions
- Afecta el contrato de la función `[name]Template(props)` — cambiar la interfaz `[Name]TemplateProps` rompe el componente
- Decisión arquitectónica sobre separación de concerns
- **Excluida**

---

## Orden de ejecución recomendado

Si se va a ejecutar todo el ciclo, este orden minimiza el riesgo de regresiones:

1. **Tarea 4** (CSS `@layer` check) — solo detección, sin edición
2. **Tarea 2** (`declare global`) — corrección mecánica, fácil de revertir
3. **Tarea 1** (`reflect: true`) — corrección con revisión humana del JSON
4. **Tarea 3** (hardcoded colors) — corrección con visual test en CI como red de seguridad
5. **Tarea 6** (JSDoc slots/events) — solo documentación
6. **Tarea 7** (union types) — requiere `pnpm type-check` después
7. Resto de tareas a criterio según prioridad del sprint
