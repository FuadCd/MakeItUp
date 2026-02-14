import { useState, useEffect } from 'react'
import { generateJobs } from './api'
import './JobsPage.css'

export function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadJobs = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await generateJobs()
      setJobs(data.jobs || [])
    } catch (e) {
      setError(e.message || 'Failed to generate jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  return (
    <div className="jobs-page">
      <header className="jobs-header">
        <h1 className="jobs-title">Jobs</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadJobs}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh Jobs'}
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="jobs-container">
        {loading && jobs.length === 0 ? (
          <div className="jobs-loading">Generating absurd job postings…</div>
        ) : (
          jobs.map((job, i) => (
            <div key={i} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h2 className="job-title">{job.archetype}</h2>
                </div>
                <div className="job-meta">
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-posted">{job.posted}</span>
                </div>
              </div>
              
              <div className="job-description">
                <p>{job.description}</p>
              </div>

              <div className="job-requirements">
                <h3 className="requirements-title">Requirements:</h3>
                <div className="requirements-content" dangerouslySetInnerHTML={{ __html: job.requirements.replace(/\n/g, '<br />') }} />
              </div>

              <div className="job-actions">
                <button className="job-btn job-btn-primary" disabled>
                  Easy Apply
                </button>
                <button className="job-btn job-btn-secondary" disabled>
                  Save
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
