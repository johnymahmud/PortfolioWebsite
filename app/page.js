'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import { SITE_CONFIG } from '@/constants/site';

export default function HomePage() {
  const [formStatus, setFormStatus] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Thank you! Your message has been received.');
  };

  return (
    <>
      <MobileHeader />

      <header className="site-header">
        <Link className="brand" href="/" aria-label="Shah Mahmud home">
          {SITE_CONFIG.name.toUpperCase()}<span>•</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/work">See My Work</Link>
          <Link href="/journal">Journal</Link>
          <a href="#identity">Identity</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        {/* FULL-WIDTH HERO CINEMATIC PORTRAIT BANNER */}
        <section className="hero hero-banner-layout" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              FINE ARTIST · ART DIRECTOR · CREATIVE STRATEGIST
            </p>

            <h1 id="hero-title" className="hero-title">
              <span>Art begins</span>
              <span>with freedom.</span>
              <span className="hero-title-accent">Design gives it direction.</span>
            </h1>

            <p className="hero-description">
              I create visual ideas rooted in art, culture, communication and
              creative strategy—across fine arts, advertising and emerging media.
            </p>

            <div className="hero-actions">
              <Link className="button button--primary" href="/work">
                See My Work <span aria-hidden="true">↗</span>
              </Link>

              <a className="button button--text" href="#identity">
                Discover My Story <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <a className="hero-scroll" href="#identity" aria-label="Scroll to identity section">
            <span>Scroll to explore</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        {/* 01 / IDENTITY SECTION */}
        <section id="identity" className="section section--split">
          <div className="section-label">
            <p>01 / IDENTITY</p>
          </div>

          <div className="section-content">
            <h2>
              Beyond creating visuals,<br />
              I create meaning.
            </h2>

            <p className="identity-intro">
              I believe every visual should communicate before it decorates. My
              work combines artistic sensitivity with strategic thinking,
              transforming ideas into meaningful visual experiences across fine
              arts, branding, advertising and digital communication.
            </p>

            <div className="identity-grid">
              <div className="identity-card">
                <span>Profession</span>
                <strong>Fine Artist</strong>
              </div>
              <div className="identity-card">
                <span>Role</span>
                <strong>Art Director</strong>
              </div>
              <div className="identity-card">
                <span>Focus</span>
                <strong>Creative Strategist</strong>
              </div>
              <div className="identity-card">
                <span>Experience</span>
                <strong>8+ Years</strong>
              </div>
              <div className="identity-card">
                <span>Expertise</span>
                <strong>Creative Leadership</strong>
              </div>
              <div className="identity-card">
                <span>Speciality</span>
                <strong>Visual Communication</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / CREATIVE JOURNEY SECTION */}
        <section id="career" className="section section--split journey-section">
          <div className="section-label">
            <p>02 / CREATIVE JOURNEY</p>
          </div>

          <div className="section-content">
            <div className="journey-heading">
              <h2>Experience shaped by art, advertising and ideas.</h2>
            </div>

            <div className="journey-list">
              <article className="journey-item">
                <span className="journey-year">2017</span>
                <div>
                  <h3>Graphic Designer</h3>
                  <p>
                    Building a professional foundation in visual communication,
                    branding and advertising design.
                  </p>
                </div>
              </article>

              <article className="journey-item">
                <span className="journey-year">2020</span>
                <div>
                  <h3>Senior Visual Creative</h3>
                  <p>
                    Developing campaigns, visual systems and cross-platform
                    creative communication.
                  </p>
                </div>
              </article>

              <article className="journey-item">
                <span className="journey-year">Present</span>
                <div>
                  <h3>Art Director & Creative Strategist</h3>
                  <p>
                    Leading visual direction, creative thinking and meaningful
                    brand experiences.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 03 / RECOGNITION SECTION */}
        <section id="recognition" className="section section--split recognition-section">
          <div className="section-label">
            <p>03 / RECOGNITION</p>
          </div>

          <div className="section-content">
            <div className="recognition-intro">
              <h2>
                Milestones that reflect<br />
                the journey.
              </h2>
              <p>
                Selected achievements, exhibitions, publications and professional
                milestones that have shaped my creative journey.
              </p>
            </div>

            <div className="recognition-grid">
              <div className="recognition-card">
                <span>Awards</span>
                <h3>Creative achievements and professional recognition.</h3>
              </div>

              <div className="recognition-card">
                <span>Exhibitions</span>
                <h3>Selected fine arts exhibitions and visual showcases.</h3>
              </div>

              <div className="recognition-card">
                <span>Publications</span>
                <h3>Featured creative work, writing and published contributions.</h3>
              </div>

              <div className="recognition-card">
                <span>Certifications</span>
                <h3>Professional development, workshops and training.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / CONTACT SECTION */}
        <section id="contact" className="section section--split contact-section">
          <div className="section-label">
            <p>04 / CONTACT</p>
          </div>

          <div className="section-content">
            <div className="contact-intro">
              <p className="contact-kicker">HAVE SOMETHING IN MIND?</p>
              <h2>Let’s create something meaningful together.</h2>
              <p className="contact-description">
                Whether it is a brand, an exhibition, a collaboration,
                or a thoughtful conversation—I would love to hear from you.
              </p>
            </div>

            <div className="contact-layout">
              <div className="contact-details">
                <div className="contact-detail">
                  <span>Email</span>
                  <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
                </div>

                <div className="contact-detail">
                  <span>Location</span>
                  <p>Bangladesh</p>
                </div>

                <div className="contact-links">
                  <a href={SITE_CONFIG.socials.behance} target="_blank" rel="noreferrer">
                    Behance <span>↗</span>
                  </a>
                  <a href={SITE_CONFIG.cvUrl} target="_blank" rel="noreferrer">
                    Download CV <span>↓</span>
                  </a>
                </div>
              </div>

              <form id="contact-form" className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-field">
                  <label htmlFor="contact-name">Name</label>
                  <input id="contact-name" name="name" type="text" required />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" name="email" type="email" required />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input id="contact-subject" name="subject" type="text" required />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" name="message" rows="5" required></textarea>
                </div>

                <button className="contact-submit" type="submit">
                  Send Message <span>↗</span>
                </button>

                {formStatus && (
                  <p className="contact-status" aria-live="polite" style={{ color: '#4ade80', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
                    {formStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">{SITE_CONFIG.name}</Link>
            <p>{SITE_CONFIG.role}</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/work">See My Work</Link>
            <Link href="/journal">Journal</Link>
            <a href="#contact">Contact</a>
          </nav>

          <div className="footer-social">
            <p>Connect</p>
            <a href={SITE_CONFIG.socials.behance} target="_blank" rel="noreferrer">Behance ↗</a>
            <a href={SITE_CONFIG.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Shah Mahmud. All rights reserved.</p>
          <a href="#top" className="back-to-top">Back to top <span>↑</span></a>
        </div>
      </footer>
    </>
  );
}
