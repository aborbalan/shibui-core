<script lang="ts">
  import type { DesignTokenDto } from '../../lib/api/tokens';
  import { libProps } from '../../lib/lib-props';
  import TokenSection from './TokenSection.svelte';
  import TokenRow from './TokenRow.svelte';
  import SubHeader from './SubHeader.svelte';
  import DataStatus from './DataStatus.svelte';

  interface Props {
    primitives: DesignTokenDto[];
    semantic: DesignTokenDto[];
    loading: boolean;
    error: string | null;
  }
  let { primitives, semantic, loading, error }: Props = $props();

  const PALETTES = ['washi', 'kaki', 'celadon', 'ink'] as const;
  type PaletteName = (typeof PALETTES)[number];

  const SEMANTIC_GROUPS = ['Marca', 'Alias componentes', 'Estados', 'Fondos', 'Texto', 'Bordes', 'Otros'];

  function paletteOf(name: string): PaletteName | null {
    return PALETTES.find((p) => name.startsWith(`color-${p}`)) ?? null;
  }

  function semanticGroupOf(name: string): string {
    if (name.startsWith('lib-shibui-')) return 'Marca';
    if (name.startsWith('lib-color-')) return 'Alias componentes';
    if (/^color-(error|warning|success|info)/.test(name) || name === 'color-white') return 'Estados';
    if (name.startsWith('bg-')) return 'Fondos';
    if (name.startsWith('text-')) return 'Texto';
    if (name.startsWith('border-')) return 'Bordes';
    return 'Otros';
  }

  /** Escalas listas para `lib-color-scale`, en el orden canónico de paletas. */
  let scales = $derived(
    PALETTES.map((palette) => ({
      palette,
      steps: primitives
        .filter((t) => paletteOf(t.name) === palette)
        .map((t) => ({
          step: Number.parseInt(t.name.split('-').pop() ?? '0', 10),
          hex: `var(${t.cssVar})`,
          oklch: t.value,
        })),
    })).filter((s) => s.steps.length > 0)
  );

  let semanticGroups = $derived(
    SEMANTIC_GROUPS.map((group) => ({
      group,
      tokens: semantic.filter((t) => semanticGroupOf(t.name) === group),
    })).filter((g) => g.tokens.length > 0)
  );
</script>

<TokenSection
  id="colores"
  eyebrow="color-primitive · color-semantic"
  title="Paletas &"
  accent="semántica"
  description="Primitivos OKLCH (washi, kaki, celadon, ink) y alias semánticos de fondo, texto y borde con soporte dark mode."
>
  <SubHeader label="Color Primitive" first />
  <DataStatus {loading} {error} />

  {#each scales as scale (scale.palette)}
    <div class="scale">
      <lib-color-scale name={scale.palette} use:libProps={{ steps: scale.steps }}></lib-color-scale>
    </div>
  {/each}

  <SubHeader label="Color Semantic" />
  <DataStatus {loading} {error} />

  {#each semanticGroups as { group, tokens }, i (group)}
    <div class="group" class:group--first={i === 0}>
      <p class="group-label">{group}</p>
      {#each tokens as token (token.id)}
        <TokenRow {token}>
          {#snippet preview()}
            <span class="swatch" style="background:var({token.cssVar});"></span>
          {/snippet}
        </TokenRow>
      {/each}
    </div>
  {/each}
</TokenSection>

<style>
  .scale {
    margin-bottom: 1.5rem;
  }

  .group {
    border-top: 1px solid var(--border-subtle);
  }
  .group--first {
    border-top: none;
  }

  .group-label {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 0.75rem 0 0.5rem;
    margin: 0;
  }

  .swatch {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-default);
    flex-shrink: 0;
  }
</style>
