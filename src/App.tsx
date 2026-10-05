import { useEffect, useState } from 'react'
import { backend, type AppUser } from './backend'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { href } from './routes'
import type { UserRole } from './types'
import boilerRoomImage from './assets/boiler room.png'
import northwindLogo from './assets/logo.png'

// The landing page links to /app?as=<role> to open that role's login straight away
function requestedRole(): UserRole | null {
  const as = new URLSearchParams(window.location.search).get('as')
  return as === 'customer' || as === 'employee' || as === 'manager' ? as : null
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole | null>(null)
  const [checkingRole, setCheckingRole] = useState(false)
  const [authRole, setAuthRole] = useState<UserRole | null>(requestedRole)
  const [showRolePicker, setShowRolePicker] = useState(false)
  const [showStaffPicker, setShowStaffPicker] = useState(false)

  useEffect(() => {
    let active = true
    async function start() {
      // Asking for a specific role means switching accounts, so drop the param and any current session
      if (requestedRole()) {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash)
        await backend.signOut()
      }
      const current = await backend.getUser()
      if (!active) return
      setUser(current)
      setLoading(false)
    }
    start()

    const unsubscribe = backend.onAuthChange(setUser)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const userId = user?.id
  useEffect(() => {
    if (!userId) {
      setRole(null)
      setCheckingRole(false)
      return
    }
    let active = true
    setCheckingRole(true)
    backend.getRole(userId).then((loadedRole) => {
      if (!active) return
      setRole(loadedRole)
      setCheckingRole(false)
    })
    return () => { active = false }
  }, [userId])

  function chooseRole(selected: UserRole) {
    setShowRolePicker(false)
    setShowStaffPicker(false)
    setAuthRole(selected)
  }

  function openStaffPicker() {
    setShowRolePicker(false)
    setShowStaffPicker(true)
  }

  function onSignedOut() {
    setUser(null)
    setAuthRole(null)
  }

  useEffect(() => {
    if (user) return
    if (authRole) {
      document.title = `Sign In (${authRole === 'manager' ? 'Manager' : authRole === 'employee' ? 'Employee' : 'Customer'}) – Northwind Utilities`
    } else {
      document.title = 'Northwind Utilities'
    }
  }, [user, authRole])

  return (
    <div className={`app${!user && !authRole ? ' app-welcome' : ''}`}>
      {loading || checkingRole ? <p className="muted center">Loading…</p> : user ? (
        role ? <Dashboard user={user} role={role} onSignOut={onSignedOut} /> : (
          <div className="card auth"><h1>Account unavailable</h1><p className="muted">We couldn’t load your account profile. Please try again or contact support.</p><button className="secondary" onClick={onSignedOut}>Log out</button></div>
        )
      ) : authRole ? <Auth role={authRole} onBack={() => setAuthRole(null)} /> : (
        <main className="welcome welcome-photo">
          <div className="welcome-photo-art" style={{ backgroundImage: `url("${boilerRoomImage}")` }} />
          <div className="photo-caption-frame" aria-hidden="true">
            <div className="photo-caption"><span>Northwind <strong>Utilities</strong></span></div>
          </div>
          <header className="welcome-topbar">
            <img className="welcome-logo" src={northwindLogo} alt="Northwind Utilities" />
            <div className="welcome-topbar-actions">
              <a
                className="presentation-link"
                href={href('presentation')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View presentation"
                title="View presentation"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                  <rect className="presentation-link-screen" x="2.5" y="4" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path className="presentation-link-stand" d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path className="presentation-link-play" d="M10 8.3v5.4l4.6-2.7L10 8.3Z" fill="currentColor" />
                </svg>
              </a>
              <button onClick={() => setShowRolePicker(true)}>Log in</button>
            </div>
          </header>
          <nav className="welcome-subbar" aria-label="Welcome page sections">
            <a href="#about">About</a>
            <a href="#mission">Mission</a>
            <a href="#locations">Locations</a>
            <a href="#contact">Contact Us</a>
            <a href="#qa">Q&amp;A</a>
          </nav>
          <div className="welcome-hero-spacer" aria-hidden="true" />
          <section className="welcome-info-section welcome-about-section" id="about">
            <div className="welcome-info-inner">
              <p className="eyebrow">About Northwind</p>
              <h2><span className="welcome-highlight">Essential</span> service for everyday life.</h2>
              <p>Founded in 1976, Northwind Utilities is a regulated energy and water provider serving 1.8 million customers. Our teams maintain the essential systems that support homes, businesses, and communities every day.</p>
            </div>
          </section>
          <section className="welcome-info-section welcome-info-section-tint" id="mission">
            <div className="welcome-info-inner">
              <p className="eyebrow">Our mission</p>
              <h2><span className="welcome-highlight">Dependable</span> service, delivered with care.</h2>
              <p>We work to provide safe energy and clean water people can count on. That means caring for critical infrastructure, responding clearly when customers need help, and planning responsibly for the future of the communities we serve.</p>
            </div>
          </section>
          <section className="welcome-info-section" id="locations">
            <div className="welcome-info-inner">
              <p className="eyebrow">Where we work</p>
              <h2><span className="welcome-highlight">Local</span> teams across our service region.</h2>
              <p>Our service districts keep field crews and customer support close to the people who rely on us.</p>
              <div className="service-area-list">
                <article><h3>North District</h3><p>Energy network maintenance and water service for northern communities.</p></article>
                <article><h3>River District</h3><p>Water operations and infrastructure support along the river corridor.</p></article>
                <article><h3>Lakeshore District</h3><p>Local field response and utility service for lakeside neighbourhoods.</p></article>
              </div>
            </div>
          </section>
          <section className="welcome-info-section welcome-info-section-tint" id="contact">
            <div className="welcome-info-inner">
              <p className="eyebrow">Contact us</p>
              <h2>We’re here to <span className="welcome-highlight">help</span>.</h2>
              <p>Our customer team is available Monday to Friday, 8 a.m. to 6 p.m. For a new service request or an update, sign in to the customer portal.</p>
              <div className="welcome-contact-details">
                <a href="tel:18005550148">1-800-555-0148</a>
                <a href="mailto:support@northwindutilities.example">support@northwindutilities.example</a>
                <button onClick={() => setShowRolePicker(true)}>Open customer portal</button>
              </div>
            </div>
          </section>
          <section className="welcome-info-section" id="qa">
            <div className="welcome-info-inner">
              <p className="eyebrow">Questions &amp; answers</p>
              <h2>Good to <span className="welcome-highlight">know</span>.</h2>
              <div className="welcome-qa-list">
                <article>
                  <h3>How do I submit a service request?</h3>
                  <p>Select Log in, choose Customer, and use the request form to tell us how we can help.</p>
                </article>
                <article>
                  <h3>How can I check on a request?</h3>
                  <p>Sign in to the customer portal to see your submitted requests and their current status.</p>
                </article>
                <article>
                  <h3>What services does Northwind provide?</h3>
                  <p>Northwind Utilities provides regulated energy and water services to homes and businesses.</p>
                </article>
              </div>
            </div>
          </section>
          <div className="welcome-foot"><span>Reliable service for the communities we call home.</span><button className="link" onClick={openStaffPicker}>Employee access</button></div>
          <footer className="welcome-footer">Northwind Utilities <span>Serving our communities since 1976</span></footer>
          {showRolePicker && <div className="modal-backdrop" role="presentation" onClick={() => setShowRolePicker(false)}>
            <section className="role-picker card" role="dialog" aria-modal="true" aria-labelledby="role-title" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" aria-label="Close" onClick={() => setShowRolePicker(false)}>×</button>
              <p className="eyebrow">Northwind Utilities</p><h2 id="role-title">How would you like to continue?</h2>
              <button className="role-choice" onClick={() => chooseRole('customer')}><strong>I’m a customer</strong><span>Submit and track a service request</span></button>
              <button className="role-choice" onClick={openStaffPicker}><strong>I’m an employee</strong><span>Review customer requests</span></button>
            </section>
          </div>}
          {showStaffPicker && <div className="modal-backdrop" role="presentation" onClick={() => setShowStaffPicker(false)}>
            <section className="role-picker card" role="dialog" aria-modal="true" aria-labelledby="staff-title" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" aria-label="Close" onClick={() => setShowStaffPicker(false)}>×</button>
              <p className="eyebrow">Northwind Utilities</p><h2 id="staff-title">Which staff account?</h2>
              <button className="role-choice" onClick={() => chooseRole('employee')}><strong>I’m an employee</strong><span>Review customer requests</span></button>
              <button className="role-choice" onClick={() => chooseRole('manager')}><strong>I’m a manager</strong><span>Oversee requests and manage staff accounts</span></button>
            </section>
          </div>}
        </main>
      )}
    </div>
  )
}
