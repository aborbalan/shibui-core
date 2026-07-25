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

  let families = $derived(
    tokens.filter(
      (t) =>
        t.name.startsWith('lib-font-') &&
        !t.name.includes('family-base') &&
        !t.name.includes('size-base')
    )
  );
  let sizes = $derived(tokens.filter((t) => t.name.startsWith('text-')));
  let weights = $derived(tokens.filter((t) => t.name.startsWith('weight-')));
  let leading = $derived(tokens.filter((t) => t.name.startsWith('leading-')));
  let tracking = $derived(tokens.filter((t) => t.name.startsWith('tracking-')));
  let libTokens = $derived(
    tokens.filter((t) => t.name.startsWith('lib-') && !t.name.startsWith('lib-font-'))
  );
</script>

<TokenSection
  id="tipografia"
  eyebrow="typography"
  title="Escala"
  accent="tipográfica"
  description="Familias (display, body, mono), escala de tamaños, pesos, tracking y leading."
>
  <DataStatus {loading} {error} />

  {#if families.length > 0}
    <SubHeader label="Familias tipográficas" first />
    <div class="families">
      {#each families as token (token.id)}
        <div class="family-card">
          <div class="family-sample" style="font-family:{token.value};">El zorro ágil</div>
          <code class="family-var">{token.cssVar}</code>
          <p class="family-desc">{token.description}</p>
        </div>
      {/each}
    </div>
  {/if}

  {#if sizes.length > 0}
    <SubHeader label="Escala de tamaños" />
    {#each sizes as token (token.id)}
      <div class="grid grid--size">
        <code class="var">{token.cssVar}</code>
        <code class="value">{token.value}</code>
        <span class="sample-display" style="font-size:{token.value};">Texto</span>
      </div>
    {/each}
  {/if}

  {#if weights.length > 0}
    <SubHeader label="Pesos tipográficos" />
    {#each weights as token (token.id)}
      <div class="grid grid--weight">
        <code class="var">{token.cssVar}</code>
        <code class="value">{token.value}</code>
        <span class="sample-body" style="font-weight:{token.value};">
          El zorro ágil salta sobre el muro
        </span>
      </div>
    {/each}
  {/if}

  {#if leading.length > 0}
    <SubHeader label="Interlineado (leading)" />
    {#each leading as token (token.id)}
      <div class="grid grid--weight">
        <code class="var">{token.cssVar}</code>
        <code class="value">{token.value}</code>
        <p class="sample-leading" style="line-height:{token.value};">
          {token.description}. Texto de muestra para visualizar el interlineado aplicado a un
          párrafo corto.
        </p>
      </div>
    {/each}
  {/if}

  {#if tracking.length > 0}
    <SubHeader label="Espaciado de letras (tracking)" />
    {#each tracking as token (token.id)}
      <div class="grid grid--tracking">
        <code class="var">{token.cssVar}</code>
        <code class="value">{token.value}</code>
        <span class="sample-tracking" style="letter-spacing:{token.value};">SHIBUI</span>
      </div>
    {/each}
  {/if}

  {#if libTokens.length > 0}
    <SubHeader label="Tokens de componentes (lib)" />
    {#each libTokens as token (token.id)}
      <TokenRow {token} />
    {/each}
  {/if}
</TokenSection>

<style>
  .families {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .family-card {
    padding: 1.25rem;
    border: 1px solid var(--border-subtle);
    background: var(--bg-elevated);
  }
  .family-sample {
    font-size: 1.4rem;
    font-weight: var(--weight-light);
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }
  .family-var {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-accent);
  }
  .family-desc {
    font-family: var(--lib-font-body);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin: 0.25rem 0 0;
  }

  .grid {
    display: grid;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .grid--size { grid-template-columns: 130px 80px 1fr; }
  .grid--weight { grid-template-columns: 150px 60px 1fr; }
  .grid--tracking { grid-template-columns: 160px 80px 1fr; }

  .var {
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    color: var(--text-accent);
  }
  .value {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    color: var(--text-secondary);
  }

  .sample-display {
    font-family: var(--lib-font-display);
    font-weight: var(--weight-light);
    color: var(--text-primary);
    line-height: 1;
    overflow: hidden;
    max-height: 2.5em;
  }
  .sample-body {
    font-family: var(--lib-font-body);
    font-size: 1rem;
    color: var(--text-primary);
    line-height: 1;
  }
  .sample-leading {
    font-family: var(--lib-font-body);
    font-size: 0.75rem;
    color: var(--text-secondary);
    max-width: 320px;
    margin: 0;
  }
  .sample-tracking {
    font-family: var(--lib-font-body);
    font-size: 0.85rem;
    color: var(--text-primary);
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .families {
      grid-template-columns: 1fr;
    }
  }
</style>
