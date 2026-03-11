import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-tabs.component';

const meta: Meta = {
  title: 'Components/Molecules/Tabs',
  component: 'lib-tabs',
  argTypes: {
    variant:  { control: 'select', options: ['underline', 'pill', 'card', 'outline', 'vertical'] },
    color:    { control: 'select', options: ['', 'kaki', 'celadon'] },
    size:     { control: 'select', options: ['', 'sm', 'lg'] },
    dark:     { control: 'boolean' },
    kintsugi: { control: 'boolean' },
    glitch:   { control: 'boolean' },
    scroll:   { control: 'boolean' },
    full:     { control: 'boolean' },
    active:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const svgInbox = `<svg viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="1"/><polyline points="2,6 8,9 14,6"/></svg>`;
const svgAlert = `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="8" y1="11" x2="8.01" y2="11"/></svg>`;
const svgSend  = `<svg viewBox="0 0 16 16"><line x1="15" y1="1" x2="8" y2="8"/><polygon points="15,1 10,15 8,8 1,6"/></svg>`;

/* ────────────────────────────────────────────
   Playground
   ──────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    variant:  'underline',
    color:    '',
    size:     '',
    dark:     false,
    kintsugi: false,
    glitch:   false,
    scroll:   false,
    full:     false,
    active:   'overview',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 2rem; ${args.dark ? 'background: var(--color-washi-950); padding: 2rem;' : ''}">
      <lib-tabs
        variant="${args.variant}"
        color="${args.color}"
        size="${args.size}"
        ?dark="${args.dark}"
        ?kintsugi="${args.kintsugi}"
        ?glitch="${args.glitch}"
        ?scroll="${args.scroll}"
        ?full="${args.full}"
        active="${args.active}"
        .items="${[
          { id: 'overview', label: 'Overview' },
          { id: 'code',     label: 'Código' },
          { id: 'docs',     label: 'Docs' },
          { id: 'issues',   label: 'Issues', disabled: true },
        ]}"
        @ui-lib-tab-change="${(e: CustomEvent): void => console.log('change', e.detail)}"
      >
        <div slot="overview" style="padding: 0.5rem 0; font-family: var(--lib-font-body); font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.8;">
          <strong style="color: var(--text-primary);">Overview</strong> — Contenido del primer panel.
        </div>
        <div slot="code" style="padding: 0.5rem 0; font-family: var(--lib-font-mono); font-size: 11px; color: var(--color-kaki-500); line-height: 1.9;">
          &lt;lib-tabs variant="underline" active="code"&gt;&lt;/lib-tabs&gt;
        </div>
        <div slot="docs" style="padding: 0.5rem 0; font-family: var(--lib-font-body); font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.8;">
          Documentación — Navegación por teclado: ← → mueve entre tabs.
        </div>
      </lib-tabs>
    </div>
  `,
};

/* ────────────────────────────────────────────
   Underline — variantes de color y tamaño
   ──────────────────────────────────────────── */
export const Underline: Story = {
  name: 'Underline — kaki · celadon · tamaños',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">

      <div>
        <p class="clabel" style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Kaki (default)</p>
        <lib-tabs variant="underline" active="u1-overview"
          .items="${[
            { id: 'u1-overview', label: 'Overview' },
            { id: 'u1-code',     label: 'Código' },
            { id: 'u1-docs',     label: 'Docs' },
            { id: 'u1-issues',   label: 'Issues', disabled: true },
          ]}">
          <div slot="u1-overview" style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Panel Overview — ink bar kaki con ease-bounce.</p></div>
          <div slot="u1-code"     style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Panel Código.</p></div>
          <div slot="u1-docs"     style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Panel Docs.</p></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Celadon</p>
        <lib-tabs variant="underline" color="celadon" active="u2-general"
          .items="${[
            { id: 'u2-general',  label: 'General' },
            { id: 'u2-security', label: 'Seguridad' },
            { id: 'u2-billing',  label: 'Facturación' },
            { id: 'u2-team',     label: 'Equipo' },
          ]}">
          <div slot="u2-general"  style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Ajustes generales.</p></div>
          <div slot="u2-security" style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Seguridad — 2FA, claves API.</p></div>
          <div slot="u2-billing"  style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Facturación — historial y métodos.</p></div>
          <div slot="u2-team"     style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Equipo — roles y permisos.</p></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Con iconos y badges</p>
        <lib-tabs variant="underline" active="u3-all"
          .items="${[
            { id: 'u3-all',     label: 'Todos',    icon: svgInbox, badge: 24 },
            { id: 'u3-unread',  label: 'Sin leer', icon: svgAlert, badge: 7  },
            { id: 'u3-sent',    label: 'Enviados', icon: svgSend               },
            { id: 'u3-archive', label: 'Archivo'                               },
          ]}">
          <div slot="u3-all"     style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Bandeja de entrada completa.</p></div>
          <div slot="u3-unread"  style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">7 mensajes sin leer.</p></div>
          <div slot="u3-sent"    style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Mensajes enviados.</p></div>
          <div slot="u3-archive" style="padding: 1rem 0;"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Archivados.</p></div>
        </lib-tabs>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">sm · lg</p>
        <lib-tabs variant="underline" size="sm" active="sz-sm-a"
          .items="${[{ id: 'sz-sm-a', label: 'Activos' }, { id: 'sz-sm-b', label: 'Inactivos' }, { id: 'sz-sm-c', label: 'Archivados' }]}">
          <div slot="sz-sm-a"><p style="font-size: var(--text-sm); color: var(--text-secondary); padding-top: 0.75rem;">sm — 36px, texto 10px.</p></div>
          <div slot="sz-sm-b"></div><div slot="sz-sm-c"></div>
        </lib-tabs>
        <lib-tabs variant="underline" size="lg" active="sz-lg-a"
          .items="${[{ id: 'sz-lg-a', label: 'Diseño' }, { id: 'sz-lg-b', label: 'Desarrollo' }, { id: 'sz-lg-c', label: 'Deploy' }]}">
          <div slot="sz-lg-a"><p style="font-size: var(--text-sm); color: var(--text-secondary); padding-top: 1rem;">lg — 52px, tracking amplio.</p></div>
          <div slot="sz-lg-b"></div><div slot="sz-lg-c"></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Pill
   ──────────────────────────────────────────── */
export const Pill: Story = {
  name: 'Pill — default · kaki · celadon',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; align-items: flex-start;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Default</p>
        <lib-tabs variant="pill" active="p1-a"
          .items="${[{ id: 'p1-a', label: 'Día' }, { id: 'p1-b', label: 'Semana' }, { id: 'p1-c', label: 'Mes' }, { id: 'p1-d', label: 'Año' }]}">
          <div slot="p1-a"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Vista diaria.</p></div>
          <div slot="p1-b"></div><div slot="p1-c"></div><div slot="p1-d"></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Kaki</p>
        <lib-tabs variant="pill" color="kaki" active="p2-a"
          .items="${[{ id: 'p2-a', label: 'Grid' }, { id: 'p2-b', label: 'Lista' }, { id: 'p2-c', label: 'Mosaic' }]}">
          <div slot="p2-a"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Vista grid.</p></div>
          <div slot="p2-b"></div><div slot="p2-c"></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Celadon</p>
        <lib-tabs variant="pill" color="celadon" active="p3-a"
          .items="${[{ id: 'p3-a', label: 'Componentes' }, { id: 'p3-b', label: 'Tokens' }, { id: 'p3-c', label: 'Motion' }]}">
          <div slot="p3-a"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Componentes.</p></div>
          <div slot="p3-b"></div><div slot="p3-c"></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Card + Outline
   ──────────────────────────────────────────── */
export const CardAndOutline: Story = {
  name: 'Card y Outline',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Card</p>
        <lib-tabs variant="card" active="c1-html"
          .items="${[
            { id: 'c1-html',    label: 'HTML' },
            { id: 'c1-css',     label: 'CSS' },
            { id: 'c1-js',      label: 'JS' },
            { id: 'c1-preview', label: 'Preview', disabled: true },
          ]}">
          <div slot="c1-html"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Estructura HTML del componente.</p></div>
          <div slot="c1-css"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Estilos CSS.</p></div>
          <div slot="c1-js"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Lógica JS.</p></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Outline</p>
        <lib-tabs variant="outline" active="o1-docs"
          .items="${[
            { id: 'o1-docs',     label: 'Docs' },
            { id: 'o1-api',      label: 'API' },
            { id: 'o1-examples', label: 'Ejemplos' },
          ]}">
          <div slot="o1-docs"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Documentación del componente.</p></div>
          <div slot="o1-api"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Referencia API.</p></div>
          <div slot="o1-examples"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Ejemplos de uso.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Vertical
   ──────────────────────────────────────────── */
export const Vertical: Story = {
  name: 'Vertical — con labels de grupo',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">

      <lib-tabs variant="vertical" active="v1-profile"
        .items="${[
          { id: 'v1-profile',  label: 'Perfil',          group: 'Cuenta' },
          { id: 'v1-security', label: 'Seguridad' },
          { id: 'v1-notif',    label: 'Notificaciones' },
          { id: 'v1-team',     label: 'Equipo',           group: 'Workspace' },
          { id: 'v1-billing',  label: 'Facturación' },
          { id: 'v1-ent',      label: 'Enterprise',       disabled: true },
        ]}">
        <div slot="v1-profile"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Nombre, avatar y bio.</p></div>
        <div slot="v1-security"><p style="font-size: var(--text-sm); color: var(--text-secondary);">2FA y sesiones activas.</p></div>
        <div slot="v1-notif"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Canales y frecuencia.</p></div>
        <div slot="v1-team"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Miembros y roles.</p></div>
        <div slot="v1-billing"><p style="font-size: var(--text-sm); color: var(--text-secondary);">Plan y pagos.</p></div>
      </lib-tabs>

      <div style="background: var(--color-washi-950); padding: 1.5rem;">
        <lib-tabs variant="vertical" dark active="v2-status"
          .items="${[
            { id: 'v2-status',  label: 'Estado',   group: 'Sistema' },
            { id: 'v2-logs',    label: 'Logs' },
            { id: 'v2-metrics', label: 'Métricas' },
            { id: 'v2-env',     label: 'Entorno',  group: 'Config' },
            { id: 'v2-secrets', label: 'Secrets' },
          ]}">
          <div slot="v2-status"><p  style="font-size: var(--text-sm); color: rgba(250,247,244,.45);">Estado del sistema.</p></div>
          <div slot="v2-logs"><p    style="font-size: var(--text-sm); color: rgba(250,247,244,.45);">Registro de eventos.</p></div>
          <div slot="v2-metrics"><p style="font-size: var(--text-sm); color: rgba(250,247,244,.45);">CPU, RAM, requests/s.</p></div>
          <div slot="v2-env"><p     style="font-size: var(--text-sm); color: rgba(250,247,244,.45);">Variables por stage.</p></div>
          <div slot="v2-secrets"><p style="font-size: var(--text-sm); color: rgba(250,247,244,.45);">Claves y tokens.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Dark
   ──────────────────────────────────────────── */
export const Dark: Story = {
  name: 'Surface dark',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="background: var(--color-washi-950); padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,.2); margin-bottom: 1.5rem;">Underline dark · kaki</p>
        <lib-tabs variant="underline" dark active="dk1-overview"
          .items="${[
            { id: 'dk1-overview', label: 'Overview' },
            { id: 'dk1-commits',  label: 'Commits' },
            { id: 'dk1-branches', label: 'Branches' },
            { id: 'dk1-releases', label: 'Releases', badge: 3 },
          ]}">
          <div slot="dk1-overview"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Underline dark — ink kaki sobre negro.</p></div>
          <div slot="dk1-commits"><p  style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Historial de commits.</p></div>
          <div slot="dk1-branches"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Ramas activas.</p></div>
          <div slot="dk1-releases"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Versiones publicadas.</p></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,.2); margin-bottom: 1.5rem;">Pill dark · kaki</p>
        <lib-tabs variant="pill" color="kaki" dark active="dk2-live"
          .items="${[{ id: 'dk2-live', label: 'Live' }, { id: 'dk2-staging', label: 'Staging' }, { id: 'dk2-preview', label: 'Preview' }]}">
          <div slot="dk2-live"><p    style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Entorno live.</p></div>
          <div slot="dk2-staging"></div><div slot="dk2-preview"></div>
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,.2); margin-bottom: 1.5rem;">Card dark</p>
        <lib-tabs variant="card" dark active="dk3-terminal"
          .items="${[{ id: 'dk3-terminal', label: 'Terminal' }, { id: 'dk3-output', label: 'Output' }, { id: 'dk3-problems', label: 'Problemas' }]}">
          <div slot="dk3-terminal"><pre style="font-family: var(--lib-font-mono); font-size: 9px; line-height: 1.9; color: rgba(250,247,244,.35);">✔ Build compiled in 2.4s&#10;✔ Chunks: main.js 248kB&#10;⚠ Bundle size warning: &gt;500kB</pre></div>
          <div slot="dk3-output"><p   style="font-size: var(--text-sm); color: rgba(250,247,244,.4);">Output del build.</p></div>
          <div slot="dk3-problems"><p style="font-size: var(--text-sm); color: rgba(250,247,244,.4);">Errores del compilador.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Kintsugi
   ──────────────────────────────────────────── */
export const Kintsugi: Story = {
  name: 'Kintsugi — ✦ gold ink',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Underline · light</p>
        <lib-tabs variant="underline" kintsugi active="ki1-wabi"
          .items="${[
            { id: 'ki1-wabi', label: 'Wabi' },
            { id: 'ki1-sabi', label: 'Sabi' },
            { id: 'ki1-mono', label: 'Mono no aware' },
            { id: 'ki1-ma',   label: 'Ma' },
          ]}">
          <div slot="ki1-wabi"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">侘び — La belleza de lo incompleto e impermanente.</p></div>
          <div slot="ki1-sabi"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">寂び — La belleza que nace del paso del tiempo.</p></div>
          <div slot="ki1-mono"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">物の哀れ — La conciencia de la impermanencia.</p></div>
          <div slot="ki1-ma"><p   style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">間 — El espacio y pausa entre dos cosas.</p></div>
        </lib-tabs>
      </div>

      <div style="background: var(--color-washi-950); padding: 1.5rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,.2); margin-bottom: 1.5rem;">Underline · dark</p>
        <lib-tabs variant="underline" kintsugi dark active="ki2-edo"
          .items="${[{ id: 'ki2-edo', label: 'Edo' }, { id: 'ki2-meiji', label: 'Meiji' }, { id: 'ki2-showa', label: 'Shōwa' }]}">
          <div slot="ki2-edo"><p   style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Era Edo — 1603–1868.</p></div>
          <div slot="ki2-meiji"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Era Meiji — 1868–1912.</p></div>
          <div slot="ki2-showa"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Era Shōwa — 1926–1989.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Glitch
   ──────────────────────────────────────────── */
export const Glitch: Story = {
  name: 'Glitch — ⌗ RGB split',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Glitch · light</p>
        <lib-tabs variant="underline" glitch active="gl1-system"
          .items="${[
            { id: 'gl1-system',   label: 'System' },
            { id: 'gl1-network',  label: 'Network' },
            { id: 'gl1-storage',  label: 'Storage' },
            { id: 'gl1-security', label: 'Security' },
          ]}">
          <div slot="gl1-system"><p   style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">CPU, memoria y procesos del sistema.</p></div>
          <div slot="gl1-network"><p  style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Tráfico y latencia de red.</p></div>
          <div slot="gl1-storage"><p  style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Uso de disco e IOPS.</p></div>
          <div slot="gl1-security"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Firewall e IDS.</p></div>
        </lib-tabs>
      </div>

      <div style="background: var(--color-washi-950); padding: 1.5rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,.2); margin-bottom: 1.5rem;">Glitch · dark</p>
        <lib-tabs variant="underline" glitch dark active="gl2-proc"
          .items="${[{ id: 'gl2-proc', label: 'Processes' }, { id: 'gl2-mem', label: 'Memory' }, { id: 'gl2-io', label: 'I/O' }]}">
          <div slot="gl2-proc"><p style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Procesos activos.</p></div>
          <div slot="gl2-mem"><p  style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Uso de heap y RAM.</p></div>
          <div slot="gl2-io"><p   style="padding-top: 1rem; font-size: var(--text-sm); color: rgba(250,247,244,.4);">Operaciones de I/O.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};

/* ────────────────────────────────────────────
   Scroll + Full
   ──────────────────────────────────────────── */
export const Extras: Story = {
  name: 'Extras — scroll · full-width',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Scrollable</p>
        <lib-tabs variant="underline" scroll active="sc-01"
          .items="${[
            { id: 'sc-01', label: 'Componentes' },
            { id: 'sc-02', label: 'Tokens' },
            { id: 'sc-03', label: 'Iconografía' },
            { id: 'sc-04', label: 'Tipografía' },
            { id: 'sc-05', label: 'Color' },
            { id: 'sc-06', label: 'Motion' },
            { id: 'sc-07', label: 'Espaciado' },
            { id: 'sc-08', label: 'Sombras' },
            { id: 'sc-09', label: 'Breakpoints' },
            { id: 'sc-10', label: 'Guía de uso' },
          ]}">
          <div slot="sc-01"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Componentes del sistema.</p></div>
          ${[2,3,4,5,6,7,8,9,10].map(n => html`<div slot="sc-0${n}"></div>`)}
        </lib-tabs>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.5rem;">Full-width · grid de columnas iguales</p>
        <lib-tabs variant="underline" full active="fw-login"
          .items="${[{ id: 'fw-login', label: 'Iniciar sesión' }, { id: 'fw-register', label: 'Registrarse' }, { id: 'fw-recover', label: 'Recuperar' }]}">
          <div slot="fw-login"><p    style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Formulario de inicio de sesión.</p></div>
          <div slot="fw-register"><p style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Formulario de registro.</p></div>
          <div slot="fw-recover"><p  style="padding-top: 1rem; font-size: var(--text-sm); color: var(--text-secondary);">Recuperación de contraseña.</p></div>
        </lib-tabs>
      </div>

    </div>
  `,
};