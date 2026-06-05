import { LibCard, LibIcon } from '@shibui-ui/ui/react';
import type { AreaId } from './areas';
import { AREAS } from './areas';
import './main.css';

interface HubPanelProps {
  /** Abre un área como pestaña nueva (o la enfoca si ya está abierta). */
  onOpenArea: (area: AreaId) => void;
  /** Abre otra pestaña-Hub nueva. */
  onAddTab: () => void;
}

/**
 * Contenido de una pestaña Hub: grid de tarjetas con las áreas de la app + una
 * tarjeta "Añadir pestaña" que abre otro Hub. Es UI pura: no navega ni mantiene
 * estado de pestañas (eso lo hace MainShell vía los callbacks).
 */
export function HubPanel({ onOpenArea, onAddTab }: HubPanelProps) {
  return (
    <div className="hub-root">
      <header className="hub-header">
        <div className="hub-brand">
          <span className="hub-logotype">渋</span>
          <h1 className="hub-title">shibui</h1>
        </div>
        <p className="hub-subtitle">workspace</p>
      </header>

      <nav className="hub-grid" aria-label="Áreas">
        {AREAS.map((area) => (
          <LibCard
            key={area.id}
            variant="glitch"
            clickable
            onUiLibCardClick={() => onOpenArea(area.id)}
          >
            <LibIcon slot="tag" name={area.icon} size="20" />
            <span slot="title" className="hub-card-title">{area.label}</span>
            <span className="hub-card-desc">{area.description}</span>
          </LibCard>
        ))}

        {/* Tarjeta "Añadir pestaña" — abre otro Hub */}
        <LibCard
          variant="glitch"
          clickable
          className="hub-card-add"
          onUiLibCardClick={onAddTab}
        >
          <LibIcon slot="tag" name="plus" size="20" />
          <span slot="title" className="hub-card-title">Añadir pestaña</span>
          <span className="hub-card-desc">Abre un nuevo hub en otra pestaña</span>
        </LibCard>
      </nav>
    </div>
  );
}
