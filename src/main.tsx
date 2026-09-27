import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// The pitch deck lives at /presentation and is loaded on demand so the app never pays for it
const Presentation = lazy(() => import('./presentation/Presentation'))
const isPresentation = /^\/presentation\/?$/.test(window.location.pathname)

// Single app components with sample data, embedded as live screens inside the deck
const ScreenPreview = lazy(() => import('./presentation/screens/ScreenPreview'))
const screenName = window.location.pathname.match(/^\/presentation\/screen\/([\w-]+)\/?$/)?.[1]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPresentation ? (
      <Suspense fallback={null}>
        <Presentation />
      </Suspense>
    ) : screenName ? (
      <Suspense fallback={null}>
        <ScreenPreview name={screenName} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
