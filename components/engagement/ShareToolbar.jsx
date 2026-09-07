'use client';

import { useState } from 'react';

export default function ShareToolbar({ targetType, targetId, targetTitle = 'Shah Mahmud Artwork' }) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const logShare = (platform) => {
    if (!targetId) return;
    fetch('/api/v1/analytics/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        target_title: targetTitle,
        platform,
      }),
    }).catch(() => {});
  };

  const handleCopy = () => {
    const url = getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      logShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(getShareUrl());
    const title = encodeURIComponent(targetTitle);

    let shareLink = '';
    if (platform === 'whatsapp') {
      shareLink = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    } else if (platform === 'linkedin') {
      shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'x') {
      shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    }

    logShare(platform);
    if (shareLink && typeof window !== 'undefined') {
      window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  return (
    <div className="share-toolbar">
      <span className="share-label">Share:</span>
      <button
        type="button"
        onClick={handleCopy}
        className="share-btn share-copy-btn"
        title="Copy direct link"
      >
        {copied ? '✓ Copied' : '🔗 Copy'}
      </button>
      <button
        type="button"
        onClick={() => handleSocialShare('whatsapp')}
        className="share-btn share-wa-btn"
        title="Share on WhatsApp"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => handleSocialShare('linkedin')}
        className="share-btn share-li-btn"
        title="Share on LinkedIn"
      >
        LinkedIn
      </button>
      <button
        type="button"
        onClick={() => handleSocialShare('facebook')}
        className="share-btn share-fb-btn"
        title="Share on Facebook"
      >
        Facebook
      </button>
    </div>
  );
}
