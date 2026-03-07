import { Meta, StoryObj }      from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-sidebar.component';
import type { LibSidebar }      from './lib-sidebar.component';
import type { ActiveElement, SidebarLink, SidebarSocial } from './lib-sidebar.types';

type StoryArgs = Pick<LibSidebar,
  'name' | 'initials' | 'avatarSrc' | 'role' | 'status' | 'showStatus' |
  'active' | 'cvLabel' | 'cvHref'
> & {
  links?:   SidebarLink[];
  socials?: SidebarSocial[];
};

/* ── Fixtures ──────────────────────────────────────────── */
const DEFAULT_LINKS: SidebarLink[] = [
  { id: 'inicio',      label: 'Inicio',      icon: 'house',        number: '01' },
  { id: 'sobre',       label: 'Sobre mí',    icon: 'user',         number: '02' },
  { id: 'proyectos',   label: 'Proyectos',   icon: 'squares-four', number: '03' },
  { id: 'stack',       label: 'Stack',       icon: 'stack',        number: '04' },
  { id: 'experiencia', label: 'Experiencia', icon: 'timeline',     number: '05' },
  { id: 'contacto',    label: 'Contacto',    icon: 'envelope',     number: '06' },
];

const DEFAULT_SOCIALS: SidebarSocial[] = [
  { href: '#', icon: 'github-logo',   label: 'GitHub' },
  { href: '#', icon: 'linkedin-logo', label: 'LinkedIn' },
  { href: '#', icon: 'dribbble-logo', label: 'Dribbble' },
  { href: '#', icon: 'x-logo',        label: 'X / Twitter' },
];

/* ── Layout helper ─────────────────────────────────────── */
const layout = (sidebar: TemplateResult, section: TemplateResult): TemplateResult => html`
  <div style="display:flex; height:100vh; overflow:hidden; background:var(--color-washi-50);">
    ${sidebar}
    <main style="
      flex:1; padding:4rem 3.5rem; overflow-y:auto;
      font-family:var(--lib-font-body); color:var(--text-primary);
    ">
      ${section}
    </main>
  </div>
`;

/* ── Meta ──────────────────────────────────────────────── */
const meta: Meta<StoryArgs> = {
  title: 'Components/Organisms/Sidebar',
  component: 'lib-sidebar',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    showStatus: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;


/* ── Playground ────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    name:       'Isabel Reyes',
    initials:   'IR',
    role:       'Frontend Developer',
    status:     'Disponible para proyectos',
    showStatus: true,
    active:     'inicio',
    cvLabel:    'Descargar CV',
    cvHref:     '#',
  },
  render: (args): TemplateResult => layout(
    html`
      <lib-sidebar
        name="${args.name}"
        initials="${args.initials}"
        role="${args.role}"
        status="${args.status}"
        ?show-status="${args.showStatus}"
        active="${args.active}"
        cv-label="${args.cvLabel}"
        cv-href="${args.cvHref}"
        .links="${DEFAULT_LINKS}"
        .socials="${DEFAULT_SOCIALS}"
        @ui-lib-navigate="${(e: CustomEvent):void => console.log('navigate', e.detail)}"
      ></lib-sidebar>
    `,
    html`
      <p style="font-family:var(--lib-font-mono);font-size:0.625rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--color-kaki-500);margin-bottom:0.5rem;">01 · Inicio</p>
      <h1 style="font-family:var(--lib-font-display);font-size:clamp(2.5rem,5vw,4rem);font-weight:300;line-height:1.05;letter-spacing:-0.03em;margin-bottom:1.5rem;">
        Construyo<br><em style="font-style:italic;color:var(--color-kaki-500);">interfaces</em><br>que importan.
      </h1>
      <p style="color:var(--text-secondary);max-width:520px;line-height:1.8;">
        Haz clic en los enlaces del sidebar para navegar. El indicador naranja sigue al enlace activo.
        En móvil el botón flotante abre/cierra el panel.
      </p>
    `,
  ),
};


/* ── Sin status ────────────────────────────────────────── */
export const WithoutStatus: Story = {
  name: 'Sin status — solo nombre y rol',
  render: (): TemplateResult => layout(
    html`
      <lib-sidebar
        name="Akira Tanaka"
        initials="AT"
        role="UI Engineer"
        active="proyectos"
        cv-label="Download CV"
        cv-href="#"
        ?show-status="${false}"
        .links="${DEFAULT_LINKS}"
        .socials="${DEFAULT_SOCIALS}"
      ></lib-sidebar>
    `,
    html`<p style="color:var(--text-secondary);">Sidebar sin indicador de disponibilidad.</p>`,
  ),
};


/* ── Sin socials ni CV ─────────────────────────────────── */
export const MinimalFooter: Story = {
  name: 'Footer mínimo — sin socials ni CV',
  render: (): TemplateResult => layout(
    html`
      <lib-sidebar
        name="Pau Miró"
        initials="PM"
        role="Product Designer"
        status="Disponible"
        active="sobre"
        cv-label=""
        .links="${[
          { id: 'sobre',     label: 'Sobre mí',  icon: 'user',      number: '01' },
          { id: 'trabajo',   label: 'Trabajo',   icon: 'briefcase', number: '02' },
          { id: 'contacto',  label: 'Contacto',  icon: 'envelope',  number: '03' },
        ]}"
        .socials="${[]}"
      ></lib-sidebar>
    `,
    html`<p style="color:var(--text-secondary);">Footer vacío cuando no se pasan socials ni cvLabel.</p>`,
  ),
};


/* ── Con avatar imagen ─────────────────────────────────── */
export const WithAvatarImage: Story = {
  name: 'Con imagen de avatar',
  render: (): TemplateResult => layout(
    html`
      <lib-sidebar
        name="Elena Voss"
        avatar-src="https://i.pravatar.cc/150?img=47"
        role="Creative Developer"
        status="Open to work"
        active="inicio"
        cv-label="Download CV"
        cv-href="#"
        .links="${DEFAULT_LINKS}"
        .socials="${DEFAULT_SOCIALS.slice(0, 2)}"
      ></lib-sidebar>
    `,
    html`<p style="color:var(--text-secondary);">Avatar con imagen externa. Si falla la URL se puede usar initials como fallback.</p>`,
  ),
};


/* ── Navegación reactiva ───────────────────────────────── */
export const ReactiveNavigation: Story = {
  name: 'Navegación reactiva — sections',
  render: (): TemplateResult => {
    const sections = [
      { id: 'inicio',      label: '01 · Inicio',      content: 'Bienvenido a mi portfolio.' },
      { id: 'sobre',       label: '02 · Sobre mí',     content: 'Desarrollador con 6 años de experiencia.' },
      { id: 'proyectos',   label: '03 · Proyectos',    content: 'Aquí van mis proyectos destacados.' },
      { id: 'stack',       label: '04 · Stack',        content: 'React, TypeScript, Lit, CSS.' },
      { id: 'experiencia', label: '05 · Experiencia',  content: 'Senior Developer · 2023 – Presente.' },
      { id: 'contacto',    label: '06 · Contacto',     content: 'hello@example.com' },
    ];

    return html`
      <div style="display:flex; height:100vh; overflow:hidden; background:var(--color-washi-50);">
        <lib-sidebar
          name="Isabel Reyes"
          initials="IR"
          role="Frontend Developer"
          status="Disponible para proyectos"
          active="inicio"
          cv-label="Descargar CV"
          cv-href="#"
          .links="${DEFAULT_LINKS}"
          .socials="${DEFAULT_SOCIALS}"
          @ui-lib-navigate="${(e: CustomEvent):void => {
            // Update active section visibility
            document.querySelectorAll<HTMLElement>('.sb-section-demo').forEach(s => {
              s.style.display = s.dataset['id'] === e.detail.id ? 'block' : 'none';
            });
            // Update sidebar active prop
            const sb = e.currentTarget as ActiveElement;
            (sb).active = e.detail.id;
          }}"
        ></lib-sidebar>
        <main style="flex:1;overflow-y:auto;padding:4rem 3.5rem;">
          ${sections.map((s, i) => html`
            <div
              class="sb-section-demo"
              data-id="${s.id}"
              style="display:${i === 0 ? 'block' : 'none'};"
            >
              <p style="font-family:var(--lib-font-mono);font-size:0.625rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--color-kaki-500);margin-bottom:0.5rem;">${s.label}</p>
              <h2 style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;letter-spacing:-0.03em;margin-bottom:1.5rem;">${s.label.split('·')[1]?.trim()}</h2>
              <p style="color:var(--text-secondary);max-width:520px;line-height:1.8;">${s.content}</p>
            </div>
          `)}
        </main>
      </div>
    `;
  },
};