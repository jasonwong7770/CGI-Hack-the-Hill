import AppScreen from '../ui/AppScreen'
import BrowserFrame from '../ui/BrowserFrame'
import Reveal from '../ui/Reveal'

export default function SolutionSlide() {
  return (
    <div className="slide-split">
      <div className="split-text">
        <Reveal step={0}>
          <p className="slide-eyebrow">Our solution</p>
        </Reveal>
        <Reveal step={1}>
          <h2 className="slide-title">A single portal for customers and staff</h2>
        </Reveal>
        <Reveal step={2}>
          <ul className="deck-list">
            <li>One shared case record, so requests never bounce between systems</li>
            <li>A bill breakdown appears as soon as a billing complaint is filed</li>
            <li>One queue for staff, and staffing hot spots for managers</li>
          </ul>
        </Reveal>
      </div>
      <Reveal step={3} className="split-media">
        <BrowserFrame>
          <AppScreen src="/" title="Northwind Utilities landing page" viewportWidth={1440} />
        </BrowserFrame>
      </Reveal>
    </div>
  )
}
