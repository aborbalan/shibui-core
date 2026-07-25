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

  let baseRadii = $derived(tokens.filter((t) => t.name.startsWith('radius-')));
  let libRadii = $derived(tokens.filter((t) => t.name.startsWith('lib-radius-')));
</script>

<TokenSection
  id="radio"
  eyebrow="radius"
  title="Border"
  accent="radius"
  description="De none (0) a full (9999px). Los tokens lib- son los usados internamente por los componentes."
>
  <DataStatus {loading} {error} />

  {#if baseRadii.length > 0}
    <SubHeader label="Escala de radio" first />
    <div class="radii">
      {#each baseRadii as token (token.id)}
        <div class="radius-item">
          <span class="radius-box" style="border-radius:{token.value};"></span>
          <code class="radius-name">{token.name.replace('radius-', '')}</code>
          <code class="radius-value">{token.value}</code>
        </div>
      {/each}
    </div>
  {/if}

  {#if libRadii.length > 0}
    <SubHeader label="Tokens de componentes (lib)" />
    {#each libRadii as token (token.id)}
      <TokenRow {token}>
        {#snippet preview()}
          <span class="radius-chip" style="border-radius:{token.value};"></span>
        {/snippet}
      </TokenRow>
    {/each}
  {/if}
</TokenSection>

<style>
  .radii {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .radius-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .radius-box {
    width: 80px;
    height: 56px;
    background: color-mix(in oklch, var(--text-accent) 25%, transparent);
    border: 1.5px solid color-mix(in oklch, var(--text-accent) 35%, transparent);
  }

  .radius-chip {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: color-mix(in oklch, var(--text-accent) 25%, transparent);
    border: 1.5px solid color-mix(in oklch, var(--text-accent) 35%, transparent);
  }

  .radius-name {
    font-family: var(--lib-font-mono);
    font-size: 0.62rem;
    color: var(--text-accent);
  }

  .radius-value {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    color: var(--text-muted);
  }
</style>
