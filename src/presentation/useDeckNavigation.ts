import { useCallback, useEffect, useRef, useState } from 'react'
import { TRANSITION_MS } from './constants'

const WHEEL_THRESHOLD = 40
const SWIPE_THRESHOLD = 50

function indexFromHash(ids: string[]) {
  const i = ids.indexOf(decodeURIComponent(window.location.hash.slice(1)))
  return i === -1 ? 0 : i
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

export function useDeckNavigation(ids: string[]) {
  const [index, setIndex] = useState(() => indexFromHash(ids))
  const last = ids.length - 1

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(last, i))), [last])
  const step = useCallback(
    (delta: number) => setIndex((i) => Math.max(0, Math.min(last, i + delta))),
    [last],
  )
  const next = useCallback(() => step(1), [step])
  const prev = useCallback(() => step(-1), [step])

  // Keep the URL hash in sync so a reload lands on the same slide
  useEffect(() => {
    const hash = `#${ids[index]}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
  }, [ids, index])

  useEffect(() => {
    const onHashChange = () => setIndex(indexFromHash(ids))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [ids])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      switch (e.key) {
        case ' ':
          step(e.shiftKey ? -1 : 1)
          break
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          step(1)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          step(-1)
          break
        case 'Home':
          go(0)
          break
        case 'End':
          go(last)
          break
        default:
          return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, step, last])

  // One wheel gesture or swipe moves exactly one slide; trackpad momentum is
  // swallowed until it settles so a single flick never skips several slides
  const lockUntil = useRef(0)
  useEffect(() => {
    let wheelSum = 0
    let lastWheel = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = performance.now()
      if (now < lockUntil.current) {
        lockUntil.current = Math.max(lockUntil.current, now + 180)
        return
      }
      if (now - lastWheel > 250) wheelSum = 0
      lastWheel = now
      wheelSum += e.deltaY
      if (Math.abs(wheelSum) < WHEEL_THRESHOLD) return
      step(Math.sign(wheelSum))
      wheelSum = 0
      lockUntil.current = now + TRANSITION_MS
    }

    let touchY: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null) return
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) > SWIPE_THRESHOLD) step(Math.sign(dy))
      touchY = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [step])

  return { index, go, next, prev }
}
