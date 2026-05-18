import { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent } from 'storybook/test';
import { html, TemplateResult } from 'lit';
import './lib-input.component';

type LibInputArgs = {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password';
  required: boolean;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  value: string;
};

const meta: Meta<LibInputArgs> = {
  title: 'Forms/Input',
  tags:['autodocs'],
  component: 'lib-input',
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
      description: 'Tipo de input',
    },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error:    { control: 'boolean' },
  },
  render: (args): TemplateResult => html`
    <div style="max-width: 320px; padding: var(--lib-space-lg);">
      <lib-input
        label="${args.label}"
        placeholder="${args.placeholder}"
        type="${args.type}"
        ?required="${args.required}"
        ?disabled="${args.disabled}"
        ?error="${args.error}"
        errorMessage="${args.errorMessage}"
        value="${args.value}"
      ></lib-input>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibInputArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    type: 'text',
    required: false,
    disabled: false,
    error: false,
    errorMessage: '',
    value: '',
  },
};

/* ── Variantes de tipo ── */
export const AllTypes: Story = {
  name: 'Types',
  render: (): TemplateResult => html`
    <div style="max-width: 320px; padding: var(--lib-space-lg); display: flex; flex-direction: column; gap: var(--lib-space-md);">
      <lib-input label="Name" placeholder="Enter your name" type="text"></lib-input>
      <lib-input label="Email" placeholder="you@example.com" type="email"></lib-input>
      <lib-input label="Password" placeholder="••••••••" type="password"></lib-input>
    </div>
  `,
};

/* ── Con slots ── */
export const WithSlots: Story = {
  name: 'With Prefix & Suffix',
  render: (): TemplateResult => html`
    <div style="max-width: 320px; padding: var(--lib-space-lg); display: flex; flex-direction: column; gap: var(--lib-space-md);">
      <lib-input label="Email" placeholder="you@example.com" type="email">
        <span slot="prefix" style="font-size: 14px;">@</span>
      </lib-input>
      <lib-input label="Search" placeholder="Search...">
        <span slot="prefix" style="font-size: 14px;">⌕</span>
      </lib-input>
    </div>
  `,
};

/* ── Estado error ── */
export const ErrorState: Story = {
  name: 'Error',
  render: (): TemplateResult => html`
    <div style="max-width: 320px; padding: var(--lib-space-lg); display: flex; flex-direction: column; gap: var(--lib-space-md);">
      <lib-input
        label="Email"
        placeholder="you@example.com"
        type="email"
        value="invalid-email"
        ?error="${true}"
        errorMessage="Please enter a valid email address"
      ></lib-input>
    </div>
  `,
};

/* ── Estado disabled ── */
export const Disabled: Story = {
  render: (): TemplateResult => html`
    <div style="max-width: 320px; padding: var(--lib-space-lg); display: flex; flex-direction: column; gap: var(--lib-space-md);">
      <lib-input label="Name" placeholder="Not available" ?disabled="${true}"></lib-input>
      <lib-input label="Email" value="fixed@example.com" ?disabled="${true}"></lib-input>
    </div>
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
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <lib-input label="Tu nombre" placeholder="Akira Kurosawa"></lib-input>
          <lib-input label="Email" type="email" placeholder="hello@shibui.dev"></lib-input>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ═══════════════════════════════════════════════════════════════
   TESTS · Interacción y accesibilidad
   ═══════════════════════════════════════════════════════════════ */

export const TestInputEvent: Story = {
  name: 'Test · ui-lib-input se dispara al teclear',
  tags: ['test'],
  args: { label: 'Email', placeholder: 'test@example.com', type: 'text', disabled: false, error: false },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-input') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    let detail: { value: string } | null = null;
    canvasElement.addEventListener('ui-lib-input', (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    }, { once: true });

    await userEvent.type(input, 'hola');

    expect(detail).not.toBeNull();
    expect(typeof detail!.value).toBe('string');
  },
};

export const TestErrorAriaInvalid: Story = {
  name: 'Test · error=true activa aria-invalid',
  tags: ['test'],
  args: { label: 'Email', error: true, errorMessage: 'Campo requerido' },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-input') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
  },
};

export const TestDisabledInput: Story = {
  name: 'Test · disabled bloquea la edición',
  tags: ['test'],
  args: { label: 'Campo', disabled: true },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-input') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
  },
};
