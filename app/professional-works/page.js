'use client';

import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import TerritoryGallery from '@/components/portfolio/TerritoryGallery';
import { SITE_CONFIG } from '@/constants/site';

export default function ProfessionalWorksPage() {
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

      <main className="professional-page" data-work-type="Professional Works">
        <section className="professional-hero">
          <div className="professional-page-inner">
            <p className="work-eyebrow">Art Direction · Strategy · Communication</p>
            <h1 className="professional-page-title">Professional Works</h1>
            <p className="professional-page-intro">
              Curated commercial work across campaigns, identity, advertising, experiences and digital communication.
            </p>
          </div>
        </section>

        <TerritoryGallery
          workType="Professional Works"
          defaultCategories={["Press Ad", "Campaign", "Logo", "Event", "Digital", "ATL", "BTL"]}
          emptyText="Professional projects will be published here soon."
        />
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Shah Mahmud</span>
        <span>Fine Artist · Art Director · Creative Strategist</span>
      </footer>
    </>
  );
}
