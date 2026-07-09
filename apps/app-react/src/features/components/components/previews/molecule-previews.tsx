import type React from "react";

/**
 * Previews compactas de moléculas, keyed por tagName del catálogo.
 * Los data-driven llevan siempre datos mínimos válidos — montar
 * estos componentes sin datos provoca errores async de Lit.
 */
export const moleculePreviews: Record<string, () => React.ReactElement> = {
  "lib-alert": () => (
    <lib-alert type="info" style={{ minWidth: 220 }}>
      Alerta informativa
    </lib-alert>
  ),

  "lib-breadcrumb": () => (
    <lib-breadcrumb
      items={[
        { label: "Home", href: "#", icon: "house" },
        { label: "Componentes", href: "#" },
        { label: "Actual" },
      ]}
    />
  ),

  "lib-button-group": () => (
    <lib-button-group>
      <lib-button>Left</lib-button>
      <lib-button>Mid</lib-button>
      <lib-button>Right</lib-button>
    </lib-button-group>
  ),

  "lib-button-sep": () => (
    <lib-button-group>
      <lib-button>Guardar</lib-button>
      <lib-button-sep />
      <lib-button>
        <lib-icon name="caret-circle-down" size="sm" />
      </lib-button>
    </lib-button-group>
  ),

  "lib-button-split": () => (
    <lib-button-split variant="solid" label="Acción">
      <button slot="menu">Opción A</button>
      <button slot="menu">Opción B</button>
    </lib-button-split>
  ),

  "lib-checkbox-card": () => (
    <lib-checkbox-card label="Acepto" sublabel="Términos y condiciones" style={{ minWidth: 210 }} />
  ),

  "lib-chip": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-sm)" }}>
      <lib-chip>default</lib-chip>
      <lib-chip tone="accent">accent</lib-chip>
      <lib-chip dismissible>dismissible</lib-chip>
    </div>
  ),

  "lib-color-picker": () => <lib-color-picker display="trigger" value="#a87c4f" label="Color" />,

  "lib-color-swatches": () => <lib-color-swatches value="#B85A1E" />,

  "lib-dropdown": () => (
    <lib-dropdown label="Menu">
      <button slot="item">Item A</button>
      <button slot="item">Item B</button>
    </lib-dropdown>
  ),

  "lib-editor-toolbar": () => <lib-editor-toolbar filename="notas.md" dirty style={{ minWidth: 230 }} />,

  "lib-empty-state": () => (
    <div style={{ transform: "scale(0.75)" }}>
      <lib-empty-state
        title="Nada por aquí"
        description="Aún no hay resultados."
        icon="compass"
        style={{ minWidth: 240 }}
      />
    </div>
  ),

  "lib-file-uploader": () => (
    <div style={{ transform: "scale(0.7)" }}>
      <lib-file-uploader style={{ minWidth: 280 }} />
    </div>
  ),

  "lib-header": () => (
    <div style={{ transform: "scale(0.6)", width: 380 }}>
      <lib-header style={{ width: "100%" }}>
        <span slot="brand">Shibui</span>
        <a slot="nav" href="#">
          Docs
        </a>
        <a slot="nav" href="#">
          About
        </a>
      </lib-header>
    </div>
  ),

  "lib-input": () => (
    <lib-input label="Buscador" placeholder="Escribe para buscar…" style={{ minWidth: 220 }}>
      <lib-icon slot="prefix" name="quill" size="sm" />
    </lib-input>
  ),

  "lib-metric-bar": () => (
    <lib-metric-bar label="CPU" value={62} unit="%" tone="accent" show-value style={{ width: 190 }} />
  ),

  "lib-pagination": () => (
    <div style={{ transform: "scale(0.85)" }}>
      <lib-pagination total="50" page-size="10" current="3" />
    </div>
  ),

  "lib-range-slider": () => <lib-range-slider min="0" max="100" value="35" style={{ minWidth: 190 }} />,

  "lib-segmented-control": () => (
    <lib-segmented-control
      value="b"
      options={[
        { value: "a", label: "Uno" },
        { value: "b", label: "Dos" },
        { value: "c", label: "Tres" },
      ]}
    />
  ),

  "lib-select": () => (
    <lib-select label="Katachi" style={{ minWidth: 190 }}>
      <lib-select-option value="wabi" label="Wabi" />
      <lib-select-option value="kintsugi" label="Kintsugi" />
    </lib-select>
  ),

  "lib-tabs": () => (
    <lib-tabs style={{ minWidth: 220 }}>
      <button slot="tab" data-tab="one">
        Uno
      </button>
      <button slot="tab" data-tab="two">
        Dos
      </button>
      <div slot="panel" data-panel="one">
        Panel uno
      </div>
      <div slot="panel" data-panel="two">
        Panel dos
      </div>
    </lib-tabs>
  ),

  "lib-tree-select": () => <lib-tree-select label="Categoría" style={{ minWidth: 190 }} />,
};
