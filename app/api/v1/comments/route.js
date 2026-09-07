import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse, getClientIpHash } from '@/lib/api-helpers';

/**
 * GET /api/v1/comments
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit'), 10) || 50;

    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (targetType) {
      query = query.eq('target_type', targetType);
    }

    if (targetId) {
      query = query.eq('target_id', targetId);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      if (error.message && error.message.includes('Could not find the table')) {
        return successResponse([], { count: 0 });
      }
      return errorResponse('Failed to fetch comments', 500, error.message);
    }

    return successResponse(data || [], { count: data?.length || 0 });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * POST /api/v1/comments
 * Guest submission with Honeypot anti-bot protection
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      target_type,
      target_id,
      author_name,
      author_email = '',
      content,
      honeypot_website = '', // Hidden trap for bots
      target_title = 'Artwork / Essay',
    } = body;

    // 1. Honeypot check: If the hidden field is filled, it's an automated bot
    if (honeypot_website) {
      // Silently return fake success so bots don't adapt
      return successResponse({ id: 'rejected' }, null, 201, 'Comment received');
    }

    // 2. Validate required human fields
    if (!target_type || !target_id) {
      return errorResponse('target_type and target_id are required', 400);
    }

    if (!author_name || author_name.trim().length < 2) {
      return errorResponse('Please enter your name', 400);
    }

    if (!content || content.trim().length < 3) {
      return errorResponse('Please enter a comment message', 400);
    }

    const ipHash = getClientIpHash(request);

    // 3. Insert comment with default 'pending' status
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          target_type,
          target_id,
          author_name: author_name.trim(),
          author_email: author_email.trim(),
          content: content.trim(),
          status: 'pending',
          ip_hash: ipHash,
        },
      ])
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to submit comment', 500, error.message);
    }

    // 4. Trigger Admin Notification
    supabase
      .from('admin_notifications')
      .insert([
        {
          type: 'comment',
          title: 'New Comment Pending Approval',
          message: `${author_name.trim()} commented on "${target_title}": "${content.trim().substring(0, 60)}..."`,
          target_url: `/admin?tab=comments`,
          is_read: false,
        },
      ])
      .then(() => {})
      .catch(() => {});

    return successResponse(
      data,
      null,
      201,
      'Your comment has been submitted and will appear after moderation review.'
    );
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PATCH /api/v1/comments
 * Moderate comment (approve/reject)
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return errorResponse('Comment id and status are required', 400);
    }

    const payload = {
      status,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('comments')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to update comment status', 500, error.message);
    }

    return successResponse(data, null, 200, `Comment ${status}`);
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * DELETE /api/v1/comments
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Comment id is required', 400);
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse('Failed to delete comment', 500, error.message);
    }

    return successResponse({ id }, null, 200, 'Comment deleted successfully');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
