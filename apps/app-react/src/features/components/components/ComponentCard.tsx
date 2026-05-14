import React from "react";
import { LibCard, LibBadge } from "@shibui-ui/ui/react";
import type { ComponentDto } from "../../../data/api/domain/components/api/components.api";

interface ComponentCardProps {
  component: ComponentDto;
  onSelect: (slug: string) => void;
}

const statusVariant: Record<string, string> = {
  stable:     "success",
  draft:      "warning",
  deprecated: "error",
};

export const ComponentCard: React.FC<ComponentCardProps> = ({ component, onSelect }) => {
  return (
    <LibCard
      variant="inverse"
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(component.slug)}
    >
      <LibBadge
        slot="tag"
        variant={statusVariant[component.status] ?? "default"}
        size="sm"
        pill
      >
        {component.status.toUpperCase()}
      </LibBadge>

      <h3 slot="title">{component.name}</h3>
      <p slot="description">{component.description}</p>

      <span
        slot="footer"
        style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.75rem", opacity: 0.6 }}
      >
        {component.tagName}
      </span>
    </LibCard>
  );
};
