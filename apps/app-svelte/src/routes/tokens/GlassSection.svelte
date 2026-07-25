<script lang="ts">
  import type { DesignTokenDto } from '../../lib/api/tokens';
  import TokenSection from './TokenSection.svelte';
  import TokenRow from './TokenRow.svelte';
  import SubHeader from './SubHeader.svelte';
  import DataStatus from './DataStatus.svelte';

  interface Props {
    tokens: DesignTokenDto[];
    loading: boolean;
    error: string | null;
  }
  let { tokens, loading, error }: Props = $props();

  const CONTROL_NAMES = new Set([
    'lib-glass-blur-amount', 'lib-glass-saturate-amount', 'lib-glass-bg-opacity',
    'lib-glass-border-opacity', 'lib-glass-shadow-opacity', 'lib-glass-shine-start',
    'lib-glass-shine-end',
  ]);
  const COMPOSITE_NAMES = new Set([
    'lib-glass-bg', 'lib-glass-bg-water', 'lib-glass-bg-kaki', 'lib-glass-filter',
    'lib-glass-border', 'lib-glass-shadow', 'lib-glass-shadow-hover', 'lib-glass-shine',
    'lib-glass-text', 'lib-glass-text-shadow',
  ]);

  const VARIANTS = [
    { label: 'default', bg: 'oklch(98% 0.01 60deg / 0.15)' },
    { label: 'water',   bg: 'oklch(55% 0.06 210deg / 0.15)' },
    { label: 'kaki',    bg: 'oklch(45% 0.05 45deg / 0.15)' },
  ];

  let controls = $derived(tokens.filter((t) => CONTROL_NAMES.has(t.name)));
  let composites = $derived(tokens.filter((t) => COMPOSITE_NAMES.has(t.name)));
  let presets = $derived(
    tokens.filter((t) => !CONTROL_NAMES.has(t.name) && !COMPOSITE_NAMES.has(t.name))
  );
</script>

<TokenSection
  id="glass"
  eyebrow="glass"
  title="Efecto"
  accent="glass"
  description="Variables que controlan blur, saturación, opacidad de fondo y borde del efecto glassmorphism. En el katachi sabi están apagadas: el papel no refleja."
>
  <DataStatus {loading} {error} />

  {#if tokens.length > 0}
    <div class="preview">
      <span class="orb orb--a"></span>
      <span class="orb orb--b"></span>
      {#each VARIANTS as variant, i (variant.label)}
        <span class="pane" style="left:{12 + i * 29}%;background:{variant.bg};">
          <span class="pane-label">{variant.label}</span>
        </span>
      {/each}
    </div>

    <SubHeader label="Controles primitivos" first />
    {#each controls as token (token.id)}<TokenRow {token} />{/each}

    <SubHeader label="Tokens compuestos" />
    {#each composites as token (token.id)}<TokenRow {token} />{/each}

    <SubHeader label="Presets de intensidad" />
    {#each presets as token (token.id)}<TokenRow {token} />{/each}
  {/if}
</TokenSection>

<style>
  .preview {
    position: relative;
    height: 110px;
    background: linear-gradient(
      135deg,
      var(--color-celadon-400),
      var(--color-celadon-300) 50%,
      var(--color-celadon-600)
    );
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    display: block;
  }
  .orb--a {
    width: 90px;
    height: 90px;
    background: var(--text-accent);
    top: -20px;
    left: 8%;
    filter: blur(24px);
    opacity: 0.5;
  }
  .orb--b {
    width: 70px;
    height: 70px;
    background: var(--color-celadon-300);
    bottom: -15px;
    right: 15%;
    filter: blur(18px);
    opacity: 0.45;
  }

  .pane {
    position: absolute;
    top: 18%;
    width: 23%;
    height: 64%;
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    border: 1px solid oklch(100% 0 0deg / 0.2);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 0.35rem;
  }

  .pane-label {
    font-family: var(--lib-font-mono);
    font-size: 0.55rem;
    color: oklch(95% 0 0deg / 0.8);
    letter-spacing: 0.1em;
  }
</style>
