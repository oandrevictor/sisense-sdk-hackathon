import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SisenseContextProvider, ThemeProvider } from '@sisense/sdk-ui'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SisenseContextProvider
      url="https://trial-bi-prod.sisense.com/"
      token="">
      <ThemeProvider
        theme={{
          typography: {
            fontFamily: 'Roboto',
          },
          palette: {
            variantColors: ["#a2d2ff","#ffafcc","#ccf5ac","#CDB4DB", "#bde0fe","#ffc8dd"]
          }
        }}
      >
        <App />
      </ThemeProvider>
    </SisenseContextProvider>
  </React.StrictMode>,
)

