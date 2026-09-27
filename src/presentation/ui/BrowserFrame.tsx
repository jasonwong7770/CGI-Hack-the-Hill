import type { ReactNode } from 'react'

type Props = { url?: string; className?: string; children: ReactNode }

// Browser window mockup for screenshots and the live demo
export default function BrowserFrame({ url = 'northwind-utilities.app', className = '', children }: Props) {
  return (
    <div className={`browser-frame ${className}`.trim()}>
      <div className="browser-bar">
        <span className="browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">{url}</span>
      </div>
      <div className="browser-body">{children}</div>
    </div>
  )
}
