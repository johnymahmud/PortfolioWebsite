import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/journals/[slug]
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    let query = supabase.from('journal_posts').select('*');

    // Check if slug is a UUID ID or text slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      query = query.eq('id', slug);
    } else {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return errorResponse('Journal essay not found', 404, error?.message);
    }

    return successResponse(data);
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PUT /api/v1/journals/[slug]
 */
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const payload = {
      title: body.title,
      slug: body.slug || slug,
      category: body.category,
      status: body.status,
      excerpt: body.excerpt,
      content: body.content,
      cover_image: body.cover_image || body.cover_image_url,
      is_featured: body.is_featured,
      updated_at: new Date().toISOString(),
    };

    if (body.status === 'published' && !body.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('journal_posts').update(payload);
    query = isUuid ? query.eq('id', slug) : query.eq('slug', slug);

    const { data, error } = await query.select().single();

    if (error) {
      return errorResponse('Failed to update journal', 500, error.message);
    }

    return successResponse(data, null, 200, 'Journal updated successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PATCH /api/v1/journals/[slug]
 * Partial update (e.g. status='published', is_featured=true)
 */
export async function PATCH(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const patchPayload = { ...body, updated_at: new Date().toISOString() };
    if ('cover_image_url' in patchPayload && !('cover_image' in patchPayload)) {
      patchPayload.cover_image = patchPayload.cover_image_url;
      delete patchPayload.cover_image_url;
    }

    if (patchPayload.status === 'published') {
      patchPayload.published_at = new Date().toISOString();
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('journal_posts').update(patchPayload);
    query = isUuid ? query.eq('id', slug) : query.eq('slug', slug);

    const { data, error } = await query.select().single();

    if (error) {
      return errorResponse('Failed to patch journal', 500, error.message);
    }

    return successResponse(data, null, 200, 'Journal patched successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * DELETE /api/v1/journals/[slug]
 */
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    let query = supabase.from('journal_posts').delete();
    query = isUuid ? query.eq('id', slug) : query.eq('slug', slug);

    const { error } = await query;

    if (error) {
      return errorResponse('Failed to delete journal post', 500, error.message);
    }

    return successResponse({ slug }, null, 200, 'Journal deleted successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
