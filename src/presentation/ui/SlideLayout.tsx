import type { ReactNode } from 'react'
import Reveal from './Reveal'

type Props = {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  children?: ReactNode
}

// Standard slide: eyebrow, title, optional lead, then a body that fills the rest of the stage
export default function SlideLayout({ eyebrow, title, lead, align = 'left', children }: Props) {
  return (
    <div className={`slide-layout align-${align}`}>
      {eyebrow && (
        <Reveal step={0}>
          <p className="slide-eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal step={1}>
        <h2 className="slide-title">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal step={2}>
          <p className="slide-lead">{lead}</p>
        </Reveal>
      )}
      {children && <div className="slide-body">{children}</div>}
    </div>
  )
}
