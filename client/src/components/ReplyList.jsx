/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  client/src/components/ReplyList.jsx
 *
 *  Renders the existing replies for a post, plus a small form to write a new one.
 *  Each reply shows author + time, and a Delete button if it belongs to the
 *  currently-logged-in user.
 *
 *  Props:
 *    postId: string                       // current post's id
 *    replies: Reply[]                     // already fetched by the parent (PostDetail)
 *    onChange: () => void                 // called after add/delete, parent refetches
 *
 *  APIs (Ray's own backend):
 *    POST   /api/posts/:postId/replies   { body }
 *    DELETE /api/replies/:id
 *
 *  Local state:
 *    text, busy, err
 *
 *  Handlers:
 *    submit(e):
 *      e.preventDefault()
 *      if (!text.trim()) return
 *      setBusy(true); setErr(null)
 *      try {
 *        await api.post(`/posts/${postId}/replies`, { body: text })
 *        setText(''); onChange?.()
 *      } catch (e) { setErr(apiError(e)) }
 *      finally { setBusy(false) }
 *
 *    del(id):
 *      if (!confirm('Delete this reply?')) return
 *      try { await api.delete(`/replies/${id}`); onChange?.() }
 *      catch (e) { alert(apiError(e)) }
 *
 *  Render:
 *    <section className="mt-6">
 *      <h3>Replies ({replies.length})</h3>
 *      <form onSubmit={submit}>
 *        <textarea ...>
 *        {err && <p className="text-red-500">…</p>}
 *        <button>{busy ? 'Sending…' : 'Reply'}</button>
 *      </form>
 *      <div space-y-3>
 *        {replies.map(r => (
 *          <div className="rounded-lg border ... p-3">
 *            <div text-xs text-slate-500 flex items-center gap-2>
 *              {r.author?.displayName || '[deleted]'} · {fmt(r.createdAt)}
 *              {user?.id === r.author?.id && (
 *                <button className="ml-auto text-red-500" onClick={()=>del(r.id)}>Delete</button>
 *              )}
 *            </div>
 *            <MarkdownView source={r.body} />
 *          </div>
 *        ))}
 *      </div>
 *    </section>
 * ============================================================================
 */

import { useState } from 'react';
import { api, apiError } from '../lib/api.js';
import MarkdownView from './MarkdownView.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

function fmt(iso) {
  return new Date(iso).toLocaleString();
}

export default function ReplyList({ postId, replies, onChange }) {
  const { user } = useAuth();
  // TODO(Ray): state hooks (text, busy, err)

  // TODO(Ray): submit + del handlers

  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-3">Replies ({replies.length})</h3>
      {/* TODO(Ray): reply form */}
      {/* TODO(Ray): list of replies, each with author/time/delete + <MarkdownView source={r.body} /> */}
    </section>
  );
}
