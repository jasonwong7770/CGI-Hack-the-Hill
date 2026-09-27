import type { CSSProperties, ReactNode } from 'react'

type Props = { step?: number; className?: string; children: ReactNode }

// Fades and rises in once the camera arrives on the slide; higher steps arrive later
export default function Reveal({ step = 0, className = '', children }: Props) {
  const style = { '--reveal-delay': `${step * 110}ms` } as CSSProperties
  return (
    <div className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
