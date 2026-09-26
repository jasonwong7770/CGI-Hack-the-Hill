import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="app">
      {!isSupabaseConfigured && (
        <div className="banner">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code> and add your keys.
        </div>
      )}
      {loading ? <p className="muted center">Loading…</p> : session ? <Dashboard session={session} /> : <Auth />}
    </div>
  )
}
