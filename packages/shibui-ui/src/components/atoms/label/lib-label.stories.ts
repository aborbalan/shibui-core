import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-label.component';
import type { LibLabel } from './lib-label.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibLabelStoryArgs = Pick<LibLabel, 'htmlFor' | 'required'>;

/* ── Stage helpers ── */
const stageLight = (content: TemplateResult): TemplateResult => html`
  <div style="padding:2.5rem 2rem; background:var(--bg-surface, #fff); border:1px solid var(--border-subtle, #E5DDD3); display:flex; flex-direction:column; gap:1.5rem;">
    ${content}
  </div>
`;

const stageDark = (content: TemplateResult): TemplateResult => html`
  <div style="padding:2.5rem 2rem; background:oklch(15% 0.02 180deg); border:1px solid rgba(255,255,255,.06); display:flex; flex-direction:column; gap:1.5rem;">
    ${content}
  </div>
`;

const field = (label: TemplateResult, control: TemplateResult): TemplateResult => html`
  <div style="display:flex; flex-direction:column; gap:6px; max-width:320px;">
    ${label}
    ${control}
  </div>
`;

const inputEl = (id: string, placeholder = ''): TemplateResult => html`
  <input
    id=${id}
    placeholder=${placeholder}
    style="
      width:100%; padding:8px 12px;
      font-family:var(--lib-font-family, inherit); font-size:.875rem;
      border:1px solid var(--border-default, #C8B9AB);
      border-radius:6px; outline:none;
      background:var(--bg-elevated, #fff);
      color:var(--text-primary, #3D332A);
    "
  />
`;

/* ── Meta ── */
const meta: Meta<LibLabelStoryArgs> = {
  title: 'Universal/Forms/Label',
  component: 'lib-label',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**\`<lib-label>\`** — Etiqueta accesible para controles de formulario.

Enlaza con su input vía \`htmlFor\` (se traduce al atributo \`for\` del \`<label>\` nativo).
El indicador de obligatoriedad (\`required\`) añade un asterisco rojo accesible mediante \`aria-hidden\`.

### Atributos

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| \`htmlFor\` | \`string\` | \`''\` | ID del control asociado |
| \`required\` | \`boolean\` | \`false\` | Muestra indicador visual de campo obligatorio |

### Uso básico

\`\`\`html
<lib-label html-for="email" required>Correo electrónico</lib-label>
<input id="email" type="email" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    htmlFor:  { control: 'text',    description: 'ID del input asociado' },
    required: { control: 'boolean', description: 'Muestra asterisco de campo obligatorio' },
  },
  render: (args): TemplateResult => html`
    <div style="padding:2rem; background:var(--bg-surface, #fff);">
      ${field(
        html`<lib-label html-for=${args.htmlFor || 'demo'} ?required=${args.required}>Nombre completo</lib-label>`,
        inputEl(args.htmlFor || 'demo', 'Introduce tu nombre'),
      )}
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibLabelStoryArgs>;

/* ══════════════════════════════════════════
   Playground
   ══════════════════════════════════════════ */
export const Playground: Story = {
  name: '⚙ Playground',
  args: { htmlFor: 'input-demo', required: false },
};

/* ══════════════════════════════════════════
   01 · Base
   ══════════════════════════════════════════ */
export const Base: Story = {
  name: '01 · Base',
  render: (): TemplateResult => stageLight(html`
    ${field(
      html`<lib-label html-for="nombre">Nombre completo</lib-label>`,
      inputEl('nombre', 'Ej. Alejandro Borbalán'),
    )}
    ${field(
      html`<lib-label html-for="empresa">Empresa</lib-label>`,
      inputEl('empresa', 'Ej. Shibui Labs'),
    )}
    ${field(
      html`<lib-label html-for="rol">Rol</lib-label>`,
      inputEl('rol', 'Ej. Senior Developer'),
    )}
  `),
};

/* ══════════════════════════════════════════
   02 · Required
   ══════════════════════════════════════════ */
export const Required: Story = {
  name: '02 · Required — indicador visual',
  render: (): TemplateResult => stageLight(html`
    ${field(
      html`<lib-label html-for="email-req" required>Correo electrónico</lib-label>`,
      inputEl('email-req', 'usuario@ejemplo.com'),
    )}
    ${field(
      html`<lib-label html-for="pass-req" required>Contraseña</lib-label>`,
      html`<input id="pass-req" type="password" placeholder="••••••••" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid var(--border-default,#C8B9AB);border-radius:6px;outline:none;background:var(--bg-elevated,#fff);color:var(--text-primary,#3D332A);" />`,
    )}
    ${field(
      html`<lib-label html-for="empresa-opt">Empresa <span style="font-family:monospace;font-size:10px;font-weight:400;color:var(--text-muted,#9A8878);margin-left:4px;">(opcional)</span></lib-label>`,
      inputEl('empresa-opt', 'Ej. Shibui Labs'),
    )}
  `),
};

/* ══════════════════════════════════════════
   03 · Contexto — controles mixtos
   ══════════════════════════════════════════ */
export const ContextMixed: Story = {
  name: '03 · Contexto — controles mixtos',
  render: (): TemplateResult => stageLight(html`
    ${field(
      html`<lib-label html-for="ctx-input" required>Nombre de usuario</lib-label>`,
      inputEl('ctx-input', '@alias'),
    )}
    <div style="display:flex; flex-direction:column; gap:6px; max-width:320px;">
      <lib-label html-for="ctx-select">País</lib-label>
      <select id="ctx-select" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid var(--border-default,#C8B9AB);border-radius:6px;background:var(--bg-elevated,#fff);color:var(--text-primary,#3D332A);">
        <option>España</option>
        <option>México</option>
        <option>Argentina</option>
      </select>
    </div>
    <div style="display:flex; align-items:center; gap:10px; max-width:320px;">
      <input id="ctx-check" type="checkbox" style="width:16px;height:16px;accent-color:var(--color-celadon-500,#357164);" />
      <lib-label html-for="ctx-check">Acepto los términos y condiciones</lib-label>
    </div>
  `),
};

/* ══════════════════════════════════════════
   04 · Formulario completo
   ══════════════════════════════════════════ */
export const FormGroup: Story = {
  name: '04 · Formulario completo',
  render: (): TemplateResult => html`
    <div style="padding:2.5rem 2rem; background:var(--bg-surface,#fff); border:1px solid var(--border-subtle,#E5DDD3); max-width:480px;">
      <div style="font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; color:var(--text-primary,#3D332A); margin-bottom:1.5rem;">
        Crear cuenta
      </div>
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          ${field(
            html`<lib-label html-for="f-nombre" required>Nombre</lib-label>`,
            inputEl('f-nombre', 'Alejandro'),
          )}
          ${field(
            html`<lib-label html-for="f-apellido" required>Apellido</lib-label>`,
            inputEl('f-apellido', 'Borbalán'),
          )}
        </div>
        ${field(
          html`<lib-label html-for="f-email" required>Correo electrónico</lib-label>`,
          inputEl('f-email', 'usuario@ejemplo.com'),
        )}
        ${field(
          html`<lib-label html-for="f-empresa">Empresa <span style="font-family:monospace;font-size:10px;font-weight:400;color:var(--text-muted,#9A8878);margin-left:4px;">(opcional)</span></lib-label>`,
          inputEl('f-empresa', 'Shibui Labs'),
        )}
        ${field(
          html`<lib-label html-for="f-pass" required>Contraseña</lib-label>`,
          html`<input id="f-pass" type="password" placeholder="••••••••" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid var(--border-default,#C8B9AB);border-radius:6px;outline:none;background:var(--bg-elevated,#fff);color:var(--text-primary,#3D332A);" />`,
        )}
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <input id="f-terms" type="checkbox" style="width:16px;height:16px;margin-top:1px;accent-color:var(--color-celadon-500,#357164);flex-shrink:0;" />
          <lib-label html-for="f-terms" required>Acepto los términos del servicio y la política de privacidad</lib-label>
        </div>
        <button style="padding:10px 20px;background:var(--color-washi-900,#1F170F);color:#fff;border:none;border-radius:6px;font-size:.875rem;font-weight:600;cursor:pointer;margin-top:.5rem;">
          Crear cuenta
        </button>
      </div>
    </div>
  `,
};

/* ══════════════════════════════════════════
   05 · Dark / Celadon
   ══════════════════════════════════════════ */
export const DarkCeladon: Story = {
  name: '05 · Dark — celadon surface',
  render: (): TemplateResult => stageDark(html`
    <div style="color:oklch(90% 0.04 180deg);">
      <p style="font-family:monospace; font-size:10px; color:oklch(60% 0.04 180deg); letter-spacing:.2em; text-transform:uppercase; margin-bottom:1.5rem;">
        data-katachi="celadon"
      </p>
      ${field(
        html`<lib-label html-for="dk-email" required>Correo electrónico</lib-label>`,
        html`<input id="dk-email" placeholder="usuario@ejemplo.com" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid oklch(30% 0.04 180deg);border-radius:6px;outline:none;background:oklch(18% 0.025 178deg);color:oklch(90% 0.04 180deg);" />`,
      )}
      ${field(
        html`<lib-label html-for="dk-pass" required>Contraseña</lib-label>`,
        html`<input id="dk-pass" type="password" placeholder="••••••••" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid oklch(30% 0.04 180deg);border-radius:6px;outline:none;background:oklch(18% 0.025 178deg);color:oklch(90% 0.04 180deg);" />`,
      )}
      ${field(
        html`<lib-label html-for="dk-opt">Empresa <span style="font-family:monospace;font-size:10px;font-weight:400;color:oklch(50% 0.03 180deg);margin-left:4px;">(opcional)</span></lib-label>`,
        html`<input id="dk-opt" placeholder="Shibui Labs" style="width:100%;padding:8px 12px;font-size:.875rem;border:1px solid oklch(30% 0.04 180deg);border-radius:6px;outline:none;background:oklch(18% 0.025 178deg);color:oklch(90% 0.04 180deg);" />`,
      )}
    </div>
  `),
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-label usa tokens semánticos de texto y borde
   (text-primary, text-muted, border-default) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);padding:var(--lib-space-md);background:var(--bg-elevated);border:1px solid var(--border-subtle);max-width:260px;">
    <div style="display:flex;flex-direction:column;gap:4px;">
      <lib-label html-for="kt-email" required>Correo electrónico</lib-label>
      <input id="kt-email" placeholder="usuario@ejemplo.com"
        style="padding:7px 10px;font-size:.875rem;border:1px solid var(--border-default);border-radius:4px;outline:none;background:var(--bg-elevated);color:var(--text-primary);" />
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <lib-label html-for="kt-empresa">Empresa</lib-label>
      <input id="kt-empresa" placeholder="Shibui Labs"
        style="padding:7px 10px;font-size:.875rem;border:1px solid var(--border-default);border-radius:4px;outline:none;background:var(--bg-elevated);color:var(--text-primary);" />
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
