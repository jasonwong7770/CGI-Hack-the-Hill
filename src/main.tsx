import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// The pitch deck lives at /presentation and is loaded on demand so the app never pays for it
const Presentation = lazy(() => import('./presentation/Presentation'))
const isPresentation = /^\/presentation\/?$/.test(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPresentation ? (
      <Suspense fallback={null}>
        <Presentation />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
