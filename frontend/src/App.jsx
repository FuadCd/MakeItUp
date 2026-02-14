import { useState } from 'react'
import { generatePost, generateVariation } from './api'
import { LinkedInCard } from './LinkedInCard'
import { JobsPage } from './JobsPage'
import { HeadlinesPage } from './HeadlinesPage'
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
  const [currentPage, setCurrentPage] = useState('posts') // 'posts', 'jobs', or 'headlines'
  const [activity, setActivity] = useState('')
  const [posts, setPosts] = useState([]) // Array of posts with their activities
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fakeName] = useState(() => pickRandom(FAKE_NAMES))

  const handleGenerate = async () => {
    if (!activity.trim()) return
    setError(null)
    setLoading(true)
    try {
      const data = await generatePost(activity.trim())
      const newPost = {
        id: Date.now(),
        activity: activity.trim(),
        body: data.body,
        hashtags: data.hashtags,
        comments: data.comments || [],
      }
      setPosts(prev => [newPost, ...prev]) // Add new post to the beginning
      setActivity('') // Clear input after generating
    } catch (e) {
      setError(e.message || 'Failed to generate post')
    } finally {
      setLoading(false)
    }
  }

  const handleNewVariation = async (postId) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return
    
    setError(null)
    setLoading(true)
    try {
      const data = await generateVariation(post.activity)
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, body: data.body, hashtags: data.hashtags, comments: data.comments || [] }
          : p
      ))
    } catch (e) {
      setError(e.message || 'Failed to generate variation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="brand">MakeItUp</h1>
          <p className="tagline">Time To Get Noticed By Everyone... But A Recruiter</p>
        </div>
        <nav className="app-nav">
          <button
            type="button"
            className={`nav-btn ${currentPage === 'posts' ? 'nav-btn-active' : ''}`}
            onClick={() => setCurrentPage('posts')}
          >
            Posts
          </button>
          <button
            type="button"
            className={`nav-btn ${currentPage === 'jobs' ? 'nav-btn-active' : ''}`}
            onClick={() => setCurrentPage('jobs')}
          >
            Jobs
          </button>
          <button
            type="button"
            className={`nav-btn ${currentPage === 'headlines' ? 'nav-btn-active' : ''}`}
            onClick={() => setCurrentPage('headlines')}
          >
            News
          </button>
        </nav>
      </header>

      {currentPage === 'jobs' ? (
        <JobsPage />
      ) : currentPage === 'headlines' ? (
        <HeadlinesPage />
      ) : (
        <>
      <section className="input-section">
        <label htmlFor="activity" className="label">
          Describe what you accomplished today
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

      {posts.length > 0 && (
        <section className="posts-feed">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-activity-label">
                <span className="activity-badge">Original: {post.activity}</span>
              </div>
              <LinkedInCard
                name={fakeName}
                body={post.body}
                hashtags={post.hashtags}
                comments={post.comments || []}
              />
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleNewVariation(post.id)}
                  disabled={loading}
                >
                  Generate New Variation
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
        </>
      )}
    </div>
  )
}
