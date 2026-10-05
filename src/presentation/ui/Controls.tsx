import type { MouseEvent } from 'react'
import { href } from '../../routes'

type Props = { index: number; total: number; onPrev: () => void; onNext: () => void }

// The buttons never take focus, so Space keeps driving the deck instead of re-clicking them
const keepFocus = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()

function Chevron({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d={direction === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Controls({ index, total, onPrev, onNext }: Props) {
  return (
    <nav className="deck-controls" aria-label="Slide controls">
      <a
        href={href('app')}
        target="_blank"
        rel="noopener noreferrer"
        className="deck-btn deck-home"
        aria-label="Open the app in a new tab"
        title="Open the app in a new tab"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path
            className="deck-home-roof"
            d="M4 11.5 12 4l8 7.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="deck-home-body"
            d="M6 10v9h12v-9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <button
        type="button"
        className="deck-btn"
        onMouseDown={keepFocus}
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Previous slide"
      >
        <Chevron direction="up" />
      </button>
      <button
        type="button"
        className="deck-btn"
        onMouseDown={keepFocus}
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Next slide"
      >
        <Chevron direction="down" />
      </button>
      <span className="deck-counter">
        {index + 1}/{total}
      </span>
    </nav>
  )
}
