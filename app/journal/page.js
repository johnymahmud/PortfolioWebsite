'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import JournalReaderModal from '@/components/journal/JournalReaderModal';
import { fetchJournals } from '@/lib/supabase/journals';
import { SITE_CONFIG } from '@/constants/site';

const CATEGORIES = [
  'All Entries',
  'Blog',
  'Essay',
  'Poetry',
  'Short Story',
  'Art Journal',
  'Research',
];

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Entries');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function loadJournals() {
      setLoading(true);
      try {
        const data = await fetchJournals({ status: 'published' });
        setJournals(data || []);
      } catch (err) {
        console.error('Failed to load journals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJournals();
  }, []);

  const filteredJournals = activeCategory === 'All Entries'
    ? journals
    : journals.filter((item) => (item.category || '').toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <MobileHeader />

      <header className="site-header">
        <Link className="brand" href="/">
          {SITE_CONFIG.name.toUpperCase()}<span>•</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/work">See My Work</Link>
          <Link href="/journal" className="is-active">Journal</Link>
        </nav>
      </header>

      <main className="journal-page-main">
        {/* HERO SECTION */}
        <section className="journal-hero-section">
          <span className="section-subtitle">JOURNAL & ESSAYS · CREATIVE THOUGHT</span>
          <h1 className="journal-hero-title">Journal</h1>
          <p className="journal-hero-description">
            Articles, essays, poetry, art journals and personal observations on art, design strategy, visual thinking and human experience.
          </p>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="journal-filter-container">
          <div className="journal-filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`journal-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="journal-grid-section">
          {loading ? (
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center', padding: '4rem 0' }}>
              Loading journal entries…
            </p>
          ) : filteredJournals.length === 0 ? (
            <div className="journal-empty" style={{ textAlign: 'center', padding: '5rem 0', color: '#888' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.8rem' }}>
                No articles found in "{activeCategory}".
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                Create or publish articles in the Admin CMS (`/admin`) to display them here.
              </p>
            </div>
          ) : (
            <div className="journal-grid">
              {filteredJournals.map((post) => {
                const coverPhoto = post.cover_image_url || post.cover_image || post.image_url;
                return (
                  <article
                    key={post.id || post.slug}
                    className="journal-card"
                    onClick={() => setSelectedPost(post)}
                  >
                    {/* ALWAYS DISPLAY COVER PHOTO MEDIA CONTAINER */}
                    <div className="journal-card-media">
                      {coverPhoto ? (
                        <img src={coverPhoto} alt={post.title} loading="lazy" />
                      ) : (
                        <div className="journal-card-placeholder">
                          <span>{(post.category || 'ESSAY').toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    <div className="journal-card-content">
                      <div className="journal-card-header">
                        <span className="journal-card-tag">
                          {(post.category || 'Essay').toUpperCase()}
                        </span>
                        <span className="journal-card-date">
                          {new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h2 className="journal-card-title">{post.title}</h2>

                      {post.excerpt && <p className="journal-card-excerpt">{post.excerpt}</p>}

                      <span className="journal-card-link">
                        Read Article ↗
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* GET IN TOUCH CTA SECTION */}
        <section className="journal-contact-section">
          <div className="journal-contact-inner">
            <h2>Get in Touch</h2>
            <p>Available for art direction, creative strategy & visual design collaborations.</p>

            <a
              href="mailto:johnymahmud@gmail.com"
              className="journal-contact-btn"
            >
              CONTACT SHAH MAHMUD ↗
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Shah Mahmud</span>
        <span>Fine Artist · Art Director · Creative Strategist</span>
      </footer>

      {/* SMART MODERN READER MODAL */}
      {selectedPost && (
        <JournalReaderModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
