import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RateBookWizard } from './RateBookWizard'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RateBookWizard accentColor="#EE7B3D" />
  </React.StrictMode>,
)
