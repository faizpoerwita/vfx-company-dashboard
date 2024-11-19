import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { worker } from './mocks/browser'

// Start the mock service worker in development
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: 'rgb(20, 20, 20)',
            border: '1px solid rgba(185, 28, 28, 0.2)',
            padding: '16px',
            color: 'rgb(248, 113, 113)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          error: {
            icon: '⚠️',
            style: {
              background: 'rgba(127, 29, 29, 0.2)',
              border: '1px solid rgba(185, 28, 28, 0.5)',
              color: 'rgb(248, 113, 113)',
            },
          },
          success: {
            style: {
              background: 'rgba(6, 78, 59, 0.2)',
              border: '1px solid rgba(4, 120, 87, 0.5)',
              color: 'rgb(52, 211, 153)',
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
