<script lang="ts">
  import type { ExampleDto, ExampleFramework } from '../../lib/api/components';
  import { libProps } from '../../lib/lib-props';

  interface Props { examples: ExampleDto[] }
  let { examples }: Props = $props();

  const FRAMEWORK_ORDER: ExampleFramework[] = ['vanilla', 'react', 'angular', 'vue'];

  const FRAMEWORK_LABEL: Record<ExampleFramework, string> = {
    vanilla: 'HTML',
    react: 'React',
    angular: 'Angular',
    vue: 'Vue',
  };

  /* `lib-code-block` solo admite un set acotado y decorativo de lenguajes
     (bash|ts|js|html|css|json|text). No hay token jsx/tsx → React usa `ts`. */
  const FRAMEWORK_LANGUAGE: Record<ExampleFramework, 'html' | 'ts'> = {
    vanilla: 'html',
    react: 'ts',
    angular: 'html',
    vue: 'html',
  };

  let grouped = $derived(
    FRAMEWORK_ORDER.reduce<Record<ExampleFramework, ExampleDto[]>>(
      (acc, fw) => {
        acc[fw] = examples
          .filter((e) => e.framework === fw)
          .sort((a, b) => a.order - b.order);
        return acc;
      },
      { vanilla: [], react: [], angular: [], vue: [] }
    )
  );

  let available = $derived(FRAMEWORK_ORDER.filter((fw) => grouped[fw].length > 0));
  let options = $derived(available.map((fw) => ({ label: FRAMEWORK_LABEL[fw], value: fw })));

  let selected = $state<ExampleFramework | null>(null);

  /* Si el componente cambia, el framework elegido puede dejar de existir. */
  let active = $derived(
    selected && available.includes(selected) ? selected : (available[0] ?? null)
  );

  let current = $derived(active ? grouped[active] : []);
</script>

{#if available.length === 0}
  <lib-empty-state
    title="Sin ejemplos"
    description="Este componente no tiene ejemplos de código disponibles aún."
    icon="code"
  ></lib-empty-state>
{:else}
  {#if available.length > 1}
    <div class="switcher">
      <lib-segmented-control
        display="outline"
        size="sm"
        value={active}
        use:libProps={{ options }}
        onui-lib-change={(e: Event) => {
          selected = (e as CustomEvent<{ value: ExampleFramework }>).detail.value;
        }}
      ></lib-segmented-control>
    </div>
  {/if}

  {#each current as example (example.id)}
    <div class="example">
      {#if example.title}<p class="example-title">{example.title}</p>{/if}
      {#if example.description}<p class="example-desc">{example.description}</p>{/if}
      <lib-code-block code={example.code} language={FRAMEWORK_LANGUAGE[example.framework]}></lib-code-block>
    </div>
  {/each}
{/if}

<style>
  .switcher {
    margin-bottom: 1.25rem;
  }

  .example {
    margin-bottom: 1.5rem;
  }

  .example-title {
    font-family: var(--lib-font-mono);
    font-size: 0.72rem;
    color: var(--text-accent);
    margin: 0 0 0.5rem;
  }

  .example-desc {
    font-family: var(--lib-font-body);
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0 0 0.75rem;
  }
</style>
