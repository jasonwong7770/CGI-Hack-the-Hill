import { useEffect, useState } from 'react'
import { TALK_SECONDS } from './constants'
import type { SlideDef } from './types'
import { groundIndex } from './zones'

type Props = { index: number; slides: SlideDef[] }

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Playful altitude/depth readout for the gauge: metres above or below the street
function altitude(i: number, ground: number) {
  return i < ground ? `+${(ground - i) * 40} m` : `−${(i - ground + 1) * 25} m`
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
  else void document.documentElement.requestFullscreen().catch(() => {})
}

// T toggles the HUD, R resets the clock, F toggles fullscreen.
// The clock starts on the first advance past the title slide and keeps running while hidden.
export default function PresenterHud({ index, slides }: Props) {
  const [visible, setVisible] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (index > 0) setStartedAt((t) => t ?? Date.now())
  }, [index])

  useEffect(() => {
    if (startedAt === null) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [startedAt])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 't') setVisible((v) => !v)
      else if (key === 'r') {
        setStartedAt(index > 0 ? Date.now() : null)
        setNow(Date.now())
      } else if (key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index])

  if (!visible) return null

  const elapsed = startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000))
  const status = elapsed >= TALK_SECONDS ? 'is-over' : elapsed >= TALK_SECONDS - 60 ? 'is-warn' : ''
  const ground = groundIndex(slides)
  const notes = slides[index].notes

  return (
    <aside className="deck-hud" aria-label="Presenter tools">
      <div className={`hud-panel ${status}`.trim()}>
        <div className="hud-clock">
          <span className="hud-time">{formatTime(elapsed)}</span>
          <span className="hud-limit">/ {formatTime(TALK_SECONDS)}</span>
        </div>
        <div className="hud-bar">
          <i style={{ width: `${Math.min(100, (elapsed / TALK_SECONDS) * 100)}%` }} />
        </div>
        {notes && <p className="hud-notes">{notes}</p>}
        <p className="hud-keys">T hide · R reset · F fullscreen</p>
      </div>

      <ol className="hud-gauge">
        {slides.map((slide, i) => (
          <li
            key={slide.id}
            className={[i === index && 'is-current', i < index && 'is-past', i === ground && 'is-ground']
              .filter(Boolean)
              .join(' ')}
          >
            <span className="hud-alt">{altitude(i, ground)}</span>
            <span className="hud-label">{slide.title}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
