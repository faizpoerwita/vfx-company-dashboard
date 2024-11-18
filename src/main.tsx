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
          className: 'bg-zinc-800 text-white',
          style: {
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
