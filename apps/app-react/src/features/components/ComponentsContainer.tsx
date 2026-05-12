import React from "react";
import { useNavigate } from "react-router-dom";
import { LibBackground } from "@shibui-ui/ui/react";
import { useCategoriesWithComponents } from "../../data/api/domain/components/hooks/useComponents";
import { ComponentsGrid } from "./components/ComponentsGrid";

export const ComponentsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isPending, error } = useCategoriesWithComponents();

  const handleSelect = (slug: string) => {
    navigate(`/componentes/${slug}`);
  };

  return (
    <LibBackground variant="midnight">
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "calc(56px + 3rem) clamp(1.5rem, 4vw, 3.5rem) 6rem",
        }}
      >
        <header style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "var(--lib-font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-kaki-400)",
              marginBottom: "0.75rem",
            }}
          >
            Design System
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Componentes
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-ink-300)",
              maxWidth: "52ch",
            }}
          >
            {!isPending && !error && `${categories.reduce((acc, c) => acc + c.components.length, 0)} componentes · ${categories.length} categorías`}
          </p>
        </header>

        <ComponentsGrid
          categories={categories}
          onSelect={handleSelect}
          isLoading={isPending}
          error={error}
        />
      </div>
    </LibBackground>
  );
};
