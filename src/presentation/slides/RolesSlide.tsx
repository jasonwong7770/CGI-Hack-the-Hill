import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

const ROLES = [
  {
    badge: 'C',
    name: 'Customer',
    can: [
      'Submit complaints & maintenance requests',
      'Track open and closed requests',
      'See a bill breakdown',
      'Book an appointment',
    ],
  },
  {
    badge: 'E',
    name: 'Employee',
    can: ['See every customer request', 'Close requests with one click'],
  },
  {
    badge: 'M',
    name: 'Manager',
    can: [
      'Everything an employee can do',
      'Overview stats at a glance',
      'Staffing trends by region',
      'Change other users’ roles',
    ],
  },
]

export default function RolesSlide() {
  return (
    <SlideLayout eyebrow="Three roles, one app" title="Everyone sees exactly what they need">
      <div className="grid-3">
        {ROLES.map((role, i) => (
          <Reveal key={role.name} step={3 + i}>
            <article className="deck-card role-card">
              <span className="role-badge">{role.badge}</span>
              <h3>{role.name}</h3>
              <ul className="deck-list compact">
                {role.can.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
