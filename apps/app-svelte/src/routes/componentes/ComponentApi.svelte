<script lang="ts">
  import type { ComponentApi } from '../../lib/api/components';
  import { libProps } from '../../lib/lib-props';

  interface Props { api?: ComponentApi }
  let { api }: Props = $props();

  /* Las columnas se pasan tal cual al web component `lib-data-table`. */
  const PROP_COLUMNS = [
    { key: 'name',        header: 'Prop',        type: 'mono' },
    { key: 'attribute',   header: 'Atributo',    type: 'mono' },
    { key: 'type',        header: 'Tipo',        type: 'mono', truncate: true },
    { key: 'default',     header: 'Por defecto', type: 'mono' },
    { key: 'description', header: 'Descripción', type: 'text' },
  ];

  const SLOT_COLUMNS = [
    { key: 'name',        header: 'Slot',        type: 'mono' },
    { key: 'description', header: 'Descripción', type: 'text' },
  ];

  const EVENT_COLUMNS = [
    { key: 'name',        header: 'Evento',      type: 'mono' },
    { key: 'type',        header: 'Tipo',        type: 'mono', truncate: true },
    { key: 'description', header: 'Descripción', type: 'text' },
  ];

  let propRows = $derived(
    (api?.props ?? []).map((p) => ({
      name: p.name,
      attribute: p.attribute || '—',
      type: p.type,
      default: p.default ?? '—',
      description: p.description || '',
    }))
  );

  let slotRows = $derived(
    (api?.slots ?? []).map((s) => ({
      name: s.name || '(default)',
      description: s.description || '',
    }))
  );

  let eventRows = $derived(
    (api?.events ?? []).map((e) => ({
      name: e.name,
      type: e.type || '—',
      description: e.description || '',
    }))
  );

  let hasApi = $derived(propRows.length + slotRows.length + eventRows.length > 0);
</script>

{#snippet apiTable(title: string, columns: unknown[], rows: Record<string, string>[])}
  {#if rows.length > 0}
    <div>
      <p class="table-title">{title}</p>
      <lib-data-table
        display="lines"
        size="sm"
        style="width:100%"
        use:libProps={{ columns, data: rows }}
      ></lib-data-table>
    </div>
  {/if}
{/snippet}

<!--
  Referencia de API (props / slots / events) derivada del Custom Elements
  Manifest y servida en `GET /components/slug/:slug`. Cada bloque solo se
  pinta si tiene filas.
-->
{#if hasApi}
  <section class="api">
    <h2 class="section-title">Referencia de API</h2>
    <lib-divider style="margin:0 0 0.5rem;"></lib-divider>

    {@render apiTable('Props', PROP_COLUMNS, propRows)}
    {@render apiTable('Slots', SLOT_COLUMNS, slotRows)}
    {@render apiTable('Events', EVENT_COLUMNS, eventRows)}
  </section>
{/if}

<style>
  .api {
    margin-bottom: 3rem;
  }

  .section-title {
    font-family: var(--lib-font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-accent);
    margin: 0 0 0.75rem;
  }

  .table-title {
    font-family: var(--lib-font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    color: var(--text-accent);
    margin: 1.75rem 0 0.6rem;
  }
</style>
