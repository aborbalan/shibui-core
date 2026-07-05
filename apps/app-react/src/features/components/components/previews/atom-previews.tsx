import type React from "react";

/**
 * Previews compactas de átomos, keyed por tagName del catálogo.
 * Una variante representativa por componente — el espectro completo
 * vive en el KitchenSink (/admin/kitchen-sink) y en Storybook.
 */
export const atomPreviews: Record<string, () => React.ReactElement> = {
  "lib-accordion-item": () => (
    <lib-accordion-item label="¿Qué es Katachi?" style={{ minWidth: 200 }}>
      <p style={{ margin: 0 }}>Contextos estéticos de Shibui.</p>
    </lib-accordion-item>
  ),

  "lib-aspect-ratio": () => (
    <lib-aspect-ratio ratio="16/9" style={{ width: 150, background: "var(--bg-elevated)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontFamily: "var(--lib-font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
        }}
      >
        16/9
      </div>
    </lib-aspect-ratio>
  ),

  "lib-avatar": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-sm)" }}>
      <lib-avatar name="Shi Bui" />
      <lib-avatar shape="squircle" tint="warm" name="Ka Ki" />
      <lib-avatar shape="square" tint="cool" name="Wa Bi" />
    </div>
  ),

  "lib-background": () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 96,
        overflow: "hidden",
        border: "1px dashed var(--border-default)",
      }}
    >
      <lib-background theme="washi-grain" />
    </div>
  ),

  "lib-badge": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-sm)" }}>
      <lib-badge tone="accent">accent</lib-badge>
      <lib-badge tone="success" pill>
        pill
      </lib-badge>
      <lib-badge tone="info" dot>
        dot
      </lib-badge>
    </div>
  ),

  "lib-bento-item": () => (
    <lib-bento-item style={{ minWidth: 150, minHeight: 70 }}>
      <p style={{ padding: "var(--lib-space-sm)", margin: 0 }}>bento item</p>
    </lib-bento-item>
  ),

  "lib-burger": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)" }}>
      <lib-burger theme="filled" />
      <lib-burger theme="framed" />
    </div>
  ),

  "lib-button": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-sm)" }}>
      <lib-button variant="solid">Solid</lib-button>
      <lib-button variant="outlined">Outlined</lib-button>
    </div>
  ),

  "lib-button-liquid": () => <lib-button-liquid>Liquid</lib-button-liquid>,

  "lib-card": () => (
    <lib-card style={{ padding: "var(--lib-space-md)", minWidth: 150 }}>
      <p style={{ margin: 0 }}>Card body</p>
    </lib-card>
  ),

  "lib-checkbox": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)", alignItems: "center" }}>
      <lib-checkbox tone="accent" checked />
      <lib-checkbox tone="default" label="Label" sublabel="Sublabel" />
    </div>
  ),

  "lib-close-button": () => <lib-close-button />,

  "lib-code-block": () => (
    <lib-code-block language="ts" style={{ minWidth: 210 }}>
      {`const k: KatachiId = 'kintsugi';`}
    </lib-code-block>
  ),

  "lib-color-scale": () => (
    <lib-color-scale
      name="washi"
      showLabels={false}
      steps={[
        { step: 100, hex: "#f5f1e8" },
        { step: 300, hex: "#e0d8c3" },
        { step: 500, hex: "#b8ab8a" },
        { step: 700, hex: "#7d7156" },
        { step: 900, hex: "#3f3a2c" },
      ]}
      style={{ maxWidth: "100%" }}
    />
  ),

  "lib-component-grid": () => (
    <lib-component-grid transparent style={{ width: 230 }}>
      <lib-card style={{ padding: "var(--lib-space-sm)" }}>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>A</p>
      </lib-card>
      <lib-card style={{ padding: "var(--lib-space-sm)" }}>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>B</p>
      </lib-card>
    </lib-component-grid>
  ),

  "lib-content-pillar": () => (
    <lib-content-pillar title="Pillar" style={{ minWidth: 180 }}>
      Body content
    </lib-content-pillar>
  ),

  "lib-copy-button": () => <lib-copy-button text="hello-world" />,

  "lib-counter": () => <lib-counter value="1234" />,

  "lib-display-heading": () => (
    <div style={{ transform: "scale(0.55)" }}>
      <lib-display-heading tag="h2" size="sm" line1="Librería de" accent="componentes" />
    </div>
  ),

  "lib-divider": () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--lib-space-md)", width: 170 }}>
      <lib-divider />
      <lib-divider style-variant="dashed" />
    </div>
  ),

  "lib-eyebrow": () => <lib-eyebrow>Eyebrow text</lib-eyebrow>,

  "lib-glass-card": () => (
    <div
      style={{
        background: "linear-gradient(135deg, var(--bg-elevated), var(--text-accent))",
        padding: "var(--lib-space-md)",
        borderRadius: 8,
      }}
    >
      <lib-glass-card style={{ padding: "var(--lib-space-md)", minWidth: 140 }}>
        <p style={{ margin: 0 }}>Glass</p>
      </lib-glass-card>
    </div>
  ),

  "lib-icon": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)" }}>
      <lib-icon name="house" size="lg" />
      <lib-icon name="arrow-right" size="lg" />
      <lib-icon name="check-circle" size="lg" />
    </div>
  ),

  "lib-kbd": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-xs)" }}>
      <lib-kbd>⌘</lib-kbd>
      <lib-kbd>K</lib-kbd>
    </div>
  ),

  "lib-label": () => <lib-label>Plain label</lib-label>,

  "lib-progress": () => <lib-progress value="60" style={{ width: 170 }} />,

  "lib-progress-circle": () => <lib-progress-circle value="60" />,

  "lib-quote": () => (
    <lib-quote author="Tanizaki" style={{ maxWidth: 230 }}>
      Beauty lives in the shadows.
    </lib-quote>
  ),

  "lib-radio": () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--lib-space-xs)" }}>
      <lib-radio name="preview-radio" value="a" label="Opción A" checked />
      <lib-radio name="preview-radio" value="b" label="Opción B" />
    </div>
  ),

  "lib-rating": () => <lib-rating value="3.5" max="5" />,

  "lib-select-option": () => <lib-select-option value="x" label="Option X" />,

  "lib-skeleton": () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--lib-space-sm)" }}>
      <lib-skeleton style={{ width: 180, height: 12 }} />
      <lib-skeleton style={{ width: 120, height: 12 }} />
    </div>
  ),

  "lib-sparkline": () => (
    <lib-sparkline values={[4, 8, 6, 10, 7, 12]} tone="accent" show-end-dot width={140} height={36} />
  ),

  "lib-spinner": () => <lib-spinner size="lg" />,

  "lib-spotlight-card": () => (
    <lib-spotlight-card style={{ padding: "var(--lib-space-md)", minWidth: 160 }}>
      <p style={{ margin: 0 }}>Spotlight</p>
    </lib-spotlight-card>
  ),

  "lib-status-dot": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)" }}>
      <lib-status-dot status="online" />
      <lib-status-dot status="busy" />
      <lib-status-dot status="offline" />
    </div>
  ),

  "lib-step": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)" }}>
      <lib-step index="1" label="Plan" />
      <lib-step index="2" label="Build" active />
    </div>
  ),

  "lib-switch": () => (
    <div style={{ display: "flex", gap: "var(--lib-space-md)" }}>
      <lib-switch checked />
      <lib-switch />
    </div>
  ),

  "lib-text-glitch": () => <lib-text-glitch text="SHIBUI" active />,

  "lib-text-list": () => (
    <lib-text-list>
      <li>Wabi</li>
      <li>Sabi</li>
      <li>Kintsugi</li>
    </lib-text-list>
  ),

  "lib-tooltip": () => (
    <lib-tooltip content="Tooltip text">
      <lib-button variant="ghost">Hover me</lib-button>
    </lib-tooltip>
  ),
};
