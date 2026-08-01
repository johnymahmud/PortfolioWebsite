'use client';

import { useState, useEffect } from 'react';
import ProjectViewerModal from '@/components/portfolio/ProjectViewerModal';
import { fetchProjects } from '@/lib/supabase/projects';

export default function TerritoryGallery({ workType, defaultCategories = [], emptyText = 'Selected works will be published here soon.' }) {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchProjects({ territory: workType, isPublishedOnly: true });
        setAllProjects(data || []);
      } catch (err) {
        console.error(`Error loading ${workType} projects:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [workType]);

  // Extract unique categories present in fetched data or defaultCategories
  const categoriesInProjects = Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)));
  const availableCategories = Array.from(new Set([...defaultCategories, ...categoriesInProjects])).filter((cat) =>
    allProjects.some((p) => p.category === cat)
  );

  const visibleProjects = activeCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  const categoriesToRender = activeCategory === 'All'
    ? availableCategories.length > 0 ? availableCategories : Array.from(new Set(allProjects.map((p) => p.category || 'General')))
    : [activeCategory];

  return (
    <section className="professional-projects">
      <div className="professional-page-inner">
        <div className="professional-projects-heading">
          <p className="work-section-label">SELECTED PROJECTS</p>
          <h2>A curated mix of the work that best represents my professional practice.</h2>
        </div>

        {/* CATEGORY FILTER PILLS */}
        {availableCategories.length > 0 && (
          <div className="territory-filter" style={{ margin: '2rem 0 3.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {['All', ...availableCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`territory-filter-button ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="professional-project-status">Loading selected works…</p>
        ) : visibleProjects.length === 0 ? (
          <p className="professional-project-status" style={{ padding: '3rem 0' }}>
            {emptyText}
          </p>
        ) : (
          <div className="territory-project-groups">
            {categoriesToRender.map((categoryName) => {
              const categoryProjects = visibleProjects.filter((p) => (p.category || 'General') === categoryName);
              if (categoryProjects.length === 0) return null;

              return (
                <section key={categoryName} className="territory-category-section" style={{ marginBottom: '4.5rem' }}>
                  <div className="territory-category-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', margin: 0, fontWeight: 500 }}>
                      {categoryName}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', margin: 0 }}>
                      {categoryProjects.length} {categoryProjects.length === 1 ? 'SELECTED WORK' : 'SELECTED WORKS'}
                    </p>
                  </div>

                  <div className="professional-project-grid">
                    {categoryProjects.map((project) => (
                      <article
                        key={project.id || project.title}
                        className="professional-project-card project-card-viewable"
                        onClick={() => setSelectedProject(project)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedProject(project);
                          }
                        }}
                      >
                        {project.cover_image_url || project.image_url ? (
                          <img src={project.cover_image_url || project.image_url} alt={project.title} loading="lazy" />
                        ) : (
                          <div className="professional-project-image-placeholder">
                            {project.video_url ? 'Play Video' : 'View Project'}
                          </div>
                        )}

                        <div className="professional-project-overlay">
                          <span className="professional-project-category">
                            {(project.category || 'Selected Work').toUpperCase()}
                          </span>
                          <h3 className="professional-project-title">{project.title}</h3>
                          <span className="professional-project-arrow">
                            {project.video_url ? '▶' : '＋'}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="professional-explore-more">
          <a
            href="https://www.behance.net/shahmahmud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Explore more on Behance <span>↗</span>
          </a>
        </div>
      </div>

      {selectedProject && (
        <ProjectViewerModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
