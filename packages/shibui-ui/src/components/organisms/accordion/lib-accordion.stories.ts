import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-accordion.component';
import '../../atoms/accordion-item/lib-accordion-item.component';
import type { LibAccordion } from './lib-accordion.component';

type LibAccordionStoryArgs = Pick<LibAccordion, 'variant' | 'exclusive'>;

const meta: Meta<LibAccordionStoryArgs> = {
  title: 'Components/Organisms/Accordion',
  component: 'lib-accordion',
  tags:['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'flush', 'separated', 'accent'],
      description: 'Variante visual del accordion',
    },
    exclusive: {
      control: 'boolean',
      description: 'Solo un item abierto a la vez',
    },
  },

  render: (args): TemplateResult => html`
    <div style="max-width:640px; padding:24px; background:#F2EDE6;">
      <lib-accordion variant=${args.variant} ?exclusive=${args.exclusive}>
        <lib-accordion-item label="Que es el sistema Shibui?" open>
          Shibui es una libreria de componentes agnostica inspirada en la estetica japonesa de lo bello sin ostentacion. Construida sobre CSS custom properties y arquitectura basada en tokens.
        </lib-accordion-item>
        <lib-accordion-item label="Como se estructuran los tokens?">
          Los tokens se definen como CSS custom properties agrupados por categoria: color, tipografia, espaciado, radios, sombras, duraciones y easing. Todos los componentes consumen exclusivamente tokens.
        </lib-accordion-item>
        <lib-accordion-item label="Es compatible con frameworks?">
          Si. Al estar construido sobre Web Components con Lit, es compatible con cualquier framework o con vanilla JS: React, Angular, Vue o cualquier otra tecnologia.
        </lib-accordion-item>
        <lib-accordion-item label="Puedo desactivar las animaciones?">
          Todas las transiciones respetan prefers-reduced-motion. Puedes sobrescribir las variables --duration-* a 0ms para deshabilitar cualquier animacion de forma global o por componente.
        </lib-accordion-item>
      </lib-accordion>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibAccordionStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'default',
    exclusive: false,
  },
};

/* ── Default ── */
export const Default: Story = {
  args: { variant: 'default', exclusive: false },
};

/* ── Flush ── */
export const Flush: Story = {
  args: { variant: 'flush', exclusive: false },
  render: (): TemplateResult => html`
    <div style="max-width:640px; padding:24px; background:#F2EDE6;">
      <div style="background:#FFFFFF; padding:24px;">
        <lib-accordion variant="flush">
          <lib-accordion-item label="Diseno sin adornos" open>
            La variante flush elimina cualquier contenedor visual propio. El contenido se lee de forma lineal, como una extension natural del texto circundante.
          </lib-accordion-item>
          <lib-accordion-item label="Uso en sidebars y paneles">
            Sin padding lateral, flush se adhiere al borde de su contenedor. Perfecto para menus de navegacion colapsables o filtros de busqueda compactos.
          </lib-accordion-item>
          <lib-accordion-item label="Dividers sutiles entre items">
            Los separadores entre items se mantienen con border-subtle para conservar la lectura vertical sin anadir peso visual innecesario.
          </lib-accordion-item>
        </lib-accordion>
      </div>
    </div>
  `,
};

/* ── Separated ── */
export const Separated: Story = {
  args: { variant: 'separated', exclusive: false },
  render: (): TemplateResult => html`
    <div style="max-width:640px; padding:24px; background:#F2EDE6;">
      <lib-accordion variant="separated">
        <lib-accordion-item label="Tipografia — Cormorant Garamond">
          Fuente de display usada para titulos y elementos de alta jerarquia. Pesos disponibles: light (300), regular (400) y semibold (600).
        </lib-accordion-item>
        <lib-accordion-item label="Tipografia — Shippori Mincho" open>
          Fuente de cuerpo de texto. Su origen en la tipografia japonesa de bloque aporta una textura organica y calida al contenido largo.
        </lib-accordion-item>
        <lib-accordion-item label="Tipografia — DM Mono">
          Fuente monoespaciada para etiquetas, metadatos, codigo y navegacion. Su espaciado amplio y trazos finos la hacen especialmente adecuada a escalas pequenas.
        </lib-accordion-item>
      </lib-accordion>
    </div>
  `,
};

/* ── Accent ── */
export const Accent: Story = {
  args: { variant: 'accent', exclusive: false },
  render: (): TemplateResult => html`
    <div style="max-width:640px; padding:24px; background:#F2EDE6;">
      <lib-accordion variant="accent">
        <lib-accordion-item label="Paleta Washi" open>
          Escala de 10 tonos del blanco roto al negro calido. Es la paleta base del sistema: fondos, bordes, texto primario y secundario.
        </lib-accordion-item>
        <lib-accordion-item label="Paleta Kaki">
          Naranja tostado de influencia japonesa. Se usa como acento principal: botones primarios, links de enfasis y estados activos.
        </lib-accordion-item>
        <lib-accordion-item label="Paleta Celadon">
          Verde azulado inspirado en la ceramica celadon. Se usa para estados de exito, indicadores positivos y acentos secundarios.
        </lib-accordion-item>
      </lib-accordion>
    </div>
  `,
};

/* ── Exclusive mode ── */
export const Exclusive: Story = {
  name: 'Exclusive Mode',
  args: { variant: 'default', exclusive: true },
  render: (): TemplateResult => html`
    <div style="max-width:640px; padding:24px; background:#F2EDE6;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:16px;">
        Exclusive — solo un item abierto a la vez
      </p>
      <lib-accordion variant="default" exclusive>
        <lib-accordion-item label="Seccion 1 — Arquitectura" open>
          Atomic Design para separar la logica de los componentes en atomos, moleculas y organismos.
        </lib-accordion-item>
        <lib-accordion-item label="Seccion 2 — Lit y TypeScript">
          Lit proporciona una base ligera y eficiente para nuestros Web Components con TypeScript estricto.
        </lib-accordion-item>
        <lib-accordion-item label="Seccion 3 — Storybook">
          Storybook permite documentar y probar los componentes de forma aislada con historias por estado.
        </lib-accordion-item>
      </lib-accordion>
    </div>
  `,
};

/* ── All variants ── */
export const AllVariants: Story = {
  name: 'All Variants .',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:32px; padding:24px; background:#F2EDE6;">

      <div>
        <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:12px;">Default</p>
        <lib-accordion variant="default">
          <lib-accordion-item label="Item abierto" open>Contenido del item abierto por defecto.</lib-accordion-item>
          <lib-accordion-item label="Item cerrado">Contenido oculto hasta que se expande.</lib-accordion-item>
        </lib-accordion>
      </div>

      <div>
        <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:12px;">Flush</p>
        <div style="background:#FFFFFF; padding:16px 24px;">
          <lib-accordion variant="flush">
            <lib-accordion-item label="Item abierto" open>Contenido sin padding lateral, integrado en el contenedor.</lib-accordion-item>
            <lib-accordion-item label="Item cerrado">Contenido oculto hasta que se expande.</lib-accordion-item>
          </lib-accordion>
        </div>
      </div>

      <div>
        <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:12px;">Separated</p>
        <lib-accordion variant="separated">
          <lib-accordion-item label="Item abierto" open>Cada item es una tarjeta independiente con elevacion al abrirse.</lib-accordion-item>
          <lib-accordion-item label="Item cerrado">Contenido oculto hasta que se expande.</lib-accordion-item>
        </lib-accordion>
      </div>

      <div>
        <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:12px;">Accent</p>
        <lib-accordion variant="accent">
          <lib-accordion-item label="Item abierto" open>Borde kaki izquierdo y fondo kaki-50 al expandirse.</lib-accordion-item>
          <lib-accordion-item label="Item cerrado">Contenido oculto hasta que se expande.</lib-accordion-item>
        </lib-accordion>
      </div>

    </div>
  `,
};