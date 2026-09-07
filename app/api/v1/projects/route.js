import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/projects
 * Query projects with filters
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const territory = searchParams.get('territory');
    const featured = searchParams.get('featured');
    const publishedOnly = searchParams.get('publishedOnly') !== 'false';
    const limit = parseInt(searchParams.get('limit'), 10) || 100;

    let query = supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (territory && territory !== 'all') {
      query = query.ilike('work_type', `%${territory}%`);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch projects', 500, error.message);
    }

    return successResponse(data || [], { count: data?.length || 0 });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * POST /api/v1/projects
 * Create a new project
 */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return errorResponse('Project title is required', 400);
    }

    const newProject = {
      title: body.title,
      work_type: body.work_type || 'Professional Works',
      category: body.category || 'General',
      year: body.year || body.project_year || '2026',
      client: body.client || body.client_name || '',
      description: body.description || body.short_description || '',
      full_content: body.full_content || body.full_description || '',
      image_url: body.image_url || body.cover_image_url || '',
      behance_url: body.behance_url || '',
      video_url: body.video_url || '',
      sort_order: parseInt(body.sort_order, 10) || 1,
      is_published: body.is_published ?? true,
      is_featured: body.is_featured ?? true,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to create project', 500, error.message);
    }

    return successResponse(data, null, 201, 'Project created successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
