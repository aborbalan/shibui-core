<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from './router';

  let headerEl: HTMLElement | null = $state(null);

  const LINKS = [
    { id: 'componentes', label: 'Componentes', href: '#/componentes' },
    { id: 'tokens',      label: 'Tokens',      href: '#/tokens'      },
    { id: 'filosofia',   label: 'Filosofía',   href: '#/filosofia'   },
    { id: 'about',       label: 'Sobre mí',    href: '#/about'       },
  ];

  const ACTIONS = [
    { label: 'Empezar →', href: '#/componentes', variant: 'kintsugi' },
  ];

  onMount(async () => {
    if (!headerEl) return;
    await customElements.whenDefined('lib-header');
    (headerEl as any).links   = LINKS;
    (headerEl as any).actions = ACTIONS;
  });
</script>

<lib-header
  bind:this={headerEl}
  variant="kintsugi"
  logo-mark="渋"
  brand-name="shibui"
  logo-href="#/"
  style="position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-overlay);"
></lib-header>
