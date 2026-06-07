/**
 * icon-registry — integridad de datos y renderizado visual de lib-icon
 *
 * Dos bloques de cobertura:
 *
 *   Bloque 1 · Contrato de datos (vía window.__SHIBUI_ICONS__ tras gallery load)
 *     · Todos los iconos del ICON_REGISTRY se registran correctamente
 *     · Los SVGs tienen formato válido: empiezan por <svg, incluyen xmlns
 *     · Ningún SVG contiene código peligroso (<script>, on*=)
 *     · Los alias apuntan exactamente al mismo SVG que su canónico
 *     · Los nombres desconocidos no se infiltran en el registro global
 *
 *   Bloque 2 · Renderizado visual (Storybook: content-icon--gallery)
 *     · Todos los lib-icon de la galería inyectan <svg> en su shadow DOM
 *     · Todos los SVGs renderizados tienen atributo viewBox
 *     · Spot-check del icono "home" (presencia de path)
 *     · Alias "back" y "notification" renderizan idéntico al canónico
 *     · lib-icon con nombre desconocido tiene wrapper vacío (fallback silencioso)
 *
 * Prerequisito: Storybook corriendo en http://localhost:6006
 */

import { test, expect, type Page } from '@playwright/test';

const BASE        = 'http://localhost:6006/iframe.html?id=';
const GALLERY_URL = `${BASE}content-icon--gallery`;

/**
 * Total de claves en ICON_REGISTRY.
 * Actualizar aquí si se añaden o eliminan iconos del registro.
 *
 * Historia:
 *   116 → base original
 *   133 → +7 críticos (check, caret-right, check-circle, warning-circle,
 *                       warning, cloud-arrow-up, circle)
 *          +2 sistema (cpu, terminal)
 *          +8 aliases (paperclip, house, leaf, globe, shield-check,
 *                      thermometer, map-pin, list)
 */
const EXPECTED_ICON_COUNT = 136; // +3 merge develop (plus, add, new)

/**
 * Pares [alias, canónico] que deben apuntar exactamente al mismo SVG.
 * Refleja los alias declarados en icon-registry.ts.
 */
const ALIAS_PAIRS: ReadonlyArray<readonly [string, string]> = [
  // Aliases originales
  ['back',         'arrow-left'],
  ['forward',      'arrow-right'],
  ['notification', 'bell'],
  ['envelope',     'mail'],
  ['pin',          'location'],
  ['x-social',     'twitter'],
  ['quill',        'write'],
  // Aliases añadidos (nombres usados en componentes/stories)
  ['paperclip',    'attachment'],
  ['house',        'home'],
  ['leaf',         'nature'],
  ['globe',        'world'],
  ['shield-check', 'shield'],
  ['thermometer',  'temp'],
  ['map-pin',      'location'],
  ['list',         'menu'],
] as const;

/** Shorthand para acceder a window.__SHIBUI_ICONS__ con tipado */
type ShibuiGlobal = { __SHIBUI_ICONS__?: Record<string, string> };

/** Espera a que todos los iconos hayan pasado por getIcon() y poblado __SHIBUI_ICONS__. */
async function waitForAllIcons(page: Page, expectedCount: number): Promise<void> {
  await page.waitForFunction(
    (count: number): boolean =>
      Object.keys((window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {}).length >= count,
    expectedCount,
    { timeout: 20_000 },
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SUITE
   ══════════════════════════════════════════════════════════════════════ */

test.describe('lib-icon · ICON_REGISTRY', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(GALLERY_URL, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);
  });

  /* ──────────────────────────────────────────────────────────────────
     Bloque 1 · Contrato de datos
     ────────────────────────────────────────────────────────────────── */

  test('registra exactamente EXPECTED_ICON_COUNT iconos en window.__SHIBUI_ICONS__', async ({ page }) => {
    const count = await page.evaluate(
      (): number =>
        Object.keys((window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {}).length,
    );
    expect(count).toBe(EXPECTED_ICON_COUNT);
  });

  test('todos los SVGs del registro tienen formato válido (empiezan por <svg)', async ({ page }) => {
    const invalidKeys: string[] = await page.evaluate((): string[] => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return Object.entries(icons)
        .filter(([, svg]) => !svg.trimStart().startsWith('<svg'))
        .map(([key]) => key);
    });
    expect(
      invalidKeys,
      `Iconos cuyo valor no empieza por <svg: ${invalidKeys.join(', ')}`,
    ).toHaveLength(0);
  });

  test('todos los SVGs del registro incluyen el atributo xmlns', async ({ page }) => {
    const missingXmlns: string[] = await page.evaluate((): string[] => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return Object.entries(icons)
        .filter(([, svg]) => !svg.includes('xmlns='))
        .map(([key]) => key);
    });
    expect(
      missingXmlns,
      `Iconos sin xmlns: ${missingXmlns.join(', ')}`,
    ).toHaveLength(0);
  });

  test('ningún SVG del registro contiene etiquetas <script>', async ({ page }) => {
    const dangerous: string[] = await page.evaluate((): string[] => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return Object.entries(icons)
        .filter(([, svg]) => /<script/i.test(svg))
        .map(([key]) => key);
    });
    expect(
      dangerous,
      `Iconos con <script>: ${dangerous.join(', ')}`,
    ).toHaveLength(0);
  });

  test('ningún SVG del registro contiene atributos de eventos on*=', async ({ page }) => {
    const dangerous: string[] = await page.evaluate((): string[] => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return Object.entries(icons)
        .filter(([, svg]) => /\son\w+=/i.test(svg))
        .map(([key]) => key);
    });
    expect(
      dangerous,
      `Iconos con on*= handlers: ${dangerous.join(', ')}`,
    ).toHaveLength(0);
  });

  test('los alias apuntan exactamente al mismo SVG que su icono canónico', async ({ page }) => {
    const mismatches: string[] = await page.evaluate(
      (pairs: ReadonlyArray<readonly [string, string]>): string[] => {
        const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
        return pairs
          .filter(([alias, canonical]) => icons[alias] !== icons[canonical])
          .map(([alias, canonical]) => `"${alias}" ≠ "${canonical}"`);
      },
      ALIAS_PAIRS as Array<[string, string]>,
    );
    expect(
      mismatches,
      `Alias con SVG diferente al canónico:\n  ${mismatches.join('\n  ')}`,
    ).toHaveLength(0);
  });

  test('los nombres desconocidos no aparecen en window.__SHIBUI_ICONS__', async ({ page }) => {
    const present = await page.evaluate((): boolean => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return '__shibui_nonexistent_icon__' in icons;
    });
    expect(present).toBe(false);
  });

  /* ──────────────────────────────────────────────────────────────────
     Bloque 2 · Renderizado visual (shadow DOM)
     ────────────────────────────────────────────────────────────────── */

  test('la galería renderiza exactamente EXPECTED_ICON_COUNT elementos lib-icon', async ({ page }) => {
    const count = await page.evaluate(
      (): number => document.querySelectorAll('lib-icon').length,
    );
    expect(count).toBe(EXPECTED_ICON_COUNT);
  });

  test('todos los lib-icon de la galería tienen un <svg> inyectado en el shadow DOM', async ({ page }) => {
    const failingIcons: string[] = await page.evaluate((): string[] => {
      const icons = Array.from(document.querySelectorAll('lib-icon'));
      return icons
        .filter(icon => {
          const wrapper = (icon as HTMLElement).shadowRoot?.querySelector('.icon-wrapper');
          return wrapper?.querySelector('svg') === null || wrapper?.querySelector('svg') === undefined;
        })
        .map(icon => icon.getAttribute('name') ?? '(sin nombre)');
    });
    expect(
      failingIcons,
      `Iconos sin SVG en shadow DOM: ${failingIcons.join(', ')}`,
    ).toHaveLength(0);
  });

  test('todos los SVGs renderizados tienen el atributo viewBox', async ({ page }) => {
    const withoutViewBox: string[] = await page.evaluate((): string[] => {
      const icons = Array.from(document.querySelectorAll('lib-icon'));
      return icons
        .filter(icon => {
          const svg = (icon as HTMLElement).shadowRoot?.querySelector('.icon-wrapper svg');
          return svg !== null && svg !== undefined && !svg.hasAttribute('viewBox');
        })
        .map(icon => icon.getAttribute('name') ?? '(sin nombre)');
    });
    expect(
      withoutViewBox,
      `SVGs renderizados sin viewBox: ${withoutViewBox.join(', ')}`,
    ).toHaveLength(0);
  });

  test('el icono "home" renderiza un SVG con contenido de forma (path / polyline / rect)', async ({ page }) => {
    const svgContent = await page.evaluate((): string => {
      const homeIcon = document.querySelector('lib-icon[name="home"]') as HTMLElement | null;
      return homeIcon?.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
    });
    expect(svgContent).toContain('<svg');
    expect(svgContent.toLowerCase()).toMatch(/path|polyline|rect|circle|line/);
  });

  test('el alias "back" renderiza exactamente el mismo SVG que "arrow-left"', async ({ page }) => {
    const [backSvg, arrowSvg] = await page.evaluate((): [string, string] => {
      const get = (name: string): string =>
        (document.querySelector(`lib-icon[name="${name}"]`) as HTMLElement | null)
          ?.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
      return [get('back'), get('arrow-left')];
    });
    expect(backSvg).not.toBe('');
    expect(backSvg).toBe(arrowSvg);
  });

  test('el alias "notification" renderiza exactamente el mismo SVG que "bell"', async ({ page }) => {
    const [notifSvg, bellSvg] = await page.evaluate((): [string, string] => {
      const get = (name: string): string =>
        (document.querySelector(`lib-icon[name="${name}"]`) as HTMLElement | null)
          ?.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
      return [get('notification'), get('bell')];
    });
    expect(notifSvg).not.toBe('');
    expect(notifSvg).toBe(bellSvg);
  });

  test('el alias "pin" renderiza exactamente el mismo SVG que "location"', async ({ page }) => {
    const [pinSvg, locationSvg] = await page.evaluate((): [string, string] => {
      const get = (name: string): string =>
        (document.querySelector(`lib-icon[name="${name}"]`) as HTMLElement | null)
          ?.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
      return [get('pin'), get('location')];
    });
    expect(pinSvg).not.toBe('');
    expect(pinSvg).toBe(locationSvg);
  });

  test('lib-icon con nombre desconocido no inyecta SVG en el wrapper (fallback silencioso)', async ({ page }) => {
    /* Añadimos dinámicamente un lib-icon con nombre inexistente al DOM */
    await page.evaluate((): void => {
      const icon = document.createElement('lib-icon') as HTMLElement;
      icon.id   = 'test-unknown-lib-icon';
      icon.setAttribute('name', '__shibui_nonexistent_icon__');
      document.body.appendChild(icon);
    });

    /* Esperamos a que Lit complete el primer render (wrapper presente aunque vacío) */
    await page.waitForFunction((): boolean => {
      const icon = document.getElementById('test-unknown-lib-icon') as HTMLElement | null;
      return icon?.shadowRoot?.querySelector('.icon-wrapper') !== null;
    });

    const hasSvg = await page.evaluate((): boolean => {
      const icon = document.getElementById('test-unknown-lib-icon') as HTMLElement | null;
      const wrapper = icon?.shadowRoot?.querySelector('.icon-wrapper');
      return wrapper?.querySelector('svg') !== null;
    });

    expect(hasSvg).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   Bloque 3 · Iconos críticos — uso real en componentes
   Verifica que cada icono hardcoded en un template renderiza correctamente
   dentro del shadow DOM del componente que lo usa.
   ══════════════════════════════════════════════════════════════════════ */

test.describe('lib-icon · iconos críticos en contexto de componente', () => {

  /** Helper: devuelve el innerHTML del wrapper de un lib-icon dentro del
   *  shadow DOM del componente indicado. Cruza dos niveles de shadow. */
  async function getIconSvgInComponent(
    page: Page,
    hostSelector: string,
    iconName: string,
  ): Promise<string> {
    return page.evaluate(
      ({ host, name }: { host: string; name: string }): string => {
        const el = document.querySelector(host) as HTMLElement | null;
        const libIcon = el?.shadowRoot?.querySelector(
          `lib-icon[name="${name}"]`,
        ) as HTMLElement | null;
        return libIcon?.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
      },
      { host: hostSelector, name: iconName },
    );
  }

  /* ── lib-copy-button · icono "check" ── */
  test('"check" se renderiza correctamente en lib-copy-button', async ({ page }) => {
    await page.goto(`${BASE}actions-copy-button--playground`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-copy-button') !== undefined);

    const svgContent = await getIconSvgInComponent(page, 'lib-copy-button', 'check');
    expect(svgContent).toContain('<svg');
  });

  /* ── lib-breadcrumb · icono "caret-right" ── */
  test('"caret-right" se renderiza correctamente en lib-breadcrumb con separador chevron', async ({ page }) => {
    await page.goto(`${BASE}navigation-breadcrumb--separators`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-breadcrumb') !== undefined);

    // Hay múltiples lib-breadcrumb en la story; el chevron está en el segundo
    const svgContent = await page.evaluate((): string => {
      const crumbs = Array.from(document.querySelectorAll('lib-breadcrumb'));
      for (const crumb of crumbs) {
        const icon = crumb.shadowRoot?.querySelector('lib-icon[name="caret-right"]') as HTMLElement | null;
        if (icon) {
          return icon.shadowRoot?.querySelector('.icon-wrapper')?.innerHTML ?? '';
        }
      }
      return '';
    });
    expect(svgContent).toContain('<svg');
  });

  /* ── lib-file-uploader · icono "cloud-arrow-up" ── */
  test('"cloud-arrow-up" se renderiza correctamente en lib-file-uploader', async ({ page }) => {
    await page.goto(`${BASE}forms-file-uploader--zone-default`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-file-uploader') !== undefined);

    const svgContent = await getIconSvgInComponent(page, 'lib-file-uploader', 'cloud-arrow-up');
    expect(svgContent).toContain('<svg');
  });

  /* ── lib-file-uploader · icono "check-circle" — estado done ── */
  test('"check-circle" existe en el registry y tiene SVG válido', async ({ page }) => {
    // Verificamos el registro global (cargado por cualquier story de la galería)
    await page.goto(`${BASE}content-icon--gallery`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);

    const svg = await page.evaluate((): string => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return icons['check-circle'] ?? '';
    });
    expect(svg).toContain('<svg');
  });

  /* ── lib-file-uploader · icono "warning-circle" ── */
  test('"warning-circle" existe en el registry y tiene SVG válido', async ({ page }) => {
    await page.goto(`${BASE}content-icon--gallery`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);

    const svg = await page.evaluate((): string => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return icons['warning-circle'] ?? '';
    });
    expect(svg).toContain('<svg');
  });

  /* ── lib-file-uploader · icono "warning" ── */
  test('"warning" existe en el registry y tiene SVG válido', async ({ page }) => {
    await page.goto(`${BASE}content-icon--gallery`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);

    const svg = await page.evaluate((): string => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return icons['warning'] ?? '';
    });
    expect(svg).toContain('<svg');
  });

  /* ── lib-timeline-item · icono "circle" ── */
  test('"circle" existe en el registry y tiene SVG válido', async ({ page }) => {
    await page.goto(`${BASE}content-icon--gallery`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);

    const svg = await page.evaluate((): string => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return icons['circle'] ?? '';
    });
    expect(svg).toContain('<svg');
  });

  /* ── Alias "paperclip" → mismo SVG que "attachment" ── */
  test('alias "paperclip" apunta al mismo SVG que "attachment" (lib-file-uploader)', async ({ page }) => {
    await page.goto(`${BASE}content-icon--gallery`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => customElements.get('lib-icon') !== undefined);
    await waitForAllIcons(page, EXPECTED_ICON_COUNT);

    const [paperclipSvg, attachmentSvg] = await page.evaluate((): [string, string] => {
      const icons = (window as unknown as ShibuiGlobal).__SHIBUI_ICONS__ ?? {};
      return [icons['paperclip'] ?? '', icons['attachment'] ?? ''];
    });
    expect(paperclipSvg).not.toBe('');
    expect(paperclipSvg).toBe(attachmentSvg);
  });
});
