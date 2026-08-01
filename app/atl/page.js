'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectViewerModal from '@/components/portfolio/ProjectViewerModal';
import { fetchProjects } from '@/lib/supabase/projects';
import { SITE_CONFIG } from '@/constants/site';

export default function ATLPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(false);
      try {
        const data = await fetchProjects({ territory: 'ATL' });
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          <Link href="/atl" className="is-active">ATL</Link>
          <Link href="/journal">Journal</Link>
        </nav>
      </header>

      <main className="work-page-main">
        <section className="work-hero-section">
          <span className="section-subtitle">TERRITORY 01</span>
          <h1 className="work-hero-title">Above The Line (ATL) Works</h1>
          <p className="work-hero-description">
            Television commercials, large-scale print campaigns, billboard OOH, and integrated ad campaigns.
          </p>
        </section>

        <section className="work-grid-section">
          {loading ? (
            <p>Loading ATL projects...</p>
          ) : projects.length === 0 ? (
            <div className="work-empty-state">
              <h3>No ATL projects uploaded yet.</h3>
              <p>Add projects in the CMS Admin with category ATL.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onClick={setSelectedProject} />
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedProject && (
        <ProjectViewerModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
