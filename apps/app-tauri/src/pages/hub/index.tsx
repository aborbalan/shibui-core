import { useNavigate } from 'react-router-dom';
import { LibCard, LibIcon } from '@shibui-ui/ui/react';
import './hub.css';

const HUB_ITEMS = [
  {
    id: 'code',
    label: 'Code',
    description: 'Editor, terminal y workspace',
    icon: 'code',
    path: '/code',
  },
  {
    id: 'files',
    label: 'Files',
    description: 'Explorador y gestor de archivos',
    icon: 'folder-open',
    path: '/files',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Claves, permisos y auditoría',
    icon: 'shield-check',
    path: '/security',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configuración del sistema',
    icon: 'gear-six',
    path: '/settings',
  },
] as const;

export function HubPage() {
  const navigate = useNavigate();

  return (
    <div className="hub-root">
      <header className="hub-header">
        <div className="hub-brand">
          <span className="hub-logotype">渋</span>
          <h1 className="hub-title">shibui</h1>
        </div>
        <p className="hub-subtitle">workspace</p>
      </header>

      <nav className="hub-grid" aria-label="Hub navigation">
        {HUB_ITEMS.map(({ id, label, description, icon, path }) => (
          <LibCard
            key={id}
            variant="glitch"
            clickable
            onUiLibCardClick={() => navigate(path)}
          >
            <LibIcon slot="tag" name={icon} size="20" />
            <span slot="title" className="hub-card-title">{label}</span>
            <span className="hub-card-desc">{description}</span>
          </LibCard>
        ))}
      </nav>
    </div>
  );
}
