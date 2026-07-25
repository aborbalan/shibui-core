<script lang="ts">
  import type { DesignTokenDto } from '../../lib/api/tokens';
  import TokenSection from './TokenSection.svelte';
  import DataStatus from './DataStatus.svelte';

  interface Props {
    tokens: DesignTokenDto[];
    loading: boolean;
    error: string | null;
  }
  let { tokens, loading, error }: Props = $props();

  const MAX_Z = 400;

  let rows = $derived(
    tokens.map((token) => {
      const z = Number.parseInt(token.value, 10) || 0;
      return { token, pct: Math.max((z / MAX_Z) * 100, 1) };
    })
  );
</script>

<TokenSection
  id="z-index"
  eyebrow="z-index"
  title="Capas de"
  accent="apilamiento"
  description="Seis niveles desde base (0) hasta tooltip (400) para gestionar la pila de renderizado."
>
  <DataStatus {loading} {error} />

  {#each rows as { token, pct } (token.id)}
    <div class="row">
      <code class="var">{token.cssVar}</code>
      <code class="value">{token.value}</code>
      <span class="track">
        <span class="fill" style="width:{pct}%;"></span>
      </span>
      <span class="desc">{token.description}</span>
    </div>
  {/each}
</TokenSection>

<style>
  .row {
    display: grid;
    grid-template-columns: 120px 52px 180px 1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.65rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .var {
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    color: var(--text-accent);
  }

  .value {
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    color: var(--text-secondary);
  }

  .track {
    height: 6px;
    background: var(--border-subtle);
    overflow: hidden;
    display: block;
  }

  .fill {
    height: 100%;
    display: block;
    background: var(--text-accent);
  }

  .desc {
    font-family: var(--lib-font-body);
    font-size: 0.75rem;
    color: var(--text-muted);
  }
</style>
