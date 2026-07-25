<script module lang="ts">
  /** Tags de átomo con preview propia — el resto cae al placeholder. */
  export const ATOM_PREVIEW_TAGS = [
    'lib-accordion-item', 'lib-aspect-ratio', 'lib-avatar', 'lib-background',
    'lib-badge', 'lib-bento-item', 'lib-burger', 'lib-button', 'lib-button-liquid',
    'lib-card', 'lib-checkbox', 'lib-close-button', 'lib-code-block',
    'lib-color-scale', 'lib-component-grid', 'lib-content-pillar', 'lib-copy-button',
    'lib-counter', 'lib-display-heading', 'lib-divider', 'lib-eyebrow',
    'lib-glass-card', 'lib-icon', 'lib-kbd', 'lib-label', 'lib-progress',
    'lib-progress-circle', 'lib-quote', 'lib-radio', 'lib-rating',
    'lib-select-option', 'lib-skeleton', 'lib-sparkline', 'lib-spinner',
    'lib-spotlight-card', 'lib-status-dot', 'lib-step', 'lib-switch',
    'lib-text-glitch', 'lib-text-list', 'lib-tooltip',
  ];
</script>

<script lang="ts">
  import { libProps } from '../../lib/lib-props';

  interface Props { tag: string }
  let { tag }: Props = $props();

  const COLOR_STEPS = [
    { step: 100, hex: '#f5f1e8' },
    { step: 300, hex: '#e0d8c3' },
    { step: 500, hex: '#b8ab8a' },
    { step: 700, hex: '#7d7156' },
    { step: 900, hex: '#3f3a2c' },
  ];
</script>

<!--
  Previews compactas de átomos. Una variante representativa por componente —
  el espectro completo vive en el KitchenSink (/admin/kitchen-sink).
-->
{#if tag === 'lib-accordion-item'}
  <lib-accordion-item label="¿Qué es Katachi?" style="min-width:200px">
    <p style="margin:0">Contextos estéticos de Shibui.</p>
  </lib-accordion-item>

{:else if tag === 'lib-aspect-ratio'}
  <lib-aspect-ratio ratio="16/9" style="width:150px;background:var(--bg-elevated)">
    <div class="ratio-label">16/9</div>
  </lib-aspect-ratio>

{:else if tag === 'lib-avatar'}
  <div class="row">
    <lib-avatar name="Shi Bui"></lib-avatar>
    <lib-avatar shape="squircle" tint="warm" name="Ka Ki"></lib-avatar>
    <lib-avatar shape="square" tint="cool" name="Wa Bi"></lib-avatar>
  </div>

{:else if tag === 'lib-background'}
  <div class="bg-frame">
    <lib-background theme="washi-grain"></lib-background>
  </div>

{:else if tag === 'lib-badge'}
  <div class="row">
    <lib-badge tone="accent">accent</lib-badge>
    <lib-badge tone="success" pill>pill</lib-badge>
    <lib-badge tone="info" dot>dot</lib-badge>
  </div>

{:else if tag === 'lib-bento-item'}
  <lib-bento-item style="min-width:150px;min-height:70px">
    <p style="padding:var(--lib-space-sm);margin:0">bento item</p>
  </lib-bento-item>

{:else if tag === 'lib-burger'}
  <div class="row">
    <lib-burger theme="filled"></lib-burger>
    <lib-burger theme="framed"></lib-burger>
  </div>

{:else if tag === 'lib-button'}
  <div class="row">
    <lib-button variant="solid">Solid</lib-button>
    <lib-button variant="outlined">Outlined</lib-button>
  </div>

{:else if tag === 'lib-button-liquid'}
  <lib-button-liquid>Liquid</lib-button-liquid>

{:else if tag === 'lib-card'}
  <lib-card style="padding:var(--lib-space-md);min-width:150px">
    <p style="margin:0">Card body</p>
  </lib-card>

{:else if tag === 'lib-checkbox'}
  <div class="row row--center">
    <lib-checkbox tone="accent" checked></lib-checkbox>
    <lib-checkbox tone="default" label="Label" sublabel="Sublabel"></lib-checkbox>
  </div>

{:else if tag === 'lib-close-button'}
  <lib-close-button></lib-close-button>

{:else if tag === 'lib-code-block'}
  <lib-code-block language="ts" style="min-width:210px">const k: KatachiId = 'sabi';</lib-code-block>

{:else if tag === 'lib-color-scale'}
  <lib-color-scale
    name="washi"
    style="max-width:100%"
    use:libProps={{ steps: COLOR_STEPS, showLabels: false }}
  ></lib-color-scale>

{:else if tag === 'lib-component-grid'}
  <lib-component-grid transparent style="width:230px">
    <lib-card style="padding:var(--lib-space-sm)"><p style="margin:0;font-size:0.75rem">A</p></lib-card>
    <lib-card style="padding:var(--lib-space-sm)"><p style="margin:0;font-size:0.75rem">B</p></lib-card>
  </lib-component-grid>

{:else if tag === 'lib-content-pillar'}
  <lib-content-pillar title="Pillar" style="min-width:180px">Body content</lib-content-pillar>

{:else if tag === 'lib-copy-button'}
  <lib-copy-button text="hello-world"></lib-copy-button>

{:else if tag === 'lib-counter'}
  <lib-counter value="1234"></lib-counter>

{:else if tag === 'lib-display-heading'}
  <div style="transform:scale(0.55)">
    <lib-display-heading tag="h2" size="sm" line1="Librería de" accent="componentes"></lib-display-heading>
  </div>

{:else if tag === 'lib-divider'}
  <div class="col" style="width:170px">
    <lib-divider></lib-divider>
    <lib-divider style-variant="dashed"></lib-divider>
  </div>

{:else if tag === 'lib-eyebrow'}
  <lib-eyebrow>Eyebrow text</lib-eyebrow>

{:else if tag === 'lib-glass-card'}
  <div class="glass-frame">
    <lib-glass-card style="padding:var(--lib-space-md);min-width:140px">
      <p style="margin:0">Glass</p>
    </lib-glass-card>
  </div>

{:else if tag === 'lib-icon'}
  <div class="row">
    <lib-icon name="house" size="lg"></lib-icon>
    <lib-icon name="arrow-right" size="lg"></lib-icon>
    <lib-icon name="check-circle" size="lg"></lib-icon>
  </div>

{:else if tag === 'lib-kbd'}
  <div class="row row--tight">
    <lib-kbd>⌘</lib-kbd>
    <lib-kbd>K</lib-kbd>
  </div>

{:else if tag === 'lib-label'}
  <lib-label>Plain label</lib-label>

{:else if tag === 'lib-progress'}
  <lib-progress value="60" style="width:170px"></lib-progress>

{:else if tag === 'lib-progress-circle'}
  <lib-progress-circle value="60"></lib-progress-circle>

{:else if tag === 'lib-quote'}
  <lib-quote author="Tanizaki" style="max-width:230px">Beauty lives in the shadows.</lib-quote>

{:else if tag === 'lib-radio'}
  <div class="col">
    <lib-radio name="preview-radio" value="a" label="Opción A" checked></lib-radio>
    <lib-radio name="preview-radio" value="b" label="Opción B"></lib-radio>
  </div>

{:else if tag === 'lib-rating'}
  <lib-rating value="3.5" max="5" aria-label="Valoración de ejemplo"></lib-rating>

{:else if tag === 'lib-select-option'}
  <lib-select-option value="x" label="Option X"></lib-select-option>

{:else if tag === 'lib-skeleton'}
  <div class="col">
    <lib-skeleton style="width:180px;height:12px"></lib-skeleton>
    <lib-skeleton style="width:120px;height:12px"></lib-skeleton>
  </div>

{:else if tag === 'lib-sparkline'}
  <lib-sparkline
    tone="accent"
    show-end-dot
    use:libProps={{ values: [4, 8, 6, 10, 7, 12], width: 140, height: 36 }}
  ></lib-sparkline>

{:else if tag === 'lib-spinner'}
  <lib-spinner size="lg"></lib-spinner>

{:else if tag === 'lib-spotlight-card'}
  <lib-spotlight-card style="padding:var(--lib-space-md);min-width:160px">
    <p style="margin:0">Spotlight</p>
  </lib-spotlight-card>

{:else if tag === 'lib-status-dot'}
  <div class="row">
    <lib-status-dot status="online"></lib-status-dot>
    <lib-status-dot status="busy"></lib-status-dot>
    <lib-status-dot status="offline"></lib-status-dot>
  </div>

{:else if tag === 'lib-step'}
  <div class="row">
    <lib-step index="1" label="Plan"></lib-step>
    <lib-step index="2" label="Build" active></lib-step>
  </div>

{:else if tag === 'lib-switch'}
  <div class="row">
    <lib-switch checked></lib-switch>
    <lib-switch></lib-switch>
  </div>

{:else if tag === 'lib-text-glitch'}
  <lib-text-glitch text="SHIBUI" active></lib-text-glitch>

{:else if tag === 'lib-text-list'}
  <lib-text-list>
    <li>Wabi</li>
    <li>Sabi</li>
    <li>Kintsugi</li>
  </lib-text-list>

{:else if tag === 'lib-tooltip'}
  <lib-tooltip content="Tooltip text">
    <lib-button variant="ghost">Hover me</lib-button>
  </lib-tooltip>
{/if}

<style>
  .row {
    display: flex;
    gap: var(--lib-space-sm);
  }
  .row--center {
    align-items: center;
    gap: var(--lib-space-md);
  }
  .row--tight {
    gap: var(--lib-space-xs);
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-sm);
  }
  .ratio-label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: var(--lib-font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
  }
  .bg-frame {
    position: relative;
    width: 100%;
    height: 96px;
    overflow: hidden;
    border: 1px dashed var(--border-default);
  }
  .glass-frame {
    background: linear-gradient(135deg, var(--bg-elevated), var(--text-accent));
    padding: var(--lib-space-md);
    border-radius: 8px;
  }
</style>
