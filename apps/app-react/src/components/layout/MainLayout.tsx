import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
  }

  const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {

    const [showCVOptions, setShowCVOptions] = useState(false);

    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        
        {/* Pasamos la navegación a la Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
  
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          {/* Header ahora más limpio, solo informativo */}
          <header style={{ padding: '0 3rem', height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold', color: '#888' }}>
              {activeTab}
            </span>
          </header>
  
          <section style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {children}
            </div>
          </section>
        </main>
      </div>
    );
  };

export default MainLayout;