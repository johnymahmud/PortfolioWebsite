'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import { supabase } from '@/lib/supabase/client';
import { fetchProjects, createProject, updateProject, deleteProject, uploadProjectAsset } from '@/lib/supabase/projects';
import { fetchJournals, createJournal, updateJournal, deleteJournal, uploadJournalAsset } from '@/lib/supabase/journals';

const TERRITORY_CATEGORIES_MAP = {
  'Professional Works': ['Press Ad', 'Campaign', 'Logo', 'Event', 'Digital', 'ATL', 'BTL', 'TTL'],
  'Professional': ['Press Ad', 'Campaign', 'Logo', 'Event', 'Digital', 'ATL', 'BTL', 'TTL'],
  'Fine Arts': ['Watercolor', 'Sketch', 'Drawing', 'Mixed Media'],
  'Passion Works': ['Photography', 'Performing Arts', 'Literature', 'Experimental Art'],
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [activeTerritory, setActiveTerritory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  // Project Form State
  const [projectData, setProjectData] = useState({
    title: '',
    work_type: '',
    category: '',
    project_year: '2026',
    client_name: '',
    description: '',
    full_content: '',
    image_url: '',
    behance_url: '',
    video_url: '',
    sort_order: 1,
    is_published: true,
    is_featured: true,
  });

  // Journal Form State
  const [journalData, setJournalData] = useState({
    title: '',
    slug: '',
    category: 'Essay',
    status: 'draft',
    excerpt: '',
    content: '',
    cover_image_url: '',
    is_featured: false,
  });

  const [comments, setComments] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab, activeTerritory]);

  async function loadData() {
    setLoading(true);
    try {
      // Always fetch latest engagement analytics overview for KPI stats
      fetch('/api/v1/analytics/overview')
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setAnalyticsData(res.data);
        })
        .catch((e) => console.error('Error fetching analytics overview:', e));

      if (activeTab === 'projects') {
        const data = await fetchProjects({ territory: activeTerritory, isPublishedOnly: false });
        setProjects(data);
      } else if (activeTab === 'journals') {
        const data = await fetchJournals({ status: 'all' });
        setJournals(data);
      } else if (activeTab === 'comments') {
        const res = await fetch('/api/v1/comments?status=all');
        const json = await res.json();
        setComments(json.data || []);
      } else if (activeTab === 'analytics') {
        const [projData, jourData, commRes] = await Promise.all([
          fetchProjects({ territory: 'all', isPublishedOnly: false }),
          fetchJournals({ status: 'all' }),
          fetch('/api/v1/comments?status=all').then((r) => r.json()),
        ]);
        setProjects(projData);
        setJournals(jourData);
        setComments(commRes.data || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleModerateComment = async (id, status) => {
    try {
      await fetch('/api/v1/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch (err) {
      console.error('Error moderating comment:', err);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await fetch(`/api/v1/comments?id=${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleOpenModal = (item = null) => {
    setFormMessage('');
    if (activeTab === 'projects') {
      if (item) {
        setEditingItem(item);
        setProjectData({
          title: item.title || '',
          work_type: item.work_type || 'Professional Works',
          category: item.category || 'Campaign',
          project_year: item.project_year || item.year || '2026',
          client_name: item.client_name || item.client || '',
          description: item.short_description || item.description || '',
          full_content: item.full_description || item.full_content || '',
          image_url: item.cover_image_url || item.image_url || '',
          behance_url: item.behance_url || '',
          video_url: item.video_url || '',
          sort_order: item.sort_order || 1,
          is_published: item.is_published ?? true,
          is_featured: item.is_featured ?? true,
        });
      } else {
        setEditingItem(null);
        setProjectData({
          title: '',
          work_type: '',
          category: '',
          project_year: '2026',
          client_name: '',
          description: '',
          full_content: '',
          image_url: '',
          behance_url: '',
          video_url: '',
          sort_order: 1,
          is_published: true,
          is_featured: true,
        });
      }
    } else {
      if (item) {
        setEditingItem(item);
        setJournalData({
          title: item.title || '',
          slug: item.slug || '',
          category: item.category || 'Essay',
          status: item.status || 'published',
          excerpt: item.excerpt || '',
          content: item.content || '',
          cover_image_url: item.cover_image_url || '',
          is_featured: item.is_featured ?? false,
        });
      } else {
        setEditingItem(null);
        setJournalData({
          title: '',
          slug: '',
          category: 'Essay',
          status: 'draft',
          excerpt: '',
          content: '',
          cover_image_url: '',
          is_featured: false,
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormMessage('Saving project...');
    try {
      if (activeTab === 'projects') {
        const rawPayload = {
          title: projectData.title,
          work_type: projectData.work_type,
          category: projectData.category,
          project_year: projectData.project_year,
          year: projectData.project_year,
          client_name: projectData.client_name,
          client: projectData.client_name,
          description: projectData.description,
          short_description: projectData.description,
          full_content: projectData.full_content,
          full_description: projectData.full_content,
          cover_image_url: projectData.image_url,
          image_url: projectData.image_url,
          behance_url: projectData.behance_url,
          video_url: projectData.video_url,
          sort_order: parseInt(projectData.sort_order, 10) || 1,
          is_published: projectData.is_published,
          is_featured: projectData.is_featured,
        };

        if (editingItem) {
          await updateProject(editingItem.id, rawPayload);
        } else {
          await createProject(rawPayload);
        }
      } else {
        const slug = journalData.slug || journalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const payload = {
          title: journalData.title,
          slug: slug,
          category: journalData.category,
          status: journalData.status,
          excerpt: journalData.excerpt,
          content: journalData.content,
          cover_image_url: journalData.cover_image_url,
          is_featured: journalData.is_featured,
        };
        if (editingItem) {
          await updateJournal(editingItem.id, payload);
        } else {
          await createJournal(payload);
        }
      }
      setFormMessage('Saved successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadData();
      }, 400);
    } catch (err) {
      console.error(err);
      setFormMessage(`Error: ${err.message || 'Could not save project.'}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'projects') {
        await deleteProject(id);
      } else {
        await deleteJournal(id);
      }
      loadData();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  // Get available categories for selected project territory
  const currentCategories = TERRITORY_CATEGORIES_MAP[projectData.work_type] || [];

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/admin">Portfolio Admin</Link>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          <a
            href="#"
            className={activeTab === 'projects' ? 'is-active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('projects'); }}
          >
            Projects (See My Work)
          </a>
          <a
            href="#"
            className={activeTab === 'journals' ? 'is-active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('journals'); }}
          >
            Journal
          </a>
          <a
            href="#"
            className={activeTab === 'comments' ? 'is-active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('comments'); }}
          >
            💬 Comments Moderation
          </a>
          <a
            href="#"
            className={activeTab === 'analytics' ? 'is-active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}
          >
            📊 Engagement Analytics
          </a>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View Website ↗
          </Link>
        </nav>

        <button type="button" className="admin-logout-button">
          Log Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main id="admin-dashboard" className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-eyebrow">
              {activeTab === 'analytics' ? 'Audience Activity & Metrics' : 'Content Management'}
            </p>
            <h1>
              {activeTab === 'projects'
                ? 'See My Work Projects'
                : activeTab === 'journals'
                ? 'Journal'
                : activeTab === 'comments'
                ? 'Visitor Comments Moderation'
                : 'Visitor Engagement & Analytics Hub'}
            </h1>
            <p>
              {activeTab === 'projects'
                ? 'Upload, publish, edit, and organize selected works across Fine Arts, Professional Works, and Passion Works.'
                : activeTab === 'journals'
                ? 'Create, edit and publish articles, essays, poetry, stories and personal journal entries.'
                : activeTab === 'comments'
                ? 'Review, approve, reject, or delete visitor comments across all artworks and essays.'
                : 'Live audience engagement metrics, reaction counts, visitor comments, and social share tracking.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AdminNotificationBell onSelectNotification={() => setActiveTab('comments')} />
            {activeTab !== 'comments' && activeTab !== 'analytics' && (
              <button
                type="button"
                id="new-project-button"
                className="admin-primary-button"
                onClick={() => handleOpenModal(null)}
              >
                + {activeTab === 'projects' ? 'Add New Project' : 'New Journal Post'}
              </button>
            )}
          </div>
        </header>

        {/* TOP KPI STATS CARDS */}
        <section className="admin-stats-grid" aria-label="Engagement KPI overview">
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper stat-icon-reactions">💖</div>
            <div className="stat-info">
              <span className="stat-number">{analyticsData?.totals?.reactions ?? 0}</span>
              <span className="stat-label">Total Likes</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper stat-icon-comments">💬</div>
            <div className="stat-info">
              <span className="stat-number">{analyticsData?.totals?.comments ?? 0}</span>
              <span className="stat-label">Comments</span>
              {(analyticsData?.totals?.pending_comments ?? 0) > 0 && (
                <span className="stat-subtext">⚠️ {analyticsData.totals.pending_comments} Pending</span>
              )}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper stat-icon-shares">🔗</div>
            <div className="stat-info">
              <span className="stat-number">{analyticsData?.totals?.shares ?? 0}</span>
              <span className="stat-label">Total Shares</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper stat-icon-works">🎨</div>
            <div className="stat-info">
              <span className="stat-number">{projects.length + journals.length}</span>
              <span className="stat-label">Total Works</span>
            </div>
          </div>
        </section>

        {loading && (
          <div className="admin-status-message" role="status">
            Loading {activeTab}...
          </div>
        )}

        {/* TOOLBAR FILTERS */}
        {activeTab === 'projects' ? (
          <section className="admin-toolbar" aria-label="Project territory filters">
            <div className="admin-filter-group">
              <button
                type="button"
                className={`journal-filter-button ${activeTerritory === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveTerritory('all')}
              >
                All Projects
              </button>
              <button
                type="button"
                className={`journal-filter-button ${activeTerritory === 'Professional' ? 'is-active' : ''}`}
                onClick={() => setActiveTerritory('Professional')}
              >
                Professional Works
              </button>
              <button
                type="button"
                className={`journal-filter-button ${activeTerritory === 'Fine Arts' ? 'is-active' : ''}`}
                onClick={() => setActiveTerritory('Fine Arts')}
              >
                Fine Arts
              </button>
              <button
                type="button"
                className={`journal-filter-button ${activeTerritory === 'Passion Works' ? 'is-active' : ''}`}
                onClick={() => setActiveTerritory('Passion Works')}
              >
                Passion Works
              </button>
            </div>
          </section>
        ) : (
          <section className="admin-toolbar" aria-label="Journal status filters">
            <div className="admin-filter-group">
              <button type="button" className="journal-filter-button is-active">
                All Posts
              </button>
            </div>
          </section>
        )}

        {/* CONTENT LIST */}
        <section className="admin-content-section">
          <div className="admin-section-heading">
            <div>
              <h2>
                {activeTab === 'projects'
                  ? 'Portfolio Works'
                  : activeTab === 'journals'
                  ? 'Journal Posts'
                  : 'Submitted Visitor Comments'}
              </h2>
              <p>
                {activeTab === 'projects'
                  ? 'johnymahmud@gmail.com'
                  : activeTab === 'journals'
                  ? `${journals.length} posts`
                  : `${comments.length} total comments`}
              </p>
            </div>
          </div>

          {activeTab === 'projects' ? (
            <div className="dashboard-project-list">
              {projects.map((project) => (
                <article key={project.id} className="dashboard-project-item">
                  <div className="dashboard-project-image">
                    {project.cover_image_url || project.image_url ? (
                      <img src={project.cover_image_url || project.image_url} alt={project.title} />
                    ) : (
                      <span>No Media</span>
                    )}
                  </div>

                  <div className="dashboard-project-content">
                    <span className="dashboard-project-category">
                      {project.work_type || 'Territory'} · {project.category || 'General'}
                    </span>
                    <h3>{project.title}</h3>
                    <p className="dashboard-project-details">
                      {project.project_year || project.year || '2026'} · {project.client_name || project.client || 'Self'} · Order: {project.sort_order || 1}
                    </p>
                    <div className="admin-item-metrics">
                      <span className="metric-pill pill-likes" title="Total Likes">❤️ {analyticsData?.item_metrics?.[project.id]?.reactions ?? 0}</span>
                      <span className="metric-pill pill-comments" title="Total Comments">💬 {analyticsData?.item_metrics?.[project.id]?.comments ?? 0}</span>
                      <span className="metric-pill pill-shares" title="Total Shares">🔗 {analyticsData?.item_metrics?.[project.id]?.shares ?? 0}</span>
                    </div>
                  </div>

                  <div className="dashboard-project-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => handleOpenModal(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : activeTab === 'journals' ? (
            <div className="dashboard-project-list">
              {journals.map((journal) => (
                <article key={journal.id} className="dashboard-project-item">
                  <div className="dashboard-project-image">
                    {journal.cover_image_url || journal.cover_image ? (
                      <img src={journal.cover_image_url || journal.cover_image} alt={journal.title} />
                    ) : (
                      <span>No Media</span>
                    )}
                  </div>

                  <div className="dashboard-project-content">
                    <span className="dashboard-project-category">
                      {journal.status || 'draft'} · {journal.category || 'Essay'}
                    </span>
                    <h3>{journal.title}</h3>
                    <p className="dashboard-project-details">
                      {journal.excerpt || 'No excerpt'}
                    </p>
                    <div className="admin-item-metrics">
                      <span className="metric-pill pill-likes" title="Total Likes">❤️ {analyticsData?.item_metrics?.[journal.id]?.reactions ?? 0}</span>
                      <span className="metric-pill pill-comments" title="Total Comments">💬 {analyticsData?.item_metrics?.[journal.id]?.comments ?? 0}</span>
                      <span className="metric-pill pill-shares" title="Total Shares">🔗 {analyticsData?.item_metrics?.[journal.id]?.shares ?? 0}</span>
                    </div>
                  </div>

                  <div className="dashboard-project-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => handleOpenModal(journal)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() => handleDelete(journal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="admin-analytics-container">
              {/* SOCIAL PLATFORMS SHARE METRICS */}
              <div className="analytics-card">
                <h3>🌐 Social Media Shares Distribution</h3>
                <div className="analytics-platforms-list">
                  <div className="platform-stat-badge">
                    <span>💬 WhatsApp:</span>
                    <strong>{analyticsData?.platforms?.whatsapp ?? 0}</strong>
                  </div>
                  <div className="platform-stat-badge">
                    <span>💼 LinkedIn:</span>
                    <strong>{analyticsData?.platforms?.linkedin ?? 0}</strong>
                  </div>
                  <div className="platform-stat-badge">
                    <span>📘 Facebook:</span>
                    <strong>{analyticsData?.platforms?.facebook ?? 0}</strong>
                  </div>
                  <div className="platform-stat-badge">
                    <span>📋 Direct Link Copy:</span>
                    <strong>{analyticsData?.platforms?.copy_link ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* TOP ENGAGEMENT RANKING TABLE */}
              <div className="analytics-card">
                <h3>🏆 Content Performance Ranking (All Works & Essays)</h3>
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th className="analytics-rank">#</th>
                      <th>Title</th>
                      <th>Type / Category</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Shares</th>
                      <th>Engagement Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...projects.map((p) => ({ ...p, item_type: 'Project', sub_cat: p.work_type || p.category })),
                      ...journals.map((j) => ({ ...j, item_type: 'Journal', sub_cat: j.category })),
                    ]
                      .map((item) => {
                        const m = analyticsData?.item_metrics?.[item.id] || { reactions: 0, comments: 0, shares: 0 };
                        const score = m.reactions * 1 + m.comments * 2 + m.shares * 3;
                        return { ...item, metrics: m, score };
                      })
                      .sort((a, b) => b.score - a.score)
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td className="analytics-rank">#{idx + 1}</td>
                          <td className="analytics-title">{item.title}</td>
                          <td>
                            <small style={{ color: '#a1a1aa' }}>{item.item_type} · {item.sub_cat || 'General'}</small>
                          </td>
                          <td style={{ color: '#fca5a5' }}>❤️ {item.metrics.reactions}</td>
                          <td style={{ color: '#93c5fd' }}>💬 {item.metrics.comments}</td>
                          <td style={{ color: '#6ee7b7' }}>🔗 {item.metrics.shares}</td>
                          <td>
                            <span className="analytics-score-badge">{item.score} pts</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="dashboard-comments-moderation-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.length === 0 ? (
                <p style={{ color: '#71717a', padding: '2rem', textAlign: 'center' }}>No visitor comments recorded yet.</p>
              ) : (
                comments.map((comment) => (
                  <article key={comment.id} style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div>
                        <strong style={{ color: '#f4f4f5', fontSize: '0.95rem' }}>{comment.author_name}</strong>
                        {comment.author_email && (
                          <span style={{ color: '#a1a1aa', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({comment.author_email})</span>
                        )}
                        <span style={{ color: '#71717a', fontSize: '0.75rem', marginLeft: '0.75rem' }}>
                          Target: {comment.target_type}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: comment.status === 'approved' ? 'rgba(16,185,129,0.15)' : comment.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: comment.status === 'approved' ? '#6ee7b7' : comment.status === 'pending' ? '#fcd34d' : '#fca5a5',
                        }}>
                          {comment.status}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: '1.5', margin: '0.5rem 0 1rem 0' }}>
                      {comment.content}
                    </p>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      {comment.status !== 'approved' && (
                        <button
                          type="button"
                          className="admin-secondary-button"
                          style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.4)', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                          onClick={() => handleModerateComment(comment.id, 'approved')}
                        >
                          ✓ Approve & Publish
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button
                          type="button"
                          className="admin-secondary-button"
                          style={{ color: '#fb7185', borderColor: 'rgba(251,113,133,0.4)', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                          onClick={() => handleModerateComment(comment.id, 'rejected')}
                        >
                          ✗ Reject
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-danger-button"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      {/* MODAL EDITING PANEL */}
      {isModalOpen && (
        <>
          <div className="project-form-backdrop" onClick={() => setIsModalOpen(false)}></div>
          <div className={`project-form-panel is-open ${activeTab === 'journals' ? 'journal-editor-panel' : ''}`}>
            <header className="project-form-header">
              <div>
                <p className="admin-page-eyebrow">
                  {activeTab === 'projects' ? 'PORTFOLIO EDITOR' : 'JOURNAL EDITOR'}
                </p>
                <h2>
                  {editingItem
                    ? activeTab === 'projects' ? 'Edit Project' : 'Edit Post'
                    : activeTab === 'projects' ? 'Add New Project' : 'Create New Post'}
                </h2>
              </div>
              <button
                type="button"
                className="project-form-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </header>

            {activeTab === 'projects' ? (
              /* MATCHED ADD NEW PROJECT FORM */
              <form className="project-form" onSubmit={handleSave}>
                <div className="admin-form-grid">
                  {/* PROJECT TITLE */}
                  <div className="admin-field admin-field-full">
                    <label htmlFor="project-title">PROJECT TITLE</label>
                    <input
                      id="project-title"
                      type="text"
                      required
                      placeholder="Enter project title"
                      value={projectData.title}
                      onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    />
                  </div>

                  {/* COVER IMAGE UPLOAD & DROP ZONE */}
                  <div className="admin-field admin-field-full">
                    <label htmlFor="project-image">COVER IMAGE UPLOAD</label>
                    <input
                      type="file"
                      id="project-image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingCover(true);
                          try {
                            const publicUrl = await uploadProjectAsset(file, 'project-covers');
                            setProjectData((prev) => ({ ...prev, image_url: publicUrl }));
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setUploadingCover(false);
                          }
                        }
                      }}
                    />
                    <small>JPG, PNG or WebP (Max 5 MB). Leave empty when editing to keep current cover.</small>

                    {uploadingCover && (
                      <small style={{ color: '#3b82f6', marginTop: '0.4rem', display: 'block' }}>
                        Uploading cover image...
                      </small>
                    )}

                    <div className="project-image-preview" style={{ marginTop: '10px' }}>
                      {projectData.image_url ? (
                        <img src={projectData.image_url} alt="Cover preview" />
                      ) : (
                        <span>Image preview drop zone</span>
                      )}
                    </div>
                  </div>

                  {/* CREATIVE TERRITORY & CATEGORY */}
                  <div className="admin-field">
                    <label htmlFor="project-work-type">CREATIVE TERRITORY</label>
                    <select
                      id="project-work-type"
                      required
                      value={projectData.work_type}
                      onChange={(e) => {
                        const newTerritory = e.target.value;
                        const newCatList = TERRITORY_CATEGORIES_MAP[newTerritory] || [];
                        setProjectData({
                          ...projectData,
                          work_type: newTerritory,
                          category: newCatList[0] || '',
                        });
                      }}
                    >
                      <option value="">Select territory</option>
                      <option value="Professional Works">Professional Works</option>
                      <option value="Fine Arts">Fine Arts</option>
                      <option value="Passion Works">Passion Works</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label htmlFor="project-category">CATEGORY</label>
                    <select
                      id="project-category"
                      required
                      disabled={!projectData.work_type}
                      value={projectData.category}
                      onChange={(e) => setProjectData({ ...projectData, category: e.target.value })}
                    >
                      {!projectData.work_type ? (
                        <option value="">Select creative territory first</option>
                      ) : (
                        currentCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* YEAR & CLIENT */}
                  <div className="admin-field">
                    <label htmlFor="project-year">YEAR</label>
                    <input
                      id="project-year"
                      type="text"
                      placeholder="e.g. 2024"
                      value={projectData.project_year}
                      onChange={(e) => setProjectData({ ...projectData, project_year: e.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="project-client">CLIENT / ORGANIZATION</label>
                    <input
                      id="project-client"
                      type="text"
                      placeholder="e.g. Self / Client Name"
                      value={projectData.client_name}
                      onChange={(e) => setProjectData({ ...projectData, client_name: e.target.value })}
                    />
                  </div>

                  {/* BEHANCE & YOUTUBE URLS */}
                  <div className="admin-field">
                    <label htmlFor="project-behance">BEHANCE PROJECT URL</label>
                    <input
                      id="project-behance"
                      type="url"
                      placeholder="https://www.behance.net/gallery/..."
                      value={projectData.behance_url}
                      onChange={(e) => setProjectData({ ...projectData, behance_url: e.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="project-video">YOUTUBE VIDEO URL</label>
                    <input
                      id="project-video"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={projectData.video_url}
                      onChange={(e) => setProjectData({ ...projectData, video_url: e.target.value })}
                    />
                  </div>

                  {/* DISPLAY SORT ORDER */}
                  <div className="admin-field admin-field-full">
                    <label htmlFor="project-order">DISPLAY SORT ORDER</label>
                    <input
                      id="project-order"
                      type="number"
                      min="1"
                      max="999"
                      required
                      value={projectData.sort_order}
                      onChange={(e) => setProjectData({ ...projectData, sort_order: e.target.value })}
                    />
                  </div>

                  {/* SHORT DESCRIPTION / SUBTITLE */}
                  <div className="admin-field admin-field-full">
                    <label htmlFor="project-description">SHORT DESCRIPTION / SUBTITLE</label>
                    <textarea
                      id="project-description"
                      rows={3}
                      placeholder="Write a brief overview of the project..."
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    />
                  </div>

                  {/* FULL DETAILS / LITERATURE TEXT */}
                  <div className="admin-field admin-field-full">
                    <label htmlFor="project-full-content">FULL DETAILS / LITERATURE TEXT</label>
                    <textarea
                      id="project-full-content"
                      rows={6}
                      placeholder="Write detailed notes, poem lines or full literature text here..."
                      value={projectData.full_content}
                      onChange={(e) => setProjectData({ ...projectData, full_content: e.target.value })}
                    />
                    <small>Used for modal view and literature reader cards.</small>
                  </div>

                  {/* CHECKBOXES */}
                  <div className="admin-field admin-field-full">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={projectData.is_featured}
                        onChange={(e) => setProjectData({ ...projectData, is_featured: e.target.checked })}
                      />
                      <span>FEATURE THIS PROJECT IN PORTFOLIO GALLERY</span>
                    </label>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={projectData.is_published}
                        onChange={(e) => setProjectData({ ...projectData, is_published: e.target.checked })}
                      />
                      <span>PUBLISHED ON WEBSITE</span>
                    </label>
                  </div>
                </div>

                {formMessage && (
                  <p className="project-form-message" data-state="info" style={{ marginTop: '1rem', color: formMessage.includes('Error') ? '#f87171' : '#4ade80' }}>
                    {formMessage}
                  </p>
                )}

                <div className="project-form-actions">
                  <button
                    type="button"
                    className="project-secondary-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-primary-button">
                    Save Project
                  </button>
                </div>
              </form>
            ) : (
              /* JOURNAL FORM */
              <form className="project-form" onSubmit={handleSave}>
                <div className="admin-form-grid">
                  <div className="admin-field admin-field-full">
                    <label htmlFor="journal-title">TITLE</label>
                    <input
                      id="journal-title"
                      type="text"
                      required
                      placeholder="Enter journal title"
                      value={journalData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setJournalData({ ...journalData, title: newTitle, slug: journalData.slug ? journalData.slug : autoSlug });
                      }}
                    />
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="journal-slug">URL SLUG</label>
                    <input
                      id="journal-slug"
                      type="text"
                      required
                      placeholder="example-journal-title"
                      value={journalData.slug}
                      onChange={(e) => setJournalData({ ...journalData, slug: e.target.value })}
                    />
                    <small>Used in the public article URL.</small>
                  </div>

                  <div className="admin-field">
                    <label htmlFor="journal-category">CATEGORY</label>
                    <select
                      id="journal-category"
                      value={journalData.category}
                      onChange={(e) => setJournalData({ ...journalData, category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      <option value="Blog">Blog</option>
                      <option value="Essay">Essay</option>
                      <option value="Poetry">Poetry</option>
                      <option value="Short Story">Short Story</option>
                      <option value="Art Journal">Art Journal</option>
                      <option value="Research">Research</option>
                      <option value="Travel">Travel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label htmlFor="journal-status">STATUS</label>
                    <select
                      id="journal-status"
                      value={journalData.status}
                      onChange={(e) => setJournalData({ ...journalData, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="journal-excerpt">EXCERPT</label>
                    <textarea
                      id="journal-excerpt"
                      rows={3}
                      placeholder="Write a brief summary or excerpt..."
                      value={journalData.excerpt}
                      onChange={(e) => setJournalData({ ...journalData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="admin-field admin-field-full">
                    <label>CONTENT</label>
                    <RichTextEditor
                      value={journalData.content}
                      onChange={(newContent) => setJournalData({ ...journalData, content: newContent })}
                      placeholder="Write your article, essay, poem or story here..."
                    />
                    <small>Write and format your article using the rich text editor toolbar.</small>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="journal-cover-image">COVER IMAGE</label>
                    <input
                      type="file"
                      id="journal-cover-image"
                      name="cover_image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingCover(true);
                          try {
                            const publicUrl = await uploadJournalAsset(file);
                            setJournalData((prev) => ({ ...prev, cover_image_url: publicUrl }));
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setUploadingCover(false);
                          }
                        }
                      }}
                    />

                    {uploadingCover && (
                      <small style={{ color: '#3b82f6', marginTop: '0.4rem', display: 'block' }}>
                        Uploading image...
                      </small>
                    )}

                    {journalData.cover_image_url && (
                      <div id="journal-cover-preview" className="journal-cover-preview" style={{ marginTop: '1rem' }}>
                        <img
                          id="journal-cover-preview-image"
                          src={journalData.cover_image_url}
                          alt="Journal cover preview"
                          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover', display: 'block', marginBottom: '0.5rem' }}
                        />

                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => setJournalData((prev) => ({ ...prev, cover_image_url: '' }))}
                        >
                          Remove Cover
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="admin-field admin-field-full">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={journalData.is_featured}
                        onChange={(e) => setJournalData({ ...journalData, is_featured: e.target.checked })}
                      />
                      <span>FEATURE THIS POST ON THE JOURNAL PAGE</span>
                    </label>
                  </div>
                </div>

                {formMessage && (
                  <p className="project-form-message" data-state="info" style={{ marginTop: '1rem', color: formMessage.includes('Error') ? '#f87171' : '#4ade80' }}>
                    {formMessage}
                  </p>
                )}

                <div className="project-form-actions">
                  <button
                    type="button"
                    className="project-secondary-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-primary-button">
                    Save Post
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
