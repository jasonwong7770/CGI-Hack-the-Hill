import { useEffect, useRef, useState } from 'react'

type Props = { src: string; title: string; viewportWidth?: number; className?: string }

// A live, non-interactive "screenshot" of the app: an iframe laid out at a desktop width,
// then scaled down to fill its box. An iframe keeps the deck's styles out of the app's.
export default function AppScreen({ src, title, viewportWidth = 1100, className = '' }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    // Layout sizes ignore the stage's scale transform, so these are stage pixels
    const observer = new ResizeObserver(() => setBox({ width: el.clientWidth, height: el.clientHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scale = box.width / viewportWidth

  return (
    <div ref={boxRef} className={`app-screen ${className}`.trim()}>
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          style={{ width: viewportWidth, height: box.height / scale, transform: `scale(${scale})` }}
          // Same origin, so the frame's scrollbar can be hidden: it's a still, not a page to scroll
          onLoad={(e) => {
            const root = e.currentTarget.contentDocument?.documentElement
            if (root) root.style.overflow = 'hidden'
          }}
        />
      )}
    </div>
  )
}
