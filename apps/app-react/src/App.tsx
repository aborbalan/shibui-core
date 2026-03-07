// App.tsx
import React, { useState } from 'react';
import { LibButton } from '@shibui/ui/react';

// Si no lo importaste en main.tsx, hazlo aquí:
// import '@shibui/ui'; 

function App() {

  return (
    <LibButton 
    variant="primary" 
    onLibClick={() => console.log("¡Funciona!")}
  >
    Click me
  </LibButton>
  );
}

export default App;