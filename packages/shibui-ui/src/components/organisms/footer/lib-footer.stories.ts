import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-footer.component';
import type { LibFooter } from './lib-footer.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

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
   KATACHI · 形 · Las 6 historias estándar
   lib-footer define tokens internos (--ft-*) envueltos con
   --lib-comp-* (GUITV) — adapta su superficie al katachi activo
   sin CSS adicional. Variantes kintsugi/glitch/accordion son
   superficies oscuras deliberadas, independientes del katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <lib-footer
    brand-name="Shibui"
    brand-kanji="渋"
    brand-sub="Design System"
    .navLinks=${[
      { label: 'Componentes', href: '#' },
      { label: 'Tokens', href: '#' },
      { label: 'MIT License', href: '#' },
    ]}
    .legalLinks=${[{ label: 'privacy.md', href: '#' }]}
  ></lib-footer>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;