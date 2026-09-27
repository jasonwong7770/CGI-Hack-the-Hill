import Placeholder from '../ui/Placeholder'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// TODO: swap placeholders for screenshots of the staff dashboard
const FEATURES = [
  {
    title: 'Employees: one shared queue',
    text: 'Every customer request in one list, closed with a click.',
    shot: 'Screenshot: employee request queue',
  },
  {
    title: 'Managers: stats and access',
    text: 'Totals by status and type, plus role management for the whole team.',
    shot: 'Screenshot: manager stats + user management',
  },
]

export default function StaffFeaturesSlide() {
  return (
    <SlideLayout eyebrow="For staff" title="Close the loop faster">
      <div className="grid-2">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} step={3 + i}>
            <article className="deck-card feature-card">
              <Placeholder label={feature.shot} className="feature-shot tall" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
