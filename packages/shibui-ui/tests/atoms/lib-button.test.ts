import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // Importación correcta
// En este modo, Playwright necesita una URL. 
// Usaremos el servidor de desarrollo de Vite o Storybook.
const COMPONENT_URL = 'http://localhost:6006/iframe.html?id=atoms-lib-button--default';

test.describe('lib-button (Integración Real)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(COMPONENT_URL);
  });

  test('debe cumplir con los estándares de accesibilidad WCAG 2.1', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=atoms-lib-button--default');
    
    // Esperamos a que el componente Lit esté listo en el DOM
    await page.waitForSelector('lib-button');
  
    // Ejecutamos el análisis de accesibilidad
    const accessibilityScan = await new AxeBuilder({ page }).analyze();
    
    // Si hay violaciones, el test fallará y te dirá cuáles son
    expect(accessibilityScan.violations).toHaveLength(0);
  });

  test('debe reaccionar al click y cambiar estados visuales', async ({ page }) => {
    const button = page.locator('lib-button');
    
    // Verificamos que el Shadow DOM es accesible para Playwright
    await button.click();
    
    // Test de regresión visual: ¿El botón se ve como debe?
    await expect(page).toHaveScreenshot('lib-button-primary.png');
  });
});