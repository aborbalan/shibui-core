import { Meta, StoryObj }      from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-sidebar.component';
import type { LibSidebar }      from './lib-sidebar.component';
import type { SidebarLink }     from '../../../types';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import { katachiContext, expectAccentMatchesToken } from '../../../stories/katachi-accent.helper';

type StoryArgs = Partial<Pick<LibSidebar,
  'logoMark' | 'brandName' | 'showSearch' | 'active' |
  'userName' | 'userRole' | 'userAvatar' | 'showUserAction' |
  'variant' | 'collapsed'
>>;

/* ── Fixtures ── */
const LINKS: SidebarLink[] = [
  { id: 'dashboard',   label: 'Dashboard',       icon: 'home',        group: 'Principal' },
  { id: 'analytics',   label: 'Analíticas',      icon: 'chart-line',  badge: 12 },
  { id: 'projects',    label: 'Proyectos',       icon: 'folder' },
  { id: 'team',        label: 'Equipo',          icon: 'student',     badge: 4 },
  { id: 'components',  label: 'Componentes',     icon: 'stack',       group: 'Sistema' },
  { id: 'settings',    label: 'Configuración',   icon: 'compass' },
  { id: 'updates',     label: 'Actualizaciones', icon: 'download',    disabled: true },
];

/* ── Meta ── */
const meta: Meta<StoryArgs> = {
  title: 'Universal/Navigation/Sidebar',
  tags: ['autodocs'],
  component: 'lib-sidebar',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant:        { control: 'select', options: ['dark', 'light'] },
    showSearch:     { control: 'boolean' },
    showUserAction: { control: 'boolean' },
    collapsed:      { control: 'boolean' },
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
   VARIANTS
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

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-sidebar consume tokens semánticos (bg-elevated, border-subtle,
   text-primary) — adapta al katachi activo. Los efectos de katachi
   (seam dorado en kintsugi, scanlines en terminal) se activan
   automáticamente vía --lib-effect-* tokens sin prop adicional.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">

    <!-- dark variant -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">dark</p>
      <div style="display:flex;height:200px;border:1px solid var(--border-subtle);overflow:hidden;">
        <lib-sidebar
          variant="dark"
          active="dashboard"
          .links="${([
            { id: 'dashboard', label: 'Dashboard',  icon: 'home',       group: 'Principal' },
            { id: 'analytics', label: 'Analíticas', icon: 'chart-line', badge: 5 },
            { id: 'projects',  label: 'Proyectos',  icon: 'folder' },
            { id: 'settings',  label: 'Ajustes',    icon: 'compass',    disabled: true },
          ] as SidebarLink[])}"
          style="--lib-sidebar-width:200px;"
        ></lib-sidebar>
        <div style="flex:1;padding:var(--lib-space-md);background:var(--color-washi-950);font-family:var(--lib-font-mono);font-size:9px;color:rgba(250,247,244,.2);">content area</div>
      </div>
    </div>

    <!-- light variant -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">light</p>
      <div style="display:flex;height:200px;border:1px solid var(--border-subtle);overflow:hidden;">
        <lib-sidebar
          variant="light"
          active="analytics"
          user-name="Shibui User"
          user-role="Pro"
          show-user-action
          .links="${([
            { id: 'dashboard', label: 'Dashboard',  icon: 'home',       group: 'Principal' },
            { id: 'analytics', label: 'Analíticas', icon: 'chart-line', badge: 12 },
            { id: 'projects',  label: 'Proyectos',  icon: 'folder' },
          ] as SidebarLink[])}"
          style="--lib-sidebar-width:200px;"
        ></lib-sidebar>
        <div style="flex:1;padding:var(--lib-space-md);background:var(--bg-base);font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);">content area</div>
      </div>
    </div>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── Acento de selección sigue al katachi (PR #448) ──────────────
   El link activo (variant dark por defecto) adopta el token de acento
   jade bajo celadon, no el kaki cálido hardcodeado. */
export const TestAccentCeladon: Story = {
  name: 'Test · accent del link activo sigue al katachi (celadon)',
  tags: ['test'],
  render: (): TemplateResult => katachiContext('celadon', html`
    <lib-sidebar
      active="dashboard"
      .links="${[{ id: 'dashboard', label: 'Dashboard', icon: 'home' }] as SidebarLink[]}"
    ></lib-sidebar>
  `),
  play: async ({ canvasElement }): Promise<void> => {
    const ctx = canvasElement.querySelector('[data-katachi="celadon"]') as HTMLElement;
    const host = ctx.querySelector('lib-sidebar') as LibSidebar;
    await host.updateComplete;
    const active = host.shadowRoot!.querySelector('.sb-link.is-active') as HTMLElement;
    expectAccentMatchesToken(active, 'color', ctx, '--text-accent');
  },
};
