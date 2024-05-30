import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SisenseContextProvider } from '@sisense/sdk-ui'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SisenseContextProvider
      url="https://trial-bi-prod.sisense.com/"
      token="">
      <App />
    </SisenseContextProvider>
  </React.StrictMode>,
)
