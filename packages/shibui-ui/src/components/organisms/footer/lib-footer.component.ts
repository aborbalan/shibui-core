import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import  { FooterColumn, FooterLink, FooterVariant } from './lib-footer.types';
import { renderFooter } from './lib-footer.html';
import componentCss from './lib-footer.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * `<lib-footer>` — Footer polimórfico con 4 variantes de diseño.
 *
 * @tag lib-footer
 *
 * @attr {string}  variant      - Estilo del footer: 'social' | 'accordion' | 'kintsugi' | 'glitch'
 * @attr {string}  brand-name   - Nombre de marca (ej: "shibui")
 * @attr {string}  brand-kanji  - Caracter kanji decorativo (ej: "渋")
 * @attr {string}  brand-sub    - Subtítulo bajo el logo (ej: "Design System · Zaragoza")
 * @attr {string}  location     - Ciudad / país para el copyright
 * @attr {string}  version      - Versión del producto (ej: "1.0.0")
 * @attr {string}  node-version - Versión de Node para la variante glitch (ej: "v22.0.0")
 * @attr {string}  github-href  - URL de GitHub
 * @attr {string}  linkedin-href- URL de LinkedIn
 * @attr {string}  rss-href     - URL del feed RSS
 * @attr {string}  email        - Dirección de email de contacto
 *
 * @prop {FooterColumn[]} columns      - Columnas de navegación (accordion / kintsugi)
 * @prop {FooterLink[]}   nav-links    - Links de navegación planos (social / glitch)
 * @prop {FooterLink[]}   legal-links  - Links de pie (privacidad, términos, etc.)
 * @prop {RuntimeLine[]}  runtime-lines- Líneas de la tabla runtime (variante glitch)
 *
 * @fires ui-lib-footer-link-click - Cuando se pulsa un enlace del footer
 *   @detail { label: string; href: string }
 */
@customElement('lib-footer')
export class LibFooter extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /* ── Props principales ── */

  @property({ type: String })
  variant: FooterVariant = 'social';

  @property({ type: String, attribute: 'brand-name' })
  brandName = 'shibui';

  @property({ type: String, attribute: 'brand-kanji' })
  brandKanji = '渋';

  @property({ type: String, attribute: 'brand-sub' })
  brandSub = 'Design System · Zaragoza';

  @property({ type: String })
  location = 'Zaragoza';

  @property({ type: String })
  version = '1.0.0';

  @property({ type: String, attribute: 'node-version' })
  nodeVersion = 'v22.0.0';

  @property({ type: String, attribute: 'github-href' })
  githubHref = '#';

  @property({ type: String, attribute: 'linkedin-href' })
  linkedinHref = '#';

  @property({ type: String, attribute: 'rss-href' })
  rssHref = '#';

  @property({ type: String })
  email = '';

  /* ── Props de datos (pasadas como JSON o JS) ── */

  @property({ type: Array })
  columns: FooterColumn[] = [
    {
      heading: 'Librería',
      links: [
        { label: 'Componentes', href: '#' },
        { label: 'Tokens', href: '#' },
        { label: 'Estilos', href: '#' },
      ],
    },
    {
      heading: 'Ecosistema',
      links: [
        { label: 'GitHub', href: '#' },
        { label: 'NPM', href: '#' },
        { label: 'Storybook', href: '#' },
      ],
    },
    {
      heading: 'Recursos',
      links: [
        { label: 'Docs', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
  ];

  @property({ type: Array, attribute: 'nav-links' })
  navLinks: FooterLink[] = [
    { label: 'Componentes', href: '#' },
    { label: 'Tokens', href: '#' },
    { label: 'MIT License', href: '#' },
  ];

  @property({ type: Array, attribute: 'legal-links' })
  legalLinks: FooterLink[] = [
    { label: 'privacy.md', href: '#' },
    { label: 'terms.md', href: '#' },
  ];

  @property({ type: Array, attribute: 'runtime-lines' })
  runtimeLines: { key: string; value: string }[] = [
    { key: 'node',  value: 'v22.0.0' },
    { key: 'css',   value: 'pure · no-build' },
    { key: 'fonts', value: 'google CDN' },
    { key: 'deps',  value: '0' },
    { key: 'size',  value: '~180kb total' },
  ];

  /* ── Computed ── */

  get year(): number {
    return new Date().getFullYear();
  }

  /* ── Behaviour ── */

  /**
   * Abre / cierra un ítem de acordeón.
   * @internal
   */
  _toggleAccordion(trigger: HTMLElement): void {
    const body = trigger.nextElementSibling as HTMLElement | null;
    const arrow = trigger.querySelector('.ft-acc-arrow') as HTMLElement | null;

    if (!body) return;

    const isOpen = body.style.maxHeight !== '' && body.style.maxHeight !== '0px';

    body.style.maxHeight  = isOpen ? '0' : '300px';
    trigger.setAttribute('aria-expanded', String(!isOpen));

    if (arrow) {
      arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return renderFooter(this);
  }
}
