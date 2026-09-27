import BrowserFrame from '../ui/BrowserFrame'
import Reveal from '../ui/Reveal'

// Shows the real app as a live preview; clicking it opens the app full size in a new tab
export default function DemoSlide() {
  return (
    <div className="slide-demo">
      <Reveal step={0} className="demo-heading">
        <p className="slide-eyebrow">Live demo</p>
      </Reveal>
      <Reveal step={1} className="demo-frame">
        <BrowserFrame url="northwind-utilities.app — live">
          <iframe src="/" title="Northwind Utilities app" tabIndex={-1} />
          <a className="demo-overlay" href="/" target="_blank" rel="noopener noreferrer">
            <span>Open the live app in a new tab</span>
          </a>
        </BrowserFrame>
      </Reveal>
    </div>
  )
}
