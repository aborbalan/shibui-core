import React from "react";
import { LibCard } from "@shibui-ui/ui/react";
import type { ComponentDto } from "../../../data/api/domain/components/api/components.api";

interface ComponentCardProps {
  component: ComponentDto;
  onSelect: (slug: string) => void;
}

const statusLabel: Record<string, string> = {
  stable: "STABLE",
  draft: "DRAFT",
  deprecated: "DEPRECATED",
};

const statusColor: Record<string, React.CSSProperties> = {
  stable: { color: "var(--color-celadon-300)", fontSize: "0.65rem", fontFamily: "var(--lib-font-mono)", letterSpacing: "0.08em" },
  draft: { color: "var(--color-kaki-300)", fontSize: "0.65rem", fontFamily: "var(--lib-font-mono)", letterSpacing: "0.08em" },
  deprecated: { color: "color-mix(in oklch, red 60%, white)", fontSize: "0.65rem", fontFamily: "var(--lib-font-mono)", letterSpacing: "0.08em" },
};

export const ComponentCard: React.FC<ComponentCardProps> = ({ component, onSelect }) => {
  return (
    <LibCard
      variant="inverse"
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(component.slug)}
    >
      <span slot="tag" style={statusColor[component.status] ?? statusColor.draft}>
        {statusLabel[component.status] ?? component.status}
      </span>
      <h3 slot="title">{component.name}</h3>
      <p slot="description">{component.description}</p>
      <span slot="footer" style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.75rem", opacity: 0.6 }}>
        {component.tagName}
      </span>
    </LibCard>
  );
};
