<script lang="ts">
  import KitchenItem from './KitchenItem.svelte';
</script>

<section class="section">
  <h2>🟢 Atoms · 44</h2>
  <div class="grid">

    <KitchenItem name="lib-button">
      <lib-button variant="default">default</lib-button>
      <lib-button variant="primary">primary</lib-button>
      <lib-button variant="secondary">secondary</lib-button>
      <lib-button variant="ghost">ghost</lib-button>
      <lib-button variant="accent">accent</lib-button>
      <lib-button variant="danger">danger</lib-button>
    </KitchenItem>

    <KitchenItem name="lib-liquid-button">
      <lib-liquid-button>liquid</lib-liquid-button>
      <lib-liquid-button variant="ink">ink</lib-liquid-button>
    </KitchenItem>

    <KitchenItem name="lib-burger-button">
      <lib-burger-button variant="ink"></lib-burger-button>
      <lib-burger-button variant="kanji"></lib-burger-button>
      <lib-burger-button variant="washi"></lib-burger-button>
      <lib-burger-button variant="framed"></lib-burger-button>
      <lib-burger-button variant="kintsugi"></lib-burger-button>
      <lib-burger-button variant="glitch"></lib-burger-button>
    </KitchenItem>

    <KitchenItem name="lib-close-button"><lib-close-button></lib-close-button></KitchenItem>
    <KitchenItem name="lib-copy-button"><lib-copy-button text="hello-world"></lib-copy-button></KitchenItem>

    <KitchenItem name="lib-badge">
      <lib-badge variant="default">default</lib-badge>
      <lib-badge variant="accent">accent</lib-badge>
      <lib-badge variant="celadon">celadon</lib-badge>
      <lib-badge variant="dark">dark</lib-badge>
      <lib-badge variant="error">error</lib-badge>
      <lib-badge variant="success">success</lib-badge>
      <lib-badge variant="warning">warning</lib-badge>
      <lib-badge variant="default" dot>dot</lib-badge>
      <lib-badge variant="default" pill>pill</lib-badge>
    </KitchenItem>

    <KitchenItem name="lib-card">
      <lib-card variant="default" style="padding: var(--lib-space-md); min-width: 140px"><p>default</p></lib-card>
      <lib-card variant="kintsugi" style="padding: var(--lib-space-md); min-width: 140px"><p>kintsugi</p></lib-card>
    </KitchenItem>

    <KitchenItem name="lib-canvas" note="wrapper Katachi propagator">
      <lib-canvas katachi="kintsugi" style="padding: var(--lib-space-sm); border: 1px dashed var(--border-default)">
        <lib-badge variant="default">kintsugi inner</lib-badge>
      </lib-canvas>
    </KitchenItem>

    <KitchenItem name="lib-checkbox">
      <lib-checkbox variant="default"></lib-checkbox>
      <lib-checkbox variant="kaki"></lib-checkbox>
      <lib-checkbox variant="error"></lib-checkbox>
      <lib-checkbox variant="default" indeterminate="true"></lib-checkbox>
      <lib-checkbox variant="default" disabled="true"></lib-checkbox>
      <lib-checkbox variant="default" label="label" sublabel="sublabel"></lib-checkbox>
    </KitchenItem>

    <KitchenItem name="lib-radio">
      <lib-radio name="r" value="a" label="opción A"></lib-radio>
      <lib-radio name="r" value="b" label="opción B"></lib-radio>
      <lib-radio name="r" value="c" label="opción C" disabled></lib-radio>
    </KitchenItem>

    <KitchenItem name="lib-switch">
      <lib-switch></lib-switch>
      <lib-switch checked></lib-switch>
      <lib-switch disabled></lib-switch>
    </KitchenItem>

    <KitchenItem name="lib-rating">
      <lib-rating value="3"></lib-rating>
      <lib-rating value="4.5" max="5"></lib-rating>
    </KitchenItem>

    <KitchenItem name="lib-progress">
      <lib-progress value="35" style="width: 200px"></lib-progress>
      <lib-progress value="80" style="width: 200px"></lib-progress>
    </KitchenItem>

    <KitchenItem name="lib-progress-circle"><lib-progress-circle value="60"></lib-progress-circle></KitchenItem>
    <KitchenItem name="lib-spinner"><lib-spinner></lib-spinner><lib-spinner size="lg"></lib-spinner></KitchenItem>

    <KitchenItem name="lib-skeleton">
      <lib-skeleton style="width: 220px; height: 12px"></lib-skeleton>
      <lib-skeleton style="width: 160px; height: 12px"></lib-skeleton>
      <lib-skeleton style="width: 60px; height: 60px; border-radius: 50%"></lib-skeleton>
    </KitchenItem>

    <KitchenItem name="lib-avatar">
      <lib-avatar></lib-avatar>
      <lib-avatar name="Alejandro Borbalan"></lib-avatar>
      <lib-avatar shape="squircle" name="Alejandro Borbalan"></lib-avatar>
      <lib-avatar shape="square" name="Alejandro Borbalan"></lib-avatar>
      <lib-avatar color="kaki" name="K K"></lib-avatar>
      <lib-avatar color="celadon" name="C C"></lib-avatar>
    </KitchenItem>

    <KitchenItem name="lib-icon">
      <lib-icon name="x"></lib-icon>
      <lib-icon name="arrow-right"></lib-icon>
      <lib-icon name="magnifying-glass"></lib-icon>
    </KitchenItem>

    <KitchenItem name="lib-status-dot">
      <lib-status-dot variant="online"></lib-status-dot>
      <lib-status-dot variant="offline"></lib-status-dot>
      <lib-status-dot variant="busy"></lib-status-dot>
    </KitchenItem>

    <KitchenItem name="lib-divider">
      <lib-divider style="width: 100%"></lib-divider>
      <lib-divider variant="dashed" style="width: 100%"></lib-divider>
    </KitchenItem>

    <KitchenItem name="lib-spacer" note="invisible — borde dashed para verlo">
      <div style="display: inline-block; border: 1px dashed var(--border-default)">
        <lib-spacer size="lg"></lib-spacer>
      </div>
    </KitchenItem>

    <KitchenItem name="lib-kbd"><lib-kbd>⌘</lib-kbd><lib-kbd>K</lib-kbd><lib-kbd>Ctrl</lib-kbd></KitchenItem>
    <KitchenItem name="lib-label"><lib-label>Plain label</lib-label></KitchenItem>
    <KitchenItem name="lib-eyebrow"><lib-eyebrow>Eyebrow text</lib-eyebrow></KitchenItem>

    <KitchenItem name="lib-display-heading">
      <lib-display-heading level="2">Display heading</lib-display-heading>
    </KitchenItem>

    <KitchenItem name="lib-quote">
      <lib-quote author="Tanizaki">We find beauty not in the thing itself, but in the shadows it creates.</lib-quote>
    </KitchenItem>

    <KitchenItem name="lib-code-block">
      <lib-code-block language="ts" style="min-width: 280px">{`const k: KatachiId = 'kintsugi';`}</lib-code-block>
    </KitchenItem>

    <KitchenItem name="lib-text-list">
      <lib-text-list><li>Wabi</li><li>Sabi</li><li>Kintsugi</li></lib-text-list>
    </KitchenItem>

    <KitchenItem name="lib-text-glitch"><lib-text-glitch>SHIBUI</lib-text-glitch></KitchenItem>
    <KitchenItem name="lib-counter"><lib-counter value="1234"></lib-counter></KitchenItem>
    <KitchenItem name="lib-color-scale"><lib-color-scale palette="washi"></lib-color-scale></KitchenItem>

    <KitchenItem name="lib-content-pillar">
      <lib-content-pillar title="Pillar" style="min-width: 220px">Body content</lib-content-pillar>
    </KitchenItem>

    <KitchenItem name="lib-tooltip">
      <lib-tooltip content="Tooltip text"><lib-button variant="ghost">hover me</lib-button></lib-tooltip>
    </KitchenItem>

    <KitchenItem name="lib-accordion-item" note="contexto: hereda del padre lib-accordion">
      <lib-accordion-item label="¿Qué es Katachi?" style="min-width: 260px">
        <p>Sistema de contextos estéticos del ecosistema Shibui.</p>
      </lib-accordion-item>
    </KitchenItem>

    <KitchenItem name="lib-step">
      <lib-step index="1" label="Plan"></lib-step>
      <lib-step index="2" label="Build" active></lib-step>
      <lib-step index="3" label="Ship"></lib-step>
    </KitchenItem>

    <KitchenItem name="lib-bento-item">
      <lib-bento-item style="min-width: 160px; min-height: 80px">
        <p style="padding: var(--lib-space-sm); margin: 0">bento item</p>
      </lib-bento-item>
    </KitchenItem>

    <KitchenItem name="lib-aspect-ratio">
      <lib-aspect-ratio ratio="16/9" style="width: 240px; background: var(--bg-elevated)">
        <div style="padding: var(--lib-space-sm)">16/9</div>
      </lib-aspect-ratio>
    </KitchenItem>

    <KitchenItem name="lib-select-option" note="standalone option (uso normal: dentro de lib-select)">
      <lib-select-option value="x" label="Option X"></lib-select-option>
    </KitchenItem>

    <KitchenItem name="lib-visually-hidden" note="a11y — invisible visualmente">
      <span style="color: var(--text-muted); font-style: italic">(skip-link declarado pero no visible)</span>
      <lib-visually-hidden>Skip to main content</lib-visually-hidden>
    </KitchenItem>

    <KitchenItem name="lib-ripple" note="overlay effect — hover/click el botón">
      <div style="position: relative; display: inline-block">
        <lib-button variant="primary">click ripple</lib-button>
        <lib-ripple></lib-ripple>
      </div>
    </KitchenItem>

    <KitchenItem name="lib-magnetic" note="effect — hover acerca el cursor">
      <lib-magnetic strength="0.4"><lib-button variant="ghost">magnetic</lib-button></lib-magnetic>
    </KitchenItem>

    <KitchenItem name="lib-reading-progress" note="effect — barra al top de la ventana">
      <lib-reading-progress></lib-reading-progress>
      <small style="color: var(--text-muted)">activa, scrollea para ver</small>
    </KitchenItem>

    <KitchenItem name="lib-background" note="producer — variante washi como demo">
      <div style="position: relative; width: 100%; min-height: 80px; overflow: hidden; border: 1px solid var(--border-subtle)">
        <lib-background variant="washi-grain"></lib-background>
      </div>
    </KitchenItem>

  </div>
</section>

<style>
  .section { display: flex; flex-direction: column; gap: var(--lib-space-lg); }
  h2 { color: var(--text-primary); border-bottom: 1px solid var(--border-default); padding-bottom: var(--lib-space-xs); margin: 0; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--lib-space-md); }
</style>
