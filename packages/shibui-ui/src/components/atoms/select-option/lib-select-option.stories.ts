import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-select-option.component';

interface SelectOptionArgs {
  value:    string;
  selected: boolean;
  disabled: boolean;
  content:  string;
}

const meta: Meta<SelectOptionArgs> = {
  title: 'Components/Atoms/SelectOption',
  tags:['autodocs'],
  component: 'lib-select-option',
  argTypes: {
    value:    { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    content:  { control: 'text', name: 'Slot Content' },
  },
  render: (args): TemplateResult => html`
    <div style="background: var(--bg-elevated); padding: 8px; width: 300px; border: 1px solid var(--border-subtle);">
      <lib-select-option
        value="${args.value}"
        ?selected="${args.selected}"
        ?disabled="${args.disabled}"
      >
        ${args.content}
      </lib-select-option>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SelectOptionArgs>;

export const Playground: Story = {
  args: {
    value:    'opcion-1',
    content:  'Opción de ejemplo',
    selected: false,
    disabled: false,
  },
};

export const AllStates: Story = {
  name: 'All States.',
  render: (): TemplateResult => html`
    <div style="background: var(--bg-elevated); width: 300px; border: 1px solid var(--border-subtle);">
      <lib-select-option value="a">Default</lib-select-option>
      <lib-select-option value="b" selected>Selected</lib-select-option>
      <lib-select-option value="c" disabled>Disabled</lib-select-option>
    </div>
  `,
};