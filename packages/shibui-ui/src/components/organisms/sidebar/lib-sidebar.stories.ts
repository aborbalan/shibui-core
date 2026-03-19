import { Meta, StoryObj }      from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-sidebar.component';
import type { LibSidebar }      from './lib-sidebar.component';
import type { SidebarLink }     from '../../../types';

type StoryArgs = Partial<Pick<LibSidebar,
  'logoMark' | 'brandName' | 'showSearch' | 'active' |
  'userName' | 'userRole' | 'userAvatar' | 'showUserAction' |
  'variant' | 'collapsed'
>>;

/* ── Fixtures ── */
const LINKS: SidebarLink[] = [
  { id: 'dashboard',   label: 'Dashboard',      icon: 'home',         group: 'Principal' },
  { id: 'analytics',   label: 'Analíticas',     icon: 'chart-line',   badge: 12 },
  { id: 'projects',    label: 'Proyectos',      icon: 'folder' },
  { id: 'team',        label: 'Equipo',         icon: 'student',      badge: 4 },
  { id: 'components',  label: 'Componentes',    icon: 'stack',        group: 'Sistema' },
  { id: 'settings',    label: 'Configuración',  icon: 'compass' },
  { id: 'updates',     label: 'Actualizaciones', icon: 'download',    disabled: true },
];

const LINKS_KINTSUGI: SidebarLink[] = [
  { id: 'gallery',    label: 'Galería',        icon: 'image',   group: '金継ぎ · Sistema' },
  { id: 'collection', label: 'Colección',      icon: 'folder',  badge: 24 },
  { id: 'history',    label: 'Historia',       icon: 'book' },
  { id: 'wabi',       label: 'Wabi-sabi',      icon: 'leaf',    group: '侘び · Filosofía' },
  { id: 'ma',         label: 'Ma · El espacio', icon: 'compass' },
];

const LINKS_GLITCH: SidebarLink[] = [
  { id: 'processes',  label: 'processes',   icon: 'atom',       group: 'modules' },
  { id: 'metrics',    label: 'metrics',     icon: 'chart-line' },
  { id: 'errorlog',   label: 'error.log',   icon: 'bell',       badge: 'dot' },
  { id: 'network',    label: 'network',     icon: 'globe',      group: 'runtime' },
  { id: 'config',     label: 'config.yaml', icon: 'compass' },
  { id: 'deploy',     label: 'deploy.sh',   icon: 'upload' },
];


/* ── Meta ── */
const meta: Meta<StoryArgs> = {
  title: 'Components/Organisms/Sidebar',
  component: 'lib-sidebar',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'select', options: ['dark','light','kintsugi','glitch'] },
    showSearch: { control: 'boolean' },
    showUserAction: { control: 'boolean' },
    collapsed: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<StoryArgs>;

/* ════════════════════════════════════════
   PLAYGROUND
   ════════════════════════════════════════ */
export const Playground: Story = {
  args: {
    logoMark: '渋', brandName: 'shibui',
    showSearch: false, active: 'dashboard',
    userName: 'Shibui User', userRole: 'v0.1.0 · Pro',
    showUserAction: true, variant: 'dark', collapsed: false,
  },
  render: (args): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        logo-mark="${args.logoMark}"
        brand-name="${args.brandName}"
        ?show-search="${args.showSearch}"
        active="${args.active}"
        user-name="${args.userName}"
        user-role="${args.userRole}"
        ?show-user-action="${args.showUserAction}"
        variant="${args.variant}"
        ?collapsed="${args.collapsed}"
        .links="${LINKS}"
        @ui-lib-navigate="${(e: CustomEvent): void => console.log('navigate', e.detail)}"
        @ui-lib-user-action="${(): void => console.log('user action')}"
      ></lib-sidebar>

      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;
        background:${args.variant === 'dark' ? 'var(--color-washi-950)' : 'var(--bg-base)'};">
        <div style="height:48px;border-bottom:1px solid var(--border-subtle);
          display:flex;align-items:center;padding:0 var(--lib-space-lg);gap:var(--lib-space-md);">
          <button style="width:32px;height:32px;background:none;border:1px solid var(--border-subtle);
            cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-muted);"
            @click="${(e: Event): void => {
              const wrap = (e.currentTarget as HTMLElement).closest('div');
              const sb = wrap?.parentElement?.parentElement?.querySelector<LibSidebar>('lib-sidebar');
              sb?.toggle();
            }}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <line x1="2" y1="4" x2="14" y2="4"/>
              <line x1="2" y1="8" x2="14" y2="8"/>
              <line x1="2" y1="12" x2="14" y2="12"/>
            </svg>
          </button>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.16em;
            text-transform:uppercase;color:var(--text-muted);">Dashboard</span>
        </div>
        <div style="flex:1;padding:var(--lib-space-xl) 3rem;overflow-y:auto;">
          <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            color:var(--text-muted);letter-spacing:var(--tracking-wide);">
            Usa el botón hamburger de la topbar para colapsar/expandir.
          </p>
        </div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   LIGHT — Classic washi
   ════════════════════════════════════════ */
export const Light: Story = {
  name: 'Variant · Light — Classic washi',
  render: (): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        variant="light"
        active="dashboard"
        user-name="Shibui User" user-role="v0.1.0 · Pro"
        show-user-action
        .links="${LINKS}"
      ></lib-sidebar>
      <div style="flex:1;display:flex;flex-direction:column;background:var(--bg-base);">
        <div style="height:48px;border-bottom:1px solid var(--border-subtle);
          display:flex;align-items:center;padding:0 var(--lib-space-lg);gap:var(--lib-space-md);">
          <button style="width:32px;height:32px;background:none;border:1px solid var(--border-subtle);
            cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-muted);"
            @click="${(_e: Event): void => {
              const sb = document.querySelector<LibSidebar>('lib-sidebar');
              sb?.toggle();
            }}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/>
              <line x1="2" y1="12" x2="14" y2="12"/>
            </svg>
          </button>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.16em;
            text-transform:uppercase;color:var(--text-muted);">Dashboard</span>
          <div style="margin-left:auto;display:flex;align-items:center;gap:var(--lib-space-sm);">
            <div style="width:7px;height:7px;border-radius:50%;background:var(--color-celadon-400);"></div>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);">Online</span>
          </div>
        </div>
        <div style="flex:1;padding:var(--lib-space-xl) 3rem;overflow-y:auto;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--lib-space-md);margin-bottom:var(--lib-space-lg);">
            ${[
              { v:'62', l:'Componentes', c:'var(--color-kaki-500)' },
              { v:'0',  l:'Deps',        c:'var(--color-washi-700)' },
              { v:'v0.1',l:'Versión',    c:'var(--color-celadon-500)' },
            ].map(k => html`
              <div style="border:1px solid var(--border-subtle);padding:var(--lib-space-lg);background:var(--bg-elevated);">
                <div style="font-family:var(--lib-font-display);font-size:1.8rem;font-weight:300;color:${k.c};">${k.v}</div>
                <div style="font-family:var(--lib-font-mono);font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted);margin-top:2px;">${k.l}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   DARK — con search bar
   ════════════════════════════════════════ */
export const Dark: Story = {
  name: 'Variant · Dark — washi-950 + search',
  render: (): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        variant="dark"
        active="dashboard"
        show-search
        user-name="Shibui User" user-role="Admin"
        .links="${LINKS}"
      ></lib-sidebar>
      <div style="flex:1;display:flex;flex-direction:column;background:var(--color-washi-950);">
        <div style="height:48px;border-bottom:1px solid rgba(255,255,255,.07);
          display:flex;align-items:center;padding:0 var(--lib-space-lg);gap:var(--lib-space-md);">
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,247,244,.2);">Dashboard</span>
          <div style="margin-left:auto;display:flex;align-items:center;gap:var(--lib-space-sm);">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--color-celadon-400);"></div>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(250,247,244,.2);">42ms</span>
          </div>
        </div>
        <div style="flex:1;padding:var(--lib-space-xl) 3rem;overflow-y:auto;color:rgba(250,247,244,.2);font-family:var(--lib-font-mono);font-size:9px;line-height:2;">
          Dark variant con search bar integrada.
        </div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   KINTSUGI — ✦ seam
   ════════════════════════════════════════ */
export const Kintsugi: Story = {
  name: 'Variant · Kintsugi — ✦ gold seam',
  render: (): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        variant="kintsugi"
        logo-mark="渋"
        brand-name="shibui ✦"
        active="gallery"
        user-name="Artesano" user-role="✦ Maestro"
        .links="${LINKS_KINTSUGI}"
      ></lib-sidebar>
      <div style="flex:1;background:var(--color-washi-950);display:flex;align-items:center;justify-content:center;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--lib-space-xl);max-width:400px;padding:var(--lib-space-xl);">
          ${['侘','渋','間'].map(k => html`
            <div style="aspect-ratio:1;border:1px solid rgba(184,90,30,.2);
              background:linear-gradient(135deg,rgba(184,90,30,.08),transparent);
              display:flex;align-items:center;justify-content:center;
              font-family:var(--lib-font-display);font-size:2.5rem;font-weight:300;
              color:var(--color-kaki-400);">${k}</div>
          `)}
        </div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   GLITCH — ⌗ scanlines
   ════════════════════════════════════════ */
export const Glitch: Story = {
  name: 'Variant · Glitch — ⌗ scanlines',
  render: (): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        variant="glitch"
        logo-mark="⌗" brand-name="SHIBUI"
        active="processes"
        user-name="PID 4821" user-role="node@22"
        .links="${LINKS_GLITCH}"
      ></lib-sidebar>
      <div style="flex:1;background:var(--color-washi-950);display:flex;flex-direction:column;">
        <div style="height:48px;border-bottom:1px solid rgba(255,255,255,.06);
          display:flex;align-items:center;padding:0 var(--lib-space-lg);">
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--color-kaki-400);">⌗ processes</span>
          <span style="margin-left:auto;font-family:var(--lib-font-mono);font-size:8px;letter-spacing:.12em;color:rgba(250,247,244,.2);">2026-03-19 · 14:32:07</span>
        </div>
        <div style="flex:1;padding:var(--lib-space-xl) 3rem;overflow-y:auto;
          font-family:var(--lib-font-mono);font-size:9px;line-height:2.4;color:rgba(250,247,244,.25);">
          <div><span style="color:var(--color-celadon-400);">✔</span>&nbsp;node server.js &nbsp;PID 4821 &nbsp;↑ 2d 14h</div>
          <div><span style="color:var(--color-celadon-400);">✔</span>&nbsp;vite dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID 4830 &nbsp;↑ 2d 14h</div>
          <div><span style="color:var(--color-kaki-400);">⚠</span>&nbsp;watcher &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PID 4842 &nbsp;↑ 1h 07m</div>
          <div style="margin-top:1rem;"><span style="color:var(--color-celadon-400);">●</span>&nbsp;online · 99.2% uptime</div>
        </div>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════
   COLLAPSIBLE — 240px → 64px icon rail
   ════════════════════════════════════════ */
export const Collapsible: Story = {
  name: 'Collapsible — 240px → 64px icon rail',
  render: (): TemplateResult => html`
    <div style="display:flex;height:100vh;overflow:hidden;">
      <lib-sidebar
        id="sb-collapsible"
        variant="light"
        active="analytics"
        user-name="Shibui User" user-role="Pro"
        show-user-action
        .links="${LINKS}"
      ></lib-sidebar>
      <div style="flex:1;display:flex;flex-direction:column;background:var(--bg-base);">
        <div style="height:48px;border-bottom:1px solid var(--border-subtle);
          display:flex;align-items:center;padding:0 var(--lib-space-lg);gap:var(--lib-space-md);">
          <button
            style="width:32px;height:32px;background:none;border:1px solid var(--border-subtle);
              cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-muted);
              transition:all var(--duration-base);"
            aria-label="Toggle sidebar"
            @click="${(): void => {
              (document.getElementById('sb-collapsible') as LibSidebar)?.toggle();
            }}"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/>
              <line x1="2" y1="12" x2="14" y2="12"/>
            </svg>
          </button>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);">Expandida · 240px</span>
        </div>
        <div style="flex:1;padding:var(--lib-space-xl) 3rem;overflow-y:auto;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--lib-space-md);max-width:400px;">
            <div style="border:1px solid var(--border-subtle);padding:var(--lib-space-lg);">
              <div style="font-family:var(--lib-font-display);font-size:1.4rem;font-weight:300;color:var(--color-kaki-500);">240px</div>
              <div style="font-family:var(--lib-font-mono);font-size:8px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.14em;margin-top:2px;">Expandida</div>
            </div>
            <div style="border:1px solid var(--border-subtle);padding:var(--lib-space-lg);">
              <div style="font-family:var(--lib-font-display);font-size:1.4rem;font-weight:300;color:var(--color-washi-500);">64px</div>
              <div style="font-family:var(--lib-font-mono);font-size:8px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.14em;margin-top:2px;">Colapsada</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};