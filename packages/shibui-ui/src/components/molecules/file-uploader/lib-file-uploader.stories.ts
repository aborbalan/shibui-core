import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';

// ✅ side-effect import — registra el custom element
import './lib-file-uploader.component';
import type { LibFileUploader } from './lib-file-uploader.component';

type Args = Partial<LibFileUploader>;

/* ================================================================
   META
   ================================================================ */

const meta: Meta<Args> = {
  title: 'Components/Molecules/File Uploader',
  component: 'lib-file-uploader',

  argTypes: {
    zone: {
      control: 'select',
      options: ['default', 'compact', 'image'],
      description: 'Variante de zona de drop',
    },
    title:       { control: 'text' },
    hint:        { control: 'text' },
    multiple:    { control: 'boolean' },
    accept:      { control: 'text' },
    disabled:    { control: 'boolean' },
    simulate:    { control: 'boolean', description: 'Simula el upload internamente' },
    simulateMs:  { control: 'number',  description: 'Duración simulada por archivo (ms)' },
  },
};

export default meta;
type Story = StoryObj<Args>;

/* ================================================================
   Playground
   ================================================================ */

export const Playground: Story = {
  args: {
    zone:       'default',
    title:      'Arrastra archivos aquí',
    hint:       'PDF, DOCX, PNG, JPG · máx. 20 MB por archivo',
    multiple:   true,
    accept:     '*',
    disabled:   false,
    simulate:   true,
    simulateMs: 2500,
  },
  render: (args): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:600px;">
      <lib-file-uploader
        zone="${args.zone ?? 'default'}"
        title="${args.title ?? ''}"
        hint="${args.hint ?? ''}"
        ?multiple="${args.multiple}"
        accept="${args.accept ?? '*'}"
        ?disabled="${args.disabled}"
        ?simulate="${args.simulate}"
        simulate-ms="${args.simulateMs ?? 2500}"
        @ui-lib-files-change="${(e: CustomEvent): void => console.log('files-change', e.detail)}"
        @ui-lib-upload-start="${(e: CustomEvent): void => console.log('upload-start', e.detail)}"
        @ui-lib-upload-done="${(e: CustomEvent): void => console.log('upload-done', e.detail)}"
        @ui-lib-upload-error="${(e: CustomEvent): void => console.log('upload-error', e.detail)}"
        @ui-lib-file-remove="${(e: CustomEvent): void => console.log('file-remove', e.detail)}"
      ></lib-file-uploader>
    </div>
  `,
};

/* ================================================================
   Zone grande — default
   ================================================================ */

export const ZoneDefault: Story = {
  name: 'Zone — Default (grande)',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:600px;background:var(--bg-surface);">
      <lib-file-uploader
        zone="default"
        title="Arrastra archivos aquí"
        hint="PDF, DOCX, PNG, JPG · máx. 20 MB por archivo"
        ?multiple="${true}"
        ?simulate="${true}"
        simulate-ms="2000"
      ></lib-file-uploader>
    </div>
  `,
};

/* ================================================================
   Zone compacta
   ================================================================ */

export const ZoneCompact: Story = {
  name: 'Zone — Compact (formulario)',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:480px;">
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">

        <!-- Simulando un campo de formulario -->
        <div style="display:flex;flex-direction:column;gap:var(--lib-space-xs);">
          <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:.15em;text-transform:uppercase;color:var(--text-secondary);">
            Documentación adjunta
          </label>
          <lib-file-uploader
            zone="compact"
            title="Adjuntar archivo"
            hint="PDF, DOCX · máx. 10 MB"
            accept=".pdf,.docx"
            ?multiple="${true}"
            ?simulate="${true}"
            simulate-ms="1800"
          ></lib-file-uploader>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--lib-space-xs);">
          <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:.15em;text-transform:uppercase;color:var(--text-secondary);">
            CV / Portfolio
          </label>
          <lib-file-uploader
            zone="compact"
            title="Subir CV"
            hint="PDF · máx. 5 MB"
            accept=".pdf"
            ?simulate="${true}"
          ></lib-file-uploader>
        </div>

      </div>
    </div>
  `,
};

/* ================================================================
   Zone imagen
   ================================================================ */

export const ZoneImage: Story = {
  name: 'Zone — Image (preview inline)',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:600px;">
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-xs);">
        <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:.15em;text-transform:uppercase;color:var(--text-secondary);">
          Imagen de portada
        </label>
        <lib-file-uploader
          zone="image"
          title="Arrastra una imagen"
          hint="PNG, JPG, WEBP · 16:9 recomendado"
          accept="image/*"
          ?simulate="${true}"
          simulate-ms="1500"
        ></lib-file-uploader>
      </div>
    </div>
  `,
};

/* ================================================================
   Tres zonas — side by side
   ================================================================ */

export const AllZones: Story = {
  name: 'Todas las zonas',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);display:flex;flex-direction:column;gap:var(--lib-space-xl);max-width:680px;">

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm);">zone="default"</p>
        <lib-file-uploader
          zone="default"
          title="Arrastra archivos aquí"
          hint="PDF, DOCX, PNG · máx. 20 MB"
          ?multiple="${true}"
          ?simulate="${true}"
        ></lib-file-uploader>
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm);">zone="compact"</p>
        <lib-file-uploader
          zone="compact"
          title="Adjuntar archivos"
          hint="PDF, DOCX · máx. 10 MB"
          ?multiple="${true}"
          ?simulate="${true}"
        ></lib-file-uploader>
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm);">zone="image"</p>
        <lib-file-uploader
          zone="image"
          title="Arrastra una imagen"
          hint="PNG, JPG, WEBP · 16:9 recomendado"
          accept="image/*"
          ?simulate="${true}"
        ></lib-file-uploader>
      </div>

    </div>
  `,
};

/* ================================================================
   Estados — disabled
   ================================================================ */

export const Disabled: Story = {
  name: 'Estado — Disabled',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);display:flex;flex-direction:column;gap:var(--lib-space-lg);max-width:600px;">
      <lib-file-uploader
        zone="default"
        title="Arrastra archivos aquí"
        hint="Zona deshabilitada"
        ?disabled="${true}"
      ></lib-file-uploader>

      <lib-file-uploader
        zone="compact"
        title="Adjuntar archivo"
        hint="Zona deshabilitada"
        ?disabled="${true}"
      ></lib-file-uploader>
    </div>
  `,
};

/* ================================================================
   Upload con tipos restringidos
   ================================================================ */

export const RestrictedTypes: Story = {
  name: 'Tipos restringidos',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);display:flex;flex-direction:column;gap:var(--lib-space-lg);max-width:600px;">

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm);">Solo PDF</p>
        <lib-file-uploader
          zone="compact"
          title="Subir PDF"
          hint="Solo archivos PDF · máx. 25 MB"
          accept=".pdf"
          ?simulate="${true}"
        ></lib-file-uploader>
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm);">Imágenes múltiples</p>
        <lib-file-uploader
          zone="default"
          title="Galería de imágenes"
          hint="PNG, JPG, WEBP · máx. 5 MB por imagen"
          accept="image/*"
          ?multiple="${true}"
          ?simulate="${true}"
          simulate-ms="1200"
        ></lib-file-uploader>
      </div>

    </div>
  `,
};