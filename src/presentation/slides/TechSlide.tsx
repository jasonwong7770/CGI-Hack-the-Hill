import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

const NODES = [
  { title: 'React 19 + Vite', text: 'TypeScript front end: landing page, role-based dashboards and this deck' },
  { title: 'Supabase Auth', text: 'Email sign-in; a database trigger creates every new account as a customer' },
  { title: 'Postgres + RLS', text: 'Row-level security enforces each role; staff can only change a request’s status' },
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
      title="Security lives in the database."
      lead="Supabase gave us auth and Postgres out of the box, so the weekend went into features, and every role rule is enforced by the database itself."
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
