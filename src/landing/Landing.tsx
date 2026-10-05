import { useEffect } from 'react'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../demoData'
import { href } from '../routes'
import { TEAM } from '../team'
import type { UserRole } from '../types'
import './landing.css'

const REPO_URL = 'https://github.com/jasonwong7770/CGI-Hack-the-Hill'
const DEVPOST_URL = 'https://devpost.com/software/fixtheflow'

// Figures from the CGI challenge data, the same ones the deck cites
const FINDINGS = [
  { figure: '35%', text: 'of complaints bounce between systems, and those reopen three times as often.' },
  { figure: '51%', text: 'of complaints are about billing, but the old portal can’t break a bill down.' },
  { figure: '77%', text: 'of service-level targets are breached today.' },
]

// A request's path through the portal, which is also the order the roles meet it
const JOURNEY: { role: UserRole; title: string; points: string[] }[] = [
  {
    role: 'customer',
    title: 'A customer reports it',
    points: [
      'Files a complaint or maintenance request in one form',
      'Sees their bill broken down before disputing it',
      'Books appointments and tracks every request',
    ],
  },
  {
    role: 'employee',
    title: 'An employee resolves it',
    points: [
      'Works one shared queue instead of four systems',
      'Opens the customer’s profile and history in one click',
      'Closes the request when it’s done',
    ],
  },
  {
    role: 'manager',
    title: 'A manager sees the pattern',
    points: [
      'Tracks open and closed requests at a glance',
      'Spots understaffed regions before service slips',
      'Decides who has staff access',
    ],
  },
]

const ROLE_NAMES: Record<UserRole, string> = { customer: 'Customer', employee: 'Employee', manager: 'Manager' }

export default function Landing() {
  useEffect(() => {
    document.title = 'FixTheFlow – Hack the Hill III'
  }, [])

  return (
    <div className="landing">
      <header className="landing-band landing-sky">
        <div className="landing-inner">
          <nav className="landing-nav" aria-label="Project links">
            <span className="landing-brand">FixTheFlow</span>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
          </nav>

          <div className="landing-hero">
            <p className="landing-kicker">Our entry for the CGI CRM challenge at Hack the Hill III</p>
            <h1>One portal for every energy and water request, from the first call to the closed ticket.</h1>
            <p className="landing-lead">
              FixTheFlow is a customer service portal for Northwind Utilities, a fictional energy and water provider
              serving 1.8 million customers. Its complaints were scattered across four systems, and FixTheFlow brings
              them into one place.
            </p>
            <div className="landing-actions">
              <a className="landing-button primary" href={href('app')}>Try the live demo</a>
              <a className="landing-button" href={href('presentation')}>View the presentation</a>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-band landing-street" aria-labelledby="problem-title">
        <div className="landing-inner">
          <h2 id="problem-title">What the data showed</h2>
          <ul className="landing-findings">
            {FINDINGS.map((finding) => (
              <li key={finding.figure}>
                <strong>{finding.figure}</strong>
                <span>{finding.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-band landing-soil" aria-labelledby="journey-title">
        <div className="landing-inner">
          <h2 id="journey-title">What we built</h2>
          <p className="landing-section-lead">
            Every request lives in one shared record, and each role sees the part of it they need.
          </p>
          <ol className="landing-journey">
            {JOURNEY.map((step) => (
              <li key={step.role}>
                <span className="landing-joint" aria-hidden="true" />
                <h3>{step.title}</h3>
                <ul>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-band landing-main" aria-labelledby="try-title">
        <div className="landing-inner">
          <h2 id="try-title">Try it yourself</h2>
          <p className="landing-section-lead">
            Log in as any of these sample accounts. The login form fills itself in, and everything you change stays in
            your browser. Use <em>Reset demo</em> in the dashboard to start over.
          </p>
          <ul className="landing-accounts">
            {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => (
              <li key={role}>
                <span className="landing-account-role">{ROLE_NAMES[role]}</span>
                <code>{DEMO_ACCOUNTS[role].email}</code>
                <code>{DEMO_PASSWORD}</code>
                <a className="landing-button small" href={`${href('app')}?as=${role}`}>
                  Log in as {role === 'customer' ? 'John' : ROLE_NAMES[role].toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-band landing-bedrock" aria-labelledby="built-title">
        <div className="landing-inner landing-columns">
          <div>
            <h2 id="built-title">How it’s built</h2>
            <p>
              React and TypeScript on Vite. The full version runs on Supabase, where Row Level Security decides what each
              role can read and change. This demo swaps in an in-browser copy of the same rules, so it needs no server.
            </p>
            <p>
              The findings come from a Python notebook over the challenge’s seven datasets, from complaints and meter
              reads to contact-centre staffing.
            </p>
          </div>
          <div>
            <h2>Who built it</h2>
            <ul className="landing-team">
              {TEAM.map((member) => (
                <li key={member.handle}>
                  <a href={`https://github.com/${member.handle}`} target="_blank" rel="noopener noreferrer">
                    <img src={member.photo} alt="" />
                    <span>{member.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="landing-band landing-reservoir">
        <div className="landing-inner landing-footer">
          <span>Northwind Utilities is fictional. The challenge data is from CGI.</span>
          <span className="landing-footer-links">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={DEVPOST_URL} target="_blank" rel="noopener noreferrer">Devpost</a>
            <a href={href('presentation')}>Presentation</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
