import React from 'react';
import meData from '../../data/me.json';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'perfil', label: '👤 Perfil' },
    { id: 'experiencia', label: '💼 Experiencia' },
    { id: 'proyectos', label: '🚀 Proyectos' }
  ];

  return (
    <aside style={{ 
      width: '280px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flexShrink: 0,
      height: '100vh'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'oklch(70% 0.15 250)' }}>
          {meData.name.split(' ')[0]} Portfolio
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{meData.label}</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: activeTab === item.id ? 'oklch(35% 0.02 250)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.6)',
              borderLeft: activeTab === item.id ? '4px solid oklch(70% 0.15 250)' : '4px solid transparent'
            }}
          >
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '1rem', fontSize: '0.75rem', opacity: 0.5 }}>
        <span>Zaragoza, ES</span>
      </div>
    </aside>
  );
};

export default Sidebar;