/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  client/src/components/LikeButton.jsx
 *
 *  Updates the count optimistically (instant UI feedback) and reverts on error.
 *
 *  Used by:
 *    - PostDetail (passed `postId`, `initialLiked`, `initialCount`)
 *
 *  APIs (your own backend in server/src/routes/likes.js):
 *    POST   /api/posts/:id/like   -> { likeCount }
 *    DELETE /api/posts/:id/like   -> { likeCount }
 *
 *  Local state:
 *    liked  (bool)   -- current liked state
 *    count  (number) -- current like count
 *    busy   (bool)   -- guard against double-click
 * ============================================================================
 */

import { useState } from 'react';
import { api, apiError } from '../lib/api.js';

export default function LikeButton({ postId, initialLiked, initialCount, onChange }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevCount + (prevLiked ? -1 : 1));
    try {
      const r = prevLiked
        ? await api.delete(`/posts/${postId}/like`) //unlike
        : await api.post(`/posts/${postId}/like`); //like
      setCount(r.data.likeCount);
      onChange?.({ liked: !prevLiked, likeCount: r.data.likeCount });
    } catch (e) {
      setLiked(prevLiked);
      setCount(prevCount);
      alert(apiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={toggle} disabled={busy} aria-pressed={liked}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${liked
        ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-950/30'
        : 'border-slate-300 dark:border-slate-700 hover:border-accent'
        }`}>
      <span>{liked ? '♥' : '♡'}</span>
      <span>{count}</span>
    </button>
  );
}
