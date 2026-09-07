import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/projects/[id]
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return errorResponse('Project not found', 404, error?.message);
    }

    return successResponse(data);
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PUT /api/v1/projects/[id]
 * Complete project replacement/update
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.title) {
      return errorResponse('Project title is required for full update', 400);
    }

    const payload = {
      title: body.title,
      work_type: body.work_type,
      category: body.category,
      year: body.year || body.project_year,
      client: body.client || body.client_name,
      description: body.description || body.short_description,
      full_content: body.full_content || body.full_description,
      image_url: body.image_url || body.cover_image_url,
      behance_url: body.behance_url,
      video_url: body.video_url,
      sort_order: parseInt(body.sort_order, 10) || 1,
      is_published: body.is_published,
      is_featured: body.is_featured,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to update project', 500, error.message);
    }

    return successResponse(data, null, 200, 'Project fully updated');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PATCH /api/v1/projects/[id]
 * Partial project update (e.g. toggle is_featured, is_published, sort_order)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Allow partial updates for any provided fields
    const patchPayload = { ...body, updated_at: new Date().toISOString() };

    // Standardize mapped field names if present
    if ('project_year' in patchPayload && !('year' in patchPayload)) {
      patchPayload.year = patchPayload.project_year;
      delete patchPayload.project_year;
    }
    if ('client_name' in patchPayload && !('client' in patchPayload)) {
      patchPayload.client = patchPayload.client_name;
      delete patchPayload.client_name;
    }
    if ('short_description' in patchPayload && !('description' in patchPayload)) {
      patchPayload.description = patchPayload.short_description;
      delete patchPayload.short_description;
    }
    if ('cover_image_url' in patchPayload && !('image_url' in patchPayload)) {
      patchPayload.image_url = patchPayload.cover_image_url;
      delete patchPayload.cover_image_url;
    }

    const { data, error } = await supabase
      .from('projects')
      .update(patchPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to patch project', 500, error.message);
    }

    return successResponse(data, null, 200, 'Project patched successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * DELETE /api/v1/projects/[id]
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse('Failed to delete project', 500, error.message);
    }

    return successResponse({ id }, null, 200, 'Project deleted successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
