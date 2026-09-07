import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/journals
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const limit = parseInt(searchParams.get('limit'), 10) || 100;

    let query = supabase
      .from('journal_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch journals', 500, error.message);
    }

    return successResponse(data || [], { count: data?.length || 0 });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * POST /api/v1/journals
 */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return errorResponse('Journal title is required', 400);
    }

    const generatedSlug = body.slug || body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `essay-${Date.now()}`;

    const newPost = {
      title: body.title,
      slug: generatedSlug,
      category: body.category || 'Art Journal',
      status: body.status || 'draft',
      excerpt: body.excerpt || '',
      content: body.content || '',
      cover_image: body.cover_image || body.cover_image_url || '',
      is_featured: body.is_featured ?? false,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('journal_posts')
      .insert([newPost])
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to create journal post', 500, error.message);
    }

    return successResponse(data, null, 201, 'Journal post created successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
