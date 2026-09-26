import { useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import type { RequestCategory } from '../types'

export default function RequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [category, setCategory] = useState<RequestCategory>('maintenance')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    // user_id and status are filled in by database defaults.
    const { error } = await supabase.from('requests').insert({ category, message: message.trim() })

    if (error) setError(error.message)
    else {
      setMessage('')
      setSuccess(true)
      onSubmitted()
    }
    setLoading(false)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>New request</h2>
      <label>
        Type
        <select value={category} onChange={(e) => setCategory(e.target.value as RequestCategory)}>
          <option value="maintenance">Maintenance request</option>
          <option value="complaint">Complaint</option>
        </select>
      </label>
      <label>
        Details
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Describe the issue…"
          required
        />
      </label>

      {error && <p className="error">{error}</p>}
      {success && <p className="info">Request submitted!</p>}

      <button type="submit" disabled={loading || !message.trim()}>
        {loading ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
