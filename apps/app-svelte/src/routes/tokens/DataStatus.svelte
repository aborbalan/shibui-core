<script lang="ts">
  interface Props { loading: boolean; error: string | null }
  let { loading, error }: Props = $props();
</script>

{#if loading}
  <lib-skeleton style="width:180px;height:12px"></lib-skeleton>
{:else if error}
  <span class="error">Error: {error}</span>
{/if}

<style>
  .error {
    font-family: var(--lib-font-mono);
    font-size: 0.72rem;
    color: var(--color-error);
  }
</style>
