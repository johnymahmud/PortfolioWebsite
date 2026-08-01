import { supabase } from './client';

/**
 * Fetch published journal posts
 */
export async function fetchJournals({ category = 'all', status = 'published' } = {}) {
  let query = supabase
    .from('journal_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching journal posts:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetch single journal post by slug or ID
 */
export async function fetchJournalBySlug(slug) {
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching journal ${slug}:`, error);
    throw error;
  }
  return data;
}

/**
 * Create a new journal post
 */
export async function createJournal(payload) {
  const { data, error } = await supabase
    .from('journal_posts')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating journal post:', error);
    throw error;
  }
  return data;
}

/**
 * Update a journal post
 */
export async function updateJournal(id, payload) {
  const { data, error } = await supabase
    .from('journal_posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating journal post ${id}:`, error);
    throw error;
  }
  return data;
}

/**
 * Delete a journal post
 */
export async function deleteJournal(id) {
  const { error } = await supabase
    .from('journal_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting journal post ${id}:`, error);
    throw error;
  }
  return true;
}

/**
 * Upload cover image file to Supabase storage or return Data URL
 */
export async function uploadJournalAsset(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `journal-covers/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

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
    console.warn('Storage upload fallback to FileReader DataURL:', err);
  }

  // Fallback to data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
