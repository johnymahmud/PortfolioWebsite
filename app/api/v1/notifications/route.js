import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

/**
 * GET /api/v1/notifications
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit'), 10) || 20;

    // Fetch unread count
    const { count: unreadCount } = await supabase
      .from('admin_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    // Fetch notifications list
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return errorResponse('Failed to fetch notifications', 500, error.message);
    }

    return successResponse(data || [], { unreadCount: unreadCount || 0 });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * PATCH /api/v1/notifications
 * Mark single notification or all notifications as read
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, markAllAsRead } = body;

    if (markAllAsRead) {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) {
        return errorResponse('Failed to mark all notifications as read', 500, error.message);
      }
      return successResponse({ allRead: true }, null, 200, 'All notifications marked as read');
    }

    if (!id) {
      return errorResponse('Notification id is required', 400);
    }

    const { data, error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse('Failed to update notification', 500, error.message);
    }

    return successResponse(data, null, 200, 'Notification marked as read');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * DELETE /api/v1/notifications?id=...
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Notification id is required', 400);
    }

    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse('Failed to delete notification', 500, error.message);
    }

    return successResponse({ id }, null, 200, 'Notification deleted');
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}
