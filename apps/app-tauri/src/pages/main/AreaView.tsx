import { lazy, Suspense } from 'react';
import { SectionPlaceholder } from '../section-placeholder';
import type { AreaId } from './areas';

// Áreas ya implementadas (lazy: solo se cargan al abrir su pestaña).
const DashboardPage = lazy(() => import('../dashboard').then(m => ({ default: m.DashboardPage })));
const FilesPage     = lazy(() => import('../files').then(m => ({ default: m.FilesPage })));
const CodePage      = lazy(() => import('../code').then(m => ({ default: m.CodePage })));

/**
 * Renderiza el contenido de un área dentro de su pestaña. Sin sidebar ni
 * layout: cada área ocupa todo el panel. Las áreas aún no construidas caen
 * al placeholder.
 */
export function AreaView({ area }: { area: AreaId }) {
  return (
    <Suspense fallback={null}>
      {renderArea(area)}
    </Suspense>
  );
}

function renderArea(area: AreaId) {
  switch (area) {
    case 'dashboard':
      return <DashboardPage />;
    case 'files':
      return <FilesPage />;
    case 'code':
      return <CodePage />;
    case 'security':
      return <SectionPlaceholder section="Security" icon="shield" />;
    case 'settings':
      return <SectionPlaceholder section="Settings" icon="desktop" />;
    default:
      return <SectionPlaceholder section={area} icon="menu" />;
  }
}
