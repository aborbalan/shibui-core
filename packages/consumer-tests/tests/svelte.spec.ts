/**
 * Consumer contract — Svelte 5 × @shibui-ui/ui
 *
 * Mismos cinco ejes que el test de React. Las diferencias en comportamiento
 * entre frameworks son exactamente lo que este test captura:
 *
 *   - Boolean: Svelte 5 puede enviar disabled={true} como atributo booleano
 *     (disabled="") en lugar de la propiedad JS. El test lo documenta.
 *   - Eventos: $effect + addEventListener (mismo mecanismo que React useEffect).
 *   - Katachi: propagación CSS idéntica (independiente del framework).
 *
 * Prerequisito: pnpm build:shibui
 * Fixture: http://localhost:5175  (levantado por Playwright webServer)
 */
import { test, expect } from '@playwright/test';
import { FIXTURES, readCapturedEvents } from '../shared/contract';

const BASE = FIXTURES.SVELTE;

test.describe('Svelte 5 × @shibui-ui/ui — consumer contract', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
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

  test('prop boolean: disabled={true} llega al elemento Lit como truthy', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-disabled"]');
    // Svelte 5 puede enviar disabled como atributo booleano (disabled="")
    // o como propiedad JS. Ambas vías son válidas para Lit.
    // Verificamos el efecto final: el elemento debe estar deshabilitado.
    const [hasProp, hasAttr] = await btn.evaluate((el: HTMLElement & { disabled?: boolean }) => [
      !!el.disabled,
      el.hasAttribute('disabled'),
    ]);
    expect(hasProp || hasAttr, 'disabled debe estar activo (propiedad o atributo)').toBe(true);
  });

  test('prop boolean: sin disabled el elemento no está deshabilitado', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-enabled"]');
    const [hasProp, hasAttr] = await btn.evaluate((el: HTMLElement & { disabled?: boolean }) => [
      !!el.disabled,
      el.hasAttribute('disabled'),
    ]);
    expect(hasProp || hasAttr).toBe(false);
  });

  // ── 2b. Properties — string enum ──────────────────────────────────────────

  test('prop string: variant="danger" se refleja como atributo en el host', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-danger"]');
    const attr = await btn.getAttribute('variant');
    expect(attr).toBe('danger');
  });

  // ── 3. Eventos ─────────────────────────────────────────────────────────────

  test('eventos: ui-lib-modal-close llega al listener registrado en Svelte', async ({ page }) => {
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

});
