import pw from '@playwright/test';
const { test, expect } = pw;

const STORY = 'http://localhost:6006/iframe.html?id=universal-navigation-tabs--playground';

test.describe('lib-tabs', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(STORY);
    await page.waitForSelector('lib-tabs');
  });

  test('click en tab emite ui-lib-tab-change con id correcto', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('ui-lib-tab-change', (e: Event) => {
        (window as Record<string, unknown>)['__tabDetail'] = (e as CustomEvent).detail;
      }, { once: true });
    });

    // Click the 'code' tab inside shadow DOM.
    // Los tabs se marcan con `data-id`, no con `id`: el `#code` de antes no
    // casaba con nada y el click nunca ocurría.
    await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs');
      const codeTab = tabs?.shadowRoot?.querySelector('.tb-tab[data-id="code"]') as HTMLElement;
      codeTab?.click();
    });

    await page.waitForTimeout(200);

    const detail = await page.evaluate(() => (window as Record<string, unknown>)['__tabDetail']);
    expect((detail as { id: string }).id).toBe('code');
  });

  test('active prop cambia el tab activo', async ({ page }) => {
    const initialActive = await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs') as HTMLElement & { active: string };
      return tabs?.active;
    });

    expect(initialActive).toBe('overview');

    await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs') as HTMLElement & { active: string };
      tabs.active = 'docs';
    });

    await page.waitForTimeout(100);

    const newActive = await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs') as HTMLElement & { active: string };
      return tabs?.active;
    });

    expect(newActive).toBe('docs');
  });

  test('tab disabled no es clickable', async ({ page }) => {
    let eventFired = false;

    await page.evaluate(() => {
      document.addEventListener('ui-lib-tab-change', () => {
        (window as Record<string, unknown>)['__disabledTabFired'] = true;
      }, { once: true });
    });

    // Try clicking the disabled 'issues' tab
    await page.evaluate(() => {
      const tabs = document.querySelector('lib-tabs');
      const disabledTab = tabs?.shadowRoot?.querySelector('#issues') as HTMLElement;
      disabledTab?.click();
    });

    await page.waitForTimeout(200);

    eventFired = await page.evaluate(
      () => !!(window as Record<string, unknown>)['__disabledTabFired']
    );

    expect(eventFired).toBe(false);
  });

});
