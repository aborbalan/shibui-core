import pw from '@playwright/test';
const { test, expect } = pw;

const STORY = 'http://localhost:6006/iframe.html?id=universal-overlay-modal--playground';

test.describe('lib-modal', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(STORY);
    await page.waitForSelector('lib-modal');

    // Open the modal programmatically
    await page.evaluate(() => {
      const modal = document.querySelector('#mo-playground') as HTMLElement & { open: boolean };
      modal.open = true;
    });
    await page.waitForTimeout(200);
  });

  test('cierra con Escape y emite reason:escape', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-modal-close', (e: Event) => {
        (window as Record<string, unknown>)['__closeDetail'] = (e as CustomEvent).detail;
      }, { once: true });
    });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const detail = await page.evaluate(() => (window as Record<string, unknown>)['__closeDetail']);
    expect((detail as { reason: string }).reason).toBe('escape');
  });

  test('cierra al pulsar el botón × y emite reason:button', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-modal-close', (e: Event) => {
        (window as Record<string, unknown>)['__closeDetail'] = (e as CustomEvent).detail;
      }, { once: true });
    });

    // Click the close button inside shadow DOM
    await page.evaluate(() => {
      const modal = document.querySelector('#mo-playground');
      const closeBtn = modal?.shadowRoot?.querySelector('.mo-close') as HTMLElement;
      closeBtn?.click();
    });
    await page.waitForTimeout(200);

    const detail = await page.evaluate(() => (window as Record<string, unknown>)['__closeDetail']);
    expect((detail as { reason: string }).reason).toBe('button');
  });

  test('aria-modal y role=dialog correctos cuando open=true', async ({ page }) => {
    const panel = await page.evaluate(() => {
      const modal = document.querySelector('#mo-playground');
      const panel = modal?.shadowRoot?.querySelector('[role="dialog"]');
      return {
        role:      panel?.getAttribute('role'),
        ariaModal: panel?.getAttribute('aria-modal'),
      };
    });

    expect(panel.role).toBe('dialog');
    expect(panel.ariaModal).toBe('true');
  });

});
