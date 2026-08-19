import pw from '@playwright/test';
const { test, expect } = pw;
import AxeBuilder from '@axe-core/playwright'; // Importación correcta
// En este modo, Playwright necesita una URL. 
// Usaremos el servidor de desarrollo de Vite o Storybook.
const COMPONENT_URL = 'http://localhost:6006/iframe.html?id=universal-actions-button--playground';

test.describe('lib-button (Integración Real)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(COMPONENT_URL);
  });

  test('debe cumplir con los estándares de accesibilidad WCAG 2.1', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=universal-actions-button--playground');
    
    // Esperamos a que el componente Lit esté listo en el DOM
    await page.waitForSelector('lib-button');
  
    // El análisis se acota al componente y a las reglas WCAG.
    //
    // Sin `.include()`, axe audita la página entera del iframe de Storybook y
    // devuelve `landmark-one-main` y `page-has-heading-one`: una story aislada
    // no tiene <main> ni <h1>, y no debería. Sin el filtro de tags, además,
    // entran reglas `best-practice` que no son WCAG — que es lo que este test
    // dice medir.
    const accessibilityScan = await new AxeBuilder({ page })
      .include('lib-button')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Si hay violaciones, el test fallará y te dirá cuáles son
    expect(accessibilityScan.violations).toHaveLength(0);
  });

  test('debe reaccionar al click emitiendo ui-lib-click', async ({ page }) => {
    // Antes esto era un `toHaveScreenshot`, que no comprobaba ninguna reacción
    // al click — y además metía una captura con baseline por plataforma
    // (-win32) en el suite de comportamiento, que corre en Linux en CI.
    // La regresión visual vive en tests/visual/; aquí se afirma la conducta.
    await page.evaluate(() => {
      document.addEventListener('ui-lib-click', () => {
        (window as Record<string, unknown>)['__btnClicked'] = true;
      }, { once: true });
    });

    const button = page.locator('lib-button');
    await button.click();

    const clicked = await page.evaluate(
      () => (window as Record<string, unknown>)['__btnClicked'] === true,
    );
    expect(clicked).toBe(true);
  });
});