import pw from '@playwright/test';
const { test, expect } = pw;

const STORY = 'http://localhost:6006/iframe.html?id=universal-feedback-toast-manager--playground';

test.describe('lib-toast-manager', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(STORY);
    await page.waitForSelector('lib-toast-manager', { state: 'attached' });
  });

  test('add() añade un toast al DOM', async ({ page }) => {
    await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager') as HTMLElement & {
        add(config: Record<string, unknown>): void;
      };
      mgr.add({ message: 'Test toast', type: 'info', duration: 5000 });
    });

    await page.waitForTimeout(200);

    const count = await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager');
      return mgr?.shadowRoot?.querySelectorAll('lib-alert').length ?? 0;
    });

    expect(count).toBeGreaterThan(0);
  });

  test('dismiss() elimina el toast por id', async ({ page }) => {
    const id = await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager') as HTMLElement & {
        add(config: Record<string, unknown>): void;
        dismiss(id: string): void;
        _toasts?: Array<{ id: string }>;
      };
      mgr.add({ message: 'Dismiss me', type: 'success', duration: 60000 });
      // The component stores toasts internally; access via private field via casting
      return (mgr as Record<string, unknown>)['_toasts']
        ? ((mgr as Record<string, unknown>)['_toasts'] as Array<{ id: string }>)[0]?.id
        : null;
    });

    await page.waitForTimeout(200);

    if (id) {
      await page.evaluate((toastId) => {
        const mgr = document.querySelector('lib-toast-manager') as HTMLElement & {
          dismiss(id: string): void;
        };
        mgr.dismiss(toastId);
      }, id);

      await page.waitForTimeout(500);

      const count = await page.evaluate(() => {
        const mgr = document.querySelector('lib-toast-manager');
        return mgr?.shadowRoot?.querySelectorAll('lib-alert').length ?? 0;
      });

      expect(count).toBe(0);
    }
  });

  test('dismissAll() limpia todos los toasts', async ({ page }) => {
    await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager') as HTMLElement & {
        add(config: Record<string, unknown>): void;
        dismissAll(): void;
      };
      mgr.add({ message: 'Toast A', type: 'info', duration: 60000 });
      mgr.add({ message: 'Toast B', type: 'warning', duration: 60000 });
    });

    await page.waitForTimeout(200);

    await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager') as HTMLElement & {
        dismissAll(): void;
      };
      mgr.dismissAll();
    });

    await page.waitForTimeout(500);

    const count = await page.evaluate(() => {
      const mgr = document.querySelector('lib-toast-manager');
      return mgr?.shadowRoot?.querySelectorAll('lib-alert').length ?? 0;
    });

    expect(count).toBe(0);
  });

});
