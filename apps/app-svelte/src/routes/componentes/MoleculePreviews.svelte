<script module lang="ts">
  /** Tags de molécula con preview propia. */
  export const MOLECULE_PREVIEW_TAGS = [
    'lib-alert', 'lib-breadcrumb', 'lib-button-group', 'lib-button-sep',
    'lib-button-split', 'lib-checkbox-card', 'lib-chip', 'lib-color-picker',
    'lib-color-swatches', 'lib-dropdown', 'lib-editor-toolbar', 'lib-empty-state',
    'lib-file-uploader', 'lib-header', 'lib-input', 'lib-metric-bar',
    'lib-pagination', 'lib-range-slider', 'lib-segmented-control', 'lib-select',
    'lib-tabs', 'lib-tree-select',
  ];
</script>

<script lang="ts">
  import { libProps } from '../../lib/lib-props';

  interface Props { tag: string }
  let { tag }: Props = $props();

  /* Datos mínimos válidos: montar los data-driven vacíos revienta en Lit. */
  const BREADCRUMB_ITEMS = [
    { label: 'Home', href: '#', icon: 'house' },
    { label: 'Componentes', href: '#' },
    { label: 'Actual' },
  ];

  const SEGMENTED_OPTIONS = [
    { value: 'a', label: 'Uno' },
    { value: 'b', label: 'Dos' },
    { value: 'c', label: 'Tres' },
  ];
</script>

{#if tag === 'lib-alert'}
  <lib-alert type="info" style="min-width:220px">Alerta informativa</lib-alert>

{:else if tag === 'lib-breadcrumb'}
  <lib-breadcrumb use:libProps={{ items: BREADCRUMB_ITEMS }}></lib-breadcrumb>

{:else if tag === 'lib-button-group'}
  <lib-button-group>
    <lib-button>Left</lib-button>
    <lib-button>Mid</lib-button>
    <lib-button>Right</lib-button>
  </lib-button-group>

{:else if tag === 'lib-button-sep'}
  <lib-button-group>
    <lib-button>Guardar</lib-button>
    <lib-button-sep></lib-button-sep>
    <lib-button><lib-icon name="caret-circle-down" size="sm"></lib-icon></lib-button>
  </lib-button-group>

{:else if tag === 'lib-button-split'}
  <lib-button-split variant="solid" label="Acción">
    <button slot="menu">Opción A</button>
    <button slot="menu">Opción B</button>
  </lib-button-split>

{:else if tag === 'lib-checkbox-card'}
  <lib-checkbox-card label="Acepto" sublabel="Términos y condiciones" style="min-width:210px"></lib-checkbox-card>

{:else if tag === 'lib-chip'}
  <div class="row">
    <lib-chip>default</lib-chip>
    <lib-chip tone="accent">accent</lib-chip>
    <lib-chip dismissible>dismissible</lib-chip>
  </div>

{:else if tag === 'lib-color-picker'}
  <lib-color-picker display="trigger" value="#a87c4f" label="Color"></lib-color-picker>

{:else if tag === 'lib-color-swatches'}
  <lib-color-swatches value="#B85A1E"></lib-color-swatches>

{:else if tag === 'lib-dropdown'}
  <lib-dropdown label="Menu">
    <button slot="item">Item A</button>
    <button slot="item">Item B</button>
  </lib-dropdown>

{:else if tag === 'lib-editor-toolbar'}
  <lib-editor-toolbar filename="notas.md" dirty style="min-width:230px" aria-label="Barra del editor"></lib-editor-toolbar>

{:else if tag === 'lib-empty-state'}
  <div style="transform:scale(0.75)">
    <lib-empty-state
      title="Nada por aquí"
      description="Aún no hay resultados."
      icon="compass"
      style="min-width:240px"
    ></lib-empty-state>
  </div>

{:else if tag === 'lib-file-uploader'}
  <div style="transform:scale(0.7)">
    <lib-file-uploader style="min-width:280px"></lib-file-uploader>
  </div>

{:else if tag === 'lib-header'}
  <div style="transform:scale(0.6);width:380px">
    <lib-header style="width:100%">
      <span slot="brand">Shibui</span>
      <a slot="nav" href="#/">Docs</a>
      <a slot="nav" href="#/">About</a>
    </lib-header>
  </div>

{:else if tag === 'lib-input'}
  <lib-input label="Buscador" placeholder="Escribe para buscar…" style="min-width:220px">
    <lib-icon slot="prefix" name="quill" size="sm"></lib-icon>
  </lib-input>

{:else if tag === 'lib-metric-bar'}
  <lib-metric-bar
    label="CPU"
    unit="%"
    tone="accent"
    show-value
    style="width:190px"
    use:libProps={{ value: 62 }}
  ></lib-metric-bar>

{:else if tag === 'lib-pagination'}
  <div style="transform:scale(0.85)">
    <lib-pagination total="50" page-size="10" current="3"></lib-pagination>
  </div>

{:else if tag === 'lib-range-slider'}
  <lib-range-slider min="0" max="100" value="35" style="min-width:190px"></lib-range-slider>

{:else if tag === 'lib-segmented-control'}
  <lib-segmented-control value="b" use:libProps={{ options: SEGMENTED_OPTIONS }}></lib-segmented-control>

{:else if tag === 'lib-select'}
  <lib-select label="Katachi" style="min-width:190px">
    <lib-select-option value="wabi" label="Wabi"></lib-select-option>
    <lib-select-option value="sabi" label="Sabi"></lib-select-option>
  </lib-select>

{:else if tag === 'lib-tabs'}
  <lib-tabs style="min-width:220px">
    <button slot="tab" data-tab="one">Uno</button>
    <button slot="tab" data-tab="two">Dos</button>
    <div slot="panel" data-panel="one">Panel uno</div>
    <div slot="panel" data-panel="two">Panel dos</div>
  </lib-tabs>

{:else if tag === 'lib-tree-select'}
  <lib-tree-select label="Categoría" style="min-width:190px"></lib-tree-select>
{/if}

<style>
  .row {
    display: flex;
    gap: var(--lib-space-sm);
  }
</style>
