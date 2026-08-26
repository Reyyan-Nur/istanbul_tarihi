/* react baslatip htmldeki root alanina yerlestirir */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render( /* app componenti buraya (index.htmldeki root alanina yerlestirir) */
  <StrictMode>
    <App />
  </StrictMode>,
)
