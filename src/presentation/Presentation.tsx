import { useEffect, useState, type CSSProperties } from 'react'
import PresenterHud from './PresenterHud'
import Scenery from './Scenery'
import { slides } from './slides'
import Controls from './ui/Controls'
import { useDeckNavigation } from './useDeckNavigation'
import { SLIDE_H, STAGE_W, TRANSITION_MS } from './constants'
import { ZONE_STYLE } from './zones'
import './presentation.css'

const SLIDE_IDS = slides.map((slide) => slide.id)

const measureViewport = () => ({ width: window.innerWidth, height: window.innerHeight })

function useViewport() {
  const [viewport, setViewport] = useState(measureViewport)
  useEffect(() => {
    const onResize = () => setViewport(measureViewport())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return viewport
}

export default function Presentation() {
  const { index, next, prev } = useDeckNavigation(SLIDE_IDS)
  const viewport = useViewport()
  const current = slides[index]

  // Slide content always fits entirely on screen (letterboxed if needed)...
  const scale = Math.min(viewport.width / STAGE_W, viewport.height / SLIDE_H)
  // ...while the scenery fills the full width, so on screens taller than 16:9 the world
  // continues above and below the stage instead of showing bars
  const worldScale = viewport.width / STAGE_W
  const worldY = viewport.height / 2 - (index + 0.5) * SLIDE_H * worldScale

  // The deck owns the whole viewport while mounted
  useEffect(() => {
    const previousTitle = document.title
    document.documentElement.classList.add('deck-mode')
    return () => {
      document.documentElement.classList.remove('deck-mode')
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    document.title = `${current.title} · Northwind Utilities`
  }, [current])

  // Only visible past the ends of the world (above the first slide or below the last)
  const edgeColor = index === 0 ? ZONE_STYLE[current.zone].from : ZONE_STYLE[current.zone].to
  const deckStyle = { '--deck-dur': `${TRANSITION_MS}ms`, '--deck-bg': edgeColor } as CSSProperties

  return (
    <main className="deck" style={deckStyle}>
      <div className="deck-world" style={{ transform: `translate3d(0, ${worldY}px, 0) scale(${worldScale})` }}>
        <Scenery slides={slides} />
      </div>

      <div className="deck-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div
          className="deck-track"
          style={{ height: slides.length * SLIDE_H, transform: `translate3d(0, ${-index * SLIDE_H}px, 0)` }}
        >
          {slides.map((slide, i) => {
            const { Component } = slide
            const tone = ZONE_STYLE[slide.zone].underground ? 'tone-light' : 'tone-dark'
            const state = [i === index && 'is-active', i <= index && 'is-reached'].filter(Boolean).join(' ')
            return (
              <section
                key={slide.id}
                id={`slide-${slide.id}`}
                className={`deck-slide zone-${slide.zone} ${tone} ${state}`}
                style={{ top: i * SLIDE_H }}
                aria-label={slide.title}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <Component active={i === index} />
              </section>
            )
          })}
        </div>
      </div>

      <Controls index={index} total={slides.length} onPrev={prev} onNext={next} />
      <PresenterHud index={index} slides={slides} />
      <p className="deck-sr-only" aria-live="polite">
        Slide {index + 1} of {slides.length}: {current.title}
      </p>
    </main>
  )
}
