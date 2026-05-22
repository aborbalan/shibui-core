import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-login-form.component';
import type { LibLoginForm } from './lib-login-form.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

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
   KATACHI · 形 · Las 6 historias estándar
   lib-login-form usa tokens semánticos de superficie y tipografía
   (bg-elevated, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <lib-login-form></lib-login-form>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
