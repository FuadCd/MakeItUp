import { useState } from 'react'
import { generatePost, generateVariation } from './api'
import { LinkedInCard } from './LinkedInCard'
import './App.css'

const FAKE_NAMES = [
  'Bradley Synergy',
  'Morgan Pivot',
  'Jordan Leverage',
  'Taylor Impact',
  'Casey Disrupt',
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function App() {
  const [activity, setActivity] = useState('')
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fakeName] = useState(() => pickRandom(FAKE_NAMES))

  const handleGenerate = async () => {
    if (!activity.trim()) return
    setError(null)
    setLoading(true)
    setPost(null)
    try {
      const data = await generatePost(activity.trim())
      setPost(data)
    } catch (e) {
      setError(e.message || 'Failed to generate post')
    } finally {
      setLoading(false)
    }
  }

  const handleNewVariation = async () => {
    if (!activity.trim() || !post) return
    setError(null)
    setLoading(true)
    try {
      const data = await generateVariation(activity.trim())
      setPost(data)
    } catch (e) {
      setError(e.message || 'Failed to generate variation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">WorkforceBeast</h1>
        <p className="tagline">AI-Powered Personal Brand Optimizer</p>
        <p className="sub">Turn any mundane activity into a LinkedIn leadership breakthrough.</p>
      </header>

      <section className="input-section">
        <label htmlFor="activity" className="label">
          Describe a normal activity…
        </label>
        <textarea
          id="activity"
          className="activity-input"
          placeholder="e.g. Made coffee, took a nap, replied to an email…"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          rows={3}
          disabled={loading}
        />
        <div className="controls">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading || !activity.trim()}
          >
            {loading ? 'Generating…' : 'Generate Post'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </section>

      {post && (
        <section className="result-section">
          <LinkedInCard
            name={fakeName}
            body={post.body}
            hashtags={post.hashtags}
          />
          <div className="actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleNewVariation}
              disabled={loading}
            >
              Generate New Variation
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
