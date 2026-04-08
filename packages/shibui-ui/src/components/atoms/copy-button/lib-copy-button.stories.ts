import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-copy-button.component';
import type { LibCopyButton } from './lib-copy-button.component';

type LibCopyButtonStoryArgs = Pick<
  LibCopyButton,
  'value' | 'variant' | 'size' | 'iconOnly' | 'label' | 'successLabel' | 'tooltip' | 'disabled'
>;

const meta: Meta<LibCopyButtonStoryArgs> = {
  title: 'Components/Atoms/CopyButton',
  tags:['autodocs'],
  component: 'lib-copy-button',

  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'outlined', 'filled', 'subtle', 'on-dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconOnly:     { control: 'boolean', description: 'Modo icono-solo (cuadrado)' },
    tooltip:      { control: 'boolean', description: 'Tooltip "Copiado" al copiar' },
    disabled:     { control: 'boolean' },
    value:        { control: 'text' },
    label:        { control: 'text' },
    successLabel: { control: 'text' },
  },

  render: (args): TemplateResult => html`
    <div style="padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; display:inline-flex;">
      <lib-copy-button
        value=${args.value}
        variant=${args.variant}
        size=${args.size}
        label=${args.label}
        success-label=${args.successLabel}
        ?icon-only=${args.iconOnly}
        ?tooltip=${args.tooltip}
        ?disabled=${args.disabled}
      ></lib-copy-button>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibCopyButtonStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    value: 'npm install @shibui-ui/ui',
    variant: 'outlined',
    size: 'md',
    label: 'Copiar',
    successLabel: 'Copiado',
    iconOnly: false,
    tooltip: false,
    disabled: false,
  },
};

/* ── All Variants — con label ── */
export const AllVariants: Story = {
  name: 'All Variants — Label',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-copy-button variant="ghost"    value="ghost"    label="Ghost"    size="md"></lib-copy-button>
      <lib-copy-button variant="outlined" value="outlined" label="Outlined" size="md"></lib-copy-button>
      <lib-copy-button variant="filled"   value="filled"   label="Filled"   size="md"></lib-copy-button>
      <lib-copy-button variant="subtle"   value="subtle"   label="Subtle"   size="md"></lib-copy-button>
    </div>
    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:24px; background:#221C16; border:1px solid #3D332A; margin-top:1px;">
      <lib-copy-button variant="on-dark" value="on-dark" label="On Dark" size="md"></lib-copy-button>
    </div>
  `,
};

/* ── All Variants — icon only ── */
export const AllVariantsIconOnly: Story = {
  name: 'All Variants — Icon Only',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-copy-button variant="ghost"    value="ghost"    icon-only size="md"></lib-copy-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">Ghost</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-copy-button variant="outlined" value="outlined" icon-only size="md"></lib-copy-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">Outlined</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-copy-button variant="filled"   value="filled"   icon-only size="md"></lib-copy-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">Filled</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-copy-button variant="subtle"   value="subtle"   icon-only size="md"></lib-copy-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">Subtle</span>
      </div>
    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:12px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-copy-button variant="outlined" value="sm" label="Small"  size="sm"></lib-copy-button>
      <lib-copy-button variant="outlined" value="md" label="Medium" size="md"></lib-copy-button>
      <lib-copy-button variant="outlined" value="lg" label="Large"  size="lg"></lib-copy-button>
    </div>
  `,
};

/* ── Tooltip ── */
export const WithTooltip: Story = {
  name: 'With Tooltip.',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:16px; padding:40px 24px 24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-copy-button variant="ghost"    value="ghost"    icon-only tooltip size="sm"></lib-copy-button>
      <lib-copy-button variant="outlined" value="outlined" icon-only tooltip size="md"></lib-copy-button>
      <lib-copy-button variant="filled"   value="filled"   icon-only tooltip size="lg"></lib-copy-button>
    </div>
  `,
};

/* ── Context: Inline snippet ── */
export const ContextInlineSnippet: Story = {
  name: 'Context — Inline Snippet',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3; max-width:480px;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:12px;">
        Install command
      </p>
      <div style="display:inline-flex; align-items:center; border:1px solid #D3C8BC; background:#FFFFFF; overflow:hidden; max-width:100%;">
        <span style="font-family:monospace; font-size:11px; letter-spacing:0.08em; color:#7A6A5C; padding:8px 16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0; border-right:1px solid #E5DDD3;">
          npm install @shibui-ui/ui
        </span>
        <lib-copy-button
          variant="ghost"
          value="npm install @shibui-ui/ui"
          icon-only
          tooltip
          size="md"
        ></lib-copy-button>
      </div>
    </div>
  `,
};

/* ── Context: Token table ── */
export const ContextTokenTable: Story = {
  name: 'Context — Token Table',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3; max-width:560px;">
      ${[
        { name: '--color-kaki-500',    value: '#B85A1E' },
        { name: '--color-celadon-500', value: '#357164' },
        { name: '--font-display',      value: "'Cormorant Garamond'" },
        { name: '--space-8',           value: '2rem' },
      ].map(token => html`
        <div style="display:grid; grid-template-columns:1fr 1fr auto; align-items:center; gap:16px; padding:12px 20px; border-bottom:1px solid #E5DDD3; background:#FFFFFF;">
          <span style="font-family:monospace; font-size:11px; color:#221C16; letter-spacing:0.08em;">${token.name}</span>
          <span style="font-family:monospace; font-size:11px; color:#9A8878; letter-spacing:0.08em;">${token.value}</span>
          <lib-copy-button
            variant="ghost"
            value="${token.name}: ${token.value}"
            icon-only
            tooltip
            size="sm"
          ></lib-copy-button>
        </div>
      `)}
    </div>
  `,
};

/* ── Context: On dark / code block ── */
export const ContextCodeBlock: Story = {
  name: 'Context — Code Block',
  render: (): TemplateResult => html`
    <div style="max-width:520px; background:#221C16; border-radius:4px; overflow:hidden;">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.25);">CSS</span>
        <lib-copy-button
          variant="on-dark"
          value=":root { --color-kaki-500: #B85A1E; }"
          label="Copiar"
          size="md"
        ></lib-copy-button>
      </div>
      <div style="padding:20px 24px; font-family:monospace; font-size:13px; line-height:1.75; color:rgba(255,255,255,0.75);">
        <span style="color:rgba(255,255,255,0.28); font-style:italic;">/* Shibui · Design Tokens */</span><br>
        <span style="color:oklch(75% 0.06 290);">:root</span> {<br>
        &nbsp;&nbsp;<span style="color:oklch(80% 0.07 55);">--color-kaki-500</span><span style="color:rgba(255,255,255,0.4)">:</span>    <span style="color:oklch(78% 0.08 140);">#B85A1E</span>;<br>
        &nbsp;&nbsp;<span style="color:oklch(80% 0.07 55);">--font-display</span><span style="color:rgba(255,255,255,0.4)">:</span>      <span style="color:oklch(78% 0.08 140);">'Cormorant Garamond'</span>;<br>
        }
      </div>
    </div>
  `,
};