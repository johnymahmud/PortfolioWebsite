import { supabase } from '@/lib/supabase/client';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/analytics/overview
 * Returns high-level engagement analytics, totals, and per-item metrics
 */
export async function GET() {
  try {
    // 1. Fetch total counts with graceful fallback
    const [reactionsRes, commentsRes, pendingCommentsRes, sharesRes] = await Promise.all([
      supabase.from('reactions').select('target_id, target_type, reaction_type', { count: 'exact' }),
      supabase.from('comments').select('id, target_id, target_type, status', { count: 'exact' }),
      supabase.from('comments').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('share_logs').select('target_id, target_type, platform', { count: 'exact' }),
    ]);

    const reactionsData = reactionsRes.data || [];
    const commentsData = commentsRes.data || [];
    const sharesData = sharesRes.data || [];

    const totalReactions = reactionsRes.count || reactionsData.length;
    const totalComments = commentsRes.count || commentsData.length;
    const pendingComments = pendingCommentsRes.count || commentsData.filter(c => c.status === 'pending').length;
    const totalShares = sharesRes.count || sharesData.length;

    // 2. Build per-target breakdown map: item_metrics[target_id] = { reactions, comments, shares }
    const itemMetrics = {};

    reactionsData.forEach((r) => {
      if (!r.target_id) return;
      if (!itemMetrics[r.target_id]) {
        itemMetrics[r.target_id] = { reactions: 0, comments: 0, shares: 0 };
      }
      itemMetrics[r.target_id].reactions += 1;
    });

    commentsData.forEach((c) => {
      if (!c.target_id) return;
      if (!itemMetrics[c.target_id]) {
        itemMetrics[c.target_id] = { reactions: 0, comments: 0, shares: 0 };
      }
      itemMetrics[c.target_id].comments += 1;
    });

    sharesData.forEach((s) => {
      if (!s.target_id) return;
      if (!itemMetrics[s.target_id]) {
        itemMetrics[s.target_id] = { reactions: 0, comments: 0, shares: 0 };
      }
      itemMetrics[s.target_id].shares += 1;
    });

    // 3. Platform breakdown for shares
    const platforms = {};
    sharesData.forEach((s) => {
      const p = s.platform || 'other';
      platforms[p] = (platforms[p] || 0) + 1;
    });

    return successResponse({
      totals: {
        reactions: totalReactions,
        comments: totalComments,
        pending_comments: pendingComments,
        approved_comments: totalComments - pendingComments,
        shares: totalShares,
      },
      platforms,
      item_metrics: itemMetrics,
    }, null, 200, 'Analytics overview fetched successfully');
  } catch (err) {
    console.error('Error fetching analytics overview:', err);
    return errorResponse('Failed to fetch analytics overview', 500, err.message);
  }
}
