import React from "react";
import { componentPreviews } from "./previews";

interface ComponentPreviewProps {
  tagName: string;
}

const PREVIEW_HEIGHT = 120;

const frameStyle: React.CSSProperties = {
  height: PREVIEW_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  pointerEvents: "none",
  userSelect: "none",
  contentVisibility: "auto",
  containIntrinsicSize: `auto ${PREVIEW_HEIGHT}px`,
  marginTop: "var(--lib-space-sm)",
};

const placeholderStyle: React.CSSProperties = {
  ...frameStyle,
  flexDirection: "column",
  gap: "var(--lib-space-xs)",
  background: "var(--bg-elevated)",
  borderRadius: "var(--lib-radius-sm, 4px)",
};

const placeholderTagStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.7rem",
  color: "var(--text-muted)",
  opacity: 0.7,
};

/**
 * Mini-preview en vivo de un componente del catálogo, congelada
 * (sin interacción) para que la card siga siendo un único click.
 * Los tags sin entrada en el registro muestran un placeholder con
 * la misma altura para mantener el grid uniforme.
 */
export const ComponentPreview: React.FC<ComponentPreviewProps> = React.memo(
  ({ tagName }) => {
    const renderPreview = componentPreviews[tagName];

    if (!renderPreview) {
      return (
        <div style={placeholderStyle} aria-hidden="true">
          <lib-icon name="atom" size="lg" />
          <span style={placeholderTagStyle}>{`<${tagName}>`}</span>
        </div>
      );
    }

    return (
      <div style={frameStyle} aria-hidden="true">
        {renderPreview()}
      </div>
    );
  }
);

ComponentPreview.displayName = "ComponentPreview";
