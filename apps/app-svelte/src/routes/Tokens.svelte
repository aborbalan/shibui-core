<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getAllTokens,
    groupByCategory,
    type DesignTokenDto,
    type TokenCategory,
  } from '../lib/api/tokens';
  import TokensSidebar from './tokens/TokensSidebar.svelte';
  import ColorsSection from './tokens/ColorsSection.svelte';
  import TypographySection from './tokens/TypographySection.svelte';
  import SpacingSection from './tokens/SpacingSection.svelte';
  import RadiusSection from './tokens/RadiusSection.svelte';
  import ShadowsSection from './tokens/ShadowsSection.svelte';
  import AnimationSection from './tokens/AnimationSection.svelte';
  import ZIndexSection from './tokens/ZIndexSection.svelte';
  import GlassSection from './tokens/GlassSection.svelte';
  import SpotlightSection from './tokens/SpotlightSection.svelte';

  let tokens = $state<DesignTokenDto[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  /* Una sola llamada al catálogo completo; cada sección filtra lo suyo. */
  onMount(async () => {
    try {
      tokens = await getAllTokens();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error al cargar los tokens';
    } finally {
      loading = false;
    }
  });

  let byCategory = $derived(groupByCategory(tokens));

  function of(category: TokenCategory): DesignTokenDto[] {
    return byCategory[category] ?? [];
  }
</script>

<div class="tokens-layout">
  <TokensSidebar />

  <main class="tokens-main">
    <div class="page-header">
      <lib-display-heading
        tag="h1"
        size="md"
        surface="light"
        line1="Design"
        accent="tokens"
        description="Variables CSS que codifican cada decisión de diseño del sistema. Servidas desde la API de Shibui — la misma fuente que consumen los showcases de React y Angular."
      ></lib-display-heading>
    </div>

    <ColorsSection
      primitives={of('color-primitive')}
      semantic={of('color-semantic')}
      {loading}
      {error}
    />
    <TypographySection tokens={of('typography')} {loading} {error} />
    <SpacingSection tokens={of('spacing')} {loading} {error} />
    <RadiusSection tokens={of('radius')} {loading} {error} />
    <ShadowsSection tokens={of('shadow')} {loading} {error} />
    <AnimationSection tokens={of('animation')} {loading} {error} />
    <ZIndexSection tokens={of('z-index')} {loading} {error} />
    <GlassSection tokens={of('glass')} {loading} {error} />
    <SpotlightSection tokens={of('spotlight')} {loading} {error} />
  </main>
</div>

<style>
  .tokens-layout {
    display: flex;
    min-height: calc(100vh - 80px);
    padding-top: 80px;
  }

  .tokens-main {
    flex: 1;
    min-width: 0;
    padding: 3rem clamp(1.5rem, 4vw, 3.5rem) 6rem;
    max-width: 1080px;
  }

  .page-header {
    margin-bottom: 4rem;
  }
</style>
