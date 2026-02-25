import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-breadcrumb.component';
import { BreadcrumbItem } from './lib-breadcrumb.types';

interface BreadcrumbArgs {
  items: BreadcrumbItem[];
  separator: string;
}

const meta: Meta<BreadcrumbArgs> = {
  title: 'Navigation/Breadcrumb',
  component: 'lib-breadcrumb',
  argTypes: {
    separator: {
      control: 'select',
      options: ['caret-right', 'chevron-right', 'arrow-right', 'slash'],
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumbArgs>;

export const Default: Story = {
  render: (args: BreadcrumbArgs): TemplateResult => html`
    <lib-breadcrumb 
      .items="${args.items}" 
      .separator="${args.separator}"
    ></lib-breadcrumb>
  `,
  args: {
    separator: 'caret-right',
    items: [
      { label: 'Home', href: '/', icon: 'house' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones' }, // El último sin href por defecto
    ],
  },
};

export const CustomSeparator: Story = {
  render: (args: BreadcrumbArgs): TemplateResult => html`
    <lib-breadcrumb 
      .items="${args.items}" 
      .separator="slash"
    ></lib-breadcrumb>
  `,
  args: {
    items: [
      { label: 'Admin', href: '/admin' },
      { label: 'Settings', href: '/admin/settings' },
      { label: 'Security' },
    ],
  },
};

export const OnlyIcons: Story = {
  render: (args: BreadcrumbArgs): TemplateResult => html`
    <lib-breadcrumb 
      .items="${args.items}"
    ></lib-breadcrumb>
  `,
  args: {
    items: [
      { label: '', href: '/', icon: 'house' },
      { label: 'Files', href: '/files', icon: 'folder' },
      { label: 'Project-Final.pdf', icon: 'file-pdf' },
    ],
  },
};