import { useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { COMPLAINT_CATEGORIES, type ComplaintCategory, type RequestCategory } from '../types'
import BillBreakdown from './BillBreakdown'

export default function RequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [category, setCategory] = useState<RequestCategory>('maintenance')
  const [complaintCategory, setComplaintCategory] = useState<ComplaintCategory | ''>('')
  const [complaintSubcategory, setComplaintSubcategory] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const selectedComplaint = COMPLAINT_CATEGORIES.find((c) => c.value === complaintCategory)
  const needsSubcategory = !!selectedComplaint && selectedComplaint.subcategories.length > 0

  function handleCategoryChange(value: RequestCategory) {
    setCategory(value)
    setComplaintCategory('')
    setComplaintSubcategory('')
  }

  function handleComplaintCategoryChange(value: ComplaintCategory) {
    setComplaintCategory(value)
    setComplaintSubcategory('')
  }

  const canSubmit =
    !!message.trim() &&
    (category !== 'complaint' || (!!complaintCategory && (!needsSubcategory || !!complaintSubcategory)))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    // user_id and status are filled in by database defaults.
    const { error } = await supabase.from('requests').insert({
      category,
      complaint_category: category === 'complaint' ? complaintCategory : null,
      complaint_subcategory: category === 'complaint' && complaintSubcategory ? complaintSubcategory : null,
      message: message.trim(),
    })

    if (error) setError(error.message)
    else {
      setMessage('')
      setCategory('maintenance')
      setComplaintCategory('')
      setComplaintSubcategory('')
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
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value as RequestCategory)}>
          <option value="maintenance">Maintenance request</option>
          <option value="complaint">Complaint</option>
        </select>
      </label>

      {category === 'complaint' && (
        <label>
          Category
          <select
            value={complaintCategory}
            onChange={(e) => handleComplaintCategoryChange(e.target.value as ComplaintCategory)}
            required
          >
            <option value="" disabled>
              Select a category…
            </option>
            {COMPLAINT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {needsSubcategory && (
        <label>
          Details on the issue
          <select
            value={complaintSubcategory}
            onChange={(e) => setComplaintSubcategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an option…
            </option>
            {selectedComplaint!.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </label>
      )}

      {complaintCategory === 'billing' && (
        <div className="billing-breakdown-inline">
          <p className="muted">Here's your current bill breakdown before you submit a billing complaint:</p>
          <BillBreakdown />
        </div>
      )}

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

      <button type="submit" disabled={loading || !canSubmit}>
        {loading ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
