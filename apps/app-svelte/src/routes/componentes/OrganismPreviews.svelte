<script module lang="ts">
  /** Tags de organismo con preview propia. */
  export const ORGANISM_PREVIEW_TAGS = [
    'lib-accordion', 'lib-bar-chart', 'lib-bento-grid', 'lib-bubble-chart',
    'lib-carousel', 'lib-combo-chart', 'lib-data-table', 'lib-file-browser',
    'lib-footer', 'lib-funnel-chart', 'lib-gadget-frame', 'lib-gauge',
    'lib-git-graph', 'lib-line-chart', 'lib-login-form', 'lib-pie-chart',
    'lib-radar-chart', 'lib-scatter-chart', 'lib-scatter-chart-3d', 'lib-sidebar',
    'lib-stepper', 'lib-text-editor', 'lib-timeline', 'lib-timeline-item',
  ];
</script>

<script lang="ts">
  import { libProps } from '../../lib/lib-props';

  interface Props { tag: string }
  let { tag }: Props = $props();

  /* Datos mínimos válidos para los data-driven — montarlos sin datos
     provoca errores async de Lit (`X.map is not a function`). */
  const CHART_CATEGORIES = ['Q1', 'Q2', 'Q3'];
  const CHART_SERIES = [{ name: '2026', values: [8, 14, 11] }];
  const SCATTER_SERIES = [
    { name: 'A', points: [{ x: 2, y: 4 }, { x: 5, y: 9 }, { x: 8, y: 6 }, { x: 11, y: 12 }] },
  ];
  const SCATTER_SERIES_3D = [
    { name: 'A', points: [{ x: 2, y: 4, z: 3 }, { x: 5, y: 9, z: 7 }, { x: 8, y: 6, z: 5 }, { x: 11, y: 12, z: 9 }] },
  ];
  const BUBBLE_SERIES = [
    { name: 'A', points: [{ x: 2, y: 4, size: 10 }, { x: 6, y: 8, size: 24 }, { x: 10, y: 5, size: 16 }] },
  ];
  const PIE_SLICES = [
    { label: 'Atoms', value: 47 },
    { label: 'Molecules', value: 23 },
    { label: 'Organisms', value: 32 },
  ];
  const FUNNEL_STAGES = [
    { label: 'Visitas', value: 100 },
    { label: 'Registros', value: 60 },
    { label: 'Compras', value: 25 },
  ];
  const GIT_COMMITS = [
    { hash: 'c3d4e5f', message: 'feat: katachi sabi', author: 'shibui', date: '2026-06-03T10:00:00Z', parents: ['b2c3d4e'], refs: ['HEAD -> develop'] },
    { hash: 'b2c3d4e', message: 'fix: card slots',    author: 'shibui', date: '2026-06-02T10:00:00Z', parents: ['a1b2c3d'], refs: [] },
    { hash: 'a1b2c3d', message: 'chore: init',        author: 'shibui', date: '2026-06-01T10:00:00Z', parents: [],          refs: ['v1.0.0'] },
  ];
  const FS_ENTRIES = [
    { name: 'src',      path: '/src',      isDir: true,  extension: null },
    { name: 'index.ts', path: '/index.ts', isDir: false, extension: 'ts' },
    { name: 'logo.svg', path: '/logo.svg', isDir: false, extension: 'svg' },
  ];
  const EDITOR_FILES = [{ id: 'f1', filename: 'notas.md', content: '# Shibui\n\nKatachi es…' }];

  const CHART_OFF = { showLegend: false, showGrid: false };
</script>

<!--
  Los organismos grandes se auto-contienen con scale/ancho fijo; el
  contenedor de ComponentPreview recorta con overflow hidden.
-->
{#if tag === 'lib-accordion'}
  <lib-accordion style="width:230px">
    <lib-accordion-item label="Sección 1">Contenido 1</lib-accordion-item>
    <lib-accordion-item label="Sección 2">Contenido 2</lib-accordion-item>
  </lib-accordion>

{:else if tag === 'lib-bar-chart'}
  <lib-bar-chart
    style="width:230px"
    use:libProps={{ series: CHART_SERIES, categories: CHART_CATEGORIES, height: 100, ...CHART_OFF }}
  ></lib-bar-chart>

{:else if tag === 'lib-bento-grid'}
  <lib-bento-grid columns="3" style="width:230px">
    <lib-bento-item><p style="padding:var(--lib-space-sm);margin:0">A</p></lib-bento-item>
    <lib-bento-item><p style="padding:var(--lib-space-sm);margin:0">B</p></lib-bento-item>
    <lib-bento-item><p style="padding:var(--lib-space-sm);margin:0">C</p></lib-bento-item>
  </lib-bento-grid>

{:else if tag === 'lib-bubble-chart'}
  <lib-bubble-chart
    style="width:230px"
    use:libProps={{ series: BUBBLE_SERIES, height: 100, maxRadius: 14, ...CHART_OFF }}
  ></lib-bubble-chart>

{:else if tag === 'lib-carousel'}
  <lib-carousel dots style="width:230px">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
  </lib-carousel>

{:else if tag === 'lib-combo-chart'}
  <lib-combo-chart
    style="width:230px"
    use:libProps={{
      categories: CHART_CATEGORIES,
      barSeries: CHART_SERIES,
      lineSeries: [{ name: 'Media', values: [10, 12, 9] }],
      height: 100,
      ...CHART_OFF,
    }}
  ></lib-combo-chart>

{:else if tag === 'lib-data-table'}
  <div style="transform:scale(0.8)">
    <lib-data-table style="width:260px">
      <table>
        <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
        <tbody>
          <tr><td>Alpha</td><td>OK</td></tr>
          <tr><td>Beta</td><td>WIP</td></tr>
        </tbody>
      </table>
    </lib-data-table>
  </div>

{:else if tag === 'lib-file-browser'}
  <div style="transform:scale(0.75)">
    <lib-file-browser
      current-path="/"
      row-size="compact"
      style="width:300px"
      use:libProps={{ entries: FS_ENTRIES }}
    ></lib-file-browser>
  </div>

{:else if tag === 'lib-footer'}
  <div style="transform:scale(0.5);width:460px">
    <lib-footer style="width:100%">
      <span>© 2026 Shibui</span>
    </lib-footer>
  </div>

{:else if tag === 'lib-funnel-chart'}
  <lib-funnel-chart
    style="width:230px"
    use:libProps={{ stages: FUNNEL_STAGES, height: 100, showValues: false }}
  ></lib-funnel-chart>

{:else if tag === 'lib-gadget-frame'}
  <div style="transform:scale(0.7)">
    <lib-gadget-frame gadget-title="CPU Monitor" icon="cpu" style="width:300px;height:150px">
      <p style="padding:var(--lib-space-sm);margin:0">62%</p>
    </lib-gadget-frame>
  </div>

{:else if tag === 'lib-gauge'}
  <lib-gauge unit="%" tone="accent" use:libProps={{ value: 68, height: 100 }}></lib-gauge>

{:else if tag === 'lib-git-graph'}
  <lib-git-graph
    style="width:230px"
    use:libProps={{ commits: GIT_COMMITS, height: 110, rowHeight: 28 }}
  ></lib-git-graph>

{:else if tag === 'lib-line-chart'}
  <lib-line-chart
    smooth
    style="width:230px"
    use:libProps={{
      series: [{ name: '2026', values: [4, 9, 6, 12] }],
      categories: ['E', 'F', 'M', 'A'],
      height: 100,
      ...CHART_OFF,
    }}
  ></lib-line-chart>

{:else if tag === 'lib-login-form'}
  <div style="transform:scale(0.4)">
    <lib-login-form style="width:320px"></lib-login-form>
  </div>

{:else if tag === 'lib-pie-chart'}
  <lib-pie-chart use:libProps={{ slices: PIE_SLICES, innerRatio: 0.55, showLegend: false, height: 110 }}></lib-pie-chart>

{:else if tag === 'lib-radar-chart'}
  <lib-radar-chart
    use:libProps={{
      axes: ['Uso', 'DX', 'A11y', 'Perf', 'Docs'],
      series: [{ name: 'v1', values: [7, 9, 8, 6, 7] }],
      height: 110,
      showLegend: false,
    }}
  ></lib-radar-chart>

{:else if tag === 'lib-scatter-chart'}
  <lib-scatter-chart
    style="width:230px"
    use:libProps={{ series: SCATTER_SERIES, height: 100, ...CHART_OFF }}
  ></lib-scatter-chart>

{:else if tag === 'lib-scatter-chart-3d'}
  <lib-scatter-chart-3d
    style="width:230px"
    use:libProps={{ series: SCATTER_SERIES_3D, height: 110, ...CHART_OFF }}
  ></lib-scatter-chart-3d>

{:else if tag === 'lib-sidebar'}
  <div style="transform:scale(0.75)">
    <div class="sidebar-frame">
      <lib-sidebar>
        <a slot="item" href="#/">Dashboard</a>
        <a slot="item" href="#/">Settings</a>
      </lib-sidebar>
    </div>
  </div>

{:else if tag === 'lib-stepper'}
  <lib-stepper current="2" style="width:230px">
    <lib-step index="1" label="Plan"></lib-step>
    <lib-step index="2" label="Build"></lib-step>
    <lib-step index="3" label="Ship"></lib-step>
  </lib-stepper>

{:else if tag === 'lib-text-editor'}
  <div style="transform:scale(0.5)">
    <lib-text-editor
      active="f1"
      readonly
      style="width:420px;height:220px"
      use:libProps={{ files: EDITOR_FILES }}
    ></lib-text-editor>
  </div>

{:else if tag === 'lib-timeline'}
  <div style="transform:scale(0.8)">
    <lib-timeline style="width:260px">
      <div data-date="2025">Phase 2 — Components</div>
      <div data-date="2026">Phase 3 — Katachi</div>
    </lib-timeline>
  </div>

{:else if tag === 'lib-timeline-item'}
  <div style="transform:scale(0.8)">
    <lib-timeline style="width:260px">
      <lib-timeline-item status="done" timestamp="Hoy · 10:30" title="Pedido entregado" hide-line></lib-timeline-item>
    </lib-timeline>
  </div>
{/if}

<style>
  .slide {
    background: var(--bg-elevated);
    padding: var(--lib-space-lg);
  }
  .sidebar-frame {
    height: 150px;
    width: 260px;
    position: relative;
    overflow: hidden;
  }
</style>
