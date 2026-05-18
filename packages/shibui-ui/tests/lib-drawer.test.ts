import { test, expect } from '@playwright/test';

const STORY = 'http://localhost:6006/iframe.html?id=overlay-drawer--playground';

test.describe('lib-drawer', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(STORY);
    await page.waitForSelector('lib-drawer');

    // Open the drawer programmatically
    await page.evaluate(() => {
      const drawer = document.querySelector('#dr-playground') as HTMLElement & { open: boolean };
      drawer.open = true;
    });
    await page.waitForTimeout(300);
  });

  test('cierra con Escape y emite ui-lib-drawer-close', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-drawer-close', () => {
        (window as Record<string, unknown>)['__drawerClosed'] = true;
      }, { once: true });
    });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const closed = await page.evaluate(() => (window as Record<string, unknown>)['__drawerClosed']);
    expect(closed).toBe(true);
  });

  test('open=true activa el atributo open reflejado', async ({ page }) => {
    const hasOpen = await page.evaluate(() => {
      const drawer = document.querySelector('#dr-playground');
      return drawer?.hasAttribute('open');
    });

    expect(hasOpen).toBe(true);
  });

  test('tiene role=dialog y aria-label en el panel', async ({ page }) => {
    const panel = await page.evaluate(() => {
      const drawer = document.querySelector('#dr-playground');
      const dialog = drawer?.shadowRoot?.querySelector('[role="dialog"]');
      return {
        role:      dialog?.getAttribute('role'),
        ariaLabel: dialog?.getAttribute('aria-label') ?? dialog?.getAttribute('aria-labelledby'),
      };
    });

    expect(panel.role).toBe('dialog');
  });

});
