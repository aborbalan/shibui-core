# Módulo de gráficas — Shibui UI

Conjunto de gráficas SVG nativas (Lit + tokens, katachi-aware) construidas sobre
una **capa compartida** de primitivas. Cero dependencias externas de charting.

> Para el inventario general de componentes ver [`COMPONENTS.md`](./COMPONENTS.md).
> Para convenciones de código/estructura ver el `CLAUDE.md` del paquete.

---

## Dónde vive cada cosa

Todo el módulo está en `packages/shibui-ui/`, repartido en 4 ubicaciones:

```
packages/shibui-ui/
│
├── models/ui/
│   └── charts.ts                        ← tipos compartidos (única fuente de verdad)
│
└── src/
    ├── shared/charts/                   ← CAPA COMPARTIDA (lógica + frame reutilizable)
    │   ├── index.ts                     ·  barrel
    │   ├── scales.ts                    ·  niceAxis · linearScale · bandScale
    │   ├── format.ts                    ·  formatTick · truncate
    │   ├── series-colors.ts             ·  SERIES_COLORS · seriesColor
    │   ├── stacking.ts                  ·  groupedMax · stackedMax
    │   ├── interaction.ts               ·  tooltipAnchor
    │   ├── chart-resize.controller.ts   ·  ChartResizeController (ancho responsive)
    │   ├── chart-frame.html.ts          ·  ejes / grid / ticks / títulos / leyenda / tooltip / empty
    │   └── chart-skeleton.css           ·  estilos del esqueleto (se importa con ?inline)
    │
    └── components/
        ├── atoms/
        │   └── sparkline/               ← único chart a nivel átomo (inline, sin ejes)
        │
        └── organisms/                   ← una carpeta por gráfica
            ├── bar-chart/
            ├── scatter-chart/
            ├── scatter-chart-3d/        ← legado: NO usa la capa compartida (lógica 3D propia)
            ├── line-chart/              ← incluye lib-area-chart.stories.ts (Area = line en mode area)
            ├── pie-chart/
            ├── gauge/
            ├── radar-chart/
            ├── bubble-chart/
            ├── combo-chart/
            └── funnel-chart/
```

**Regla mental:**
- Lógica de ejes/escala/frame compartida → `src/shared/charts`
- Tipos comunes → `models/ui/charts.ts`
- Cada gráfica concreta → su carpeta en `organisms/` (o `atoms/` para sparkline)

Cada carpeta de gráfica sigue la estructura estándar de 6 ficheros:

```
lib-[nombre]/
├── index.ts                    ← barrel (re-exporta componente + tipos)
├── lib-[nombre].component.ts   ← LitElement (@customElement, props, render)
├── lib-[nombre].html.ts        ← template + cálculos SVG
├── lib-[nombre].css            ← solo la "marca" (bar/dot/slice/line…); el esqueleto va en shared
├── lib-[nombre].types.ts       ← props/tipos del componente
└── lib-[nombre].stories.ts     ← Storybook (Playground → API → Katachi → Tests)
```

---

## Capa compartida (`src/shared/charts`)

| Módulo | Exporta | Para qué |
|---|---|---|
| `scales.ts` | `niceAxis(min, max, opts)` | dominio + ticks "redondos" (`zeroAnchored` para barras, `pad` para scatter) |
| | `linearScale(domain, range)` | mapea valor → px (eje Y se invierte el range) |
| | `bandScale(count, range)` | bandas categóricas (`bandWidth`, `start(i)`, `center(i)`) |
| `format.ts` | `formatTick(v)` · `truncate(label, max)` | etiquetas compactas (1.2k, 3.4M) y truncado |
| `series-colors.ts` | `SERIES_COLORS` · `seriesColor(i)` | paleta común de series (coherencia entre charts) |
| `stacking.ts` | `groupedMax(series)` · `stackedMax(series, n)` | máximos para escalado agrupado/apilado |
| `interaction.ts` | `tooltipAnchor(wrapper, target)` | ancla del tooltip relativa al wrapper |
| `chart-resize.controller.ts` | `ChartResizeController` | `ReactiveController` que expone `.width` responsive |
| `chart-frame.html.ts` | `renderAxes`, `renderGrid`, `renderYTicks`, `renderXTicks`, `renderBandLabels`, `renderAxisTitles`, `renderEmptyState`, `renderTooltip`, `renderLegend` | sub-templates SVG/HTML del esqueleto |
| `chart-skeleton.css` | clases `.chart-wrapper`, `.chart-svg`, `.grid-line`, `.axis-line`, `.tick-line`, `.tick-label`, `.axis-label`, `.empty-label`, `.chart-tooltip`, `.chart-legend`, `.legend-dot(.square)` | estilos comunes; se inyecta con `?inline` tras los tokens |

---

## Modelo de datos (`models/ui/charts.ts`)

```ts
interface ChartPoint       { x: number; y: number; label?: string; }
interface ChartSeries      { name: string; values: number[]; }       // eje de banda (bar/line/combo/radar)
interface ChartPointSeries { name: string; points: ChartPoint[]; }   // eje numérico (scatter/line lineal)
interface ChartTooltip     { x: number; y: number; content: string; color: string; }
interface ChartMargin      { top: number; right: number; bottom: number; left: number; }
interface AxisInfo         { domain: [number, number]; ticks: number[]; }
type     LegendShape       = 'dot' | 'square';
interface PieSlice         { label: string; value: number; color?: string; }
```

Tipos específicos por gráfica (en su `*.types.ts`): `BubblePoint`/`BubbleSeries`,
`GaugeZone`/`GaugeTone`, `SparklineType`/`SparklineTone`, `FunnelStage`,
`LineChartMode`, `BarChartMode`.

---

## Catálogo de gráficas

Todas en la categoría Storybook **`Universal/Charts/`**.

| Componente | Nivel | Storybook | Props clave |
|---|---|---|---|
| `lib-bar-chart` | organismo | Bar Chart | `.series` (ChartSeries[]) · `.categories` · `mode` grouped\|stacked · `show-grid` · `show-legend` |
| `lib-scatter-chart` | organismo | Scatter Chart | `.series` ({name,points{x,y}}) · `dot-radius` · `show-grid` · `show-legend` |
| `lib-scatter-chart-3d` | organismo | Scatter Chart 3D | (lógica propia, fuera de la capa compartida) |
| `lib-line-chart` | organismo | Line Chart / Area Chart | `.series`+`.categories` **o** `.pointSeries` · `mode` line\|area\|stacked-area · `smooth` · `show-dots` |
| `lib-pie-chart` | organismo | Pie Chart | `.slices` (PieSlice[]) · `inner-ratio` (donut) · `show-labels` · `center-label` / slot `center` |
| `lib-gauge` | organismo | Gauge | `value` · `min`/`max` · `tone` · `.zones` (umbrales) · `unit` · `label` |
| `lib-radar-chart` | organismo | Radar | `.axes` · `.series` (ChartSeries[]) · `max` · `levels` · `fill-opacity` |
| `lib-bubble-chart` | organismo | Bubble | `.series` ({name,points{x,y,size}}) · `min-radius`/`max-radius` (tamaño → área, escala sqrt) |
| `lib-combo-chart` | organismo | Combo | `.categories` · `.barSeries` · `.lineSeries` · `dual-axis` (2º eje Y) · `smooth` |
| `lib-funnel-chart` | organismo | Funnel | `.stages` (FunnelStage[]) · `show-values` · % de conversión sobre la 1ª etapa |
| `lib-sparkline` | **átomo** | Sparkline | `.values` · `type` line\|area\|bar · `tone` · `show-end-dot` · `min`/`max` |

Notas:
- **Area Chart** no es un componente propio: es `lib-line-chart` con `mode="area"`/`"stacked-area"`; tiene entrada propia en Storybook (`lib-area-chart.stories.ts`) por visibilidad.
- Las APIs públicas de `bar`/`scatter` mantienen sus tipos originales (`BarSeries`, `ScatterSeries`…) como **alias** de los tipos compartidos.

---

## Cómo añadir una gráfica nueva

1. Crear `src/components/organisms/lib-[nombre]/` con los 6 ficheros (o `atoms/` si es inline tipo sparkline).
2. Reutilizar la capa compartida: `niceAxis`/`linearScale`/`bandScale`, `renderAxes`/`renderGrid`/`renderYTicks`/…, `ChartResizeController`, `renderTooltip`/`renderLegend`, `SERIES_COLORS`. Importar `chart-skeleton.css` con `?inline` tras `tokens.css`.
3. El `.css` del componente contiene **solo la marca** propia (la forma que dibuja); el esqueleto ya viene del skeleton compartido.
4. Tipos comunes desde `models/ui/charts.ts`; los específicos en el `*.types.ts` del componente.
5. Katachi-aware: consumir tokens semánticos (`--text-*`, `--border-*`, `--bg-*`). Para color por dato, mapear a `var(--text-*)` (no hardcodear).
6. Registrar el componente en el barrel correspondiente:
   - organismo → `src/components/organisms/index.ts`
   - átomo → `src/components/atoms/index.ts`
   (ambos se re-exportan desde `src/index.ts`).
7. Story canónica con `title: 'Universal/Charts/<Nombre>'` y las 4 secciones (Playground → API → Katachi → Tests).

---

## Estado del módulo

**Estable:** la capa compartida está consolidada; `bar`/`scatter` se refactorizaron sobre
ella sin cambios visuales (pixel-idénticos).

**Pendientes propuestos** (nicho, aún no construidos): Heatmap, Histograma,
Treemap, Waterfall, Candlestick, Box-plot.
