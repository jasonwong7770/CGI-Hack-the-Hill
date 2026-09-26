import { useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import type { UserRole } from '../types'

type Mode = 'login' | 'signup'

// TEMPORARY TEST ONLY: these credentials are exposed in the frontend bundle.
// Remove them before production and use Supabase-managed credentials instead.
const EMPLOYEE_TEST_EMAIL = 'support@northwind.ca'
const EMPLOYEE_TEST_PASSWORD = '12345678'
const MANAGER_TEST_EMAIL = 'manager@northwind.ca'
const MANAGER_TEST_PASSWORD = '12345678'

export default function Auth({ role, onBack }: { role: UserRole; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState(role === 'manager' ? MANAGER_TEST_EMAIL : role === 'employee' ? EMPLOYEE_TEST_EMAIL : '')
  const [password, setPassword] = useState(role === 'manager' ? MANAGER_TEST_PASSWORD : role === 'employee' ? EMPLOYEE_TEST_PASSWORD : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (!data.session) setInfo('Account created! Check your email to confirm, then log in.')
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

      {role === 'customer' && <p className="switch">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button type="button" className="link" onClick={switchMode}>{mode === 'login' ? 'Sign up' : 'Log in'}</button>
      </p>}
    </div>
  )
}
