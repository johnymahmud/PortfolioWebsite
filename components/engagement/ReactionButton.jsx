'use client';

import { useState, useEffect } from 'react';

export default function ReactionButton({ targetType, targetId, targetTitle = 'Artwork' }) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const localKey = `reacted_${targetType}_${targetId}`;

  useEffect(() => {
    if (!targetId) return;

    // Check localStorage first for instant UI response
    const cachedReaction = typeof window !== 'undefined' && localStorage.getItem(localKey);
    if (cachedReaction) {
      setHasReacted(true);
    }

    // Fetch live reaction count from REST API
    fetch(`/api/v1/reactions?target_type=${targetType}&target_id=${targetId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCount(json.data.count || 0);
          if (json.data.hasReacted) {
            setHasReacted(true);
            localStorage.setItem(localKey, 'true');
          }
        }
      })
      .catch((err) => console.warn('Failed to load reactions:', err));
  }, [targetType, targetId]);

  const handleReact = async () => {
    if (loading || !targetId) return;

    setLoading(true);
    setAnimating(true);

    // Optimistic UI update
    const previousCount = count;
    const previousState = hasReacted;
    setCount((prev) => prev + 1);
    setHasReacted(true);
    localStorage.setItem(localKey, 'true');

    try {
      const res = await fetch('/api/v1/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          target_title: targetTitle,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCount(json.data.count);
      } else {
        // If rate limited or error, revert
        setCount(previousCount);
        setHasReacted(previousState);
      }
    } catch (err) {
      console.warn('Reaction error:', err);
      setCount(previousCount);
      setHasReacted(previousState);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReact}
      className={`reaction-btn ${hasReacted ? 'is-reacted' : ''} ${animating ? 'is-animating' : ''}`}
      title="Appreciate this artwork"
      aria-label="Like this artwork"
    >
      <span className="reaction-icon">{hasReacted ? '❤️' : '🤍'}</span>
      <span className="reaction-count">{count}</span>
    </button>
  );
}
