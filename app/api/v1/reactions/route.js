import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse, getClientIpHash } from '@/lib/api-helpers';

/**
 * GET /api/v1/reactions?target_type=project&target_id=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');

    if (!targetType || !targetId) {
      return errorResponse('target_type and target_id are required', 400);
    }

    const ipHash = getClientIpHash(request);

    // Fetch total reaction count
    const { count, error } = await supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    if (error) {
      return errorResponse('Failed to fetch reactions', 500, error.message);
    }

    // Check if this IP reacted in the last 24h
    const { data: userReactions } = await supabase
      .from('reactions')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .eq('ip_hash', ipHash)
      .limit(1);

    const hasReacted = Boolean(userReactions && userReactions.length > 0);

    return successResponse({
      count: count || 0,
      hasReacted,
    });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * POST /api/v1/reactions
 * Submit 1-click reaction with IP-hash rate-limiting
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { target_type, target_id, target_title = 'Artwork / Essay' } = body;

    if (!target_type || !target_id) {
      return errorResponse('target_type and target_id are required', 400);
    }

    const ipHash = getClientIpHash(request);

    // Rate Limiting: Check reactions from this IP in the last 24 hours for this target
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existingReactions } = await supabase
      .from('reactions')
      .select('id')
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .eq('ip_hash', ipHash)
      .gte('created_at', yesterday);

    if (existingReactions && existingReactions.length >= 5) {
      return errorResponse('Daily reaction limit reached for this item', 429);
    }

    // Insert reaction
    const { data, error } = await supabase
      .from('reactions')
      .insert([
        {
          target_type,
          target_id,
          reaction_type: body.reaction_type || 'heart',
          ip_hash: ipHash,
        },
      ])
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to save reaction', 500, error.message);
    }

    // Trigger Admin Notification (fire-and-forget)
    supabase
      .from('admin_notifications')
      .insert([
        {
          type: 'reaction',
          title: 'New Reaction',
          message: `Someone liked "${target_title}"`,
          target_url: target_type === 'project' ? `/work` : `/journal`,
          is_read: false,
        },
      ])
      .then(() => {})
      .catch(() => {});

    // Return updated total count
    const { count } = await supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', target_type)
      .eq('target_id', target_id);

    return successResponse(
      { count: count || 1, hasReacted: true },
      null,
      201,
      'Reaction recorded'
    );
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
