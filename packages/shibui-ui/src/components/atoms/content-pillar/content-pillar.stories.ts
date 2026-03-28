import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, TemplateResult } from "lit";
import "./content-pillar.component";
import type { LibContentPillar } from "./content-pillar.component";

const stageDark = (c: ReturnType<typeof html>): TemplateResult =>
  html`<div style="padding:2.5rem;background:var(--color-washi-950,#120E0A);">
    ${c}
  </div>`;
const stageLight = (c: ReturnType<typeof html>): TemplateResult =>
  html`<div style="padding:2.5rem;background:#fff;">${c}</div>`;

const meta: Meta<LibContentPillar> = {
  title: "Data Display/ContentPillar",
  component: "lib-content-pillar",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    surface: { control: "select", options: ["dark", "light"] },
  },
};

export default meta;
type Story = StoryObj<LibContentPillar>;

export const Playground: Story = {
  name: "⚙ Playground",
  args: {
    kanji: "金",
    label: "Kintsugi · Cicatrices de oro",
    description:
      "Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente.",
    surface: "dark",
  },
  render: (args) => html`
    <div
      style="padding:2.5rem;background:${args.surface === "dark"
        ? "var(--color-washi-950,#120E0A)"
        : "#fff"};"
    >
      <lib-content-pillar
        kanji=${args.kanji}
        label=${args.label}
        description=${args.description}
        surface=${args.surface}
      ></lib-content-pillar>
    </div>
  `,
};

export const ThreePillars: Story = {
  name: "01 · Los tres pilares · dark",
  render: () =>
    stageDark(html`
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <lib-content-pillar
          kanji="侘"
          label="Wabi · Imperfección"
          description="La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia, no como error a corregir."
        ></lib-content-pillar>

        <lib-content-pillar
          kanji="金"
          label="Kintsugi · Cicatrices de oro"
          description="Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente."
        ></lib-content-pillar>

        <lib-content-pillar
          kanji="間"
          label="Ma · El espacio"
          description="El silencio entre notas. El espacio vacío no es ausencia — es presencia. Los tokens de espaciado están calibrados para crear respiración visual intencional."
        ></lib-content-pillar>
      </div>
    `),
};

export const ThreePillarsLight: Story = {
  name: "02 · Los tres pilares · light",
  render: () =>
    stageLight(html`
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <lib-content-pillar
          kanji="侘"
          label="Wabi · Imperfección"
          surface="light"
          description="La belleza en lo incompleto e impermanente."
        >
        </lib-content-pillar>
        <lib-content-pillar
          kanji="金"
          label="Kintsugi · Cicatrices de oro"
          surface="light"
          description="Reparar con oro en lugar de ocultar."
        >
        </lib-content-pillar>
        <lib-content-pillar
          kanji="間"
          label="Ma · El espacio"
          surface="light"
          description="El espacio vacío no es ausencia — es presencia."
        >
        </lib-content-pillar>
      </div>
    `),
  parameters: { backgrounds: { default: "paper" } },
};

export const RichContent: Story = {
  name: "03 · Rich content via slot",
  render: () =>
    stageDark(html`
      <lib-content-pillar kanji="間" label="Ma · El espacio">
        El silencio entre notas. El espacio vacío no es ausencia —
        <em style="font-style:italic;color:var(--color-kaki-400,#D97234);"
          >es presencia.</em
        >
        Los tokens de espaciado están calibrados para crear respiración visual
        intencional.
      </lib-content-pillar>
    `),
};
