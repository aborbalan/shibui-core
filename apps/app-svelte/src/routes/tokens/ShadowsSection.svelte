<script lang="ts">
  import type { DesignTokenDto } from '../../lib/api/tokens';
  import TokenSection from './TokenSection.svelte';
  import TokenRow from './TokenRow.svelte';
  import DataStatus from './DataStatus.svelte';

  interface Props {
    tokens: DesignTokenDto[];
    loading: boolean;
    error: string | null;
  }
  let { tokens, loading, error }: Props = $props();
</script>

<TokenSection
  id="sombras"
  eyebrow="shadow"
  title="Escala de"
  accent="sombras"
  description="Cuatro niveles (sm → xl) basados en ink con opacidades variables para light y dark mode."
>
  <DataStatus {loading} {error} />

  {#each tokens as token (token.id)}
    <TokenRow {token}>
      {#snippet preview()}
        <span class="shadow-box" style="box-shadow:{token.value};"></span>
      {/snippet}
    </TokenRow>
  {/each}
</TokenSection>

<style>
  .shadow-box {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
  }
</style>
