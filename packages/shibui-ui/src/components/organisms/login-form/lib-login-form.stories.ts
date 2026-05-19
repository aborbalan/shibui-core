import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-login-form.component';
import type { LibLoginForm } from './lib-login-form.component';

type LoginFormStoryArgs = Pick<LibLoginForm, 'loading' | 'errorMessage'>;

const meta: Meta<LoginFormStoryArgs> = {
  title: 'Forms/LoginForm',
  tags: ['autodocs'],
  component: 'lib-login-form',
  argTypes: {
    loading:      { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<LoginFormStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    loading:      false,
    errorMessage: '',
  },
  render: (args: LoginFormStoryArgs): TemplateResult => html`
    <lib-login-form
      ?loading="${args.loading}"
      errorMessage="${args.errorMessage}"
      @ui-lib-login-submit="${(e: CustomEvent): void => {
        console.log('ui-lib-login-submit', e.detail);
      }}"
    ></lib-login-form>
  `,
};

/* ── Estado inicial ── */
export const Default: Story = {
  name: 'Default — Formulario vacío',
  render: (): TemplateResult => html`
    <lib-login-form
      @ui-lib-login-submit="${(e: CustomEvent): void => console.log(e.detail)}"
    ></lib-login-form>
  `,
};

/* ── Cargando ── */
export const Loading: Story = {
  name: 'Loading — Iniciando sesión',
  render: (): TemplateResult => html`
    <lib-login-form loading></lib-login-form>
  `,
};

/* ── Error de servidor ── */
export const WithServerError: Story = {
  name: 'Error — Credenciales incorrectas',
  render: (): TemplateResult => html`
    <lib-login-form
      errorMessage="Correo o contraseña incorrectos. Comprueba tus datos e inténtalo de nuevo."
    ></lib-login-form>
  `,
};

/* ── Slot header personalizado ── */
export const CustomHeader: Story = {
  name: 'Slot — Título personalizado',
  render: (): TemplateResult => html`
    <lib-login-form
      @ui-lib-login-submit="${(e: CustomEvent): void => console.log(e.detail)}"
    >
      <div slot="header">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">
          Shibui Design System
        </p>
        <h2 style="font-size:var(--text-xl);font-weight:var(--weight-light);letter-spacing:var(--tracking-tight);color:var(--text-primary);">
          Accede a tu cuenta
        </h2>
      </div>
      <div slot="footer">
        <a href="#" style="font-size:var(--text-xs);color:var(--text-accent);">
          ¿Olvidaste la contraseña?
        </a>
      </div>
    </lib-login-form>
  `,
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
          <lib-login-form></lib-login-form>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};
