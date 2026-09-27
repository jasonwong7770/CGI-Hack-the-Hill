import BrowserFrame from '../ui/BrowserFrame'
import Placeholder from '../ui/Placeholder'
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
          {/* TODO: tighten the pitch */}
          <ul className="deck-list">
            <li>Customers file complaints and maintenance requests online</li>
            <li>Staff see every request in one queue and close the loop</li>
            <li>Managers get live numbers and control who can do what</li>
          </ul>
        </Reveal>
      </div>
      <Reveal step={3} className="split-media">
        <BrowserFrame>
          <Placeholder label="Screenshot: landing page" />
        </BrowserFrame>
      </Reveal>
    </div>
  )
}
