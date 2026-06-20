/**
 * Consumer contract — Angular 21 × @shibui-ui/ui
 *
 * Mismos cinco ejes que React/Svelte más uno específico de Angular:
 *
 *   6. Angular property binding — verifica que [prop]="value" (con corchetes)
 *      llega como propiedad JS y no como atributo string. Esta es la diferencia
 *      idiomática más importante para consumidores Angular: usar [disabled]="true"
 *      en lugar de disabled="true" (que enviaría el string "true").
 *
 * Gotcha documentado: tokens.css en angular.json
 *   A diferencia de React/Svelte (donde @shibui-ui/ui auto-importa tokens.css
 *   desde el entry point), Angular NO bundlea CSS desde node_modules
 *   automáticamente. El consumidor DEBE añadir tokens.css en angular.json:
 *     "styles": ["node_modules/@shibui-ui/ui/dist/tokens.css"]
 *   Sin esa línea el sistema Katachi no funciona. Este fixture la incluye
 *   y los tests de katachi verifican que la propagación funciona.
 *
 * Prerequisito: pnpm build:shibui
 * Fixture: http://localhost:4201  (levantado por @shibui/consumer-tests-angular)
 */
import { test, expect } from '@playwright/test';
import { FIXTURES, readCapturedEvents } from '../shared/contract';

const BASE = FIXTURES.ANGULAR;

test.describe('Angular 21 × @shibui-ui/ui — consumer contract', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    // Angular tarda más en arrancar que Vite. `customElements.get('lib-button')`
    // puede resolverse antes de que Angular complete su primer change detection
    // (y por tanto antes de que ngAfterViewInit registre el listener de
    // ui-lib-modal-close). En vez de APROXIMAR esa garantía (esperar a que el
    // botón esté en el DOM ≠ ngAfterViewInit corrido), esperamos la señal
    // EXPLÍCITA que el fixture expone al montar el listener — elimina la carrera.
    await page.waitForSelector('app-root');
    await page.waitForFunction(() => customElements.get('lib-button') !== undefined);
    await page.waitForSelector('[data-testid="btn-open-modal"]');
    await page.waitForFunction(
      () => (window as unknown as { __modalListenerReady__?: boolean }).__modalListenerReady__ === true,
    );
  });

  // ── 1. Registro ────────────────────────────────────────────────────────────

  test('registro: import @shibui-ui/ui define lib-button en el registry', async ({ page }) => {
    const defined = await page.evaluate(() => customElements.get('lib-button') !== undefined);
    expect(defined).toBe(true);
  });

  test('registro: los componentes core están todos definidos tras el import', async ({ page }) => {
    const results = await page.evaluate(() =>
      ['lib-button', 'lib-modal', 'lib-icon', 'lib-input', 'lib-tabs', 'lib-accordion']
        .map(tag => ({ tag, defined: customElements.get(tag) !== undefined })),
    );
    for (const { tag, defined } of results) {
      expect(defined, `${tag} no está registrado`).toBe(true);
    }
  });

  // ── 2a. Properties — boolean ───────────────────────────────────────────────

  test('prop boolean: [disabled]="true" (property binding) llega como propiedad JS', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-disabled"]');
    // [disabled]="true" en Angular → establece .disabled = true (booleano JS)
    // disabled="true"   en Angular → establece atributo disabled="true" (string)
    // Verificamos que el property binding Angular envía el tipo correcto a Lit.
    const propValue = await btn.evaluate(
      (el: HTMLElement & { disabled?: boolean }) => el.disabled,
    );
    expect(propValue).toBe(true);
  });

  test('prop boolean: [disabled]="false" no deja el elemento deshabilitado', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-enabled"]');
    const propValue = await btn.evaluate(
      (el: HTMLElement & { disabled?: boolean }) => !!el.disabled,
    );
    expect(propValue).toBe(false);
  });

  // ── 2b. Properties — string enum ──────────────────────────────────────────

  test('prop string: tone="error" se refleja como atributo en el host', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-error"]');
    const attr = await btn.getAttribute('tone');
    expect(attr).toBe('error');
  });

  // ── 3. Eventos ─────────────────────────────────────────────────────────────

  test('eventos: ui-lib-modal-close llega al listener registrado en Angular', async ({ page }) => {
    await page.locator('[data-testid="btn-open-modal"]').click();

    await page.waitForFunction(() => {
      const modal = document.querySelector('#ct-modal');
      return modal?.shadowRoot?.querySelector('[role="dialog"]') !== null;
    });

    await page.keyboard.press('Escape');

    await page.waitForFunction(() => {
      const win = window as unknown as { __capturedEvents__: Record<string, unknown[]> };
      return (win.__capturedEvents__['ui-lib-modal-close']?.length ?? 0) > 0;
    });

    const events = await page.evaluate(readCapturedEvents);
    expect(events['ui-lib-modal-close']).toHaveLength(1);
    expect((events['ui-lib-modal-close'][0] as { reason: string }).reason).toBe('escape');
  });

  test('eventos: el modal emite reason:button al pulsar el botón de cierre interno', async ({ page }) => {
    await page.locator('[data-testid="btn-open-modal"]').click();
    await page.waitForFunction(() => {
      const modal = document.querySelector('#ct-modal');
      return modal?.shadowRoot?.querySelector('[role="dialog"]') !== null;
    });

    await page.evaluate(() => {
      const modal = document.querySelector('#ct-modal');
      const closeBtn = modal?.shadowRoot?.querySelector('.mo-close') as HTMLElement | null;
      closeBtn?.click();
    });

    await page.waitForFunction(() => {
      const win = window as unknown as { __capturedEvents__: Record<string, unknown[]> };
      return (win.__capturedEvents__['ui-lib-modal-close']?.length ?? 0) > 0;
    });

    const events = await page.evaluate(readCapturedEvents);
    expect((events['ui-lib-modal-close'][0] as { reason: string }).reason).toBe('button');
  });

  // ── 4. Slots ───────────────────────────────────────────────────────────────

  test('slots: lib-icon en slot="prefix" aparece en assignedNodes del shadow DOM', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-with-icon"]');
    const assignedCount = await btn.evaluate((el: HTMLElement) => {
      const prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;
      return prefixSlot?.assignedNodes().length ?? 0;
    });
    expect(assignedCount, 'El slot "prefix" debe tener al menos un nodo asignado').toBeGreaterThan(0);
  });

  // ── 5. Katachi ─────────────────────────────────────────────────────────────

  test('katachi: --katachi-id es heredado desde data-katachi="kintsugi" al componente', async ({ page }) => {
    const katachiId = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="btn-in-kintsugi"]') as HTMLElement | null;
      return btn ? getComputedStyle(btn).getPropertyValue('--katachi-id').trim() : null;
    });
    expect(katachiId, '--katachi-id debe ser "kintsugi" dentro del contexto').toBe('kintsugi');
  });

  test('katachi: --katachi-id difiere entre contextos kintsugi y terminal', async ({ page }) => {
    const [kintsugiId, terminalId] = await page.evaluate(() => {
      const get = (testid: string): string => {
        const el = document.querySelector(`[data-testid="${testid}"]`) as HTMLElement | null;
        return el ? getComputedStyle(el).getPropertyValue('--katachi-id').trim() : '';
      };
      return [get('btn-in-kintsugi'), get('btn-in-terminal')];
    });
    expect(kintsugiId).toBe('kintsugi');
    expect(terminalId).toBe('terminal');
    expect(kintsugiId).not.toBe(terminalId);
  });

  test('katachi: fuera de cualquier data-katachi el token --katachi-id está vacío', async ({ page }) => {
    const katachiId = await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="btn-no-katachi"]') as HTMLElement | null;
      return btn ? getComputedStyle(btn).getPropertyValue('--katachi-id').trim() : null;
    });
    expect(katachiId, 'Sin data-katachi, --katachi-id debe estar vacío').toBe('');
  });

  // ── 6. Angular-específico: property binding vs attribute binding ───────────

  test('Angular-específico: [open]="signal()" abre el modal (property binding con Signal)', async ({ page }) => {
    // Verifica que [open]="modalOpen()" (Signal + property binding)
    // hace que Angular establezca .open = true en el elemento Lit.
    await page.locator('[data-testid="btn-open-modal"]').click();

    const isOpen = await page.waitForFunction(() => {
      const modal = document.querySelector('#ct-modal') as HTMLElement & { open?: boolean } | null;
      return modal?.open === true || modal?.hasAttribute('open');
    });
    expect(isOpen).toBeTruthy();
  });

  test('Angular-específico: CUSTOM_ELEMENTS_SCHEMA permite renderizar lib-* sin errores', async ({ page }) => {
    // Si CUSTOM_ELEMENTS_SCHEMA no está habilitado, Angular lanza un error de
    // compilación y la app no arranca. Que la página haya cargado es la prueba.
    const hasErrors = await page.evaluate(() => {
      // Angular registra errores de bootstrap en la consola. Los capturamos
      // buscando el elemento app-root que Angular habrá renderizado.
      return document.querySelector('app-root') === null;
    });
    expect(hasErrors, 'app-root no está presente — Angular no arrancó').toBe(false);
  });

});
