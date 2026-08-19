/**
 * lib-close-button — propagación de eventos de cierre (SG-26, SG-59, SG-60, …)
 *
 * Verifica que el click en el botón interno de <lib-close-button> (part="close-btn")
 * atraviesa correctamente todos los límites de Shadow DOM y hace que cada
 * componente padre emita su propio evento de cierre semántico.
 *
 * Cadena de eventos en cada caso:
 *   click (inner <button>) → lib-close (composed) → handler del padre → ui-lib-*-close
 */

import pw from '@playwright/test';
import type { Page } from '@playwright/test';
const { test, expect } = pw;

const BASE = 'http://localhost:6006/iframe.html?id=';

/** Hace click en el <button part="close-btn"> dentro de lib-close-button,
 *  cruzando dos niveles de Shadow DOM (componente padre → lib-close-button). */
async function clickInnerCloseBtn(
  page: Page,
  hostSelector: string,
  closeBtnSelector: string = 'lib-close-button',
): Promise<void> {
  await page.evaluate(
    ({ hostSel, closeSel }: { hostSel: string; closeSel: string }) => {
      const host     = document.querySelector(hostSel);
      const btnHost  = host?.shadowRoot?.querySelector(closeSel) as (HTMLElement & { shadowRoot: ShadowRoot }) | null;
      const innerBtn = btnHost?.shadowRoot?.querySelector<HTMLElement>('button');
      innerBtn?.click();
    },
    { hostSel: hostSelector, closeSel: closeBtnSelector },
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   1 · lib-drawer — ui-lib-drawer-close
   ══════════════════════════════════════════════════════════════════════════════ */
test.describe('lib-drawer › close-button propagation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}universal-overlay-drawer--playground`);
    await page.waitForSelector('lib-drawer', { state: 'attached' });

    // Open the drawer before each test
    await page.evaluate(() => {
      const drawer = document.querySelector('#dr-playground') as HTMLElement & { open: boolean };
      drawer.open = true;
    });
    await page.waitForTimeout(300);
  });

  test('click en lib-close-button emite ui-lib-drawer-close en el documento', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-drawer-close', () => {
        (window as Record<string, unknown>)['__drawerClosed'] = true;
      }, { once: true });
    });

    await clickInnerCloseBtn(page, '#dr-playground', 'lib-close-button.dr-close');
    await page.waitForTimeout(300);

    const fired = await page.evaluate(() => (window as Record<string, unknown>)['__drawerClosed']);
    expect(fired).toBe(true);
  });

  test('después del cierre, open pasa a false', async ({ page }) => {
    await clickInnerCloseBtn(page, '#dr-playground', 'lib-close-button.dr-close');
    await page.waitForTimeout(300);

    const isOpen = await page.evaluate(() => {
      const drawer = document.querySelector('#dr-playground') as HTMLElement & { open: boolean };
      return drawer.open;
    });
    expect(isOpen).toBe(false);
  });

});

/* ══════════════════════════════════════════════════════════════════════════════
   2 · lib-dialog — ui-lib-dialog-close
   ══════════════════════════════════════════════════════════════════════════════ */
test.describe('lib-dialog › close-button propagation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}universal-overlay-dialog--playground`);
    await page.waitForSelector('lib-dialog');

    // Open the dialog before each test
    await page.evaluate(() => {
      const dlg = document.getElementById('dlg-playground') as HTMLElement & { show(): void };
      dlg?.show();
    });
    await page.waitForTimeout(300);
  });

  test('click en lib-close-button emite ui-lib-dialog-close en el documento', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-dialog-close', () => {
        (window as Record<string, unknown>)['__dialogClosed'] = true;
      }, { once: true });
    });

    await clickInnerCloseBtn(page, '#dlg-playground', 'lib-close-button.dlg-close');
    // Give time for the close animation + transitionend
    await page.waitForTimeout(600);

    const fired = await page.evaluate(() => (window as Record<string, unknown>)['__dialogClosed']);
    expect(fired).toBe(true);
  });

  test('después del cierre, open pasa a false', async ({ page }) => {
    await clickInnerCloseBtn(page, '#dlg-playground', 'lib-close-button.dlg-close');
    await page.waitForTimeout(600);

    const isOpen = await page.evaluate(() => {
      const dlg = document.getElementById('dlg-playground') as HTMLElement & { open: boolean };
      return dlg?.open;
    });
    expect(isOpen).toBe(false);
  });

});

/* ══════════════════════════════════════════════════════════════════════════════
   3 · lib-gadget-frame — ui-lib-gadget-close
   ══════════════════════════════════════════════════════════════════════════════ */
test.describe('lib-gadget-frame › close-button propagation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}desktop-layout-gadget-frame--playground`);
    await page.waitForSelector('lib-gadget-frame');
  });

  test('click en lib-close-button emite ui-lib-gadget-close en el documento', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-gadget-close', () => {
        (window as Record<string, unknown>)['__gadgetClosed'] = true;
      }, { once: true });
    });

    await clickInnerCloseBtn(page, 'lib-gadget-frame', 'lib-close-button.gadget-btn--close');
    await page.waitForTimeout(200);

    const fired = await page.evaluate(() => (window as Record<string, unknown>)['__gadgetClosed']);
    expect(fired).toBe(true);
  });

  test('el evento ui-lib-gadget-close burbujea más allá del shadow DOM', async ({ page }) => {
    // Verificar que el evento llega al ancestro más alto (window)
    await page.evaluate(() => {
      window.addEventListener('ui-lib-gadget-close', () => {
        (window as Record<string, unknown>)['__gadgetClosedWindow'] = true;
      }, { once: true });
    });

    await clickInnerCloseBtn(page, 'lib-gadget-frame', 'lib-close-button.gadget-btn--close');
    await page.waitForTimeout(200);

    const fired = await page.evaluate(() => (window as Record<string, unknown>)['__gadgetClosedWindow']);
    expect(fired).toBe(true);
  });

});

/* ══════════════════════════════════════════════════════════════════════════════
   4 · lib-tabs — ui-lib-tab-close
   ══════════════════════════════════════════════════════════════════════════════ */
test.describe('lib-tabs › close-button propagation', () => {

  test.beforeEach(async ({ page }) => {
    // Se usa la story `Closable`, que ya trae tabs con botón de cierre.
    // Antes se cargaba `Playground` (que tiene closable: false) y se intentaba
    // activar la prop en caliente; no renderizaba ningún `.tb-close`, así que
    // los dos tests de este bloque no tenían nada que pulsar.
    await page.goto(`${BASE}universal-navigation-tabs--closable`);
    await page.waitForSelector('lib-tabs');
    await page.waitForTimeout(150);
  });

  test('click en lib-close-button de un tab emite ui-lib-tab-close', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-tab-close', (e: Event) => {
        (window as Record<string, unknown>)['__tabCloseDetail'] = (e as CustomEvent).detail;
      }, { once: true });
    });

    // Click the close button inside the first non-disabled tab
    await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs');
      const closeBtnHost = tabs?.shadowRoot?.querySelector<HTMLElement & { shadowRoot: ShadowRoot }>('.tb-close');
      const innerBtn = closeBtnHost?.shadowRoot?.querySelector<HTMLElement>('button');
      innerBtn?.click();
    });

    await page.waitForTimeout(200);

    const detail = await page.evaluate(() => (window as Record<string, unknown>)['__tabCloseDetail']);
    expect(detail).toBeTruthy();
    expect(typeof (detail as { id: string }).id).toBe('string');
  });

  test('ui-lib-tab-close incluye el id del tab cerrado', async ({ page }) => {
    // Get the id of the first tab's close button
    const expectedId = await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs');
      const firstTab = tabs?.shadowRoot?.querySelector<HTMLElement>('.tb-tab:not(.is-disabled)');
      return firstTab?.dataset['id'] ?? '';
    });

    await page.evaluate(() => {
      document.addEventListener('ui-lib-tab-close', (e: Event) => {
        (window as Record<string, unknown>)['__tabCloseId'] = (e as CustomEvent).detail?.id;
      }, { once: true });
    });

    await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs');
      const closeBtnHost = tabs?.shadowRoot?.querySelector<HTMLElement & { shadowRoot: ShadowRoot }>('.tb-close');
      const innerBtn = closeBtnHost?.shadowRoot?.querySelector<HTMLElement>('button');
      innerBtn?.click();
    });

    await page.waitForTimeout(200);

    const receivedId = await page.evaluate(() => (window as Record<string, unknown>)['__tabCloseId']);
    expect(receivedId).toBe(expectedId);
  });

});

/* ══════════════════════════════════════════════════════════════════════════════
   5 · lib-chip — ui-lib-chip-remove
   ══════════════════════════════════════════════════════════════════════════════ */
test.describe('lib-chip › close-button propagation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}universal-actions-chip--playground`);
    await page.waitForSelector('lib-chip');

    // Switch to kind=input so the remove button is rendered
    await page.evaluate(() => {
      const chip = document.querySelector('lib-chip') as HTMLElement & { kind: string };
      chip.kind = 'input';
    });
    await page.waitForTimeout(150);
  });

  test('click en lib-close-button emite ui-lib-chip-remove en el documento', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-chip-remove', () => {
        (window as Record<string, unknown>)['__chipRemoved'] = true;
      }, { once: true });
    });

    await clickInnerCloseBtn(page, 'lib-chip', 'lib-close-button.chip-remove');
    // Allow time for the chip-remove-anim animation (200ms) + event emission
    await page.waitForTimeout(400);

    const fired = await page.evaluate(() => (window as Record<string, unknown>)['__chipRemoved']);
    expect(fired).toBe(true);
  });

  test('el evento ui-lib-chip-remove burbujea hasta el documento', async ({ page }) => {
    let eventCount = 0;

    await page.evaluate(() => {
      document.addEventListener('ui-lib-chip-remove', () => {
        (window as Record<string, unknown>)['__chipEventCount'] =
          ((window as Record<string, unknown>)['__chipEventCount'] as number ?? 0) + 1;
      });
    });

    await clickInnerCloseBtn(page, 'lib-chip', 'lib-close-button.chip-remove');
    await page.waitForTimeout(400);

    eventCount = await page.evaluate(
      () => (window as Record<string, unknown>)['__chipEventCount'] as number ?? 0,
    );
    expect(eventCount).toBe(1);
  });

});
