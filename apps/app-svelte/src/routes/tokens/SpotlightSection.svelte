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
    'lib-spotlight-opacity', 'lib-spotlight-feather',
    'lib-spotlight-x', 'lib-spotlight-y', 'lib-spotlight-transition',
  ]);

  const PREVIEWS = [
    { label: 'kaki',  gradient: 'radial-gradient(circle at 50% 50%, oklch(45% 0.05 45deg / 0.55) 0%, oklch(45% 0.05 45deg / 0) 60%)' },
    { label: 'water', gradient: 'radial-gradient(circle at 50% 50%, oklch(55% 0.06 210deg / 0.55) 0%, oklch(55% 0.06 210deg / 0) 60%)' },
    { label: 'white', gradient: 'radial-gradient(circle at 50% 50%, oklch(100% 0 0deg / 0.35) 0%, oklch(100% 0 0deg / 0) 60%)' },
  ];

  let controls = $derived(tokens.filter((t) => CONTROL_NAMES.has(t.name)));
  let gradients = $derived(tokens.filter((t) => t.name.startsWith('lib-spotlight-gradient')));
  let texture = $derived(
    tokens.filter((t) => t.name.startsWith('lib-metal') || t.name === 'lib-kintsugi-border')
  );
</script>

<TokenSection
  id="spotlight"
  eyebrow="spotlight"
  title="Efecto"
  accent="spotlight"
  description="Gradiente radial dinámico que sigue el cursor. Controla opacidad, feather y variantes de color. También apagado bajo sabi."
>
  <DataStatus {loading} {error} />

  {#if tokens.length > 0}
    <div class="previews">
      {#each PREVIEWS as preview (preview.label)}
        <span class="preview" style="background-image:{preview.gradient};">
          <span class="preview-label">{preview.label}</span>
        </span>
      {/each}
    </div>

    <SubHeader label="Controles" first />
    {#each controls as token (token.id)}<TokenRow {token} />{/each}

    <SubHeader label="Gradientes" />
    {#each gradients as token (token.id)}<TokenRow {token} />{/each}

    <SubHeader label="Textura & borde" />
    {#each texture as token (token.id)}<TokenRow {token} />{/each}
  {/if}
</TokenSection>

<style>
  .previews {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .preview {
    flex: 1;
    height: 80px;
    background-color: var(--color-washi-900);
    border: 1px solid var(--border-default);
    display: flex;
    align-items: flex-end;
    padding: 0.5rem 0.6rem;
  }

  .preview-label {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    color: var(--color-washi-300);
    letter-spacing: 0.1em;
  }
</style>
