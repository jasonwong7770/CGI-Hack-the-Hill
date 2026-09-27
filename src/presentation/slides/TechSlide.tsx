import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

const NODES = [
  { title: 'React 19 + Vite', text: 'Landing page, auth screens and role-based dashboards' },
  { title: 'Supabase Auth', text: 'Email and password sign-in, one profile per user' },
  { title: 'Postgres + RLS', text: 'Row-level security policies enforce each role in the database' },
]

function Arrow() {
  return (
    <svg className="arch-arrow" viewBox="0 0 80 24" aria-hidden="true">
      <path
        d="M2 12h70M62 4l10 8-10 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TechSlide() {
  return (
    <SlideLayout
      eyebrow="Under the hood"
      title="Security lives in the database, not the UI"
      lead="TODO: one line on why this architecture was the right call for a weekend build."
    >
      <div className="arch">
        {NODES.map((node, i) => (
          <Reveal key={node.title} step={3 + i} className="arch-step">
            {i > 0 && <Arrow />}
            <article className="deck-card arch-node">
              <h3>{node.title}</h3>
              <p>{node.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
