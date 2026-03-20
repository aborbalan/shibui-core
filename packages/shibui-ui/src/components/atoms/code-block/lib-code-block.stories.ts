import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-code-block.component';
import type { LibCodeBlock } from './lib-code-block.component';

type LibCodeBlockStoryArgs = Pick<
  LibCodeBlock,
  'code' | 'language' | 'filename' | 'copyable' | 'variant'
>;

const meta: Meta<LibCodeBlockStoryArgs> = {
  title: 'Layout & Surfaces/CodeBlock',
  component: 'lib-code-block',

  argTypes: {
    code: {
      control: 'text',
      description: 'Código a mostrar',
    },
    language: {
      control: 'select',
      options: ['bash', 'ts', 'js', 'html', 'css', 'json', 'text'],
      description: 'Etiqueta de lenguaje (decorativa)',
    },
    filename: {
      control: 'text',
      description: 'Nombre de fichero opcional en el header',
    },
    copyable: {
      control: 'boolean',
      description: 'Muestra el botón de copia',
    },
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
      description: 'Variante visual: default (oscuro) | ghost (claro)',
    },
  },

  render: (args): TemplateResult => html`
    <div style="padding: 24px; max-width: 640px;">
      <lib-code-block
        code=${args.code}
        language=${args.language}
        filename=${args.filename ?? ''}
        ?copyable=${args.copyable}
        variant=${args.variant}
      ></lib-code-block>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibCodeBlockStoryArgs>;

export const Playground: Story = {
  args: {
    code: 'npm install @shibui/ui lit',
    language: 'bash',
    filename: '',
    copyable: true,
    variant: 'default',
  },
};

export const Install: Story = {
  name: 'Instalación',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:16px; padding:24px; max-width:640px;">
      <lib-code-block
        language="bash"
        code="npm install @shibui/ui lit"
      ></lib-code-block>

      <lib-code-block
        language="bash"
        code="yarn add @shibui/ui lit"
      ></lib-code-block>

      <lib-code-block
        language="bash"
        code="pnpm add @shibui/ui lit"
      ></lib-code-block>
    </div>
  `,
};

export const WithFilename: Story = {
  name: 'Con nombre de fichero',
  render: (): TemplateResult => html`
    <div style="padding:24px; max-width:640px;">
      <lib-code-block
        language="ts"
        filename="main.ts"
        code="import '@shibui/ui';

const button = document.querySelector('lib-button');
button?.addEventListener('ui-lib-click', (e) => {
  console.log('clicked!', e.detail);
});"
      ></lib-code-block>
    </div>
  `,
};

export const MultiLanguage: Story = {
  name: 'Múltiples lenguajes',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:16px; padding:24px; max-width:640px;">

      <lib-code-block
        language="html"
        filename="index.html"
        code='<lib-button variant="primary">Click me</lib-button>
<lib-badge variant="celadon" dot>Activo</lib-badge>'
      ></lib-code-block>

      <lib-code-block
        language="ts"
        filename="sidebar.tsx"
        code="import { LibSidebar } from '@shibui/ui/react';

export const Nav = () => (
  <LibSidebar name='Alejandro B.' role='Frontend Dev' />
);"
      ></lib-code-block>

      <lib-code-block
        language="json"
        filename="package.json"
        code='{
  "dependencies": {
    "@shibui/ui": "^1.0.0",
    "lit": "^3.0.0"
  }
}'
      ></lib-code-block>
    </div>
  `,
};

export const GhostVariant: Story = {
  name: 'Variante ghost',
  render: (): TemplateResult => html`
    <div style="padding:24px; max-width:640px; background:var(--color-washi-100);">
      <lib-code-block
        variant="ghost"
        language="ts"
        filename="tokens.ts"
        code="// Importa los tokens globales en tu punto de entrada
import '@shibui/ui/styles';

// O solo los tokens CSS
import '@shibui/ui/tokens';"
      ></lib-code-block>
    </div>
  `,
};

export const NoCopy: Story = {
  name: 'Sin botón de copia',
  render: (): TemplateResult => html`
    <div style="padding:24px; max-width:640px;">
      <lib-code-block
        language="bash"
        code="Este bloque no se puede copiar"
        ?copyable=${false}
      ></lib-code-block>
    </div>
  `,
};