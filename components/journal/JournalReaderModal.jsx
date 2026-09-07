'use client';

import { useState, useEffect } from 'react';
import ReactionButton from '@/components/engagement/ReactionButton';
import ShareToolbar from '@/components/engagement/ShareToolbar';
import CommentSection from '@/components/engagement/CommentSection';

export default function JournalReaderModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (post) {
      document.body.classList.add('journal-reader-open');
    } else {
      document.body.classList.remove('journal-reader-open');
    }
    return () => {
      document.body.classList.remove('journal-reader-open');
    };
  }, [post]);

  if (!post) return null;

  // Calculate estimated reading time
  const textContent = post.content ? post.content.replace(/<[^>]+>/g, '') : post.excerpt || '';
  const wordCount = textContent.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  const formattedDate = new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const totalScroll = scrollHeight - clientHeight;
    if (totalScroll > 0) {
      const progress = (scrollTop / totalScroll) * 100;
      setScrollProgress(progress);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/journal#${post.slug || post.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="journal-reader-modal" role="dialog" aria-modal="true">
      <div className="journal-reader-backdrop" onClick={onClose} />

      <div className="journal-reader-container" onScroll={handleScroll}>
        {/* Reading Progress Indicator */}
        <div
          className="journal-reader-progress"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Top Header Bar */}
        <header className="journal-reader-header">
          <div className="journal-reader-header-meta">
            <span className="journal-reader-tag">{(post.category || 'Essay').toUpperCase()}</span>
            <span className="journal-reader-dot">•</span>
            <span className="journal-reader-date">{formattedDate}</span>
            <span className="journal-reader-dot">•</span>
            <span className="journal-reader-time">⏱ {readTime} min read</span>
          </div>

          <div className="journal-reader-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ReactionButton targetType="journal" targetId={post.id} targetTitle={post.title} />
            <button
              type="button"
              className="journal-reader-action-btn"
              onClick={handleCopyLink}
              title="Copy article link"
            >
              {copied ? '✓ Copied' : '🔗 Share'}
            </button>
            <button
              type="button"
              className="journal-reader-close-btn"
              onClick={onClose}
              aria-label="Close article"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Main Article Body */}
        <article className="journal-reader-article">
          <header className="journal-reader-article-header">
            <h1 className="journal-reader-title">{post.title}</h1>

            <div className="journal-reader-author">
              <div className="author-avatar">SM</div>
              <div>
                <p className="author-name">Shah Mahmud</p>
                <p className="author-role">Visual Artist · Art Director · Creative Strategist</p>
              </div>
            </div>
          </header>

          {post.cover_image_url && (
            <figure className="journal-reader-hero-media">
              <img src={post.cover_image_url} alt={post.title} />
            </figure>
          )}

          {post.excerpt && (
            <div className="journal-reader-lead">
              <p>{post.excerpt}</p>
            </div>
          )}

          {post.content ? (
            <div
              className="journal-reader-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="journal-reader-content">
              <p>{post.excerpt}</p>
            </div>
          )}

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <ShareToolbar targetType="journal" targetId={post.id} targetTitle={post.title} />
          </div>

          <CommentSection targetType="journal" targetId={post.id} targetTitle={post.title} />

          <footer className="journal-reader-footer">
            <div className="journal-reader-footer-inner">
              <p className="footer-tagline">Written by Shah Mahmud</p>
              <button
                type="button"
                className="admin-primary-button"
                onClick={onClose}
              >
                Close Article
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
