'use client';

import { useState, useEffect } from 'react';

export default function CommentSection({ targetType, targetId, targetTitle = 'Artwork' }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap

  useEffect(() => {
    if (!targetId) return;

    fetch(`/api/v1/comments?target_type=${targetType}&target_id=${targetId}&status=approved`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setComments(json.data);
        }
      })
      .catch((err) => console.warn('Failed to load comments:', err))
      .finally(() => setLoading(false));
  }, [targetType, targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!authorName.trim() || !content.trim()) {
      setErrorMessage('Please enter your name and message.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          target_title: targetTitle,
          author_name: authorName,
          author_email: authorEmail,
          content: content,
          honeypot_website: honeypot, // If filled, server rejects silent-bot
        }),
      });

      const json = await res.json();

      if (json.success) {
        setSuccessMessage('আপনার মন্তব্যের জন্য ধন্যবাদ! পর্যালোচনার পর এটি সাইটে প্রদর্শিত হবে।');
        setContent('');
      } else {
        setErrorMessage(json.message || 'মন্তব্য জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMessage('সার্ভার এরর। দয়া করে পরে চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="engagement-comment-section">
      <div className="comment-section-header">
        <h3 className="comment-section-title">
          Thoughts & Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Submission Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-form-row">
          <input
            type="text"
            placeholder="Your Name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="comment-input"
          />
          <input
            type="email"
            placeholder="Your Email (optional / private)"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="comment-input"
          />
        </div>

        {/* Hidden Honeypot field for bots */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex="-1"
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <textarea
          placeholder="Leave your constructive reflection or feedback here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="3"
          className="comment-textarea"
        />

        {successMessage && <div className="comment-alert is-success">{successMessage}</div>}
        {errorMessage && <div className="comment-alert is-error">{errorMessage}</div>}

        <div className="comment-form-actions">
          <button type="submit" disabled={submitting} className="comment-submit-btn">
            {submitting ? 'Submitting...' : 'Post Thought'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <p className="comments-loading">Loading thoughts...</p>
        ) : comments.length === 0 ? (
          <p className="comments-empty">Be the first to leave a thought on this piece.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-author-meta">
                <span className="comment-author-name">{c.author_name}</span>
                <span className="comment-date">
                  {new Date(c.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="comment-body">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
