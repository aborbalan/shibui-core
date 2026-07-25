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

  const MAX_PX = 32;
  const BAR_MAX = 180;

  /** El px real vive en la descripción del token («…— 8px»). */
  function extractPx(description: string): number {
    const match = description.match(/(\d+)px/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  let rows = $derived(
    tokens.map((token) => {
      const px = extractPx(token.description);
      return {
        token,
        px,
        barWidth: px > 0 ? Math.max((px / MAX_PX) * BAR_MAX, 4) : 4,
      };
    })
  );
</script>

<TokenSection
  id="espaciado"
  eyebrow="spacing"
  title="Escala de"
  accent="espaciado"
  description="Unidad base de 0.25 rem con escala multiplicativa: xs → xl."
>
  <DataStatus {loading} {error} />

  {#each rows as { token, px, barWidth } (token.id)}
    <div class="row">
      <code class="var">{token.cssVar}</code>
      <div class="bar-cell">
        <span class="bar" style="width:{barWidth}px;"></span>
        <code class="value">{px > 0 ? `${px}px` : token.value}</code>
      </div>
      <span class="desc">{token.description}</span>
    </div>
  {/each}
</TokenSection>

<style>
  .row {
    display: grid;
    grid-template-columns: 190px 220px 1fr;
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

  .bar-cell {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .bar {
    height: 18px;
    background: var(--text-accent);
    opacity: 0.65;
    flex-shrink: 0;
  }

  .value {
    font-family: var(--lib-font-mono);
    font-size: 0.63rem;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .desc {
    font-family: var(--lib-font-body);
    font-size: 0.75rem;
    color: var(--text-muted);
  }
</style>
