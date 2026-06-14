<script lang="ts">
  /**
   * App fixture — Svelte 5 (runes)
   *
   * Cubre los mismos cinco ejes que el fixture de React.
   * Diferencias Svelte 5 vs React 19:
   *   - bind:this para obtener referencia al elemento DOM
   *   - $effect para attachar listeners (equivale a useEffect)
   *   - onclick={fn} en lugar de onClick={fn} (Svelte 5, minúsculas)
   *   - open={modalOpen} — Svelte pasa la prop directamente como atributo/propiedad
   */
  // Tipo local — no importamos desde shared/contract para evitar dependencia
  // de ruta relativa cross-root en la fixture.
  type CapturedEventsMap = Record<string, Array<Record<string, unknown>>>;
  type WindowWithCapture = Window & { __capturedEvents__: CapturedEventsMap };

  function capture(name: string, detail: Record<string, unknown>): void {
    const win = window as unknown as WindowWithCapture;
    win.__capturedEvents__[name] ??= [];
    win.__capturedEvents__[name].push(detail);
  }

  let modalOpen = $state(false);
  let modalEl = $state<HTMLElement | null>(null);

  // Adjunta el listener cuando el elemento está disponible en el DOM.
  // $effect corre después del mount y se re-ejecuta si modalEl cambia.
  $effect(() => {
    if (!modalEl) return;

    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail ?? {};
      capture('ui-lib-modal-close', detail);
      modalOpen = false;
    };

    modalEl.addEventListener('ui-lib-modal-close', handler);
    return () => modalEl?.removeEventListener('ui-lib-modal-close', handler);
  });
</script>

<div>

  <!-- 1. Registro -->
  <section data-scenario="registration">
    <lib-button data-testid="btn-registration">Present</lib-button>
  </section>

  <!-- 2a. Property — boolean -->
  <!-- Svelte 5: disabled={true} puede enviarse como atributo booleano o
       como propiedad según si el elemento lo tiene definido. Verificar
       con el test qué llega al elemento Lit. -->
  <section data-scenario="boolean-prop">
    <lib-button disabled={true} data-testid="btn-disabled">Disabled</lib-button>
    <lib-button data-testid="btn-enabled">Enabled</lib-button>
  </section>

  <!-- 2b. Property — string enum -->
  <section data-scenario="string-prop">
    <lib-button tone="error" data-testid="btn-error">Error</lib-button>
  </section>

  <!-- 3. Eventos -->
  <section data-scenario="events">
    <lib-modal
      bind:this={modalEl}
      id="ct-modal"
      open={modalOpen}
    >
      <span slot="header">Consumer Test Modal</span>
      <p>Prueba de propagación de eventos</p>
    </lib-modal>

    <lib-button
      data-testid="btn-open-modal"
      onclick={() => { modalOpen = true; }}
    >
      Abrir modal
    </lib-button>
  </section>

  <!-- 4. Slots -->
  <section data-scenario="slots">
    <lib-button data-testid="btn-with-icon">
      <lib-icon slot="prefix" name="home"></lib-icon>
      Home
    </lib-button>
  </section>

  <!-- 5. Katachi -->
  <section data-scenario="katachi">
    <div data-katachi="kintsugi">
      <lib-button data-testid="btn-in-kintsugi">Button</lib-button>
    </div>
    <div data-katachi="terminal">
      <lib-button data-testid="btn-in-terminal">Button</lib-button>
    </div>
    <lib-button data-testid="btn-no-katachi">Button</lib-button>
  </section>

</div>
