'use client';

import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import TerritoryGallery from '@/components/portfolio/TerritoryGallery';
import { SITE_CONFIG } from '@/constants/site';

export default function FineArtsPage() {
  return (
    <>
      <MobileHeader />

      <header className="site-header">
        <Link className="brand" href="/">
          {SITE_CONFIG.name.toUpperCase()}<span>•</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/work" className="is-active">See My Work</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/admin">CMS Admin</Link>
        </nav>
      </header>

      <main className="professional-page" data-work-type="Fine Arts">
        <section className="professional-hero">
          <div className="professional-page-inner">
            <p className="work-eyebrow">WATERCOLOR · SKETCH · DRAWING</p>
            <h1 className="professional-page-title">Fine Arts</h1>
            <p className="professional-page-intro">
              A curated selection of watercolor, sketch and drawing developed through observation, emotion and material exploration.
            </p>
          </div>
        </section>

        <TerritoryGallery
          workType="Fine Arts"
          defaultCategories={["Watercolor", "Sketch", "Drawing"]}
          emptyText="Selected fine art works will be published here soon."
        />
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Shah Mahmud</span>
        <span>Fine Artist · Art Director · Creative Strategist</span>
      </footer>
    </>
  );
}
