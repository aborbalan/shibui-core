<script lang="ts">
  import type { ComponentDto } from '../../lib/api/components';
  import ComponentPreview from './ComponentPreview.svelte';

  interface Props {
    component: ComponentDto;
    onselect: (slug: string) => void;
  }
  let { component, onselect }: Props = $props();

  const STATUS_TONE: Record<string, string> = {
    stable: 'success',
    draft: 'warning',
    deprecated: 'error',
  };

  function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onselect(component.slug);
    }
  }
</script>

<!-- La card entera es el destino del click: rol y teclado explícitos porque
     `lib-card` es un contenedor, no un control. -->
<lib-card
  style="cursor:pointer"
  role="button"
  tabindex="0"
  aria-label="Ver {component.name}"
  onclick={() => onselect(component.slug)}
  onkeydown={onKeydown}
>
  <lib-badge slot="tag" tone={STATUS_TONE[component.status] ?? 'default'} size="sm" pill>
    {component.status.toUpperCase()}
  </lib-badge>

  <h3 slot="title">{component.name}</h3>
  <p>{component.description}</p>

  <ComponentPreview tagName={component.tagName} />

  <span slot="footer" class="tag-name">{component.tagName}</span>
</lib-card>

<style>
  .tag-name {
    font-family: var(--lib-font-mono);
    font-size: 0.75rem;
    opacity: 0.6;
  }
</style>
