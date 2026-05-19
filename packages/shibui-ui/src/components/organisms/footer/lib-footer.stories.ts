import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-footer.component';
import type { LibFooter } from './lib-footer.component';

const DEFAULT_COLUMNS = [
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

const DEFAULT_NAV_LINKS = [
  { label: 'Componentes', href: '#' },
  { label: 'Tokens', href: '#' },
  { label: 'MIT License', href: '#' },
];

const DEFAULT_LEGAL_LINKS = [
  { label: 'privacy.md', href: '#' },
  { label: 'terms.md', href: '#' },
];

const DEFAULT_RUNTIME = [
  { key: 'node',  value: 'v22.0.0' },
  { key: 'css',   value: 'pure · no-build' },
  { key: 'fonts', value: 'google CDN' },
  { key: 'deps',  value: '0' },
  { key: 'size',  value: '~180kb total' },
];

const GLITCH_NAV_LINKS = [
  { label: 'components.css', href: '#' },
  { label: 'tokens.json',    href: '#' },
  { label: 'changelog.md',   href: '#' },
  { label: 'license.md',     href: '#' },
];

const meta: Meta<LibFooter> = {
  title: 'Layout/Footer',
  
  component: 'lib-footer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<LibFooter>;

/* ══════════════════════════════════════════
   01 · Social Prominent
   ══════════════════════════════════════════ */
export const Social: Story = {
  name: '01 · Social Prominent',
  render: () => html`
    <lib-footer
      variant="social"
      brand-name="shibui"
      brand-kanji="渋"
      brand-sub="Design System · Zaragoza"
      location="Zaragoza"
      github-href="https://github.com"
      linkedin-href="https://linkedin.com"
      rss-href="#"
      email="hola@shibui.dev"
      .navLinks=${DEFAULT_NAV_LINKS}
      .legalLinks=${DEFAULT_LEGAL_LINKS}
    ></lib-footer>
  `,
  parameters: { backgrounds: { default: 'paper' } },
};

/* ══════════════════════════════════════════
   02 · Accordion Mobile
   ══════════════════════════════════════════ */
export const Accordion: Story = {
  name: '02 · Accordion Mobile',
  render: () => html`
    <lib-footer
      variant="accordion"
      brand-name="shibui"
      brand-kanji="渋"
      github-href="https://github.com"
      linkedin-href="https://linkedin.com"
      email="hola@shibui.dev"
      .columns=${DEFAULT_COLUMNS}
      .legalLinks=${DEFAULT_LEGAL_LINKS}
    ></lib-footer>
  `,
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   03 · Kintsugi
   ══════════════════════════════════════════ */
export const Kintsugi: Story = {
  name: '03 · Kintsugi ✦',
  render: () => html`
    <lib-footer
      variant="kintsugi"
      brand-name="shibui"
      brand-kanji="渋い"
      brand-sub="Design System · Zaragoza"
      location="Zaragoza"
      .columns=${DEFAULT_COLUMNS}
      .legalLinks=${DEFAULT_LEGAL_LINKS}
    ></lib-footer>
  `,
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   04 · Glitch Terminal
   ══════════════════════════════════════════ */
export const Glitch: Story = {
  name: '04 · Glitch Terminal ⌗',
  render: () => html`
    <lib-footer
      variant="glitch"
      brand-name="shibui"
      brand-kanji="渋い"
      location="Zaragoza"
      version="1.0.0"
      node-version="v22.0.0"
      .navLinks=${GLITCH_NAV_LINKS}
      .runtimeLines=${DEFAULT_RUNTIME}
      .legalLinks=${DEFAULT_LEGAL_LINKS}
    ></lib-footer>
  `,
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   All variants
   ══════════════════════════════════════════ */
export const AllVariants: Story = {
  name: '— All Variants',
  render: () => html`
    <div style="display:flex;flex-direction:column;">
      <p style="font-family:'DM Mono',monospace;font-size:.6875rem;letter-spacing:.18em;text-transform:uppercase;color:#B8A99A;padding:.75rem 1rem;border-bottom:1px solid #E5DDD3;">01 · Social prominent</p>
      <lib-footer
        variant="social"
        brand-name="shibui"
        brand-kanji="渋"
        brand-sub="Design System · Zaragoza"
        location="Zaragoza"
        github-href="#"
        linkedin-href="#"
        rss-href="#"
        email="hola@shibui.dev"
        .navLinks=${DEFAULT_NAV_LINKS}
        .legalLinks=${DEFAULT_LEGAL_LINKS}
      ></lib-footer>

      <p style="font-family:'DM Mono',monospace;font-size:.6875rem;letter-spacing:.18em;text-transform:uppercase;color:#B8A99A;padding:.75rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);background:#120E0A;">02 · Accordion móvil</p>
      <lib-footer
        variant="accordion"
        brand-name="shibui"
        brand-kanji="渋"
        github-href="#"
        linkedin-href="#"
        email="hola@shibui.dev"
        .columns=${DEFAULT_COLUMNS}
        .legalLinks=${DEFAULT_LEGAL_LINKS}
      ></lib-footer>

      <p style="font-family:'DM Mono',monospace;font-size:.6875rem;letter-spacing:.18em;text-transform:uppercase;color:#B8A99A;padding:.75rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);background:#120E0A;">03 · Kintsugi ✦</p>
      <lib-footer
        variant="kintsugi"
        brand-name="shibui"
        brand-kanji="渋い"
        brand-sub="Design System · Zaragoza"
        location="Zaragoza"
        .columns=${DEFAULT_COLUMNS}
        .legalLinks=${DEFAULT_LEGAL_LINKS}
      ></lib-footer>

      <p style="font-family:'DM Mono',monospace;font-size:.6875rem;letter-spacing:.18em;text-transform:uppercase;color:#B8A99A;padding:.75rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);background:#120E0A;">04 · Glitch Terminal ⌗</p>
      <lib-footer
        variant="glitch"
        brand-name="shibui"
        brand-kanji="渋い"
        location="Zaragoza"
        version="1.0.0"
        node-version="v22.0.0"
        .navLinks=${GLITCH_NAV_LINKS}
        .runtimeLines=${DEFAULT_RUNTIME}
        .legalLinks=${DEFAULT_LEGAL_LINKS}
      ></lib-footer>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <lib-footer
            brand-name="Shibui"
            .navLinks=${[{ label: 'Componentes', href: '#' }, { label: 'Tokens', href: '#' }]}
            .legalLinks=${[{ label: 'MIT License', href: '#' }]}
          ></lib-footer>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};