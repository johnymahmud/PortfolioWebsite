import { supabase } from './client';

export const TERRITORY_OPTIONS = [
  { label: 'All Territories', value: 'all' },
  { label: 'ATL (Above The Line)', value: 'ATL' },
  { label: 'BTL & TTL', value: 'BTL/TTL' },
  { label: 'Fine Arts', value: 'Fine Arts' },
  { label: 'Passion Works', value: 'Passion Works' },
  { label: 'Professional Works', value: 'Professional Works' },
];

/**
 * Fetch all published projects or filter by territory
 */
export async function fetchProjects({ territory = 'all', featuredOnly = false, isPublishedOnly = true } = {}) {
  let query = supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (isPublishedOnly) {
    query = query.eq('is_published', true);
  }

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (territory && territory !== 'all') {
    query = query.ilike('work_type', `%${territory}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetch single project by ID
 */
export async function fetchProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
  return data;
}

/**
 * Resilient project saver that auto-generates slug and adapts to Supabase table schema
 */
export async function saveProjectPayload(id, rawPayload) {
  // Generate safe non-null slug from title
  const generatedSlug = rawPayload.slug || (rawPayload.title || 'project')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `project-${Date.now()}`;

  const cleanPayload = {
    title: rawPayload.title || 'Untitled Project',
    slug: generatedSlug,
    work_type: rawPayload.work_type || 'Professional Works',
    category: rawPayload.category || 'General',
    project_year: rawPayload.project_year || '2026',
    client_name: rawPayload.client_name || '',
    short_description: rawPayload.description || rawPayload.short_description || '',
    full_description: rawPayload.full_content || rawPayload.full_description || '',
    cover_image_url: rawPayload.image_url || rawPayload.cover_image_url || '',
    image_url: rawPayload.image_url || rawPayload.cover_image_url || '',
    behance_url: rawPayload.behance_url || '',
    video_url: rawPayload.video_url || '',
    sort_order: parseInt(rawPayload.sort_order, 10) || 1,
    is_published: rawPayload.is_published ?? true,
    is_featured: rawPayload.is_featured ?? true,
  };

  // 1. Attempt save
  let query = id
    ? supabase.from('projects').update(cleanPayload).eq('id', id)
    : supabase.from('projects').insert([cleanPayload]);

  let { data, error } = await query.select();

  // 2. Self-healing schema check: if column is missing, remove it and retry!
  while (error && error.message && error.message.includes("Could not find the")) {
    const missingColMatch = error.message.match(/Could not find the '([^']+)' column/);
    if (missingColMatch && missingColMatch[1]) {
      const badCol = missingColMatch[1];
      console.warn(`Removing unknown column '${badCol}' and retrying project save...`);
      delete cleanPayload[badCol];

      let retryQuery = id
        ? supabase.from('projects').update(cleanPayload).eq('id', id)
        : supabase.from('projects').insert([cleanPayload]);

      const retryRes = await retryQuery.select();
      data = retryRes.data;
      error = retryRes.error;
    } else {
      break;
    }
  }

  if (error) {
    console.error('Error saving project:', error);
    throw error;
  }
  return data ? data[0] : null;
}

/**
 * Create a new project entry
 */
export async function createProject(projectPayload) {
  return saveProjectPayload(null, projectPayload);
}

/**
 * Update an existing project
 */
export async function updateProject(id, projectPayload) {
  return saveProjectPayload(id, projectPayload);
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
  return true;
}

/**
 * Upload project image to Supabase Storage bucket or DataURL fallback
 */
export async function uploadProjectAsset(file, pathPrefix = 'projects') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    }
  } catch (err) {
    console.warn('Storage upload fallback to DataURL:', err);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
