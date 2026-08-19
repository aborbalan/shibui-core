import pw from '@playwright/test';
const { test, expect } = pw;

const STORY = 'http://localhost:6006/iframe.html?id=universal-layout-accordion--playground';

test.describe('lib-accordion', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(STORY);
    await page.waitForSelector('lib-accordion');
  });

  test('click en item cerrado lo abre', async ({ page }) => {
    // First item is open by default; click the second (closed) item
    await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[1];
      const trigger = item?.shadowRoot?.querySelector('button') as HTMLElement;
      trigger?.click();
    });

    await page.waitForTimeout(200);

    const isOpen = await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[1] as HTMLElement & { open: boolean };
      return item?.open;
    });

    expect(isOpen).toBe(true);
  });

  test('click en item abierto lo cierra', async ({ page }) => {
    // First item starts open
    await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[0];
      const trigger = item?.shadowRoot?.querySelector('button') as HTMLElement;
      trigger?.click();
    });

    await page.waitForTimeout(200);

    const isOpen = await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[0] as HTMLElement & { open: boolean };
      return item?.open;
    });

    expect(isOpen).toBe(false);
  });

  test('exclusive=true cierra el anterior al abrir uno nuevo', async ({ page }) => {
    // Enable exclusive mode
    await page.evaluate(() => {
      const accordion = document.querySelector('lib-accordion') as HTMLElement & { exclusive: boolean };
      accordion.exclusive = true;
    });

    await page.waitForTimeout(100);

    // Open item 2 (currently closed)
    await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[1];
      const trigger = item?.shadowRoot?.querySelector('button') as HTMLElement;
      trigger?.click();
    });

    await page.waitForTimeout(200);

    const [item1Open, item2Open] = await page.evaluate(() => {
      const items = document.querySelectorAll('lib-accordion-item');
      return [
        (items[0] as HTMLElement & { open: boolean }).open,
        (items[1] as HTMLElement & { open: boolean }).open,
      ];
    });

    expect(item1Open).toBe(false);
    expect(item2Open).toBe(true);
  });

  test('accordion-toggle se emite al hacer click', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('lib-accordion')?.addEventListener('accordion-toggle', (e: Event) => {
        (window as Record<string, unknown>)['__toggleDetail'] = (e as CustomEvent).detail;
      }, { once: true });
    });

    await page.evaluate(() => {
      const item = document.querySelectorAll('lib-accordion-item')[1];
      const trigger = item?.shadowRoot?.querySelector('button') as HTMLElement;
      trigger?.click();
    });

    await page.waitForTimeout(200);

    const detail = await page.evaluate(() => (window as Record<string, unknown>)['__toggleDetail']);
    expect(detail).not.toBeNull();
  });

});
