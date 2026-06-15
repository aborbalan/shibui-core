import React from "react";
import { LibDataTable, LibDivider } from "@shibui-ui/ui/react";
import type { ComponentApiDto } from "../../../data/api/domain/components/api/components.api";

interface ComponentDetailApiProps {
  api?: ComponentApiDto;
}

/**
 * Referencia de API del componente (props / slots / events) derivada del
 * Custom Elements Manifest y servida en `GET /components/slug/:slug`.
 *
 * Renderiza una tabla por bloque, solo si tiene filas. Si `api` no llegó aún
 * (hidratación) o las tres listas están vacías, no pinta nada.
 */

// Las columnas se pasan tal cual al web component `lib-data-table`
// (el wrapper de React expone props sin tipar; el shape lo valida el elemento).
const propColumns = [
  { key: "name", header: "Prop", type: "mono" },
  { key: "attribute", header: "Atributo", type: "mono" },
  { key: "type", header: "Tipo", type: "mono", truncate: true },
  { key: "default", header: "Por defecto", type: "mono" },
  { key: "description", header: "Descripción", type: "text" },
];

const slotColumns = [
  { key: "name", header: "Slot", type: "mono" },
  { key: "description", header: "Descripción", type: "text" },
];

const eventColumns = [
  { key: "name", header: "Evento", type: "mono" },
  { key: "type", header: "Tipo", type: "mono", truncate: true },
  { key: "description", header: "Descripción", type: "text" },
];

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-accent)",
  marginBottom: "0.75rem",
};

const subTitleStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.05em",
  color: "var(--text-accent)",
  margin: "1.75rem 0 0.6rem",
};

interface ApiTableProps {
  title: string;
  columns: Array<Record<string, unknown>>;
  data: Array<Record<string, string>>;
}

const ApiTable: React.FC<ApiTableProps> = ({ title, columns, data }) => {
  if (data.length === 0) return null;
  return (
    <div>
      <p style={subTitleStyle}>{title}</p>
      <LibDataTable
        columns={columns}
        data={data}
        variant="lines"
        size="sm"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export const ComponentDetailApi: React.FC<ComponentDetailApiProps> = ({ api }) => {
  if (!api) return null;

  const props = api.props ?? [];
  const slots = api.slots ?? [];
  const events = api.events ?? [];

  if (props.length === 0 && slots.length === 0 && events.length === 0) {
    return null;
  }

  const propRows = props.map((p) => ({
    name: p.name,
    attribute: p.attribute || "—",
    type: p.type,
    default: p.default ?? "—",
    description: p.description || "",
  }));

  const slotRows = slots.map((s) => ({
    name: s.name || "(default)",
    description: s.description || "",
  }));

  const eventRows = events.map((e) => ({
    name: e.name,
    type: e.type || "—",
    description: e.description || "",
  }));

  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={sectionTitleStyle}>Referencia de API</h2>
      <LibDivider style={{ marginBottom: "0.5rem" }} />

      <ApiTable title="Props" columns={propColumns} data={propRows} />
      <ApiTable title="Slots" columns={slotColumns} data={slotRows} />
      <ApiTable title="Events" columns={eventColumns} data={eventRows} />
    </section>
  );
};
