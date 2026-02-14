import { useState } from 'react'
import './LinkedInCard.css'

// Comment time cannot be before the post. Post is "Just now", so comments are "Just now" only.
function getCommentTime() {
  return 'Just now'
}

// Ensure each hashtag has a # prefix (handles API returning with or without #)
function formatHashtags(hashtags) {
  if (!hashtags || typeof hashtags !== 'string') return ''
  return hashtags
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .join(' ')
}

export function LinkedInCard({ name, body, hashtags, comments = [] }) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  return (
    <article className="linkedin-card">
      <div className="card-header">
        <div className="avatar" aria-hidden="true" />
        <div className="meta">
          <strong className="author">{name}</strong>
          <span className="headline">On a growth journey. Mostly downward.</span>
          <span className="time">Just now · 🌐</span>
        </div>
      </div>
      <div className="card-body">
        <p className="post-body">{body}</p>
        <p className="hashtags">{formatHashtags(hashtags)}</p>
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
            {comments.length > 0 ? (
              comments.map((c, i) => (
                <div key={i} className="comment-block">
                  <div className="comment-avatar" aria-hidden="true" />
                  <div className="comment-content">
                    <div className="comment-meta-row">
                      <strong className="comment-name">{c.archetype}</strong>
                      <span className="comment-dot"> · </span>
                      <span className="comment-time">{getCommentTime()}</span>
                      <span className="comment-more" aria-hidden="true">⋯</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                    <div className="comment-actions">
                      <span className="comment-action">Like</span>
                      <span className="comment-action-sep">|</span>
                      <span className="comment-action">Reply</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="comment-block">
                <div className="comment-avatar" aria-hidden="true" />
                <div className="comment-content">
                  <p className="comment-text" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No comments yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
