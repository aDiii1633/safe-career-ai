import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactGA from "react-ga4";

// Initialize GA4 - Uses VITE_GA_MEASUREMENT_ID if present
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
