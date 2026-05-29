import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import './lib-header.component';
import type { NavLink, HeaderAction } from './lib-header.types';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Layout/Header',
  tags:['autodocs'],
  component: 'lib-header',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'select', options: [
      'classic','dark','centered','transparent',
      'mega','minimal','shrink','app-bar','celadon','sabi','shizen',
    ]},
  },
};
export default meta;
type Story = StoryObj;

/* ── Fixtures ── */
const NAV: NavLink[] = [
  { id: 'components', label: 'Componentes', href: '#', dropdown: [
    { label: 'Documentación' }, { label: 'Figma Kit' },
    { label: 'GitHub' }, { label: 'Changelog', divider: true },
  ]},
  { id: 'tokens', label: 'Tokens', href: '#' },
  { id: 'blog',   label: 'Blog',   href: '#' },
];

const NAV_SIMPLE: NavLink[] = [
  { id: 'components', label: 'Componentes', href: '#' },
  { id: 'tokens',     label: 'Tokens',      href: '#' },
  { id: 'blog',       label: 'Blog',         href: '#' },
];

const ACTIONS: HeaderAction[] = [
  { label: 'Empezar gratis', href: '#', variant: 'kaki' },
];

/* ── Fake page body ── */
const body = (dark = false, content = ''): TemplateResult => html`
  <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl) * 2);
    background:${dark ? 'var(--color-washi-950)' : 'var(--bg-base)'};
    min-height:300px;">
    ${content ? html`<div style="font-family:var(--lib-font-display);font-size:2.4rem;
      font-weight:300;letter-spacing:-.02em;line-height:1.15;
      color:${dark ? 'rgba(250,247,244,.65)' : 'var(--color-washi-800)'};">${content}</div>` : nothing}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--lib-space-md);margin-top:var(--lib-space-xl);">
      ${[0,1,2].map(() => html`
        <div style="height:60px;background:${dark
          ? 'rgba(255,255,255,.03)' : 'var(--color-washi-100)'};
          border:1px solid ${dark ? 'rgba(255,255,255,.06)' : 'var(--border-subtle)'};"></div>
      `)}
    </div>
  </div>`;

const nothing = html``;

/* ════════════════════════════════════════
   01 · CLASSIC
   ════════════════════════════════════════ */
export const Classic: Story = {
  name: '01 · Classic — light · dropdown',
  render: (): TemplateResult => html`
    <lib-header variant="classic"
      brand-name="shibui" login-label="Entrar"
      .links="${NAV}"
      .actions="${ACTIONS}"
    ></lib-header>
    ${body(false, 'Diseña con <em style="font-style:italic;color:var(--color-kaki-500);">quietud</em>')}
  `,
};

/* ════════════════════════════════════════
   02 · DARK
   ════════════════════════════════════════ */
export const Dark: Story = {
  name: '02 · Dark — washi-950 · blur',
  render: (): TemplateResult => html`
    <lib-header variant="dark"
      brand-name="shibui" version="v0.1" login-label="Entrar"
      .links="${NAV_SIMPLE}"
      .actions="${[{ label: 'Empezar', href: '#', variant: 'kaki' }]}"
    ></lib-header>
    ${body(true, 'Sistema <em style="font-style:italic;color:var(--color-kaki-400);">nocturno</em>')}
  `,
};

/* ════════════════════════════════════════
   03 · CENTERED EDITORIAL
   ════════════════════════════════════════ */
export const Centered: Story = {
  name: '03 · Centered — editorial · logo central',
  render: (): TemplateResult => html`
    <lib-header variant="centered"
      brand-name="shibui"
      announcement="✦ Componente 66 ya disponible — Header completo"
      announcement-href="#"
      .links="${[
        { id: 'components', label: 'Componentes', href: '#' },
        { id: 'tokens',     label: 'Tokens',      href: '#' },
        { id: 'motion',     label: 'Motion',      href: '#' },
        { id: 'blog',       label: 'Blog',         href: '#' },
        { id: 'recursos',   label: 'Recursos',     href: '#' },
      ]}"
      .actions="${[{ label: 'Entrar', href: '#', variant: 'outline' }]}"
    ></lib-header>
    <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);text-align:center;">
      <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.22em;
        text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">Vol. I · 2026</div>
      <div style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;
        letter-spacing:-.02em;color:var(--color-washi-800);line-height:1.1;">
        La belleza de lo <em style="font-style:italic;color:var(--color-kaki-500);">incompleto</em></div>
    </div>
  `,
};

/* ════════════════════════════════════════
   04 · TRANSPARENT
   ════════════════════════════════════════ */
export const Transparent: Story = {
  name: '04 · Transparent — sobre hero · blur al scroll',
  render: (): TemplateResult => html`
    <div style="position:relative;">
      <!-- Hero gradient -->
      <div style="position:absolute;inset:0;background:linear-gradient(160deg,var(--color-washi-800),var(--color-washi-950));z-index:0;height:400px;"></div>
      <div style="position:relative;z-index:1;">
        <lib-header variant="transparent"
          brand-name="shibui" login-label="Entrar"
          .links="${NAV_SIMPLE}"
          .actions="${[{ label: 'Ver componentes', href: '#', variant: 'kaki' }]}"
        ></lib-header>
        <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);color:rgba(250,247,244,.75);">
          <div style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;
            letter-spacing:-.02em;line-height:1.1;max-width:500px;">
            Interfaz que respeta el <em style="font-style:italic;color:var(--color-kaki-400);">silencio</em>
          </div>
          <p style="font-size:var(--text-sm);color:rgba(250,247,244,.35);margin-top:var(--lib-space-md);max-width:380px;line-height:1.8;">
            Al hacer scroll el header adquiere blur y fondo rgba. Scroll en la página para verlo.
          </p>
        </div>
      </div>
    </div>
    <div style="height:600px;background:var(--bg-base);padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);">
      <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);letter-spacing:var(--tracking-wide);">
        ↑ Haz scroll hacia arriba para ver el header transparente → blur
      </p>
    </div>
  `,
};

/* ════════════════════════════════════════
   05 · MEGA-NAV
   ════════════════════════════════════════ */
export const Mega: Story = {
  name: '05 · Mega-nav — panel full-width',
  render: (): TemplateResult => html`
    <lib-header variant="mega"
      brand-name="shibui" login-label="Entrar"
      .links="${[
        { id: 'components', label: 'Componentes', href: '#', dropdown: [{}] },
        { id: 'tokens',  label: 'Tokens',  href: '#' },
        { id: 'motion',  label: 'Motion',  href: '#' },
        { id: 'blog',    label: 'Blog',    href: '#' },
      ]}"
      .actions="${ACTIONS}"
      .megaColumns="${[
        { title: 'Interacción',  items: [
          { label: 'Buttons · 12 variantes' },
          { label: 'Modal · Dialog' },
          { label: 'Drawer · Speed Dial' },
        ]},
        { title: 'Datos', items: [
          { label: 'Bar Chart · 8 tipos' },
          { label: 'Calendar · Datepicker' },
          { label: 'Rich Text Editor' },
        ]},
        { title: 'Layout', items: [
          { label: 'Header · 10 variantes' },
          { label: 'Sidebar · 9 variantes' },
          { label: 'Footer · 6 variantes' },
        ]},
      ]}"
      .megaCta="${{
        label: 'Novedades', cta: 'Ver todo →',
        title: '66 componentes. Cero dependencias.',
        desc:  'La última versión incluye tour, sidebar y header.',
        href: '#',
      }}"
    ></lib-header>
    ${body(false)}
  `,
};

/* ════════════════════════════════════════
   06 · MINIMAL
   ════════════════════════════════════════ */
export const Minimal: Story = {
  name: '06 · Minimal — sin borde · solo texto',
  render: (): TemplateResult => html`
    <div style="background:var(--color-washi-100);">
      <lib-header variant="minimal"
        logo-mark="渋い"
        contact-label="Contacto"
        contact-href="#"
        .links="${[
          { id: 'trabajo',  label: 'Trabajo',  href: '#' },
          { id: 'indice',   label: 'Índice',   href: '#', active: true },
          { id: 'escritura',label: 'Escritura', href: '#' },
          { id: 'sobre',    label: 'Sobre mí', href: '#' },
        ]}"
        .actions="${[]}"
      ></lib-header>
      <div style="height:1px;background:var(--color-washi-300);"></div>
      <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);">
        <div style="font-family:var(--lib-font-display);font-size:3.5rem;font-weight:300;
          letter-spacing:-.03em;color:var(--color-washi-800);line-height:1.05;">
          Diseñador de<br>sistemas visuales</div>
        <div style="font-family:var(--lib-font-body);font-size:var(--text-sm);
          color:var(--text-muted);margin-top:var(--lib-space-md);">Zaragoza · Disponible para proyectos</div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   07 · SHRINK ON SCROLL
   ════════════════════════════════════════ */
export const Shrink: Story = {
  name: '07 · Shrink — 72px → 48px al scroll',
  render: (): TemplateResult => html`
    <lib-header variant="shrink"
      brand-name="shibui" brand-tagline="Design System"
      .links="${NAV_SIMPLE}"
      .actions="${ACTIONS}"
    ></lib-header>
    <div style="height:800px;background:var(--bg-base);padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);">
      <div style="font-family:var(--lib-font-display);font-size:2rem;font-weight:300;color:var(--color-washi-700);">
        El header se comprime al hacer scroll.<br>
        <em style="font-style:italic;color:var(--color-kaki-500);">Prueba a bajar por la página.</em>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   08 · APP-BAR
   ════════════════════════════════════════ */
export const AppBar: Story = {
  name: '08 · App-bar — breadcrumbs · search · acciones',
  render: (): TemplateResult => html`
    <!-- Default 56px light -->
    <lib-header variant="app-bar"
      show-search search-placeholder="Buscar componentes…"
      user-name="Shibui" notifications
      .breadcrumbs="${[
        { label: 'Shibui',       href: '#' },
        { label: 'Componentes',  href: '#' },
        { label: 'Header' },
      ]}"
      .actions="${[
        { label: 'Exportar', variant: 'outline' },
        { label: 'Publicar', variant: 'kaki' },
      ]}"
    ></lib-header>

    <div style="background:var(--bg-base);padding:var(--lib-space-md) calc(var(--lib-space-xl)*2);">
      <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">
        Compact dark · 44px:
      </p>
    </div>

    <!-- Compact 44px dark -->
    <lib-header variant="app-bar" compact
      user-name="S" notifications
      .breadcrumbs="${[
        { label: 'Shibui',  href: '#' },
        { label: 'Monitor', href: '#' },
        { label: 'Procesos' },
      ]}"
      show-search search-placeholder="Buscar proceso…"
      .actions="${[]}"
    ></lib-header>

    <div style="background:var(--color-washi-950);padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);min-height:200px;
      font-family:var(--lib-font-mono);font-size:9px;color:rgba(250,247,244,.2);line-height:2.2;">
      <div><span style="color:rgba(78,148,130,.7);">✔</span>&nbsp; node server.js · PID 4821 · ↑ 2d 14h</div>
      <div><span style="color:rgba(78,148,130,.7);">✔</span>&nbsp; vite dev · PID 4830</div>
      <div><span style="color:var(--color-kaki-400);">⚠</span>&nbsp; watcher · high memory</div>
    </div>
  `,
};

/* ════════════════════════════════════════
   09 · CELADON
   ════════════════════════════════════════ */
export const Celadon: Story = {
  name: '09 · Celadon — 青 jade · seam jade',
  render: (): TemplateResult => html`
    <lib-header variant="celadon"
      brand-name="shibui"
      login-label="Entrar"
      .links="${[
        { id: 'gallery',    label: 'Galería',    href: '#' },
        { id: 'collection', label: 'Colección',  href: '#' },
        { id: 'archive',    label: 'Archivo',    href: '#' },
        { id: 'about',      label: 'Sobre',      href: '#' },
      ]}"
      .actions="${[{ label: '青 Explorar', href: '#', variant: 'celadon' }]}"
    ></lib-header>
    <div style="background:oklch(15% 0.02 180deg);padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);min-height:300px;">
      <div style="font-family:var(--lib-font-display);font-size:2.8rem;font-weight:300;
        letter-spacing:-.02em;line-height:1.1;color:oklch(90% 0.04 180deg / .55);">
        青磁<br><em style="font-style:italic;color:var(--color-celadon-400);">cerámica jade, fría y serena</em>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   10 · SABI
   ════════════════════════════════════════ */
export const Sabi: Story = {
  name: '10 · Sabi — 寂 washi · tinta · brutal',
  render: (): TemplateResult => html`
    <lib-header variant="sabi"
      brand-name="shibui"
      login-label="Entrar"
      .links="${[
        { id: 'trabajo',  label: 'Trabajo',  href: '#' },
        { id: 'indice',   label: 'Índice',   href: '#' },
        { id: 'notas',    label: 'Notas',    href: '#' },
        { id: 'sobre',    label: 'Sobre mí', href: '#' },
      ]}"
      .actions="${[{ label: '寂 Contacto', href: '#', variant: 'sabi' }]}"
    ></lib-header>
    <div style="background:var(--color-washi-50);padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);min-height:300px;">
      <div style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;
        letter-spacing:-.02em;line-height:1.1;color:var(--color-washi-800);">
        寂び<br><em style="font-style:italic;color:var(--color-kaki-600);">la belleza de lo envejecido</em>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   11 · SHIZEN
   ════════════════════════════════════════ */
export const Shizen: Story = {
  name: '11 · Shizen — 自 natural · limpio · aireado',
  render: (): TemplateResult => html`
    <lib-header variant="shizen"
      brand-name="shibui"
      login-label="Entrar"
      .links="${[
        { id: 'plantas',  label: 'Plantas',  href: '#' },
        { id: 'estudio',  label: 'Estudio',  href: '#' },
        { id: 'diario',   label: 'Diario',   href: '#' },
        { id: 'sobre',    label: 'Sobre mí', href: '#' },
      ]}"
      .actions="${[{ label: 'Explorar', href: '#', variant: 'shizen' }]}"
    ></lib-header>
    <div style="background:#fff;padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);min-height:300px;">
      <div style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;
        letter-spacing:-.02em;line-height:1.1;color:var(--color-washi-700);">
        自然<br><em style="font-style:italic;color:var(--color-kaki-500);">lo que fluye sin esfuerzo</em>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   PLAYGROUND
   ════════════════════════════════════════ */
export const Playground: Story = {
  args: { variant: 'classic' },
  render: (args): TemplateResult => html`
    <lib-header
      variant="${args.variant}"
      brand-name="shibui"
      login-label="Entrar"
      .links="${NAV_SIMPLE}"
      .actions="${ACTIONS}"
    ></lib-header>
    ${body(['dark','celadon'].includes(args.variant as string))}
  `,
};
/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-header (variant="classic") consume tokens semánticos y adapta
   al katachi activo. Los efectos de katachi (seam dorado en kintsugi,
   scanlines en terminal) se activan automáticamente vía --lib-effect-*
   tokens sin prop adicional en el componente.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:0;">
    <lib-header
      variant="classic"
      brand-name="Shibui"
      login-label="Entrar"
      .links="${[
        { id: 'comp',  label: 'Componentes', href: '#' },
        { id: 'tok',   label: 'Tokens',      href: '#' },
        { id: 'docs',  label: 'Docs',        href: '#' },
      ] as NavLink[]}"
      .actions="${[{ label: 'Empezar', href: '#', variant: 'kaki' }] as HeaderAction[]}"
    ></lib-header>
    <div style="background:var(--bg-base);padding:var(--lib-space-md) calc(var(--lib-space-xl) * 2);border-top:1px solid var(--border-subtle);">
      <div style="font-family:var(--lib-font-display);font-size:1.8rem;font-weight:300;letter-spacing:-0.02em;color:var(--text-primary);">
        Diseño con <em style="font-style:italic;color:var(--color-kaki-500);">quietud</em>
      </div>
      <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);margin-top:var(--lib-space-sm);line-height:1.8;">
        Header variant classic — adapta tokens semánticos al katachi activo.
      </p>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
