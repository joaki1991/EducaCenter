// Punto de entrada principal de la aplicación React
// Renderiza el componente App dentro de StrictMode para mejores advertencias y comprobaciones
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
