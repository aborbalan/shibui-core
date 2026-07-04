import type React from "react";

/* Datos mínimos válidos para los componentes data-driven — montarlos
   sin datos provoca errores async de Lit (`X.map is not a function`). */

const CHART_CATEGORIES = ["Q1", "Q2", "Q3"];
const CHART_SERIES = [{ name: "2026", values: [8, 14, 11] }];
const SCATTER_SERIES = [
  {
    name: "A",
    points: [
      { x: 2, y: 4 },
      { x: 5, y: 9 },
      { x: 8, y: 6 },
      { x: 11, y: 12 },
    ],
  },
];
const SCATTER_SERIES_3D = [
  {
    name: "A",
    points: [
      { x: 2, y: 4, z: 3 },
      { x: 5, y: 9, z: 7 },
      { x: 8, y: 6, z: 5 },
      { x: 11, y: 12, z: 9 },
    ],
  },
];
const BUBBLE_SERIES = [
  {
    name: "A",
    points: [
      { x: 2, y: 4, size: 10 },
      { x: 6, y: 8, size: 24 },
      { x: 10, y: 5, size: 16 },
    ],
  },
];
const PIE_SLICES = [
  { label: "Atoms", value: 47 },
  { label: "Molecules", value: 23 },
  { label: "Organisms", value: 32 },
];
const FUNNEL_STAGES = [
  { label: "Visitas", value: 100 },
  { label: "Registros", value: 60 },
  { label: "Compras", value: 25 },
];
const GIT_COMMITS = [
  {
    hash: "c3d4e5f",
    message: "feat: katachi celadon",
    author: "shibui",
    date: "2026-06-03T10:00:00Z",
    parents: ["b2c3d4e"],
    refs: ["HEAD -> develop"],
  },
  {
    hash: "b2c3d4e",
    message: "fix: card slots",
    author: "shibui",
    date: "2026-06-02T10:00:00Z",
    parents: ["a1b2c3d"],
    refs: [],
  },
  {
    hash: "a1b2c3d",
    message: "chore: init",
    author: "shibui",
    date: "2026-06-01T10:00:00Z",
    parents: [],
    refs: ["v1.0.0"],
  },
];
const FS_ENTRIES = [
  { name: "src", path: "/src", isDir: true, extension: null },
  { name: "index.ts", path: "/index.ts", isDir: false, extension: "ts" },
  { name: "logo.svg", path: "/logo.svg", isDir: false, extension: "svg" },
];
const EDITOR_FILES = [{ id: "f1", filename: "notas.md", content: "# Shibui\n\nKatachi es…" }];

/**
 * Previews compactas de organismos, keyed por tagName del catálogo.
 * Los organismos grandes se auto-contienen con scale/ancho fijo;
 * el contenedor de ComponentPreview recorta con overflow hidden.
 */
export const organismPreviews: Record<string, () => React.ReactElement> = {
  "lib-accordion": () => (
    <lib-accordion style={{ width: 230 }}>
      <lib-accordion-item label="Sección 1">Contenido 1</lib-accordion-item>
      <lib-accordion-item label="Sección 2">Contenido 2</lib-accordion-item>
    </lib-accordion>
  ),

  "lib-bar-chart": () => (
    <lib-bar-chart
      series={CHART_SERIES}
      categories={CHART_CATEGORIES}
      height={100}
      showLegend={false}
      showGrid={false}
      style={{ width: 230 }}
    />
  ),

  "lib-bento-grid": () => (
    <lib-bento-grid columns="3" style={{ width: 230 }}>
      <lib-bento-item>
        <p style={{ padding: "var(--lib-space-sm)", margin: 0 }}>A</p>
      </lib-bento-item>
      <lib-bento-item>
        <p style={{ padding: "var(--lib-space-sm)", margin: 0 }}>B</p>
      </lib-bento-item>
      <lib-bento-item>
        <p style={{ padding: "var(--lib-space-sm)", margin: 0 }}>C</p>
      </lib-bento-item>
    </lib-bento-grid>
  ),

  "lib-bubble-chart": () => (
    <lib-bubble-chart
      series={BUBBLE_SERIES}
      height={100}
      showLegend={false}
      showGrid={false}
      maxRadius={14}
      style={{ width: 230 }}
    />
  ),

  "lib-carousel": () => (
    <lib-carousel dots style={{ width: 230 }}>
      <div style={{ background: "var(--bg-elevated)", padding: "var(--lib-space-lg)" }}>Slide 1</div>
      <div style={{ background: "var(--bg-elevated)", padding: "var(--lib-space-lg)" }}>Slide 2</div>
    </lib-carousel>
  ),

  "lib-combo-chart": () => (
    <lib-combo-chart
      categories={CHART_CATEGORIES}
      barSeries={CHART_SERIES}
      lineSeries={[{ name: "Media", values: [10, 12, 9] }]}
      height={100}
      showLegend={false}
      showGrid={false}
      style={{ width: 230 }}
    />
  ),

  "lib-data-table": () => (
    <div style={{ transform: "scale(0.8)" }}>
      <lib-data-table style={{ width: 260 }}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alpha</td>
              <td>OK</td>
            </tr>
            <tr>
              <td>Beta</td>
              <td>WIP</td>
            </tr>
          </tbody>
        </table>
      </lib-data-table>
    </div>
  ),

  "lib-file-browser": () => (
    <div style={{ transform: "scale(0.75)" }}>
      <lib-file-browser entries={FS_ENTRIES} current-path="/" row-size="compact" style={{ width: 300 }} />
    </div>
  ),

  "lib-footer": () => (
    <div style={{ transform: "scale(0.5)", width: 460 }}>
      <lib-footer style={{ width: "100%" }}>
        <span>© 2026 Shibui</span>
      </lib-footer>
    </div>
  ),

  "lib-funnel-chart": () => (
    <lib-funnel-chart stages={FUNNEL_STAGES} height={100} showValues={false} style={{ width: 230 }} />
  ),

  "lib-gadget-frame": () => (
    <div style={{ transform: "scale(0.7)" }}>
      <lib-gadget-frame gadget-title="CPU Monitor" icon="cpu" style={{ width: 300, height: 150 }}>
        <p style={{ padding: "var(--lib-space-sm)", margin: 0 }}>62%</p>
      </lib-gadget-frame>
    </div>
  ),

  "lib-gauge": () => <lib-gauge value={68} unit="%" tone="accent" height={100} />,

  "lib-git-graph": () => (
    <lib-git-graph commits={GIT_COMMITS} height={110} rowHeight={28} style={{ width: 230 }} />
  ),

  "lib-line-chart": () => (
    <lib-line-chart
      series={[{ name: "2026", values: [4, 9, 6, 12] }]}
      categories={["E", "F", "M", "A"]}
      height={100}
      showLegend={false}
      showGrid={false}
      smooth
      style={{ width: 230 }}
    />
  ),

  "lib-login-form": () => (
    <div style={{ transform: "scale(0.4)" }}>
      <lib-login-form style={{ width: 320 }} />
    </div>
  ),

  "lib-pie-chart": () => (
    <lib-pie-chart slices={PIE_SLICES} innerRatio={0.55} showLegend={false} height={110} />
  ),

  "lib-radar-chart": () => (
    <lib-radar-chart
      axes={["Uso", "DX", "A11y", "Perf", "Docs"]}
      series={[{ name: "v1", values: [7, 9, 8, 6, 7] }]}
      height={110}
      showLegend={false}
    />
  ),

  "lib-scatter-chart": () => (
    <lib-scatter-chart
      series={SCATTER_SERIES}
      height={100}
      showLegend={false}
      showGrid={false}
      style={{ width: 230 }}
    />
  ),

  "lib-scatter-chart-3d": () => (
    <lib-scatter-chart-3d
      series={SCATTER_SERIES_3D}
      height={110}
      showLegend={false}
      showGrid={false}
      style={{ width: 230 }}
    />
  ),

  "lib-sidebar": () => (
    <div style={{ transform: "scale(0.75)" }}>
      <div style={{ height: 150, width: 260, position: "relative", overflow: "hidden" }}>
        <lib-sidebar>
          <a slot="item" href="#">
            Dashboard
          </a>
          <a slot="item" href="#">
            Settings
          </a>
        </lib-sidebar>
      </div>
    </div>
  ),

  "lib-stepper": () => (
    <lib-stepper current="2" style={{ width: 230 }}>
      <lib-step index="1" label="Plan" />
      <lib-step index="2" label="Build" />
      <lib-step index="3" label="Ship" />
    </lib-stepper>
  ),

  "lib-text-editor": () => (
    <div style={{ transform: "scale(0.5)" }}>
      <lib-text-editor files={EDITOR_FILES} active="f1" readonly style={{ width: 420, height: 220 }} />
    </div>
  ),

  "lib-timeline": () => (
    <div style={{ transform: "scale(0.8)" }}>
      <lib-timeline style={{ width: 260 }}>
        <div data-date="2025">Phase 2 — Components</div>
        <div data-date="2026">Phase 3 — Katachi</div>
      </lib-timeline>
    </div>
  ),

  "lib-timeline-item": () => (
    <div style={{ transform: "scale(0.8)" }}>
      <lib-timeline style={{ width: 260 }}>
        <lib-timeline-item status="done" timestamp="Hoy · 10:30" title="Pedido entregado" hide-line />
      </lib-timeline>
    </div>
  ),
};
