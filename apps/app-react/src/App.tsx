// App.tsx
import React, { useState } from 'react';
import '@shibui/ui';

// Si no lo importaste en main.tsx, hazlo aquí:
// import '@shibui/ui'; 

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Shibui Ecosystem + React 19</h1>
        <lib-badge color="info">Conexión Exitosa</lib-badge>
      </header>

      <main style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Prueba de Átomos */}
        <section style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <lib-button 
            variant="primary" 
            onClick={() => setCount(count + 1)}
          >
            Incrementar Contador
          </lib-button>
          
          <lib-label>Clicks: {count}</lib-label>
        </section>

        <section style={{ display: 'flex', gap: '20px' }}>
          <lib-avatar 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=shibui" 
            alt="User"
          />
          <lib-copy-button text="Texto copiado desde React" />
          <lib-status-dot status="online" />
        </section>

        {/* Prueba de Feedback */}
        <section style={{ width: '300px' }}>
          <lib-label>Cargando progreso...</lib-label>
          <lib-progress value={count * 10} max={100} />
          <lib-progress-circle value={75} size="small" />
        </section>

        {/* Prueba de Contenedores */}
        <lib-glass-card>
          <p>Este es un Glass Card de la librería consumido por React 19.</p>
        </lib-glass-card>

      </main>
    </div>
  );
}

export default App;