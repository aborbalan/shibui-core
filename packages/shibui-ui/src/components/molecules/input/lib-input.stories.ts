import { Meta, StoryObj } from '@storybook/web-components-vite';
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
  title: 'Components/Molecules/Input',
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
  name: 'All Types',
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
  name: 'Error State',
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