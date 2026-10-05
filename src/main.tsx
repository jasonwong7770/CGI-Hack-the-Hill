import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { currentRoute } from './routes'
import './index.css'

// Every page loads on demand, so the landing page never pays for the app or the deck
const Landing = lazy(() => import('./landing/Landing'))
// The Northwind portal itself, at /app
const App = lazy(() => import('./App'))
// The pitch deck, at /presentation
const Presentation = lazy(() => import('./presentation/Presentation'))
// Single app components with sample data, embedded as live screens inside the deck
const ScreenPreview = lazy(() => import('./presentation/screens/ScreenPreview'))

const route = currentRoute()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {route.name === 'app' ? (
        <App />
      ) : route.name === 'presentation' ? (
        <Presentation />
      ) : route.name === 'screen' ? (
        <ScreenPreview name={route.screen} />
      ) : (
        <Landing />
      )}
    </Suspense>
  </StrictMode>,
)
