/**
 * Consumer contract — React 19 × @shibui-ui/ui
 *
 * Verifica los cinco ejes del contrato de integración:
 *   1. Registro     — los elementos están definidos en customElements registry
 *   2. Properties   — boolean y string enum llegan correctamente al LitElement
 *   3. Eventos      — ui-lib-modal-close se captura desde el listener de React
 *   4. Slots        — contenido sloteado aparece en assignedNodes del shadow DOM
 *   5. Katachi      — data-katachi en ancestro propaga CSS tokens al componente
 *
 * Prerequisito: pnpm build:shibui
 * Fixture: http://localhost:5174  (levantado por Playwright webServer)
 */
import { test, expect } from '@playwright/test';
import { FIXTURES, readCapturedEvents } from '../shared/contract';

const BASE = FIXTURES.REACT;

test.describe('React 19 × @shibui-ui/ui — consumer contract', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    // Espera a que @shibui-ui/ui haya registrado al menos lib-button.
    await page.waitForFunction(() => customElements.get('lib-button') !== undefined);
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

  test('prop boolean: disabled llega como propiedad JS true (no como string)', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-disabled"]');
    // React 19 establece .disabled = true en el elemento; Lit lo refleja
    // como atributo disabled (reflect:true). Verificamos la propiedad JS.
    const propValue = await btn.evaluate(
      (el: HTMLElement & { disabled?: boolean }) => el.disabled,
    );
    expect(propValue).toBe(true);
  });

  test('prop boolean: sin disabled la propiedad es false/undefined', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-enabled"]');
    const propValue = await btn.evaluate(
      (el: HTMLElement & { disabled?: boolean }) => !!el.disabled,
    );
    expect(propValue).toBe(false);
  });

  // ── 2b. Properties — string enum ──────────────────────────────────────────

  test('prop string: tone="error" se refleja como atributo en el host', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-error"]');
    // Lit reflect:true asegura que la propiedad se refleja como atributo.
    // React envía "error" como atributo directamente (valor string).
    const attr = await btn.getAttribute('tone');
    expect(attr).toBe('error');
  });

  // ── 3. Eventos ─────────────────────────────────────────────────────────────

  test('eventos: ui-lib-modal-close llega al listener registrado en React', async ({ page }) => {
    // Abre el modal clicando el botón (dispara setModalOpen(true) en el fixture)
    await page.locator('[data-testid="btn-open-modal"]').click();

    // Espera a que el modal esté visible en el shadow DOM
    await page.waitForFunction(() => {
      const modal = document.querySelector('#ct-modal');
      return modal?.shadowRoot?.querySelector('[role="dialog"]') !== null;
    });

    // Cierra con Escape — la librería emite ui-lib-modal-close con reason:'escape'
    await page.keyboard.press('Escape');

    // El listener del fixture captura el evento y lo guarda en window.__capturedEvents__
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

    // Pulsa el botón × dentro del shadow DOM
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
    // El token --katachi-id debe propagarse por herencia CSS hasta lib-button
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

});
