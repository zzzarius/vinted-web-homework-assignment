import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.ui.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
