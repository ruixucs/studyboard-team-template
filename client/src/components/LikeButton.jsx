/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  client/src/components/LikeButton.jsx
 *
 *  A pill-shaped toggle button. Click to like / un-like a post.
 *  Updates the count optimistically (instant UI feedback) and reverts on error.
 *
 *  Used by:
 *    - PostDetail (passed `postId`, `initialLiked`, `initialCount`)
 *    - You can extend with an `onChange({ liked, likeCount })` callback if needed.
 *
 *  APIs (your own backend in server/src/routes/likes.js):
 *    POST   /api/posts/:id/like   -> { likeCount }
 *    DELETE /api/posts/:id/like   -> { likeCount }
 *
 *  Local state:
 *    liked  (bool)   -- current liked state
 *    count  (number) -- current like count
 *    busy   (bool)   -- guard against double-click
 *
 *  toggle() pseudocode (optimistic update):
 *    if (busy) return
 *    setBusy(true)
 *    const prevLiked = liked
 *    const prevCount = count
 *    setLiked(!prevLiked)
 *    setCount(prevCount + (prevLiked ? -1 : 1))
 *    try {
 *      const r = prevLiked
 *        ? await api.delete(`/posts/${postId}/like`)
 *        : await api.post  (`/posts/${postId}/like`)
 *      setCount(r.data.likeCount)         // sync to authoritative server count
 *      onChange?.({ liked: !prevLiked, likeCount: r.data.likeCount })
 *    } catch (e) {
 *      setLiked(prevLiked)
 *      setCount(prevCount)
 *      alert(apiError(e))
 *    } finally {
 *      setBusy(false)
 *    }
 *
 *  Render — a single button:
 *    <button onClick={toggle} disabled={busy} aria-pressed={liked}
 *      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${
 *        liked
 *          ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-950/30'
 *          : 'border-slate-300 dark:border-slate-700 hover:border-accent'
 *      }`}>
 *      <span>{liked ? '♥' : '♡'}</span>
 *      <span>{count}</span>
 *    </button>
 * ============================================================================
 */

import { useState } from 'react';
import { api, apiError } from '../lib/api.js';

export default function LikeButton({ postId, initialLiked, initialCount, onChange }) {
  // TODO(Donovan): state hooks (liked, count, busy)

  // TODO(Donovan): toggle()

  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border">
      {/* TODO(Donovan): heart icon + count */}
    </button>
  );
}
