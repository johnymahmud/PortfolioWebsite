'use client';

export default function ProjectCard({ project, onClick }) {
  const thumbnail = project.cover_image_url || project.image_url || '/assets/images/placeholder.jpg';
  const categoryLabel = `${project.work_type || 'Territory'} · ${project.category || 'General'}`;

  return (
    <article
      className="project-card"
      onClick={() => onClick && onClick(project)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(project);
        }
      }}
    >
      <div className="project-card-media">
        <img
          src={thumbnail}
          alt={project.title || 'Portfolio Work'}
          loading="lazy"
          className="project-card-image"
        />
        <div className="project-card-overlay">
          <span>View Project</span>
        </div>
      </div>

      <div className="project-card-content">
        <span className="project-category-tag">{categoryLabel}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-meta">
          {project.project_year || '2026'} {project.client_name ? `· ${project.client_name}` : ''}
        </p>
      </div>
    </article>
  );
}
