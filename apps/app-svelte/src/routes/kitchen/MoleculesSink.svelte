<script lang="ts">
  import KitchenItem from './KitchenItem.svelte';
</script>

<section class="section">
  <h2>🟡 Molecules · 18</h2>
  <div class="grid">

    <KitchenItem name="lib-input">
      <lib-input label="Buscador" placeholder="Escribe para buscar…" style="min-width: 280px">
        <lib-icon slot="prefix" name="magnifying-glass" size="18"></lib-icon>
        <lib-button slot="suffix" variant="ghost" style="padding: 0">
          <lib-icon name="arrow-right" size="18"></lib-icon>
        </lib-button>
      </lib-input>
    </KitchenItem>

    <KitchenItem name="lib-select">
      <lib-select label="Katachi" style="min-width: 220px">
        <lib-select-option value="wabi" label="Wabi"></lib-select-option>
        <lib-select-option value="kintsugi" label="Kintsugi"></lib-select-option>
        <lib-select-option value="sabi" label="Sabi"></lib-select-option>
      </lib-select>
    </KitchenItem>

    <KitchenItem name="lib-tree-select"><lib-tree-select label="Categoría" style="min-width: 220px"></lib-tree-select></KitchenItem>
    <KitchenItem name="lib-color-picker"><lib-color-picker value="#a87c4f"></lib-color-picker></KitchenItem>
    <KitchenItem name="lib-range-slider"><lib-range-slider min="0" max="100" value="35" style="min-width: 240px"></lib-range-slider></KitchenItem>
    <KitchenItem name="lib-file-uploader"><lib-file-uploader style="min-width: 280px"></lib-file-uploader></KitchenItem>

    <KitchenItem name="lib-segmented-control">
      <lib-segmented-control value="b">
        <button data-value="a">Uno</button>
        <button data-value="b">Dos</button>
        <button data-value="c">Tres</button>
      </lib-segmented-control>
    </KitchenItem>

    <KitchenItem name="lib-button-group">
      <lib-button-group>
        <lib-button>Left</lib-button>
        <lib-button>Mid</lib-button>
        <lib-button>Right</lib-button>
      </lib-button-group>
    </KitchenItem>

    <KitchenItem name="lib-chip">
      <lib-chip>default</lib-chip>
      <lib-chip tone="accent">accent</lib-chip>
      <lib-chip dismissible>dismissible</lib-chip>
    </KitchenItem>

    <KitchenItem name="lib-checkbox-card">
      <lib-checkbox-card label="Acepto" sublabel="Términos y condiciones" style="min-width: 240px"></lib-checkbox-card>
    </KitchenItem>

    <KitchenItem name="lib-tabs">
      <lib-tabs style="min-width: 280px">
        <button slot="tab" data-tab="one">Uno</button>
        <button slot="tab" data-tab="two">Dos</button>
        <div slot="panel" data-panel="one">Panel uno</div>
        <div slot="panel" data-panel="two">Panel dos</div>
      </lib-tabs>
    </KitchenItem>

    <KitchenItem name="lib-breadcrumb">
      <lib-breadcrumb>
        <a href="#/">Home</a>
        <a href="#/">Components</a>
        <span>Current</span>
      </lib-breadcrumb>
    </KitchenItem>

    <KitchenItem name="lib-pagination">
      <lib-pagination total="50" page-size="10" current="3"></lib-pagination>
    </KitchenItem>

    <KitchenItem name="lib-dropdown">
      <lib-dropdown label="Menu">
        <button slot="item">Item A</button>
        <button slot="item">Item B</button>
        <button slot="item">Item C</button>
      </lib-dropdown>
    </KitchenItem>

    <KitchenItem name="lib-alert">
      <lib-alert type="info" style="min-width: 280px">Info alert</lib-alert>
      <lib-alert type="success" style="min-width: 280px">Success</lib-alert>
      <lib-alert type="warning" style="min-width: 280px">Warning</lib-alert>
      <lib-alert type="error" style="min-width: 280px">Error</lib-alert>
    </KitchenItem>

    <KitchenItem name="lib-empty-state">
      <lib-empty-state title="Nada por aquí" description="Aún no hay resultados." style="min-width: 280px"></lib-empty-state>
    </KitchenItem>

    <KitchenItem name="lib-modal" note="declarativo — abre con prop open">
      <lib-modal><p>Modal content (cerrado por defecto)</p></lib-modal>
      <small style="color: var(--text-muted)">open=false por defecto</small>
    </KitchenItem>

    <KitchenItem name="lib-header" note="estructural — preview comprimido">
      <lib-header style="width: 100%">
        <span slot="brand">Shibui</span>
        <a slot="nav" href="#/">Docs</a>
        <a slot="nav" href="#/">About</a>
      </lib-header>
    </KitchenItem>

  </div>
</section>

<style>
  .section { display: flex; flex-direction: column; gap: var(--lib-space-lg); }
  h2 { color: var(--text-primary); border-bottom: 1px solid var(--border-default); padding-bottom: var(--lib-space-xs); margin: 0; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--lib-space-md); }
</style>
