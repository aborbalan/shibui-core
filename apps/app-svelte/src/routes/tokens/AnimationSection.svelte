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

  let durations = $derived(tokens.filter((t) => t.name.startsWith('duration-')));
  let easings = $derived(tokens.filter((t) => t.name.startsWith('ease-')));
</script>

<TokenSection
  id="motion"
  eyebrow="animation"
  title="Duración &"
  accent="easing"
  description="Cuatro duraciones (fast → slower) y cuatro curvas de bezier para motion consistente."
>
  <DataStatus {loading} {error} />

  {#if durations.length > 0}
    <SubHeader label="Duraciones" first />
    {#each durations as token (token.id)}
      <div class="row">
        <code class="var">{token.cssVar}</code>
        <div class="demo">
          <span class="track">
            <span class="dot" style="animation-duration:{token.value};"></span>
          </span>
          <code class="value">{token.value}</code>
        </div>
        <span class="desc">{token.description}</span>
      </div>
    {/each}
  {/if}

  {#if easings.length > 0}
    <SubHeader label="Curvas de easing" />
    {#each easings as token (token.id)}
      <TokenRow {token} />
    {/each}
  {/if}
</TokenSection>

<style>
  .row {
    display: grid;
    grid-template-columns: 160px 1fr 2fr;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .var {
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    color: var(--text-accent);
  }

  .demo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .track {
    width: 80px;
    height: 8px;
    position: relative;
    display: block;
  }

  .dot {
    position: absolute;
    top: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-accent);
    animation-name: tk-slide;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-iteration-count: infinite;
  }

  .value {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    color: var(--text-secondary);
  }

  .desc {
    font-family: var(--lib-font-body);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  @keyframes tk-slide {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(72px); }
  }
</style>
