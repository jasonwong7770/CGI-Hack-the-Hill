import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import type { UserRole } from './types'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole | null>(null)
  const [checkingRole, setCheckingRole] = useState(false)
  const [authRole, setAuthRole] = useState<UserRole | null>(null)
  const [showRolePicker, setShowRolePicker] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setRole(null)
      setCheckingRole(false)
      return
    }
    let active = true
    setCheckingRole(true)
    supabase.from('profiles').select('role').eq('id', session.user.id).single()
      .then(({ data, error }) => {
        if (!active) return
        setRole(error ? null : data?.role === 'employee' ? 'employee' : 'customer')
        setCheckingRole(false)
      })
    return () => { active = false }
  }, [session])

  function chooseRole(selected: UserRole) {
    setShowRolePicker(false)
    setAuthRole(selected)
  }

  function onSignedOut() {
    setSession(null)
    setAuthRole(null)
  }

  return (
    <div className="app">
      {!isSupabaseConfigured && (
        <div className="banner">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code> and add your keys.
        </div>
      )}
      {loading || checkingRole ? <p className="muted center">Loading…</p> : session ? (
        role ? <Dashboard session={session} role={role} onSignOut={onSignedOut} /> : (
          <div className="card auth"><h1>Account unavailable</h1><p className="muted">We couldn’t load your account profile. Please try again or contact support.</p><button className="secondary" onClick={onSignedOut}>Log out</button></div>
        )
      ) : authRole ? <Auth role={authRole} onBack={() => setAuthRole(null)} /> : (
        <main className="welcome">
          <header className="welcome-topbar"><span className="brand">Haven<span>.</span></span><button onClick={() => setShowRolePicker(true)}>Log in</button></header>
          <section className="welcome-hero">
            <p className="eyebrow">A better way to get things fixed</p>
            <h1>Home care,<br /><span>handled.</span></h1>
            <p className="welcome-copy">Submit a request, track its progress, and let us take care of the details.</p>
            <button className="hero-button" onClick={() => chooseRole('customer')}>Get started <span aria-hidden="true">→</span></button>
          </section>
          <div className="welcome-foot"><span>Thoughtful support for every home.</span><button className="link" onClick={() => chooseRole('employee')}>Employee access</button></div>
          {showRolePicker && <div className="modal-backdrop" role="presentation" onClick={() => setShowRolePicker(false)}>
            <section className="role-picker card" role="dialog" aria-modal="true" aria-labelledby="role-title" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" aria-label="Close" onClick={() => setShowRolePicker(false)}>×</button>
              <p className="eyebrow">Welcome to Haven</p><h2 id="role-title">How would you like to continue?</h2>
              <button className="role-choice" onClick={() => chooseRole('customer')}><strong>I’m a customer</strong><span>Submit and track a home request</span></button>
              <button className="role-choice" onClick={() => chooseRole('employee')}><strong>I’m an employee</strong><span>Review customer requests</span></button>
            </section>
          </div>}
        </main>
      )}
    </div>
  )
}
