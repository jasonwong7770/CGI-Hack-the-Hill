import { useCallback, useEffect, useRef, useState } from 'react'
import type { SlideProps } from '../types'
import BrowserFrame from '../ui/BrowserFrame'
import Reveal from '../ui/Reveal'

// Embeds the real app. Click the frame to hand keyboard and mouse to the app;
// Esc, "Back to deck" or clicking outside the frame hands them back to the deck.
export default function DemoSlide({ active }: SlideProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [interacting, setInteracting] = useState(false)
  const live = active && interacting

  const leave = useCallback(() => {
    setInteracting(false)
    frameRef.current?.blur()
    window.focus()
  }, [])

  useEffect(() => {
    if (!live) return
    const frame = frameRef.current
    const frameWindow = frame?.contentWindow
    frame?.focus()
    frameWindow?.focus()

    const onFrameKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') leave()
    }
    frameWindow?.addEventListener('keydown', onFrameKeyDown)
    // Clicks inside the iframe never reach this window, so any click here is outside the frame
    window.addEventListener('mousedown', leave)
    return () => {
      frameWindow?.removeEventListener('keydown', onFrameKeyDown)
      window.removeEventListener('mousedown', leave)
    }
  }, [live, leave])

  return (
    <div className="slide-demo">
      <Reveal step={0} className="demo-heading">
        <p className="slide-eyebrow">Live demo</p>
        {live && (
          <button type="button" className="demo-exit" onClick={leave}>
            Back to deck <kbd>Esc</kbd>
          </button>
        )}
      </Reveal>
      <Reveal step={1} className="demo-frame">
        <BrowserFrame url="northwind-utilities.app — live">
          <iframe
            ref={frameRef}
            src="/"
            title="Northwind Utilities app"
            className={live ? 'is-live' : ''}
            tabIndex={live ? 0 : -1}
          />
          {!live && (
            <button type="button" className="demo-overlay" onClick={() => setInteracting(true)}>
              <span>Click to use the live app</span>
            </button>
          )}
        </BrowserFrame>
      </Reveal>
    </div>
  )
}
