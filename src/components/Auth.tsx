import { useState, type FormEvent } from 'react'
import { backend, isDemoMode } from '../backend'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../demoData'
import type { UserRole } from '../types'

type Mode = 'login' | 'signup'

export default function Auth({ role, onBack }: { role: UserRole; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('login')
  // Demo mode fills in the sample account for the chosen role, so visitors only need to press Log in
  const [email, setEmail] = useState(isDemoMode ? DEMO_ACCOUNTS[role].email ?? '' : '')
  const [password, setPassword] = useState(isDemoMode ? DEMO_PASSWORD : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const canSignUp = role === 'customer' && !!backend.signUp

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    if (mode === 'login') {
      const { error } = await backend.signIn(email, password)
      if (error) setError(error)
    } else if (backend.signUp) {
      const { error, needsConfirmation } = await backend.signUp(email, password)
      if (error) setError(error)
      else if (needsConfirmation) setInfo('Account created! Check your email to confirm, then log in.')
    }

    setLoading(false)
  }

  function switchMode() {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setInfo(null)
  }

  return (
    <div className="card auth">
      <button type="button" className="link back-link" onClick={onBack}>← Back</button>
      <p className="eyebrow">{role === 'manager' ? 'Manager portal' : role === 'employee' ? 'Employee portal' : 'Customer portal'}</p>
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      <p className="muted">{role === 'manager' ? 'Sign in with your manager account.' : role === 'employee' ? 'Sign in with your employee account.' : 'Submit complaints and maintenance requests.'}</p>
      {isDemoMode && <p className="demo-note">Demo account: the details are filled in for you.</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      {canSignUp && <p className="switch">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button type="button" className="link" onClick={switchMode}>{mode === 'login' ? 'Sign up' : 'Log in'}</button>
      </p>}
    </div>
  )
}
