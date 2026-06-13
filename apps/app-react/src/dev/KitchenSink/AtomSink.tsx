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

export const AtomsSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={headerStyle}>🟢 Atoms · 44</h2>

    <div style={sectionStyle}>

      <KitchenItem name="lib-button">
        <lib-button>solid (default)</lib-button>
        <lib-button variant="solid">solid</lib-button>
        <lib-button variant="outlined">outlined</lib-button>
        <lib-button variant="ghost">ghost</lib-button>
        <lib-button tone="accent">accent</lib-button>
        <lib-button tone="error">error</lib-button>
      </KitchenItem>

      <KitchenItem name="lib-button-liquid">
        <lib-button-liquid>liquid</lib-button-liquid>
        <lib-button-liquid variant="outlined">outlined</lib-button-liquid>
      </KitchenItem>

      <KitchenItem name="lib-burger">
        <lib-burger theme="filled" />
        <lib-burger theme="kanji" />
        <lib-burger theme="neutral" />
        <lib-burger theme="framed" />
        <lib-burger theme="inverse" />
        <lib-burger theme="glitch" />
      </KitchenItem>

      <KitchenItem name="lib-close-button">
        <lib-close-button />
      </KitchenItem>

      <KitchenItem name="lib-copy-button">
        <lib-copy-button text="hello-world" />
      </KitchenItem>

      <KitchenItem name="lib-badge">
        <lib-badge tone="default">default</lib-badge>
        <lib-badge tone="accent">accent</lib-badge>
        <lib-badge tone="info">info</lib-badge>
        <lib-badge tone="strong">strong</lib-badge>
        <lib-badge tone="error">error</lib-badge>
        <lib-badge tone="success">success</lib-badge>
        <lib-badge tone="warning">warning</lib-badge>
        <lib-badge tone="default" dot>dot</lib-badge>
        <lib-badge tone="default" pill>pill</lib-badge>
      </KitchenItem>

      <KitchenItem name="lib-card">
        <lib-card style={{ padding: 'var(--lib-space-md)', minWidth: 140 }}>
          <p style={{ margin: 0 }}>solid (default)</p>
        </lib-card>
        <lib-card variant="featured" style={{ padding: 'var(--lib-space-md)', minWidth: 140 }}>
          <p style={{ margin: 0 }}>featured</p>
        </lib-card>
      </KitchenItem>

      <KitchenItem name="lib-canvas" note="wrapper Katachi propagator">
        <lib-canvas katachi="kintsugi" style={{ padding: 'var(--lib-space-sm)', border: '1px dashed var(--border-default)' }}>
          <lib-badge tone="default">kintsugi inner</lib-badge>
        </lib-canvas>
      </KitchenItem>

      <KitchenItem name="lib-checkbox">
        <lib-checkbox tone="default" />
        <lib-checkbox tone="accent" />
        <lib-checkbox tone="error" />
        <lib-checkbox tone="default" indeterminate="true" />
        <lib-checkbox tone="default" disabled="true" />
        <lib-checkbox tone="default" label="label" sublabel="sublabel" />
      </KitchenItem>

      <KitchenItem name="lib-radio">
        <lib-radio name="r" value="a" label="opción A" />
        <lib-radio name="r" value="b" label="opción B" />
        <lib-radio name="r" value="c" label="opción C" disabled />
      </KitchenItem>

      <KitchenItem name="lib-switch">
        <lib-switch />
        <lib-switch checked />
        <lib-switch disabled />
      </KitchenItem>

      <KitchenItem name="lib-rating">
        <lib-rating value="3" />
        <lib-rating value="4.5" max="5" />
      </KitchenItem>

      <KitchenItem name="lib-progress">
        <lib-progress value="35" style={{ width: 200 }} />
        <lib-progress value="80" style={{ width: 200 }} />
      </KitchenItem>

      <KitchenItem name="lib-progress-circle">
        <lib-progress-circle value="60" />
      </KitchenItem>

      <KitchenItem name="lib-spinner">
        <lib-spinner />
        <lib-spinner size="lg" />
      </KitchenItem>

      <KitchenItem name="lib-skeleton">
        <lib-skeleton style={{ width: 220, height: 12 }} />
        <lib-skeleton style={{ width: 160, height: 12 }} />
        <lib-skeleton style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </KitchenItem>

      <KitchenItem name="lib-avatar">
        <lib-avatar />
        <lib-avatar name="Alejandro Borbalan" />
        <lib-avatar shape="squircle" name="Alejandro Borbalan" />
        <lib-avatar shape="square" name="Alejandro Borbalan" />
        <lib-avatar tint="warm" name="K K" />
        <lib-avatar tint="cool" name="C C" />
      </KitchenItem>

      <KitchenItem name="lib-icon">
        <lib-icon name="x" />
        <lib-icon name="arrow-right" />
        <lib-icon name="magnifying-glass" />
      </KitchenItem>

      <KitchenItem name="lib-status-dot">
        <lib-status-dot status="online" />
        <lib-status-dot status="offline" />
        <lib-status-dot status="busy" />
      </KitchenItem>

      <KitchenItem name="lib-divider">
        <lib-divider style={{ width: '100%' }} />
        <lib-divider style-variant="dashed" style={{ width: '100%' }} />
      </KitchenItem>

      <KitchenItem name="lib-spacer" note="invisible — borde dashed para verlo">
        <div style={{ display: 'inline-block', border: '1px dashed var(--border-default)' }}>
          <lib-spacer size="lg" />
        </div>
      </KitchenItem>

      <KitchenItem name="lib-kbd">
        <lib-kbd>⌘</lib-kbd>
        <lib-kbd>K</lib-kbd>
        <lib-kbd>Ctrl</lib-kbd>
      </KitchenItem>

      <KitchenItem name="lib-label">
        <lib-label>Plain label</lib-label>
      </KitchenItem>

      <KitchenItem name="lib-eyebrow">
        <lib-eyebrow>Eyebrow text</lib-eyebrow>
      </KitchenItem>

      <KitchenItem name="lib-display-heading">
        <lib-display-heading level="2">Display heading</lib-display-heading>
      </KitchenItem>

      <KitchenItem name="lib-quote">
        <lib-quote author="Tanizaki">
          We find beauty not in the thing itself, but in the shadows it creates.
        </lib-quote>
      </KitchenItem>

      <KitchenItem name="lib-code-block">
        <lib-code-block language="ts" style={{ minWidth: 280 }}>
          {`const k: KatachiId = 'kintsugi';`}
        </lib-code-block>
      </KitchenItem>

      <KitchenItem name="lib-text-list">
        <lib-text-list>
          <li>Wabi</li>
          <li>Sabi</li>
          <li>Kintsugi</li>
        </lib-text-list>
      </KitchenItem>

      <KitchenItem name="lib-text-glitch">
        <lib-text-glitch>SHIBUI</lib-text-glitch>
      </KitchenItem>

      <KitchenItem name="lib-counter">
        <lib-counter value="1234" />
      </KitchenItem>

      <KitchenItem name="lib-color-scale">
        <lib-color-scale palette="washi" />
      </KitchenItem>

      <KitchenItem name="lib-content-pillar">
        <lib-content-pillar title="Pillar" style={{ minWidth: 220 }}>
          Body content
        </lib-content-pillar>
      </KitchenItem>

      <KitchenItem name="lib-tooltip">
        <lib-tooltip content="Tooltip text">
          <lib-button variant="ghost">hover me</lib-button>
        </lib-tooltip>
      </KitchenItem>

      <KitchenItem name="lib-accordion-item" note="contexto: hereda del padre lib-accordion">
        <lib-accordion-item label="¿Qué es Katachi?" style={{ minWidth: 260 }}>
          <p>Sistema de contextos estéticos del ecosistema Shibui.</p>
        </lib-accordion-item>
      </KitchenItem>

      <KitchenItem name="lib-step">
        <lib-step index="1" label="Plan" />
        <lib-step index="2" label="Build" active />
        <lib-step index="3" label="Ship" />
      </KitchenItem>

      <KitchenItem name="lib-bento-item">
        <lib-bento-item style={{ minWidth: 160, minHeight: 80 }}>
          <p style={{ padding: 'var(--lib-space-sm)', margin: 0 }}>bento item</p>
        </lib-bento-item>
      </KitchenItem>

      <KitchenItem name="lib-aspect-ratio">
        <lib-aspect-ratio ratio="16/9" style={{ width: 240, background: 'var(--bg-elevated)' }}>
          <div style={{ padding: 'var(--lib-space-sm)' }}>16/9</div>
        </lib-aspect-ratio>
      </KitchenItem>

      <KitchenItem name="lib-select-option" note="standalone option (uso normal: dentro de lib-select)">
        <lib-select-option value="x" label="Option X" />
      </KitchenItem>

      <KitchenItem name="lib-visually-hidden" note="a11y — invisible visualmente">
        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          (skip-link declarado pero no visible)
        </span>
        <lib-visually-hidden>Skip to main content</lib-visually-hidden>
      </KitchenItem>

      <KitchenItem name="lib-ripple" note="overlay effect — hover/click el botón">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <lib-button variant="solid">click ripple</lib-button>
          <lib-ripple />
        </div>
      </KitchenItem>

      <KitchenItem name="lib-magnetic" note="effect — hover acerca el cursor">
        <lib-magnetic strength="0.4">
          <lib-button variant="ghost">magnetic</lib-button>
        </lib-magnetic>
      </KitchenItem>

      <KitchenItem name="lib-reading-progress" note="effect — barra al top de la ventana">
        <lib-reading-progress />
        <small style={{ color: 'var(--text-muted)' }}>activa, scrollea para ver</small>
      </KitchenItem>

      <KitchenItem name="lib-background" note="producer — variante washi como demo">
        <div style={{ position: 'relative', width: '100%', minHeight: 80, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <lib-background theme="washi-grain" />
        </div>
      </KitchenItem>

    </div>
  </section>
);
