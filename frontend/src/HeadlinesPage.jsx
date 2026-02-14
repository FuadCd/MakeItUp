import { useState, useEffect } from 'react'
import { generateHeadlines } from './api'
import './HeadlinesPage.css'

export function HeadlinesPage() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadHeadlines = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await generateHeadlines()
      setHeadlines(data.headlines || [])
    } catch (e) {
      setError(e.message || 'Failed to generate headlines')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHeadlines()
  }, [])

  return (
    <div className="headlines-page">
      <header className="headlines-header">
        <h1 className="headlines-title">News</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadHeadlines}
          disabled={loading}
        >
          {loading ? 'Loading' : 'Refresh Headlines'}
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="headlines-container">
        {loading && headlines.length === 0 ? (
          <div className="headlines-loading">Measuring your replaceability…</div>
        ) : (
          headlines.map((headline, i) => (
            <div key={i} className="headline-card">
              <div className="headline-icon">📰</div>
              <h2 className="headline-text">{headline}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
