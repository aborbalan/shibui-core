# Shibui UI — Superficies × Efectos por Componente

> Registro de implementación real. Se actualiza componente a componente en orden alfabético.
> La compatibilidad teórica de la matriz global está en `shibui-surfaces-x-effects.html`.
> Última auditoría: 2026-05-16 — átomos, moléculas y organismos verificados sobre CSS real.
> Sistema Katachi (形) completado al 100% (77/77 componentes con bloque KATACHI).

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado |
| 🔲 | Compatible — pendiente de implementar |
| ❌ | Conflicto — no aplicar (ver matriz) |
| `—` | No aplica / neutro para este componente |
| `↑ padre` | Lo gestiona el componente padre |

**Superficies:** `light` · `dark` · `kintsugi` · `glitch` · `celadón` · `washi`  
**Efectos:** `glass` · `spotlight` · `kintsugi-border` · `shadow-brutal` · `metal-texture`

---

## Átomos

---

### `lib-accordion-item` · ✅

> **Nota de arquitectura:** Este átomo no implementa variantes de superficie directamente.
> Sus valores visuales (fondos, colores, bordes) están expuestos como CSS custom properties
> (`--accordion-item-trigger-bg`, `--accordion-item-body-bg`, etc.) para que el padre
> `lib-accordion` los sobreescriba según su propia variante. El ítem en sí es
> superficialmente neutro por diseño.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | `↑ padre` | Defaults actuales equivalen a light |
| dark | `↑ padre` | Requiere override desde lib-accordion |
| kintsugi | `↑ padre` | Requiere override desde lib-accordion |
| glitch | `↑ padre` | Requiere override desde lib-accordion |
| celadón | `↑ padre` | — |
| washi | `↑ padre` | — |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No aplica: el item no es una superficie flotante |
| spotlight | — | `—` | No aplica: área interactiva pequeña, no card |
| kintsugi-border | kintsugi | 🔲 | El trigger podría llevar kintsugi-border como línea inferior cuando open |
| shadow-brutal | light / washi | 🔲 | Podría aplicarse al root del item como sombra lateral |
| metal-texture | — | `—` | No aplica |

---

### `lib-aspect-ratio`

> **Nota:** Contenedor utilitario puro. No tiene superficies propias — es un wrapper
> de relación de aspecto. Superficies y efectos los hereda del contenido que alberga.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-avatar` · ✅

> **CSS verificado.** El componente expone una prop `color` (`washi` · `kaki` · `celadon` · `dark`)
> que controla la paleta de fondo de la cara (iniciales / icono fallback). Esta dimensión es
> independiente de las superficies del sistema — `color="dark"` oscurece la cara del avatar
> pero no adapta el componente a una superficie dark global. No existen variantes de superficie
> explícitas (`variant="kintsugi"` etc.). El avatar hereda tokens del contexto sin tratamiento propio.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | `—` | Hereda tokens; `color="washi"` / `color="kaki"` son la paleta clara natural |
| dark | `—` | Hereda tokens; `color="dark"` oscurece la cara pero no es variante surface |
| kintsugi | 🔲 | Sin implementar — anillo dorado pendiente |
| glitch | 🔲 | Sin implementar |
| celadón | `—` | `color="celadon"` cubre el caso de uso; no necesita variante surface |
| washi | `—` | `color="washi"` es el default; cubre el caso de uso |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No aplica: tamaño insuficiente para el efecto |
| spotlight | — | `—` | No aplica: tamaño insuficiente para el efecto |
| kintsugi-border | kintsugi | 🔲 | Anillo dorado sustituyendo al border actual (1px washi-300) |
| shadow-brutal | light / washi | 🔲 | Sombra sólida 2–3px en variante square/squircle |
| metal-texture | — | `—` | No aplica |

---

### `lib-background` · ✅

> **Componente especial — CSS verificado.**
> `lib-background` no *consume* el sistema de superficies y efectos: lo *produce*.
> Cada variante es en sí misma una superficie. El análisis relevante aquí es qué
> familias de superficie están cubiertas, cuántas variantes tiene cada una, y qué gaps existen.
> Los efectos del sistema (`--lib-glass-filter`, `--lib-spotlight-x/y`, `--lib-metal-texture`)
> **no se usan** — cada variante implementa su efecto visual de forma baked-in con CSS propio.

---

#### Variantes implementadas — 52 total

**Light (15)**
`washi` · `washi-grain` · `washi-weave` · `seigaiha` · `tatami` · `asanoha` · `sashiko` · `komon` · `kasuri` · `nishiki` · `kagome` · `shoji` · `shibori` · `ori` · `chirimen`

**Dark (15)**
`sumi` · `sumi-grain` · `ash-grid` · `ink-dot` · `mokume` · `kumo` · `temari` · `dusk` · `embers` · `obsidian` · `forge` · `void` · `yami` · `midnight` · `kintsugi`

**Gradient (8)**
`aurora-light` · `kaki-glow` · `celadon-mist` · `noctiluca` · `horizon` · `sakura` · `twilight` · `jade-deep`

**Animated (8)**
`breathing` · `aurora-drift` · `scan` · `ink-drop` · `shimmer` · `pulse` · `fog` · `static`

**Canvas (6)**
`particles` · `rain` · `wave-mesh` · `constellation` · `fireflies` · `ink-wash`

---

#### Cobertura por superficie

| Superficie | Variantes que la cubren | Estado | Gaps |
|------------|------------------------|--------|------|
| light | 15 light + `aurora-light` `kaki-glow` `horizon` `sakura` `breathing` `ink-drop` `shimmer` `wave-mesh` `ink-wash` | ✅ Bien cubierta | — |
| dark | 15 dark + `noctiluca` `twilight` `jade-deep` `aurora-drift` `scan` `fog` `static` `particles` `rain` `constellation` `fireflies` | ✅ Bien cubierta | — |
| kintsugi | `kintsugi` (filamentos sutiles) · `pulse` (anillos dorados animados) | 🔲 Escasa | Solo 2 variantes. Falta: kintsugi con grietas visibles, kintsugi sobre papel claro, kintsugi + textura |
| glitch | `static` (ruido CRT + scanlines) | 🔲 Mínima | Solo 1 variante. Falta: RGB split, aberración cromática, glitch con color |
| celadón | `celadon-mist` · `jade-deep` | 🔲 Escasa | Solo 2 variantes vs 15 de light y dark. Falta densidad en la familia jade/celadón |
| washi | Toda la familia light es esencialmente washi | ✅ Cubierta | Washi como superficie = light; no es un gap |

---

#### Efectos del sistema — estado

| Efecto | Estado | Notas |
|--------|--------|-------|
| glass | `—` | No hay variante frosted/glass. `aurora-drift` tiene orbes pero sin `backdrop-filter`. Gap real si se quiere un fondo de cristal |
| spotlight | `—` | `aurora-drift` tiene orbes flotantes pero no usa `--lib-spotlight-x/y`. No es reactivo al cursor |
| kintsugi-border | `—` | `kintsugi` (dark) usa `linear-gradient` propio, no el token `--lib-kintsugi-border` |
| shadow-brutal | `—` | No aplica: es superficie, no elemento |
| metal-texture | `—` | `washi-grain`, `sumi-grain`, `chirimen`, `static` usan `feTurbulence` SVG inline custom — no el token `--lib-metal-texture` |

---

### `lib-badge` · ✅

> **CSS verificado.** Las variantes (`default` · `accent` · `celadon` · `dark` · `error` · `success` · `warning`)
> son paletas semánticas de color, no variantes del sistema de superficies.
> `variant="dark"` cubre el uso en fondos oscuros pero no es una adaptación de superficie formal.
> Sin efectos implementados.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | `—` | `default` / `accent` / `celadon` cubren el uso en light |
| dark | `—` | `variant="dark"` cubre el uso visual; no es surface adaptation |
| kintsugi | 🔲 | Sin implementar — borde dorado pendiente |
| glitch | 🔲 | Sin implementar |
| celadón | `—` | `variant="celadon"` cubre el caso de uso |
| washi | `—` | `variant="default"` es washi por naturaleza |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No aplica: tamaño insuficiente |
| spotlight | — | `—` | No aplica: tamaño insuficiente |
| kintsugi-border | kintsugi | 🔲 | Borde dorado fino en variante kintsugi |
| shadow-brutal | light / washi | 🔲 | Sombra sólida 2px reducida — natural para shape definido |
| metal-texture | — | `—` | No aplica |

---

### `lib-bento-item` · ✅

> **CSS verificado.** Contenedor estructural puro. Sin variantes de superficie ni efectos.
> Fondo `bg-elevated`, borde `border-subtle`, `lib-radius-lg` (2px brutalista).
> Solo tiene los modificadores `interactive` (hover con `translateY` + `shadow-md`)
> y `flush` (elimina padding para contenido a sangre).
> Las superficies y efectos los aporta el contenido que alberga, no el ítem en sí.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| todas | `—` | Contenedor neutro — hereda del contenido |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | dark / kintsugi | 🔲 | Posible: `.bento-item` con `backdrop-filter` como variante |
| spotlight | dark / kintsugi | 🔲 | Posible: foco reactivo al cursor por celda vía `mousemove` |
| kintsugi-border | kintsugi | 🔲 | Posible: borde dorado en celdas kintsugi |
| shadow-brutal | light / washi | 🔲 | Posible: sombra sólida como alternativa al hover actual |
| metal-texture | — | `—` | No aplica |

---

### `lib-burger-button` · ✅

> **CSS verificado.** Las 6 variantes están completamente implementadas y mapean
> directamente a superficies del sistema. Los efectos son todos baked-in con CSS propio —
> ninguno usa tokens del sistema (`--lib-kintsugi-border`, `--lib-spotlight-gradient`, etc.).

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `ink` · `kanji` · `washi` | `text-primary`, hover `kaki-500` |
| dark | ✅ | `kintsugi` | Color `rgba(250,247,244,.5)` sobre fondo oscuro |
| kintsugi | ✅ | `kintsugi` | Destello radial kaki en estado open |
| glitch | ✅ | `glitch` | Ghosts RGB split (`clip-path`), scramble en click |
| celadón | `—` | — | No aplica |
| washi | ✅ | `framed` | Borde `border-default`, rombo kaki en open |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No aplica: tamaño insuficiente |
| spotlight | — | `—` | `kintsugi` tiene radial gradient propio, no usa `--lib-spotlight-gradient` |
| kintsugi-border | kintsugi | `—` | `kintsugi` tiene destello radial propio, no usa `--lib-kintsugi-border` |
| shadow-brutal | light / washi | 🔲 | Posible en `framed`: sombra sólida 4px como alternativa al borde fino |
| metal-texture | — | `—` | No aplica |

---

### `lib-button` · ✅

> **CSS verificado.** Variantes sólidas cubren el uso en light. El modificador `glass`
> es el primero en átomos que conecta directamente con los tokens del sistema
> (`--lib-glass-filter`, `--lib-glass-bg`, `--lib-glass-border`, `--lib-glass-shadow`,
> `--lib-glass-shine`), con sub-variantes `glass+primary` → `--lib-glass-bg-water`
> y `glass+accent` → `--lib-glass-bg-kaki`. Sin variantes kintsugi ni glitch. Sin dark adaptation.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `primary` · `secondary` · `ghost` · `accent` · `danger` |
| dark | 🔲 | Sin adaptación — `secondary` y `ghost` necesitan tokens invertidos sobre fondos oscuros |
| kintsugi | 🔲 | Sin implementar — líneas doradas, destello radial en hover |
| glitch | 🔲 | Sin implementar — RGB split, scramble |
| celadón | `—` | No aplica |
| washi | `—` | Las variantes light cubren el uso en washi |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | dark / kintsugi | ✅ | Implementado con tokens del sistema. `glass+primary` → water, `glass+accent` → kaki |
| spotlight | dark / kintsugi | 🔲 | No implementado — foco reactivo al cursor sobre el área del botón |
| kintsugi-border | kintsugi | 🔲 | No implementado — `--lib-kintsugi-border` como borde en variante kintsugi |
| shadow-brutal | light / washi | 🔲 | Tiene `shadow-md` difusa en hover; `--lib-shadow-brutal` (4px sólida) no implementada |
| metal-texture | `—` | `—` | No aplica |

---

### `lib-card` · ✅

> **CSS verificado.** Las 8 variantes están completamente implementadas y cubren
> todas las superficies del sistema. Los efectos son baked-in — la seam kintsugi
> usa `linear-gradient` propio animado (no `--lib-kintsugi-border`), el RGB split
> del glitch usa `box-shadow` con offset (no tokens del sistema). Sin glass ni spotlight.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` · `accent` | `bg-elevated`, `border-subtle` |
| dark | ✅ | `inverse` · `featured` | `washi-900` / gradient kaki |
| kintsugi | ✅ | `kintsugi` | `washi-950`, seam animada `::before`, gradiente dorado en título |
| glitch | ✅ | `glitch` | `washi-950`, barra celadón, scanlines `::after`, `glitch-drift`, RGB split en hover |
| celadón | ✅ | `celadon` | `washi-950`, barra celadón superior, hover glow verde |
| washi | ✅ | `washi` | `washi-50`, `washi-200`, barra `washi-400` superior |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No implementado — `lib-glass-card` lo cubre como componente separado |
| spotlight | dark / kintsugi | 🔲 | No implementado — `lib-spotlight-card` lo cubre, posible convergencia futura |
| kintsugi-border | kintsugi | `—` | Variante `kintsugi` tiene seam propia (`linear-gradient` animado), no usa `--lib-kintsugi-border` |
| shadow-brutal | light / washi | 🔲 | Tiene `shadow-lg` difusa en hover; `--lib-shadow-brutal` (4px sólida) no implementada |
| metal-texture | — | `—` | No implementado |

---

### `lib-card-grid` · ✅

> **CSS verificado.** Contenedor de layout puro (`CSS Grid`). Fondo y borde con opacidad
> `0.04` — prácticamente transparentes. Sin variantes de superficie ni efectos.
> Expone `--cg-cols` y `--cg-gap` como API pública. Las superficies y efectos
> los aportan las tarjetas que alberga, no el grid en sí.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-checkbox` · ✅

> **CSS verificado.** Variantes de color del box (`default` washi-900 · `kaki` kaki-500 · `error`)
> — no variantes de superficie. Sin dark adaptation, sin efectos. Mismo patrón que lib-badge y lib-avatar.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | `—` | Default funciona en light; `variant` es color del box, no surface |
| dark | 🔲 | Sin adaptación — box y label no invierten tokens sobre fondos oscuros |
| kintsugi | 🔲 | Sin implementar |
| glitch | 🔲 | Sin implementar |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — control de formulario de tamaño insuficiente |

---

### `lib-close-button` · ✅

> **CSS verificado.** 7 variantes implementadas. Light: `ghost` · `subtle` · `outlined` · `filled` ·
> `filled-round` · `danger`. Dark: `on-dark` — adaptación explícita con `oklch(100% 0 0deg / 0.45)`,
> el único átomo hasta ahora con dark adaptation formal como variante propia (no delegada al contexto).
> Sin kintsugi, glitch ni efectos.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `ghost` · `subtle` · `outlined` · `filled` · `filled-round` · `danger` | Cobertura completa |
| dark | ✅ | `on-dark` | Adaptación explícita — color `oklch(100%/0.45)`, hover `oklch(100%/0.10)` |
| kintsugi | 🔲 | — | Sin implementar |
| glitch | 🔲 | — | Sin implementar |
| celadón | `—` | — | No aplica |
| washi | `—` | — | Light cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — tamaño insuficiente para efectos de superficie |

---

### `lib-code-block` · ✅

> **CSS verificado.** Dos variantes: `default` (dark, `washi-950`) y `ghost` (light, `washi-100`).
> Notable: `default` usa `--lib-shadow-brutal` — el primer átomo que conecta con este token del sistema.
> Sin kintsugi, glitch ni otros efectos.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `ghost` | `washi-100` fondo, `washi-200` header, sin sombra |
| dark | ✅ | `default` | `washi-950` fondo, `washi-900` header |
| kintsugi | 🔲 | — | Sin implementar |
| glitch | 🔲 | — | Sin implementar — scanlines CRT serían naturales aquí |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `ghost` cubre el uso en washi |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | No aplica |
| spotlight | — | `—` | No aplica |
| kintsugi-border | kintsugi | 🔲 | No implementado |
| shadow-brutal | dark | ✅ | `--lib-shadow-brutal` activo en variante `default` — conectado al token del sistema |
| metal-texture | — | `—` | No aplica |

---

### `lib-color-scale` · ✅

> **CSS verificado.** Componente de documentación puro — visualiza escalas de color con hover-expand.
> Sin variantes de superficie ni efectos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-content-pillar` · ✅

> **CSS verificado.** Dos superficies: `surface="light"` (explícita) y dark/kaki como default
> (valores sin atributo usan `rgba(184,90,30,0.35)` para kanji — contexto oscuro natural).
> Sin kintsugi ni glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `surface="light"` — colores invertidos a tokens claros |
| dark | ✅ | Default (sin atributo) — kanji y label con opacidades kaki sobre fondo oscuro |
| kintsugi | `—` | No aplica — componente editorial de apoyo |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | `surface="light"` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — elemento tipográfico de apoyo |

---

### `lib-copy-button` · ✅

> **CSS verificado.** 5 variantes: `ghost` · `outlined` · `filled` · `subtle` (light) y `on-dark`
> (adaptación explícita para fondos oscuros). Estado `[copied]` cambia a celadón en todas las variantes.
> Tooltip animado incluido. Sin kintsugi, glitch ni efectos del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `ghost` · `outlined` · `filled` · `subtle` | Paleta completa para fondos claros |
| dark | ✅ | `on-dark` | Adaptación explícita con oklch transparencias |
| kintsugi | `—` | — | No aplica — control utilitario |
| glitch | `—` | — | No aplica |
| celadón | `—` | — | No aplica |
| washi | `—` | — | Variantes light cubren el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — control de formulario/acción |

---

### `lib-counter` · ✅

> **CSS verificado.** Control de display numérico animado (digit flip). Tones: `default` · `kaki` · `celadon` · `error` · `muted` · `on-dark`. `tone="on-dark"` es la adaptación para fondos oscuros via OKLCH. Sin variantes de superficie formales ni efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | `—` | Default (`text-primary`) funciona en light |
| dark | `—` | `tone="on-dark"` cubre el uso en dark — oklch(82% 0.03 62deg) |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `tone="celadon"` es suficiente |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — display numérico |

---

### `lib-display-heading` · ✅

> **CSS verificado.** Tres superficies implementadas: `light` (default), `surface="dark"`, `surface="washi"`.
> Sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — `washi-800` heading, `washi-500` desc |
| dark | ✅ | `surface="dark"` — `rgba(250,247,244,0.65)` heading, `rgba(250,247,244,0.28)` desc |
| kintsugi | 🔲 | Sin implementar — acento dorado en letras pendiente |
| glitch | 🔲 | Sin implementar |
| celadón | `—` | No aplica |
| washi | ✅ | `surface="washi"` — `washi-800` heading, `washi-600` desc |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — elemento tipográfico |

---

### `lib-divider`

> **Nota:** Elemento estructural neutro. No tiene superficies ni efectos propios.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-eyebrow`

> **Nota:** Elemento tipográfico de apoyo. Neutro.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-glass-card` · ✅

> **CSS verificado.** Completamente implementado. Tres variantes de tinte (`paper` default · `water` · `kaki`)
> y tres intensidades de blur (`low` 4px · `md` 12px default · `high` 25px). Usa los tokens del sistema:
> `--lib-glass-filter`, `--lib-glass-bg`, `--lib-glass-border`, `--lib-glass-shadow`, `--lib-glass-shine`.
> Reflexión de luz vía `::before`. El blur requiere un fondo oscuro detrás para ser efectivo.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ❌ | Conflicto — glass no aporta nada sobre fondos claros |
| dark | ✅ | Contexto natural — las 3 variantes funcionan sobre dark |
| kintsugi | ✅ | Compatible — el blur sobre el fondo kintsugi funciona bien |
| glitch | ❌ | Conflicto filosófico — agua vs terminal rota |
| celadón | `—` | Neutro |
| washi | `—` | Neutro |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | dark / kintsugi | ✅ | Es la razón de ser del componente — tokens del sistema conectados |
| spotlight | dark / kintsugi | 🔲 | Combinación posible — spotlight + glass encima |
| kintsugi-border | kintsugi | 🔲 | Hilo dorado en el borde del cristal |
| shadow-brutal | — | ❌ | Conflicto: brutal + glass son narrativas opuestas |
| metal-texture | dark / kintsugi | 🔲 | Textura de ruido sobre el vidrio |

---

### `lib-icon`

> **Nota:** SVG inline. Hereda el color del contexto mediante `currentColor`.
> No tiene superficie propia — se adapta al contexto del componente padre.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-kbd` · ✅

> **CSS verificado.** 5 variantes: `default` (light bg-elevated), `dark` (washi-800), `ghost` (transparent),
> `kaki` (kaki-50), `celadon` (celadon-100). Sin kintsugi, sin glitch. El efecto `is-pressed` simula
> la pulsación física vía `translateY + border-bottom`. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` · `ghost` · `kaki` · `celadon` | bg-elevated, key wall simulado |
| dark | ✅ | `dark` | washi-800, border washi-950 |
| kintsugi | `—` | — | No aplica para una tecla |
| glitch | `—` | — | No aplica |
| celadón | `—` | — | `variant="celadon"` cubre el caso de uso |
| washi | `—` | — | `variant="default"` es washi por naturaleza |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| shadow-brutal | light | `—` | El `border-bottom: 3px` ya simula profundidad — shadow-brutal sería redundante |
| resto | — | `—` | No aplica |

---

### `lib-label`

> **Nota:** Elemento tipográfico de formulario. Neutro en cuanto a superficies y efectos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-liquid-button` · ✅

> **CSS verificado.** Variantes: `ink` · `washi` · `kaki` · `celadon` · `ghost` · `danger` + `[dark]` modifier
> para `ghost`. El efecto líquido (canvas WebGL/2D con ripple + wave sinusoidal) es el
> efecto propio del componente — no usa tokens del sistema. Sin kintsugi ni glitch.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `ink` · `washi` · `kaki` · `celadon` · `ghost` · `danger` | Paleta completa para light |
| dark | ✅ | `ghost[dark]` | Adaptación parcial — solo ghost tiene modo dark explícito |
| kintsugi | 🔲 | — | Sin implementar |
| glitch | `—` | — | El efecto líquido y el glitch son filosóficamente incompatibles |
| celadón | `—` | — | `variant="celadon"` cubre el caso de uso |
| washi | `—` | — | `variant="washi"` cubre el caso de uso |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| glass | `—` | El efecto líquido propio es incompatible con glass |
| spotlight | 🔲 | Posible en dark |
| kintsugi-border | 🔲 | — |
| shadow-brutal | `—` | Conflicto con el efecto líquido |
| metal-texture | `—` | No aplica |

---

### `lib-magnetic`

> **Nota:** Wrapper de comportamiento puro (efecto magnético al cursor).
> No tiene superficie propia — la hereda del contenido que envuelve.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-progress` · ✅

> **CSS verificado.** Tones: `default` (washi-900) · `kaki` · `celadon` · `error`. Sin superficie dark
> ni adaptaciones de superficie. Modificadores: `striped` · `indeterminate` · `square`. Multi-segmento.
> Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — track `washi-200`, fill `washi-900` |
| dark | 🔲 | Sin adaptación — track y fill no invierten sobre fondos oscuros |
| kintsugi | `—` | No aplica |
| glitch | 🔲 | Posible: scanline sobre la barra |
| celadón | `—` | `tone="celadon"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-progress-circle` · ✅

> **CSS verificado.** Variantes: `default` (washi-900) · `kaki` · `celadon` · `error`. Sin dark adaptation.
> El arco animado vía SVG `stroke-dashoffset`. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — arco washi-900 sobre track washi-200 |
| dark | 🔲 | Sin adaptación — arco y track no invierten |
| kintsugi | 🔲 | Trazo dorado del arco pendiente |
| glitch | `—` | No aplica |
| celadón | `—` | `variant="celadon"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-quote` · ✅

> **CSS verificado.** Tres superficies: dark (default, `rgba(250,247,244,0.55)`),
> `surface="light"` (washi-700), `surface="washi"` (washi-800). Sin kintsugi, sin glitch.
> Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `surface="light"` — washi-700 texto, kaki-500 acento, washi-400 cite |
| dark | ✅ | Default — rgba-blanco escalonado, kaki-400 acento, rgba-blanco cite |
| kintsugi | 🔲 | Línea izquierda dorada — pendiente |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | ✅ | `surface="washi"` — washi-800 texto, kaki-500 acento, washi-500 cite |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| kintsugi-border | kintsugi | 🔲 | La línea izquierda como kintsugi-border — pendiente |
| shadow-brutal | washi | 🔲 | Sombra sólida en variante brutalista — pendiente |
| resto | — | `—` | No aplica |

---

### `lib-radio` · ✅

> **CSS verificado.** Variantes: `default` (washi-900) · `kaki` · `error`. Sin dark adaptation.
> Sin efectos del sistema. Mismo patrón que `lib-checkbox`.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — circle border-default, bg-elevated |
| dark | 🔲 | Sin adaptación — circle y label no invierten |
| kintsugi | `—` | No aplica — control de formulario |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — control de formulario de tamaño insuficiente |

---

### `lib-rating` · ✅

> **CSS verificado.** Variantes de color: `gold` (default, CSS var local `--_gold`) · `kaki` · `washi` · `celadon`.
> Half-star en modo readonly via clip trick. Sin dark adaptation. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — estrellas gold sobre fondo claro |
| dark | 🔲 | Sin adaptación — color de estrella vacía (`washi-300`) no invierte |
| kintsugi | 🔲 | Estrellas doradas (`color="kaki"`) son compatible pero no hay surface formal |
| glitch | `—` | No aplica |
| celadón | `—` | `color="celadon"` cubre el caso de uso |
| washi | `—` | `color="washi"` cubre el caso de uso |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-reading-progress` · ✅

> **CSS verificado.** 5 variantes de forma: `bar` (default) · `line` · `dots` · `ring` · `vertical`.
> 4 tones: `kaki` (default) · `celadon` · `ink` · `kintsugi`.
> El tono `kintsugi` tiene tratamiento completo baked-in: gradiente diagonal kaki-600→kaki-300,
> shimmer animado (::before), glow tip extendido — **no usa el token `--lib-kintsugi-border`**.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Funciona en todos los fondos — elemento superpuesto |
| dark | ✅ | Funciona en todos los fondos — elemento superpuesto |
| kintsugi | ✅ | `tone="kintsugi"` — gradiente + shimmer propios, no token del sistema |
| glitch | `—` | No aplica |
| celadón | `—` | `tone="celadon"` cubre el caso de uso |
| washi | `—` | `tone="kaki"` / `tone="ink"` cubren el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | Es un overlay de progreso — no aplica capa de efectos adicional |

---

### `lib-ripple`

> **Nota:** Efecto visual puro superpuesto. No tiene superficie propia.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-select-option`

> **Nota:** Elemento de lista interno a `lib-select` y `lib-dropdown`.
> No tiene superficie propia — la hereda del contenedor.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `↑ padre` |
| Efectos | `—` |

---

### `lib-skeleton` · ✅

> **CSS verificado.** 3 superficies: `light` (default, washi-200/100) · `dark` (washi-800/700) ·
> `kaki` (kaki-200/100). 3 animaciones: `shimmer` (default) · `wave` · `pulse`.
> Sin kintsugi ni glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — shimmer washi-200/100 |
| dark | ✅ | `surface="dark"` — shimmer washi-800/700 |
| kintsugi | `—` | No aplica — skeleton es estado de carga, no surface |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default (`surface="light"`) cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-spacer`

> **Nota:** Utilidad de layout. Sin superficies ni efectos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-spinner` · ✅

> **CSS verificado.** 4 variantes con personalidad propia: `enso` (trazo zen SVG) · `sumi` (tinta en agua,
> conic-gradient) · `kintsugi` (anillo dorado, conic-gradient dorado + drop-shadow) · `shizuku` (gotas en órbita).
> Modificador `[dark]` activa paletas para fondos oscuros.
> La variante `kintsugi` ES el efecto kintsugi del spinner — usa conic-gradient y drop-shadow propios,
> no el token `--lib-kintsugi-border`.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `enso` · `sumi` · `shizuku` | Paleta ink por defecto — legible sobre fondos claros |
| dark | ✅ | Todas con `[dark]` | `dark` activa paletas OKLCH para fondos oscuros |
| kintsugi | ✅ | `kintsugi` | Anillo dorado con glow — implementación propia |
| glitch | `—` | — | No aplica |
| celadón | `—` | — | No aplica |
| washi | `—` | — | Light cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | El componente ES el efecto — no aplica capa adicional |

---

### `lib-spotlight-card` · ✅

> **CSS verificado.** Completamente implementado. Foco radial reactivo al cursor vía
> `--lib-spotlight-x/y` + `--lib-spotlight-gradient*` (tokens del sistema). Tres variantes de foco:
> `kaki` (default) · `water` · `white`. Modificador `[kintsugi]` activa el hilo de oro en el borde
> vía `--lib-kintsugi-border` con mask-composite. El fondo cambia a `oklch(18% 0.02 45deg)` en kintsugi.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ❌ | Conflicto — spotlight invisible sobre fondos claros |
| dark | ✅ | Contexto natural — `oklch(20% 0.02 220deg)` como fondo base |
| kintsugi | ✅ | Nativo — `[kintsugi]` + `--lib-kintsugi-border` implementado |
| glitch | ❌ | Conflicto — dos sistemas de luz en competencia |
| celadón | 🔲 | Compatible con variante `spotlight="water"` |
| washi | `—` | Neutro |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | — | `—` | Componente distinto: lib-glass-card |
| spotlight | dark / kintsugi | ✅ | Es la razón de ser del componente — tokens del sistema conectados |
| kintsugi-border | kintsugi | ✅ | `[kintsugi]` activa `--lib-kintsugi-border` vía mask-composite |
| shadow-brutal | — | ❌ | Conflicto |
| metal-texture | dark / kintsugi | 🔲 | Textura de ruido encima del spotlight |

---

### `lib-status-dot`

> **Nota:** Indicador visual mínimo. No tiene variantes de superficie —
> su color semántico (success/error/warning) es su única dimensión visual.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-step` · ✅

> **CSS verificado.** 3 variantes: `default` · `minimal` (nodo cuadrado, kaki activo) · `kintsugi`.
> La variante `kintsugi` usa `--lib-kintsugi-border` vía mask-composite en los estados active y completed.
> Animación `kintsugi-pulse` en el nodo activo. Conectores dorados en completados.
> Orientación horizontal (default) y vertical.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` · `minimal` | Tokens semánticos del sistema |
| dark | `—` | — | No hay variant dark explícita — hereda del contexto |
| kintsugi | ✅ | `kintsugi` | Fondo oscuro `oklch(12%)`, venas doradas, `--lib-kintsugi-border` conectado |
| glitch | 🔲 | — | Sin implementar |
| celadón | `—` | — | No aplica |
| washi | `—` | — | Default cubre el uso en washi |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| kintsugi-border | kintsugi | ✅ | Nodo del paso — `--lib-kintsugi-border` con mask-composite activo |
| resto | — | `—` | No aplica |

---

### `lib-switch` · ✅

> **CSS verificado.** 2 variantes: `default` (track washi-300/900, thumb white) y `kintsugi`
> (track dark ceramic `oklch(12%)`, `--lib-kintsugi-border` animado en el track vía `::before`,
> thumb dorado animado con `kin-thumb-glow` al activar). Sin dark adaptation explícita. Sin glitch.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` | Track washi-300 → washi-900, thumb blanco |
| dark | 🔲 | — | Sin adaptación — track claro no invierte sobre fondos oscuros |
| kintsugi | ✅ | `kintsugi` | Track dark ceramic + `--lib-kintsugi-border` animado + thumb dorado |
| glitch | `—` | — | No aplica |
| celadón | `—` | — | No aplica |
| washi | `—` | — | Default cubre el uso en washi |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| kintsugi-border | kintsugi | ✅ | Track `::before` usa `--lib-kintsugi-border` con mask-composite |
| resto | — | `—` | No aplica |

---

### `lib-text-glitch` · ✅

> **CSS verificado.** 6 variantes: `slice` (RGB split kaki+celadón, mix-blend-mode) · `scan` (barrido kaki L→R) ·
> `shift` (desregistro tipográfico sutil) · `decode` (katakana scramble JS-driven) · `redact` (barra de tinta) ·
> `noise` (señal analógica corrupta, dark bg only).
> Sin surface prop. Todas las variantes funcionan sobre cualquier superficie pero `noise` es oscuro-only.
> Trigger por hover (default) o `trigger="always"`.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `slice`, `scan`, `shift`, `decode`, `redact` — legibles sobre fondos claros |
| dark | ✅ | Todas las variantes + `noise` (dark-only) |
| glitch | ✅ | Contexto natural del componente — especialmente `noise` y `slice` |
| kintsugi | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Light cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | El componente ES el efecto — no aplica capa adicional |

---

### `lib-text-list` · ✅

> **CSS verificado.** Tres familias: content (ul/ol) · ui (list interactiva) · description (dl key/value).
> Attribute `[dark]` implementa dark adaptation completa para todas las familias vía OKLCH.
> Sin kintsugi ni glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — paleta washi, bg-elevated para UI list |
| dark | ✅ | `[dark]` — dark adaptation completa con oklch para text, borders, backgrounds |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — elemento de contenido/interfaz |

---

### `lib-tooltip` · ✅

> **CSS verificado.** 5 variantes de color: `dark` (default, washi-900) · `light` (bg-elevated + borde) ·
> `kaki` (kaki-500) · `celadon` (celadon-500) · `error`. Sin kintsugi, sin glitch. Sin efectos del sistema.
> Posiciones: 8 variantes (top/bottom/left/right + start/end). Contenido rico vía slots.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `variant="light"` | bg-elevated + border + shadow-md |
| dark | ✅ | `variant="dark"` (default) | washi-900, color washi-100 |
| kintsugi | 🔲 | — | Sin implementar |
| glitch | 🔲 | — | Sin implementar |
| celadón | `—` | — | `variant="celadon"` cubre el caso de uso |
| washi | `—` | — | `variant="light"` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| glass | dark | 🔲 | Tooltip glass sobre fondos oscuros |
| resto | — | `—` | No aplica |

---

### `lib-visually-hidden`

> **Nota:** Utilidad de accesibilidad. Sin display visual — sin superficies ni efectos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

## Moléculas

---

### `lib-breadcrumb` · ✅

> **CSS verificado.** Variantes de acento: `default` · `kaki` · `celadon` · `bold`.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — paleta washi, hover kaki |
| dark | 🔲 | Sin adaptación — separadores y links no invierten |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `.bc-celadon` cubre el acento celadón |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — navegación de apoyo |

---

### `lib-button-group` · ✅

> **CSS verificado.** Wrapper estructural — agrupa `lib-button`. Sin superficies ni efectos propios.
> Las superficies las gestionan los `lib-button` internos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `↑ padre` |
| Efectos | `—` |

---

### `lib-checkbox-card` · ✅

> **CSS verificado.** Variantes de color: `kaki` (default) · `celadon`. El estado checked activa
> borde, fondo tintado y shimmer `::after`. Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — bg-elevated, borde tenue, checked activa tinte kaki |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `color="celadon"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-chip` · ✅

> **CSS verificado.** Colores: `default` · `kaki` · `celadon` · `error` · `info` · `dark`.
> `dark` es adaptación para fondos oscuros. Sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `default` / `kaki` / `celadon` / `error` / `info` |
| dark | ✅ | `color="dark"` — fondo washi-900, texto washi-100 |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `color="celadon"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — tamaño insuficiente |

---

### `lib-color-picker` · ✅

> **CSS verificado.** Sin variantes de superficie ni efectos del sistema.
> Utilidad de selección de color con paleta y campos de texto.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-dropdown` · ✅

> **CSS verificado.** Variantes del trigger: `ghost` · `filled` · `kaki`. Sin dark adaptation,
> sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `ghost` / `filled` / `kaki` — paleta clara |
| dark | 🔲 | Sin adaptación — panel y trigger no invierten |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-editor-toolbar` · ✅

> **Coverage: 🟢 semantic.** Molecule · `app/editor`.
> Consume tokens semánticos (`--bg-elevated`, `--border-subtle`, `--text-secondary`,
> `--text-primary`, `--accent-primary`) para la barra, los botones y el nombre del fichero.
> Adapta su aspecto con cada katachi sin override específico salvo el contexto `terminal`
> (fuente monoespaciada en las etiquetas de botón).

#### Superficies / Efectos

| | Estado | Notas |
|-|--------|-------|
| Superficies | ✅ | Tokens semánticos propios — adapta fondo y bordes con katachi |
| Efectos | `—` | No aplica — sin superficie propia |

---

### `lib-empty-state` · ✅

> **CSS verificado.** Tones: `neutral` (default) · `kaki` · `celadon` · `error`.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — fondo bg-elevated |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `tone="celadon"` cubre el caso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-file-uploader` · ✅

> **CSS verificado.** Sin variantes de superficie formales. Estado `accepted` activa paleta celadón.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-header` · ✅

> **CSS verificado.** Cobertura completa de superficies: `classic` (light) · `dark` · `centered` (light) ·
> `transparent` · `kintsugi` (seam animada `::after`, bg `washi-950`) · `glitch` (scanlines, glitch keyframe) ·
> `mega` · `minimal` · `shrink` · `app-bar`. Sin efectos del sistema (kintsugi y glitch son baked-in).

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `classic` · `centered` · `minimal` · `transparent` | Paleta washi clara |
| dark | ✅ | `dark` · `shrink` · `app-bar` | Fondo washi-950/900 |
| kintsugi | ✅ | `kintsugi` | Seam animada (`kintsugi-seam` keyframe), fondo washi-950 |
| glitch | ✅ | `glitch` | Scanlines `::before`, `hdr-glitch` keyframe 7s |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `classic` cubre el uso en washi |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass | dark | 🔲 | Posible: variante `transparent` con backdrop-filter |
| spotlight | dark / kintsugi | 🔲 | No implementado |
| kintsugi-border | kintsugi | `—` | `kintsugi` tiene seam propia, no usa `--lib-kintsugi-border` |
| shadow-brutal | — | `—` | No aplica para nav |
| metal-texture | — | `—` | No aplica |

---

### `lib-input` · ✅

> **CSS verificado.** Sin variantes de superficie formales. Paleta light por defecto.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — bg-elevated, border-default |
| dark | 🔲 | Sin adaptación — field y label no invierten |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — control de formulario |

---

### `lib-alert` · ✅

> **CSS verificado.** Variantes semánticas: `default` · `info` · `success` · `warning` · `error`.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — paleta semántica |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `variant="success"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-metric-bar` · ✅

> **Coverage: 🟢 semantic (proxy).** Molécula thin-wrapper sobre `lib-progress`.
> No tiene CSS visual propio — delega el renderizado completo a `lib-progress`.
> Los tokens semánticos (`--text-primary`, `--text-muted`, `--bg-inverse`) se propagan
> por herencia de CSS custom properties al shadow DOM de `lib-progress`, por lo que
> el componente adapta su aspecto con cada katachi sin override propio.
> Contexto de uso: `app/metric`.

#### Superficies / Efectos

| | Estado | Notas |
|-|--------|-------|
| Superficies | ✅ | Heredado de `lib-progress` vía CSS custom properties |
| Efectos | `—` | No aplica — sin superficie propia |

---

### `lib-modal` · ✅

> **CSS verificado.** Sin variantes de superficie formales. Tones de ícono: `kaki` · `celadon` · `error` · `info`.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — bg-surface, border |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| glass | dark | 🔲 | Modal glass sobre fondos oscuros — posible |
| resto | — | `—` | No aplica |

---

### `lib-pagination` · ✅

> **CSS verificado.** Variantes: `outline` · `ghost`. Sin dark adaptation, sin kintsugi, sin glitch.
> Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `outline` / `ghost` — paleta clara |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-range-slider` · ✅

> **CSS verificado.** Tones: `default` · `kaki` · `celadon` · `error` · `washi` · `dark`.
> `tone="dark"` adapta la paleta para fondos oscuros. Sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default / kaki / celadon / error / washi |
| dark | ✅ | `tone="dark"` — fill-color y track invertidos |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `tone="celadon"` cubre el caso de uso |
| washi | `—` | `tone="washi"` disponible |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-segmented-control` · ✅

> **CSS verificado.** Variantes light: `outline` · `underline` · `pill` · `ghost` · `kaki` · `celadon`.
> Variantes dark: `dark-outline` · `dark-pill` · `dark-kaki` · `dark-underline`.
> Modificador `[glitch]` — RGB split en la opción activa (baked-in, no token del sistema).
> Sin kintsugi. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `outline` · `underline` · `pill` · `ghost` · `kaki` · `celadon` | Paleta completa |
| dark | ✅ | `dark-outline` · `dark-pill` · `dark-kaki` · `dark-underline` | Dark adaptation explícita |
| kintsugi | `—` | — | No aplica |
| glitch | ✅ | `[glitch]` | RGB split en tab activa — baked-in (no token del sistema) |
| celadón | `—` | — | `variant="celadon"` cubre el caso de uso |
| washi | `—` | — | `variant="outline"` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-select` · ✅

> **CSS verificado.** Variantes del trigger: `filled` · `ghost`. Sin dark adaptation,
> sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | `filled` / `ghost` — paleta clara |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-tabs` · ✅

> **CSS verificado.** Variantes de forma: `underline` (default) · `pill` · `card` · `outline` · `vertical`.
> Modificadores de superficie: `[dark]` (dark adaptation completa) · `[kintsugi]` · `[glitch]`
> (ambos baked-in, no tokens del sistema). Colores: `kaki` (default) · `celadon`.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default para todas las variantes de forma |
| dark | ✅ | `[dark]` — fondo oscuro para list y panels, colores invertidos |
| kintsugi | ✅ | `[kintsugi]` — tratamiento dorado baked-in |
| glitch | ✅ | `[glitch]` — efectos CRT baked-in |
| celadón | `—` | `color="celadon"` cubre el caso de uso |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica — ninguno usa tokens del sistema |

---

### `lib-tree-select` · ✅

> **CSS verificado.** Sin variantes de superficie ni efectos del sistema.
> Control de árbol jerárquico, paleta light por defecto.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

## Organismos

---

### `lib-gadget-frame` · ✅

> **Coverage: 🟢 semantic.** Dos variantes de superficie:
> - `variant="card"` — consume `--bg-elevated`, `--border-subtle`, `--text-primary`, `--text-muted` (tokens semánticos).
> - `variant="glass"` — consume `--lib-glass-bg`, `--lib-glass-filter`, `--lib-glass-shine`, `--lib-glass-border`, `--lib-glass-shadow` (tokens glass).
> Ambos grupos se reescriben con cada katachi, por lo que el componente adapta su aspecto sin override propio.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light      | ✅      | `card`: bg-elevated + border-subtle |
| dark       | ✅      | `glass`: tokens glass sobre fondo oscuro |
| kintsugi   | ✅      | Hereda override glass desde `_katachi.css` |
| glitch     | ✅      | Tokens semánticos terminal; glass silenciado |
| celadón    | ✅      | Glass con tono jade vía celadon override |
| washi      | ✅      | `card`: washi paper; `glass`: wabi refuerza blur |

#### Efectos

| Efecto | Superficie | Estado | Notas |
|--------|------------|--------|-------|
| glass  | glass      | ✅      | `variant="glass"` activa glassmorphism completo |
| spotlight | —       | `—`    | No aplica: el frame no es interactivo de ese modo |
| kintsugi-border | kintsugi | 🔲 | Compatible — podría decorar el borde del header |
| shadow-brutal   | sabi   | 🔲 | `card` en sabi podría llevar shadow-brutal |
| metal-texture   | —      | `—`  | No aplica |

---

### `lib-accordion` · ✅

> **CSS verificado.** Variantes estructurales: `flush` · `separated` · `accent`.
> No propaga superficies a los ítems directamente — los ítems tienen API de custom properties
> para que el acordeón les sobreescriba. Sin dark adaptation, sin kintsugi, sin glitch en el organismo.
> Las superficies las gestiona `lib-accordion-item` vía API.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| todas | `↑ lib-accordion-item` | El organismo define estructura; los ítems gestionan la superficie |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica en el nivel de organismo |

---

### `lib-bento-grid` · ✅

> **CSS verificado.** Contenedor de layout puro (`CSS Grid` + `CSS Subgrid`). Sin superficies ni efectos propios.
> Las superficies y efectos los aportan los `lib-bento-item` internos.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-carousel` · ✅

> **CSS verificado.** Sin variantes de superficie ni efectos del sistema. Slider de contenido genérico.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-cursor-follower` · ✅

> **CSS verificado.** Efecto de comportamiento puro — cursor personalizado que sigue al ratón.
> Sin superficies propias.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-data-table` · ✅

> **CSS verificado.** Variantes de layout: `lines` (default) · `grid` · `striped` · `borderless`.
> Sin dark adaptation, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — bg-surface, border-subtle |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-dialog` · ✅

> **CSS verificado.** Variantes: `default` (light) · `danger` · `warning` · `dark`.
> `dark` invierte fondo a washi-950. Sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` · `danger` · `warning` | bg-surface + header semántico |
| dark | ✅ | `dark` | washi-950 fondo, colores rgba-blanco |
| kintsugi | 🔲 | — | Sin implementar |
| glitch | 🔲 | — | Sin implementar |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `default` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| glass | dark | 🔲 | Dialog glass sobre fondos oscuros — posible |
| spotlight | dark | 🔲 | Foco en el dialog oscuro |
| kintsugi-border | kintsugi | 🔲 | — |
| shadow-brutal | light | 🔲 | — |
| metal-texture | — | `—` | No aplica |

---

### `lib-drawer` · ✅

> **CSS verificado.** Cobertura completa de superficies con 6 variantes:
> `default` (light) · `dark` · `kintsugi` · `kintsugi-dark` · `glitch` · `glitch-dark`.
> Las variantes kintsugi y glitch son baked-in — no usan tokens del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `default` | bg-surface, paleta washi |
| dark | ✅ | `dark` | fondo oscuro washi-950 |
| kintsugi | ✅ | `kintsugi` · `kintsugi-dark` | Tratamiento dorado baked-in |
| glitch | ✅ | `glitch` · `glitch-dark` | Scanlines + RGB split baked-in |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `default` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | Efectos baked-in; ninguno usa tokens del sistema |

---

### `lib-footer` · ✅

> **CSS verificado.** 4 variantes: `social` (light) · `accordion` (dark) · `kintsugi` · `glitch`.
> Las variantes oscuras tienen fondo `washi-950` o `washi-900`. El footer kintsugi tiene seam animada,
> anillo rotante y cuadrícula dorada. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `social` | Paleta washi clara |
| dark | ✅ | `accordion` | fondo washi-950 |
| kintsugi | ✅ | `kintsugi` | Seam animada, anillo cónico, cuadrícula dorada — baked-in |
| glitch | ✅ | `glitch` | Efectos CRT baked-in |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `social` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | Efectos baked-in; ninguno usa tokens del sistema |

---

### `lib-horizontal-scroll-section` · ✅

> **CSS verificado.** Wrapper de scroll horizontal con snap. Sin variantes de superficie ni efectos propios.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-parallax-container` · ✅

> **CSS verificado.** Wrapper de comportamiento parallax. Sin variantes de superficie ni efectos propios.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-parallax-text` · ✅

> **CSS verificado.** Texto desfilante en capas (outline + italic). Color celadón disponible.
> Sin dark adaptation formal, sin kintsugi, sin glitch. Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default |
| dark | `—` | Funciona sobre fondos oscuros por naturaleza del componente |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `color="celadon"` disponible en capa outline e italic |
| washi | `—` | Default |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-sidebar` · ✅

> **CSS verificado.** Cobertura completa de superficies: `dark` (default) · `light` · `kintsugi` · `glitch`.
> La variante `kintsugi` tiene seam animada (`sb-kintsugi-seam`). La variante `glitch` tiene
> `sb-glitch-border` keyframe con scanlines. Todas baked-in — no usan tokens del sistema.

#### Superficies

| Superficie | Estado | Variante | Notas |
|------------|--------|----------|-------|
| light | ✅ | `light` | Paleta washi clara |
| dark | ✅ | `dark` (default) | washi-950 |
| kintsugi | ✅ | `kintsugi` | Seam animada baked-in |
| glitch | ✅ | `glitch` | Border glitch keyframe baked-in |
| celadón | `—` | — | No aplica |
| washi | `—` | — | `light` cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | Efectos baked-in; ninguno usa tokens del sistema |

---

### `lib-stagger` · ✅

> **CSS verificado.** Wrapper de animación escalonada. Sin variantes de superficie ni efectos propios.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-stepper` · ✅

> **CSS verificado.** Organismo que orquesta `lib-step`. Variante del stepper: `default` · `minimal` · `kintsugi`.
> Las variantes se propagan a los steps internos vía atributo. Sin dark ni glitch formal.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default / minimal |
| dark | `—` | Hereda del contexto |
| kintsugi | ✅ | Propaga `variant="kintsugi"` a los `lib-step` internos |
| glitch | `—` | No aplica |
| celadón | `—` | No aplica |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| kintsugi-border | kintsugi | ✅ | Propagado a cada `lib-step[variant="kintsugi"]` |
| resto | — | `—` | No aplica |

---

### `lib-timeline` · ✅

> **CSS verificado.** Nodes con colores semánticos (`kaki` · `celadon` · `error` · etc.).
> Sin variantes de superficie formales. Sin dark adaptation, sin kintsugi, sin glitch.
> Sin efectos del sistema.

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light | ✅ | Default — nodos y conectores sobre fondo claro |
| dark | 🔲 | Sin adaptación |
| kintsugi | `—` | No aplica |
| glitch | `—` | No aplica |
| celadón | `—` | `.nd-celadon` cubre el node semántico celadón |
| washi | `—` | Default cubre el uso en washi |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos | `—` | No aplica |

---

### `lib-toast-manager` · ✅

> **CSS verificado.** Sin variantes de superficie ni efectos del sistema.
> Gestiona el posicionamiento y apilado de toasts.

#### Superficies / Efectos

| | Estado |
|-|--------|
| Superficies | `—` |
| Efectos | `—` |

---

### `lib-text-editor` · ✅

> **Coverage: 🟢 semantic.** Organismo que compone `lib-editor-toolbar` y `lib-tabs`.
> Consume `--bg-base`, `--bg-elevated`, `--border-subtle`, `--text-primary`, `--text-muted`,
> `--accent-primary`, `--font-mono`, `--radius-md` — todos tokens semánticos.
> Los sub-componentes (`lib-editor-toolbar`, `lib-tabs`) gestionan sus propias superficies.
> Overrides katachi propios para `terminal` (tipografía mono ajustada) y `kintsugi` (border reforzado).

#### Superficies

| Superficie | Estado | Notas |
|------------|--------|-------|
| light      | ✅      | bg-base + border-subtle, textarea sobre fondo claro |
| dark       | ✅      | Hereda katachi del ancestro |
| kintsugi   | ✅      | Border reforzado a border-default |
| glitch     | ✅      | Hereda terminal vía tokens semánticos |
| celadón    | ✅      | Hereda katachi del ancestro |
| washi      | ✅      | Hereda katachi del ancestro |

#### Efectos

| Efecto | Estado | Notas |
|--------|--------|-------|
| todos  | `—`    | No aplica — editor es superficie funcional, no decorativa |

---

## Resumen de estado global

### Efectos del sistema — conexión a tokens

| Token | Componentes conectados |
|-------|----------------------|
| `--lib-glass-filter` / `--lib-glass-bg*` | `lib-glass-card` ✅ · `lib-button` (glass modifier) ✅ |
| `--lib-spotlight-gradient*` | `lib-spotlight-card` ✅ |
| `--lib-kintsugi-border` | `lib-spotlight-card` [kintsugi] ✅ · `lib-step` [kintsugi] ✅ · `lib-switch` [kintsugi] ✅ |
| `--lib-shadow-brutal` | `lib-code-block` (default) ✅ |
| `--lib-metal-texture` | Ninguno — pendiente de primer uso |

### Baked-in vs tokens del sistema

La mayoría de componentes con tratamiento kintsugi o glitch usan CSS baked-in en lugar de los tokens del sistema. Esta es la brecha principal a formalizar:

| Componente | Kintsugi baked-in | Glitch baked-in |
|------------|------------------|-----------------|
| `lib-card` | seam lineal propia | RGB split box-shadow |
| `lib-burger-button` | radial gradient propio | clip-path ghosts |
| `lib-header` | seam keyframe propia | scanlines + keyframe |
| `lib-footer` | seam + ring propios | efectos propios |
| `lib-sidebar` | seam keyframe propia | border keyframe |
| `lib-drawer` | baked-in | baked-in |
| `lib-tabs` | baked-in | baked-in |
| `lib-reading-progress` | gradiente + shimmer propios | — |
| `lib-spinner` | conic-gradient propio | — |

---

## Katachi (形) — cobertura por componente

> **Sistema completado al 100% el 2026-05-16** tras los PRs #281–#313 (Fases 1+2+3, rollout B1–B6 y tanda C1–C5).
> Todos los 77 componentes con CSS file llevan el bloque marcador KATACHI.
> Detalle conceptual en `src/styles/shared/tokens/_katachi.css`.

Cada componente con presencia katachi lleva un bloque marcador delimitado al
final de su `@layer components`:

```css
/* ─── KATACHI · ambient context ─────────────────────── */
…
/* ─── /KATACHI ───────────────────────────────────────── */
```

Existen **dos modos de presencia**:

- **Semantic override** — el bloque sustituye colores hardcoded (`--color-washi-X`)
  por tokens semánticos (`--bg-surface`, `--bg-inverse`, `--text-primary`, etc.)
  cuando el default coincide con el valor original. Esto activa la respuesta
  ambiental: el componente se adapta al katachi del ancestro sin más cambios.
- **Marker-only** — el bloque solo documenta que el componente ya consume tokens
  semánticos en su default y, por tanto, ya hereda el katachi por construcción.
  Sirve como anchor de búsqueda y como confirmación explícita.

### Cobertura por fase

| Fase | PR | Tipo | Componentes | Estado |
|------|-----|------|-------------|--------|
| 1 | #281 | Sistema | `_katachi.css` con 6 contextos (wabi · kintsugi · sabi · terminal · shizen · celadon) | ✅ |
| 2 (piloto) | #289 | Semantic | `lib-card` · `lib-button` · `lib-badge` | ✅ |
| 2 (structural) | #291 | Semantic | `lib-header` · `lib-sidebar` | ✅ |
| 2 (forms) | #292 | Semantic | `lib-alert` · `lib-input` · `lib-select` | ✅ |
| 2 (storybook) | #294 | Demo | Story `Foundations/Katachi Demo` | ✅ |
| B1 (forms) | #296 | Mixto | `lib-checkbox` · `lib-radio` · `lib-switch` · `lib-segmented-control` (semantic) · `lib-button-group` (marker) | ✅ |
| B2 (nav) | #297 | Mixto | `lib-breadcrumb` · `lib-tabs` · `lib-pagination` · `lib-chip` (semantic) · `lib-dropdown` (marker) | ✅ |
| B3 (overlays) | #298 | Mixto | `lib-drawer` · `lib-empty-state` (semantic) · `lib-modal` · `lib-dialog` (marker) | ✅ |
| B4 (display) | #299 | Mixto | `lib-divider` (semantic, heavy variant) · `lib-display-heading` · `lib-quote` · `lib-eyebrow` · `lib-kbd` (marker) | ✅ |
| B5 (misc) | #300 | Mixto | `lib-status-dot` · `lib-progress` (semantic) · `lib-close-button` · `lib-copy-button` · `lib-burger-button` · `lib-tooltip` · `lib-rating` (marker) | ✅ |
| B6 (layout) | #301 | Marker | `lib-footer` · `lib-data-table` · `lib-timeline` · `lib-code-block` · `lib-step` | ✅ |
| 3 (canvas) | #303 | DX | `<lib-canvas>` wrapper con typed `KatachiId` | ✅ |
| Docs | #304 | Docs | KATACHI.md · Katachi.mdx · katachi-migration.md · effects-x-surfaces (sección Katachi) | ✅ |
| Visual regression | #305 | Tests | Playwright suite + fixture HTML para los 6 katachi (scaffold) | ✅ |
| C1 (atoms) | #309 | Mixto | `lib-liquid-button` (semantic, variant ink) · `lib-accordion-item` · `lib-avatar` · `lib-bento-item` · `lib-card-grid` · `lib-color-scale` · `lib-label` · `lib-counter` (marker) | ✅ |
| C2 (molecules) | #310 | Mixto | `lib-color-picker` · `lib-file-uploader` · `lib-range-slider` · `lib-tree-select` (semantic) · `lib-checkbox-card` (marker) | ✅ |
| C3 (organisms) | #311 | Marker | `lib-accordion` · `lib-bento-grid` · `lib-stepper` · `lib-toast-manager` | ✅ |
| C4 (effect/primitive) | #312 | Marker | `lib-glass-card` · `lib-spotlight-card` · `lib-spinner` · `lib-skeleton` · `lib-text-glitch` | ✅ |
| C5 (utility/producer/animator) | #313 | Marker | `lib-aspect-ratio` · `lib-visually-hidden` · `lib-ripple` · `lib-magnetic` · `lib-text-list` · `lib-select-option` · `lib-progress-circle` · `lib-reading-progress` · `lib-icon` · `lib-background` · `lib-cursor-follower` · `lib-parallax` · `lib-parallax-text-stack` · `lib-horizontal-scroll-section` · `lib-stagger` · `lib-carousel` | ✅ |

### Total — sistema completado

- **77 componentes** con bloque KATACHI documentado (**100% de cobertura**)
- **23 con semantic overrides activos** (`--bg-inverse`, `--bg-surface`, `--text-inverse`, etc. — cambian de aspecto bajo katachi)
- **54 marker-only** (defaults ya conectados, primitivos con paleta deliberada, utility/producer/animator)
- **0 conflictos** detectados entre contextos katachi y variantes explícitas

### Desglose semantic / marker por categoría

| Categoría | Semantic | Marker | Total |
|-----------|----------|--------|-------|
| Atoms (cards, buttons, inputs, displays) | 14 | 28 | 42 |
| Molecules (forms, nav, overlays) | 8 | 5 | 13 |
| Organisms (layout, structural, animators) | 1 | 21 | 22 |
| **Total** | **23** | **54** | **77** |

### Cómo se activa

```html
<!-- Vía atributo en cualquier ancestor (HTML element o custom element) -->
<body data-katachi="kintsugi">
  <lib-card>…</lib-card>  <!-- adopta superficie kintsugi automáticamente -->
</body>

<!-- O vía wrapper tipado (Fase 3) -->
<lib-canvas katachi="kintsugi" display="block" pad="xl">
  <lib-card>…</lib-card>
</lib-canvas>
```

### Compatibilidad con variantes explícitas

El sistema katachi nunca pisa una variante explícita. Cuando un componente lleva
`variant="kintsugi"` directamente, su tratamiento `:host([variant="kintsugi"])`
gana por especificidad sobre el bloque ambient `:host(:not([variant]))`. Los
selectores son **mutuamente exclusivos por construcción**, no por precedencia.

---

*Última actualización: 2026-05-18 — auditoría completa sobre CSS real · átomos · moléculas · organismos · sistema Katachi (Fases 1+2+3, B1–B6, C1–C5) completado al 100% (77/77 componentes)*

---

## Auditoría Celadon (青磁) — readiness por componente

> Detalle completo en `celadon-audit.md`. Este bloque es la vista rápida de producto.
> Katachi celadon: superficie dark jade · acento `celadon-400` · efecto `spotlight-water`.

| Tier | Criterio | Componentes |
|------|----------|-------------|
| **A — Nativo** | Prop celadon + dark-ready | `lib-card` · `lib-background` · `lib-tabs` · `lib-segmented-control` · `lib-range-slider` · `lib-chip` · `lib-tooltip` · `lib-kbd` · `lib-reading-progress` · `lib-counter` · `lib-avatar` · `lib-liquid-button` · `lib-parallax-text` |
| **B — Semántico** | Auto-adapta vía semantic override | `lib-button` · `lib-badge` · `lib-header` · `lib-sidebar` · `lib-alert` · `lib-input` · `lib-select` · `lib-checkbox` · `lib-radio` · `lib-switch` · `lib-breadcrumb` · `lib-drawer` · `lib-empty-state` · `lib-divider` · `lib-display-heading` · `lib-quote` · `lib-progress` · `lib-status-dot` · `lib-tree-select` *(+ lib-card · lib-segmented-control · lib-chip · lib-liquid-button)* |
| **C — Neutro** | Utility/wrapper, funciona sin cambio | `lib-glass-card` · `lib-file-uploader` · `lib-color-picker` · `lib-accordion` · `lib-bento-grid` · `lib-carousel` · `lib-stagger` · `lib-parallax-container` · `lib-horizontal-scroll-section` · `lib-cursor-follower` · `lib-toast-manager` · `lib-stepper`/`lib-step` · `lib-bento-item` · `lib-card-grid` · `lib-button-group` · `lib-accordion-item` · `lib-icon` · `lib-label` · `lib-eyebrow` · `lib-select-option` · `lib-ripple` · `lib-magnetic` · `lib-spacer` · `lib-aspect-ratio` · `lib-visually-hidden` · `lib-color-scale` |
| **D — Parcial ⚠️** | Prop celadon sin dark adaptation | `lib-progress` · `lib-progress-circle` · `lib-rating` · `lib-checkbox-card` · `lib-empty-state` |
| **E — Pendiente 🔲** | Compatible, sin implementar | `lib-spotlight-card` *(spotlight="water" pendiente verificación)* · `lib-button` *(secondary/ghost en dark)* · `lib-dropdown` · `lib-pagination` |
| **F — Excluir** | No aplica o incompatible | `lib-burger-button` · `lib-text-glitch` · `lib-code-block` · variante `glitch` de header · variante `kintsugi` de spinner |

**Listos sin trabajo adicional:** A + B + C = 63 / 77 (82 %) · **Gap menor:** D = 5 (7 %) · **Pendiente:** E = 4 (5 %)
