import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/analytics/share?target_type=project&target_id=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');

    let query = supabase.from('share_logs').select('*', { count: 'exact', head: true });

    if (targetType) query = query.eq('target_type', targetType);
    if (targetId) query = query.eq('target_id', targetId);

    const { count, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch share count', 500, error.message);
    }

    return successResponse({ count: count || 0 });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * POST /api/v1/analytics/share
 * Log sharing click
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { target_type, target_id, platform = 'copy_link', target_title = 'Artwork' } = body;

    if (!target_type || !target_id) {
      return errorResponse('target_type and target_id are required', 400);
    }

    const { error } = await supabase.from('share_logs').insert([
      {
        target_type,
        target_id,
        platform,
      },
    ]);

    if (error) {
      return errorResponse('Failed to record share log', 500, error.message);
    }

    // Trigger Admin Notification (fire-and-forget)
    supabase
      .from('admin_notifications')
      .insert([
        {
          type: 'share',
          title: 'Artwork Shared',
          message: `"${target_title}" was shared via ${platform}`,
          target_url: target_type === 'project' ? `/work` : `/journal`,
          is_read: false,
        },
      ])
      .then(() => {})
      .catch(() => {});

    return successResponse({ recorded: true }, null, 201, 'Share event logged');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
