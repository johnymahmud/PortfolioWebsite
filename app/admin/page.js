'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
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

  useEffect(() => {
    loadData();
  }, [activeTab, activeTerritory]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const data = await fetchProjects({ territory: activeTerritory, isPublishedOnly: false });
        setProjects(data);
      } else {
        const data = await fetchJournals({ status: 'all' });
        setJournals(data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }

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
            <p className="admin-page-eyebrow">Content Management</p>
            <h1>{activeTab === 'projects' ? 'See My Work Projects' : 'Journal'}</h1>
            <p>
              {activeTab === 'projects'
                ? 'Upload, publish, edit, and organize selected works across Fine Arts, Professional Works, and Passion Works.'
                : 'Create, edit and publish articles, essays, poetry, stories and personal journal entries.'}
            </p>
          </div>

          <button
            type="button"
            id="new-project-button"
            className="admin-primary-button"
            onClick={() => handleOpenModal(null)}
          >
            + {activeTab === 'projects' ? 'Add New Project' : 'New Journal Post'}
          </button>
        </header>

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
              <h2>{activeTab === 'projects' ? 'Portfolio Works' : 'Journal Posts'}</h2>
              <p>{activeTab === 'projects' ? 'johnymahmud@gmail.com' : `${journals.length} posts`}</p>
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
          ) : (
            <div className="dashboard-project-list">
              {journals.map((journal) => (
                <article key={journal.id} className="dashboard-project-item">
                  <div className="dashboard-project-image">
                    {journal.cover_image_url ? (
                      <img src={journal.cover_image_url} alt={journal.title} />
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
