'use client';

import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import { SITE_CONFIG } from '@/constants/site';

export default function WorkPage() {
  return (
    <>
      <MobileHeader />

      <header className="site-header">
        <Link className="brand" href="/" aria-label="Shah Mahmud home">
          {SITE_CONFIG.name.toUpperCase()}<span>•</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/work" className="is-active">See My Work</Link>
          <Link href="/journal">Journal</Link>
          <a href="/#contact">Contact</a>
          <Link href="/admin" className="admin-nav-link">CMS Admin</Link>
        </nav>
      </header>

      <main className="work-page">
        {/* Work Hero */}
        <section className="work-hero">
          <div className="work-hero-inner">
            <p className="work-eyebrow">Selected Practice · Curated Archive</p>

            <h1 className="work-title">See My Work</h1>

            <p className="work-intro">
              A curated view of my practice across fine art, professional design
              and personal creative exploration. The website presents selected
              works, while Behance and YouTube hold the wider archive.
            </p>
          </div>
        </section>

        {/* Main Work Categories */}
        <section className="work-categories" aria-labelledby="work-categories-title">
          <div className="work-categories-inner">
            <div className="work-section-heading">
              <p className="work-section-label">Creative Territories</p>

              <h2 className="work-section-copy" id="work-categories-title">
                Three connected worlds shaped by observation, strategy,
                imagination and human experience.
              </h2>
            </div>

            <div className="work-card-list">
              {/* Fine Arts */}
              <Link className="work-card" href="/fine-arts">
                <span className="work-card-number">01</span>

                <div className="work-card-content">
                  <span className="work-card-kicker">Artistic Practice</span>

                  <h3 className="work-card-title">Fine Arts</h3>

                  <p className="work-card-description">
                    Selected personal works developed through observation,
                    emotion, material exploration and visual interpretation.
                  </p>

                  <div className="work-card-tags" aria-label="Fine Arts categories">
                    <span>Watercolor</span>
                    <span>Sketch</span>
                    <span>Drawing</span>
                  </div>
                </div>

                <span className="work-card-arrow" aria-hidden="true">↗</span>
              </Link>

              {/* Professional Works */}
              <Link className="work-card" href="/professional-works">
                <span className="work-card-number">02</span>

                <div className="work-card-content">
                  <span className="work-card-kicker">Art Direction & Strategy</span>

                  <h3 className="work-card-title">Professional Works</h3>

                  <p className="work-card-description">
                    Curated commercial work across campaigns, identity,
                    advertising, experiences and digital communication.
                  </p>

                  <div className="work-card-tags" aria-label="Professional Works categories">
                    <span>ATL</span>
                    <span>BTL</span>
                    <span>TTL / Digital</span>
                  </div>
                </div>

                <span className="work-card-arrow" aria-hidden="true">↗</span>
              </Link>

              {/* Passion Works */}
              <Link className="work-card" href="/passion-works">
                <span className="work-card-number">03</span>

                <div className="work-card-content">
                  <span className="work-card-kicker">Personal Exploration</span>

                  <h3 className="work-card-title">Passion Works</h3>

                  <p className="work-card-description">
                    Creative activities beyond commissioned design—where
                    photography, performance and literature become personal forms
                    of expression.
                  </p>

                  <div className="work-card-tags" aria-label="Passion Works categories">
                    <span>Photography</span>
                    <span>Performing Arts</span>
                    <span>Literature</span>
                  </div>
                </div>

                <span className="work-card-arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Archive Strategy */}
        <section className="archive-strategy">
          <div className="archive-strategy-inner">
            <p>
              <strong>This website is the curated experience.</strong> Behance holds
              complete campaigns and visual archives, while YouTube hosts motion and
              performance-based work.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Shah Mahmud</span>
        <span>Fine Artist · Art Director · Creative Strategist</span>
      </footer>
    </>
  );
}
