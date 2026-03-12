import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-checkbox-card.component';

const meta: Meta = {
  title: 'Components/Molecules/CheckboxCard',
  component: 'lib-checkbox-card',
  argTypes: {
    color:       { control: 'select', options: ['kaki', 'celadon'] },
    layout:      { control: 'select', options: ['vertical', 'horizontal', 'compact'] },
    'input-type':{ control: 'select', options: ['checkbox', 'radio'] },
    checked:     { control: 'boolean' },
    dark:        { control: 'boolean' },
    disabled:    { control: 'boolean' },
    error:       { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const dashboardIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
    style="width:28px;height:28px;">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>`;

const userIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
    style="width:28px;height:28px;">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;

const analyticsIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
    style="width:28px;height:28px;">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>`;

const featureList = (items: string[]): TemplateResult => html`
  <ul slot="features" class="cc-features">
    ${items.map(i => html`<li>${i}</li>`)}
  </ul>`;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    color: 'kaki', layout: 'vertical',
    'input-type': 'checkbox', checked: false,
    dark: false, disabled: false, error: false,
  },
  render: (args): TemplateResult => html`
    <div style="width:280px;padding:2rem;">
      <lib-checkbox-card
        color="${args.color}"
        layout="${args.layout}"
        input-type="${args['input-type']}"
        ?checked="${args.checked}"
        ?dark="${args.dark}"
        ?disabled="${args.disabled}"
        ?error="${args.error}"
        card-title="Dashboard"
        desc="Panel de control con métricas en tiempo real."
        @ui-lib-checkbox-card-change="${(e: CustomEvent): void => console.log(e.detail)}"
      >
        ${dashboardIcon}
      </lib-checkbox-card>
    </div>
  `,
};

/* ── Variante kaki — vertical con icono ── */
export const KakiVertical: Story = {
  name: 'Kaki · Vertical con icono',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(3,240px);gap:1rem;padding:2rem;">

      <lib-checkbox-card card-title="Dashboard"
        desc="Panel de control centralizado con métricas clave.">
        ${dashboardIcon}
      </lib-checkbox-card>

      <lib-checkbox-card card-title="Usuarios" checked
        desc="Gestión de cuentas, roles y permisos de acceso.">
        ${userIcon}
      </lib-checkbox-card>

      <lib-checkbox-card card-title="Analytics"
        desc="Informes de rendimiento, conversión y retención.">
        ${analyticsIcon}
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Badge + features ── */
export const BadgeAndFeatures: Story = {
  name: 'Badge + features list',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(3,240px);gap:1rem;padding:2rem;">

      <lib-checkbox-card card-title="Angular">
        <span slot="badge" class="cc-badge">Básico</span>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['Components', 'Services', 'Router'])}
      </lib-checkbox-card>

      <lib-checkbox-card card-title="RxJS" checked>
        <span slot="badge" class="cc-badge">Avanzado</span>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['Observables', 'Operators', 'Subjects', 'Schedulers'])}
      </lib-checkbox-card>

      <lib-checkbox-card card-title="Astro.js">
        <span slot="badge" class="cc-badge">Nuevo</span>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['Islands', 'SSG / SSR', 'View transitions'])}
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Celadon ── */
export const Celadon: Story = {
  name: 'Celadon · Pill checkmark',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(3,240px);gap:1rem;padding:2rem;">

      <lib-checkbox-card color="celadon" check-shape="pill"
        card-title="Seguridad" checked
        desc="Autenticación de dos factores y auditoría de accesos.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </lib-checkbox-card>

      <lib-checkbox-card color="celadon" check-shape="pill"
        card-title="Monitorización"
        desc="Alertas en tiempo real y dashboards de salud.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      </lib-checkbox-card>

      <lib-checkbox-card color="celadon" check-shape="pill"
        card-title="API Access"
        desc="Claves, webhooks y rate limiting configurables.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
        </svg>
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Horizontal ── */
export const Horizontal: Story = {
  name: 'Horizontal · layout denso',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:.75rem;max-width:560px;padding:2rem;">

      <lib-checkbox-card layout="horizontal" checked
        card-title="Dashboard principal"
        desc="Incluye widgets, filtros y exportación de datos.">
        ${dashboardIcon}
      </lib-checkbox-card>

      <lib-checkbox-card layout="horizontal"
        card-title="Notificaciones SMS"
        desc="Alertas críticas por mensaje al número verificado.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
        </svg>
      </lib-checkbox-card>

      <lib-checkbox-card layout="horizontal" disabled
        card-title="Módulo Enterprise"
        desc="Disponible en plan Enterprise. Requiere contrato.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Compact ── */
export const Compact: Story = {
  name: 'Compact · sin descripción',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;
      max-width:640px;padding:2rem;">
      ${['Angular','React','Astro','Vue','Svelte','Qwik','TypeScript','Node.js']
        .map((t, i) => html`
          <lib-checkbox-card layout="compact" card-title="${t}"
            ?checked="${i === 0 || i === 2 || i === 6}">
          </lib-checkbox-card>`)}
    </div>
  `,
};

/* ── Radio / Pricing ── */
export const RadioPricing: Story = {
  name: 'Radio · Pricing plans',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(3,240px);gap:1rem;padding:2rem;">

      <lib-checkbox-card input-type="radio" name="plan" card-title="Free">
        <span slot="badge" class="cc-badge">Starter</span>
        <div slot="price" class="cc-price"><sup>€</sup>0<sub>/mes</sub></div>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['5 proyectos', '1 usuario', '1 GB storage', 'Soporte comunidad'])}
      </lib-checkbox-card>

      <lib-checkbox-card input-type="radio" name="plan" card-title="Pro" checked>
        <span slot="badge" class="cc-badge">Popular</span>
        <div slot="price" class="cc-price"><sup>€</sup>24<sub>/mes</sub></div>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['Proyectos ilimitados', '10 usuarios', '50 GB storage',
          'Soporte prioritario', 'Analytics avanzado'])}
      </lib-checkbox-card>

      <lib-checkbox-card input-type="radio" name="plan" card-title="Custom">
        <span slot="badge" class="cc-badge">Enterprise</span>
        <div slot="price" class="cc-price" style="font-size:1.4rem;margin-top:1rem;">Contactar</div>
        <hr slot="divider" class="cc-divider"/>
        ${featureList(['Todo en Pro', 'SSO · SAML', 'SLA garantizado',
          'Onboarding dedicado', 'Auditoría compliance'])}
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Dark ── */
export const Dark: Story = {
  name: 'Dark · surface oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="background:var(--color-washi-950);padding:2rem;
      display:grid;grid-template-columns:repeat(3,240px);gap:1rem;">

      <lib-checkbox-card dark card-title="Dashboard"
        desc="Panel de control con métricas en tiempo real.">
        ${dashboardIcon}
      </lib-checkbox-card>

      <lib-checkbox-card dark checked card-title="Usuarios"
        desc="Gestión de cuentas, roles y permisos.">
        ${userIcon}
      </lib-checkbox-card>

      <lib-checkbox-card dark card-title="Analytics"
        desc="Informes de rendimiento y conversión.">
        ${analyticsIcon}
      </lib-checkbox-card>

    </div>
  `,
};

/* ── Estados ── */
export const States: Story = {
  name: 'Estados — disabled · error',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(3,240px);gap:1rem;padding:2rem;">

      <lib-checkbox-card card-title="Normal" desc="Estado base sin interacción.">
        ${dashboardIcon}
      </lib-checkbox-card>

      <lib-checkbox-card disabled card-title="Disabled"
        desc="Módulo no disponible en tu plan actual.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </lib-checkbox-card>

      <lib-checkbox-card error card-title="Error"
        desc="Este módulo contiene conflictos de configuración.">
        <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          style="width:28px;height:28px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </lib-checkbox-card>

    </div>
  `,
};