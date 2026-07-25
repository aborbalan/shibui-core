<script lang="ts">
  import { onMount } from 'svelte';

  const SECTIONS = [
    { id: 'colores',    label: 'Color'      },
    { id: 'tipografia', label: 'Tipografía' },
    { id: 'espaciado',  label: 'Espaciado'  },
    { id: 'radio',      label: 'Radio'      },
    { id: 'sombras',    label: 'Sombras'    },
    { id: 'motion',     label: 'Motion'     },
    { id: 'z-index',    label: 'Z-Index'    },
    { id: 'glass',      label: 'Glass'      },
    { id: 'spotlight',  label: 'Spotlight'  },
  ];

  let active = $state('colores');

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active = entry.target.id;
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });

  function goTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    active = id;
  }
</script>

<nav class="sidebar" aria-label="Categorías de tokens">
  <span class="heading">Categorías</span>

  {#each SECTIONS as section (section.id)}
    <button
      class="link"
      class:active={active === section.id}
      type="button"
      aria-current={active === section.id ? 'true' : undefined}
      onclick={() => goTo(section.id)}
    >
      <span class="dot"></span>
      {section.label}
    </button>
  {/each}
</nav>

<style>
  .sidebar {
    width: 200px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-subtle);
    padding: 1.5rem 1rem;
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
    overflow-y: auto;
  }

  .heading {
    display: block;
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.3rem 0.4rem;
    background: transparent;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    text-align: left;
    transition: color var(--duration-base), background var(--duration-base);
  }

  .link:hover {
    color: var(--text-primary);
  }

  .link.active {
    border-left-color: var(--text-accent);
    color: var(--text-accent);
    background: color-mix(in oklch, var(--text-accent) 6%, transparent);
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--border-default);
    transition: background var(--duration-base);
  }

  .link.active .dot {
    background: var(--text-accent);
  }

  @media (max-width: 900px) {
    .sidebar {
      display: none;
    }
  }
</style>
