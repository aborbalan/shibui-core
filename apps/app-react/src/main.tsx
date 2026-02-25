


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@shibui/ui'; // Esto registra todos los custom elements (<lib-button>, etc.)
import App from './App';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
