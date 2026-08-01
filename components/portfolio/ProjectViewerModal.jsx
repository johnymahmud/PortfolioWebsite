'use client';

import { useEffect } from 'react';

/**
 * Robust YouTube Embed URL Extractor
 */
function getYouTubeEmbedUrl(url) {
  const rawUrl = String(url || '').trim();
  if (!rawUrl) return '';

  try {
    const parsedUrl = new URL(rawUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
    let videoId = '';

    if (hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      if (parsedUrl.pathname === '/watch') {
        videoId = parsedUrl.searchParams.get('v') || '';
      } else if (parsedUrl.pathname.startsWith('/embed/')) {
        videoId = parsedUrl.pathname.split('/embed/')[1]?.split('/')[0] || '';
      } else if (parsedUrl.pathname.startsWith('/shorts/')) {
        videoId = parsedUrl.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      } else if (parsedUrl.pathname.startsWith('/live/')) {
        videoId = parsedUrl.pathname.split('/live/')[1]?.split('/')[0] || '';
      }
    }

    if (!videoId) return '';
    const cleanVideoId = videoId.split('?')[0].split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(cleanVideoId)}?rel=0&autoplay=1`;
  } catch (error) {
    console.error('Invalid YouTube URL:', error);
    return '';
  }
}

export default function ProjectViewerModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      document.body.classList.add('project-viewer-open');
    } else {
      document.body.classList.remove('project-viewer-open');
    }
    return () => {
      document.body.classList.remove('project-viewer-open');
    };
  }, [project]);

  if (!project) return null;

  const imageUrl = project.cover_image_url || project.image_url;
  const description = project.short_description || project.description;
  const fullText = project.full_description || project.full_content;

  // Video and Behance URL resolution
  const videoUrl = String(project.video_url || '').trim();
  const behanceUrl = String(project.behance_url || '').trim();
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  // Determine external link redirect
  let exploreUrl = '';
  let exploreText = 'EXPLORE MORE →';

  if (behanceUrl) {
    exploreUrl = behanceUrl;
    exploreText = 'EXPLORE MORE →';
  } else if (videoUrl) {
    exploreUrl = videoUrl;
    exploreText = 'WATCH ON YOUTUBE →';
  }

  return (
    <div className="project-viewer">
      <div className="project-viewer-backdrop" onClick={onClose} />

      <div className="project-viewer-panel">
        <button
          type="button"
          className="project-viewer-close"
          onClick={onClose}
          aria-label="Close project viewer"
        >
          ✕
        </button>

        {/* HERO MEDIA: Render Embedded YouTube Player if video project, else Image */}
        {embedUrl ? (
          <div className="project-viewer-video" style={{ marginBottom: '3rem', width: '100%' }}>
            <iframe
              src={embedUrl}
              title={project.title || 'YouTube Video Player'}
              style={{
                width: '100%',
                aspectRatio: '16/9',
                border: '0',
                borderRadius: '8px',
                boxShadow: '0 30px 90px rgba(0, 0, 0, 0.6)',
                display: 'block',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          imageUrl && (
            <div className="project-viewer-image">
              <img src={imageUrl} alt={project.title || 'Project image'} />
            </div>
          )
        )}

        <div className="project-viewer-content">
          <span className="viewer-category">
            {(project.category || 'Selected Work').toUpperCase()}
          </span>

          <h2>{project.title}</h2>

          {description && <p className="viewer-description">{description}</p>}

          {fullText && (
            <div
              className="viewer-description"
              style={{ marginTop: '1.5rem', whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: fullText }}
            />
          )}

          <div className="viewer-meta">
            {project.work_type && (
              <div className="viewer-meta-item">
                <span className="viewer-meta-label">CREATIVE TERRITORY</span>
                <span className="viewer-meta-value">{project.work_type}</span>
              </div>
            )}

            {project.category && (
              <div className="viewer-meta-item">
                <span className="viewer-meta-label">CATEGORY</span>
                <span className="viewer-meta-value">{project.category}</span>
              </div>
            )}

            {(project.project_year || project.year) && (
              <div className="viewer-meta-item">
                <span className="viewer-meta-label">YEAR</span>
                <span className="viewer-meta-value">{project.project_year || project.year}</span>
              </div>
            )}

            {(project.client_name || project.client) && (
              <div className="viewer-meta-item">
                <span className="viewer-meta-label">CLIENT / ORGANIZATION</span>
                <span className="viewer-meta-value">{project.client_name || project.client}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            {exploreUrl ? (
              <a
                href={exploreUrl}
                target="_blank"
                rel="noreferrer"
                className="viewer-explore"
              >
                {exploreText}
              </a>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                NO EXTERNAL LINK SPECIFIED FOR THIS WORK
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
