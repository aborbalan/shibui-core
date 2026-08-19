/**
 * lib-burger — integración con lib-sidebar y lib-header (SG-65, SG-66)
 *
 * Verifica que <lib-burger> integrado en lib-sidebar y lib-header:
 *   1. Emite ui-lib-burger-change al hacer click (open:true / open:false)
 *   2. Cambia el estado interno del componente padre (_mobileOpen)
 *   3. El overlay/drawer aparece y desaparece en el DOM correctamente
 *   4. Cerrar desde el backdrop/overlay funciona igual
 *
 * Cadena de eventos en cada caso:
 *   click (button.burger en lib-burger) → ui-lib-burger-change (composed)
 *     → handler padre (_toggleMobile / onToggleClick) → actualiza _mobileOpen
 */

import pw from '@playwright/test';
import type { Page } from '@playwright/test';
const { test, expect } = pw;

const BASE = 'http://localhost:6006/iframe.html?id=';

/**
 * Hace click en el <button class="burger"> dentro de lib-burger,
 * cruzando dos niveles de Shadow DOM (componente padre → lib-burger).
 */
async function clickBurgerBtn(
  page: Page,
  hostSelector: string,
  burgerSelector: string,
): Promise<void> {
  await page.evaluate(
    ({ hostSel, burgerSel }: { hostSel: string; burgerSel: string }) => {
      const host       = document.querySelector(hostSel);
      const burgerHost = host?.shadowRoot?.querySelector(burgerSel) as (HTMLElement & { shadowRoot: ShadowRoot }) | null;
      const innerBtn   = burgerHost?.shadowRoot?.querySelector<HTMLElement>('button.burger');
      innerBtn?.click();
    },
    { hostSel: hostSelector, burgerSel: burgerSelector },
  );
}

/* ══════════════════════════════════════════════════════════════
   lib-sidebar · hamburger toggle (sb-toggle)
   ══════════════════════════════════════════════════════════════ */

test.describe('lib-sidebar · hamburger (lib-burger)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}universal-navigation-sidebar--playground`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-sidebar') !== undefined);
  });

  test('overlay empieza cerrado', async ({ page }) => {
    const overlayOpen = await page.evaluate(() => {
      const sidebar  = document.querySelector('lib-sidebar');
      const overlay  = sidebar?.shadowRoot?.querySelector('.sb-overlay');
      return overlay?.classList.contains('is-open') ?? false;
    });
    expect(overlayOpen).toBe(false);
  });

  test('click en lib-burger abre el overlay y el aside', async ({ page }) => {
    await clickBurgerBtn(page, 'lib-sidebar', 'lib-burger.sb-toggle');

    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });

    const [overlayOpen, sidebarOpen] = await page.evaluate(() => {
      const sidebar  = document.querySelector('lib-sidebar');
      const sr       = sidebar?.shadowRoot;
      return [
        sr?.querySelector('.sb-overlay')?.classList.contains('is-open'),
        sr?.querySelector('aside.sidebar')?.classList.contains('is-open'),
      ];
    });

    expect(overlayOpen).toBe(true);
    expect(sidebarOpen).toBe(true);
  });

  test('segundo click cierra el overlay', async ({ page }) => {
    // Abrir
    await clickBurgerBtn(page, 'lib-sidebar', 'lib-burger.sb-toggle');
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });

    // Cerrar
    await clickBurgerBtn(page, 'lib-sidebar', 'lib-burger.sb-toggle');
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      const overlay = sidebar?.shadowRoot?.querySelector('.sb-overlay');
      return overlay !== null && !overlay.classList.contains('is-open');
    });

    const overlayOpen = await page.evaluate(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });
    expect(overlayOpen).toBe(false);
  });

  test('lib-burger emite ui-lib-burger-change con open:true al abrir', async ({ page }) => {
    const detail = await page.evaluate(() =>
      new Promise<{ open: boolean }>(resolve => {
        const sidebar = document.querySelector('lib-sidebar');
        const burger  = sidebar?.shadowRoot?.querySelector('lib-burger.sb-toggle');

        burger?.addEventListener('ui-lib-burger-change', (e) => {
          resolve((e as CustomEvent<{ open: boolean }>).detail);
        }, { once: true });

        const innerBtn = (burger as HTMLElement & { shadowRoot: ShadowRoot })
          ?.shadowRoot?.querySelector<HTMLElement>('button.burger');
        innerBtn?.click();
      }),
    );
    expect(detail.open).toBe(true);
  });

  test('lib-burger emite ui-lib-burger-change con open:false al cerrar', async ({ page }) => {
    // Abrir primero
    await clickBurgerBtn(page, 'lib-sidebar', 'lib-burger.sb-toggle');
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });

    const detail = await page.evaluate(() =>
      new Promise<{ open: boolean }>(resolve => {
        const sidebar = document.querySelector('lib-sidebar');
        const burger  = sidebar?.shadowRoot?.querySelector('lib-burger.sb-toggle');

        burger?.addEventListener('ui-lib-burger-change', (e) => {
          resolve((e as CustomEvent<{ open: boolean }>).detail);
        }, { once: true });

        const innerBtn = (burger as HTMLElement & { shadowRoot: ShadowRoot })
          ?.shadowRoot?.querySelector<HTMLElement>('button.burger');
        innerBtn?.click();
      }),
    );
    expect(detail.open).toBe(false);
  });

  test('click en overlay cierra el sidebar', async ({ page }) => {
    // Abrir
    await clickBurgerBtn(page, 'lib-sidebar', 'lib-burger.sb-toggle');
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });

    // Click overlay
    await page.evaluate(() => {
      const sidebar  = document.querySelector('lib-sidebar');
      const overlay  = sidebar?.shadowRoot?.querySelector<HTMLElement>('.sb-overlay');
      overlay?.click();
    });

    await page.waitForFunction(() => {
      const sidebar = document.querySelector('lib-sidebar');
      const overlay = sidebar?.shadowRoot?.querySelector('.sb-overlay');
      return overlay !== null && !overlay.classList.contains('is-open');
    });

    const overlayOpen = await page.evaluate(() => {
      const sidebar = document.querySelector('lib-sidebar');
      return sidebar?.shadowRoot?.querySelector('.sb-overlay')?.classList.contains('is-open');
    });
    expect(overlayOpen).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════
   lib-header · hamburger toggle (hdr-burger)
   ══════════════════════════════════════════════════════════════ */

test.describe('lib-header · hamburger (lib-burger)', () => {

  test.beforeEach(async ({ page }) => {
    // Viewport móvil (≤640px) — el burger es visible y el drawer aplica estilos correctos
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}universal-layout-header--classic`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-header') !== undefined);
  });

  test('drawer no existe en el DOM inicialmente', async ({ page }) => {
    const drawerExists = await page.evaluate(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') !== null;
    });
    expect(drawerExists).toBe(false);
  });

  test('click en lib-burger añade el drawer al DOM con is-open', async ({ page }) => {
    await clickBurgerBtn(page, 'lib-header', 'lib-burger.hdr-burger');

    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') !== null;
    });

    const [drawerExists, drawerOpen] = await page.evaluate(() => {
      const header  = document.querySelector('lib-header');
      const drawer  = header?.shadowRoot?.querySelector('#hdr-mobile-drawer');
      return [drawer !== null, drawer?.classList.contains('is-open') ?? false];
    });

    expect(drawerExists).toBe(true);
    expect(drawerOpen).toBe(true);
  });

  test('backdrop aparece junto con el drawer', async ({ page }) => {
    await clickBurgerBtn(page, 'lib-header', 'lib-burger.hdr-burger');

    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('.hdr-mobile-backdrop') !== null;
    });

    const backdropExists = await page.evaluate(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('.hdr-mobile-backdrop') !== null;
    });
    expect(backdropExists).toBe(true);
  });

  test('segundo click cierra el drawer (elimina del DOM)', async ({ page }) => {
    // Abrir
    await clickBurgerBtn(page, 'lib-header', 'lib-burger.hdr-burger');
    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') !== null;
    });

    // Cerrar
    await clickBurgerBtn(page, 'lib-header', 'lib-burger.hdr-burger');
    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') === null;
    });

    const drawerExists = await page.evaluate(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') !== null;
    });
    expect(drawerExists).toBe(false);
  });

  test('lib-burger emite ui-lib-burger-change con open:true al abrir', async ({ page }) => {
    const detail = await page.evaluate(() =>
      new Promise<{ open: boolean }>(resolve => {
        const header = document.querySelector('lib-header');
        const burger = header?.shadowRoot?.querySelector('lib-burger.hdr-burger');

        burger?.addEventListener('ui-lib-burger-change', (e) => {
          resolve((e as CustomEvent<{ open: boolean }>).detail);
        }, { once: true });

        const innerBtn = (burger as HTMLElement & { shadowRoot: ShadowRoot })
          ?.shadowRoot?.querySelector<HTMLElement>('button.burger');
        innerBtn?.click();
      }),
    );
    expect(detail.open).toBe(true);
  });

  test('click en backdrop cierra el drawer', async ({ page }) => {
    // Abrir
    await clickBurgerBtn(page, 'lib-header', 'lib-burger.hdr-burger');
    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('.hdr-mobile-backdrop') !== null;
    });

    // Click backdrop
    await page.evaluate(() => {
      const header   = document.querySelector('lib-header');
      const backdrop = header?.shadowRoot?.querySelector<HTMLElement>('.hdr-mobile-backdrop');
      backdrop?.click();
    });

    await page.waitForFunction(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') === null;
    });

    const drawerExists = await page.evaluate(() => {
      const header = document.querySelector('lib-header');
      return header?.shadowRoot?.querySelector('#hdr-mobile-drawer') !== null;
    });
    expect(drawerExists).toBe(false);
  });
});
