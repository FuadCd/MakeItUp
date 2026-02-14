import { useState } from 'react'
import './LinkedInCard.css'

const FAKE_COMMENTS = [
  { name: 'Jordan Lee', headline: 'Strategic Initiatives Lead', company: 'at Growth Labs', text: 'Seeing this was motivating!', time: '2d' },
  { name: 'Morgan Blake', headline: 'Thought Partner', company: 'at Synergy Co', text: 'Amen! This is the energy we need.', time: '1w' },
  { name: 'Casey Kim', headline: 'Leadership Development', company: 'at Peak Performance Inc', text: 'Such insight. Thank you for sharing.', time: '3d' },
  { name: 'Taylor Chen', headline: 'Operations Excellence', company: 'at Scale Up', text: 'Needed this today. 🙌', time: '5h' },
  { name: 'Riley Jordan', headline: 'Culture & Engagement', company: 'at Next Gen', text: 'Leadership in action. Inspiring!', time: '1w' },
  { name: 'Alex Morgan', headline: 'Transformation Coach', company: 'at Impact Partners', text: 'So true. Saving this for later.', time: '4d' },
  { name: 'Sam Davis', headline: 'Executive Advisor', company: 'at Vision Board', text: 'This hit different. 🔥', time: '2w' },
  { name: 'Jordan Dongmo', headline: 'Dessinateur et concepteur', company: 'at Global Engineering TD', text: 'Exactly the mindset we need in 2025.', time: '3w' },
]

function pickRandom(arr, count = 3) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function LinkedInCard({ name, body, hashtags }) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const comments = pickRandom(FAKE_COMMENTS)

  return (
    <article className="linkedin-card">
      <div className="card-header">
        <div className="avatar" aria-hidden="true" />
        <div className="meta">
          <strong className="author">{name}</strong>
          <span className="headline">Transforming the ordinary into the extraordinary</span>
          <span className="time">Just now · Edited · 🌐</span>
        </div>
      </div>
      <div className="card-body">
        <p className="post-body">{body}</p>
        <p className="hashtags">{hashtags}</p>
      </div>
      <div className="card-engagement">
        <span className="engagement-reactions" aria-hidden="true">
          <span className="reaction-icons">👍</span>
          <span className="reaction-icons">❤️</span>
          <span className="engagement-count">42</span>
        </span>
        <span className="engagement-repost">12 reposts</span>
      </div>
      <div className="card-actions">
        <span className="action-item action-item--disabled" aria-hidden="true">
          <span className="action-icon" aria-hidden="true">👍</span>
          <span className="action-label">Like</span>
        </span>
        <button
          type="button"
          className="action-item action-item--comment"
          onClick={() => setCommentsOpen((prev) => !prev)}
          aria-expanded={commentsOpen}
          aria-label={commentsOpen ? 'Hide comments' : 'Show comments'}
        >
          <span className="action-icon" aria-hidden="true">💬</span>
          <span className="action-label">Comment</span>
        </button>
        <span className="action-item action-item--disabled" aria-hidden="true">
          <span className="action-icon" aria-hidden="true">🔄</span>
          <span className="action-label">Repost</span>
        </span>
        <span className="action-item action-item--disabled" aria-hidden="true">
          <span className="action-icon" aria-hidden="true">✈️</span>
          <span className="action-label">Send</span>
        </span>
      </div>
      {commentsOpen && (
        <div className="card-comments" role="region" aria-label="Comments">
          <div className="comment-add">
            <div className="comment-avatar comment-avatar--sm" aria-hidden="true" />
            <div className="comment-add-wrap">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                readOnly
                aria-label="Add a comment"
              />
              <span className="comment-input-icons" aria-hidden="true">
                <span className="comment-input-icon">🙂</span>
                <span className="comment-input-icon">🖼️</span>
              </span>
            </div>
          </div>
          <div className="comment-list">
            {comments.map((c, i) => (
              <div key={i} className="comment-block">
                <div className="comment-avatar" aria-hidden="true" />
                <div className="comment-content">
                  <div className="comment-meta-row">
                    <strong className="comment-name">{c.name}</strong>
                    <span className="comment-headline-inline"> {c.headline}</span>
                    <span className="comment-dot"> · </span>
                    <span className="comment-connection">2nd</span>
                    <span className="comment-time">{c.time}</span>
                    <span className="comment-more" aria-hidden="true">⋯</span>
                  </div>
                  <div className="comment-company">{c.company}</div>
                  <p className="comment-text">{c.text}</p>
                  <div className="comment-actions">
                    <span className="comment-action">Like</span>
                    <span className="comment-action-sep">|</span>
                    <span className="comment-action">Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
