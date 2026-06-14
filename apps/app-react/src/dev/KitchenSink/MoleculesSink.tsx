import { KitchenItem } from './KitchenItem';

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--lib-space-md)',
};

const headerStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-default)',
  paddingBottom: 'var(--lib-space-xs)',
  margin: 0,
};

export const MoleculesSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={headerStyle}>🟡 Molecules · 18</h2>

    <div style={sectionStyle}>

      <KitchenItem name="lib-input">
        <lib-input label="Buscador" placeholder="Escribe para buscar…" style={{ minWidth: 280 }}>
          <lib-icon slot="prefix" name="magnifying-glass" size="18" />
          <lib-button slot="suffix" variant="ghost" style={{ padding: 0 }}>
            <lib-icon name="arrow-right" size="18" />
          </lib-button>
        </lib-input>
      </KitchenItem>

      <KitchenItem name="lib-select">
        <lib-select label="Katachi" style={{ minWidth: 220 }}>
          <lib-select-option value="wabi" label="Wabi" />
          <lib-select-option value="kintsugi" label="Kintsugi" />
          <lib-select-option value="sabi" label="Sabi" />
        </lib-select>
      </KitchenItem>

      <KitchenItem name="lib-tree-select">
        <lib-tree-select label="Categoría" style={{ minWidth: 220 }} />
      </KitchenItem>

      <KitchenItem name="lib-color-picker">
        <lib-color-picker value="#a87c4f" />
      </KitchenItem>

      <KitchenItem name="lib-range-slider">
        <lib-range-slider min="0" max="100" value="35" style={{ minWidth: 240 }} />
      </KitchenItem>

      <KitchenItem name="lib-file-uploader">
        <lib-file-uploader style={{ minWidth: 280 }} />
      </KitchenItem>

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
        <lib-checkbox-card label="Acepto" sublabel="Términos y condiciones" style={{ minWidth: 240 }} />
      </KitchenItem>

      <KitchenItem name="lib-tabs">
        <lib-tabs style={{ minWidth: 280 }}>
          <button slot="tab" data-tab="one">Uno</button>
          <button slot="tab" data-tab="two">Dos</button>
          <div slot="panel" data-panel="one">Panel uno</div>
          <div slot="panel" data-panel="two">Panel dos</div>
        </lib-tabs>
      </KitchenItem>

      <KitchenItem name="lib-breadcrumb">
        <lib-breadcrumb>
          <a href="#">Home</a>
          <a href="#">Components</a>
          <span>Current</span>
        </lib-breadcrumb>
      </KitchenItem>

      <KitchenItem name="lib-pagination">
        <lib-pagination total="50" page-size="10" current="3" />
      </KitchenItem>

      <KitchenItem name="lib-dropdown">
        <lib-dropdown label="Menu">
          <button slot="item">Item A</button>
          <button slot="item">Item B</button>
          <button slot="item">Item C</button>
        </lib-dropdown>
      </KitchenItem>

      <KitchenItem name="lib-alert">
        <lib-alert type="info" style={{ minWidth: 280 }}>Info alert</lib-alert>
        <lib-alert type="success" style={{ minWidth: 280 }}>Success</lib-alert>
        <lib-alert type="warning" style={{ minWidth: 280 }}>Warning</lib-alert>
        <lib-alert type="error" style={{ minWidth: 280 }}>Error</lib-alert>
      </KitchenItem>

      <KitchenItem name="lib-empty-state">
        <lib-empty-state title="Nada por aquí" description="Aún no hay resultados." style={{ minWidth: 280 }} />
      </KitchenItem>

      <KitchenItem name="lib-modal" note="declarativo — abre con prop open">
        <lib-modal>
          <p>Modal content (cerrado por defecto)</p>
        </lib-modal>
        <small style={{ color: 'var(--text-muted)' }}>open=false por defecto</small>
      </KitchenItem>

      <KitchenItem name="lib-header" note="estructural — preview comprimido">
        <lib-header style={{ width: '100%' }}>
          <span slot="brand">Shibui</span>
          <a slot="nav" href="#">Docs</a>
          <a slot="nav" href="#">About</a>
        </lib-header>
      </KitchenItem>

    </div>
  </section>
);
