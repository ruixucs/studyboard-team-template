/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  client/src/components/PostEditor.jsx
 *
 *  A reusable editor for both creating a new post and editing an existing one.
 *  Used by CourseBoard (create) and PostDetail (edit).
 *
 *  Props:
 *    initialTitle  (default '')
 *    initialBody   (default '')
 *    onSubmit({ title, body })   // async; the parent does the actual API call
 *    onCancel?                   // optional cancel button
 *    submitLabel   (default 'Post')
 *
 *  Features:
 *    - Title input (max 200 chars)
 *    - Body textarea (max 10000 chars)
 *    - "Write" / "Preview" tabs — preview uses <MarkdownView source={body} />
 *    - Validates: title and body must both be non-empty before submitting
 *    - Disables submit while busy; surfaces server error messages
 *
 *  Local state to keep:
 *    title, body, preview (bool), busy, err
 *
 *  Submit handler:
 *    e.preventDefault()
 *    if (!title.trim() || !body.trim()) return setErr('Title and body are required')
 *    setBusy(true)
 *    try { await onSubmit({ title: title.trim(), body }) }
 *    catch (e) { setErr(e?.response?.data?.error?.message || e.message) }
 *    finally { setBusy(false) }
 *
 *  Layout:
 *    <form onSubmit={submit} className="space-y-3 rounded-xl border ... p-4">
 *      <input title ... />
 *      <div tabs row>  Write | Preview |  span "Markdown + code blocks supported" </div>
 *      {preview ? <div border> <MarkdownView source={body} /> </div>
 *               : <textarea body ... />}
 *      {err && <p className="text-sm text-red-500">{err}</p>}
 *      <div flex gap-2>
 *        <button submit>{busy ? 'Saving…' : submitLabel}</button>
 *        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
 *      </div>
 *    </form>
 * ============================================================================
 */

import { useState } from 'react';
import MarkdownView from './MarkdownView.jsx';

export default function PostEditor({
  initialTitle = '',
  initialBody = '',
  onSubmit,
  onCancel,
  submitLabel = 'Post',
}) {
  // TODO(Ray): state hooks (title, body, preview, busy, err)

  // TODO(Ray): submit handler

  return (
    <form className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      {/* TODO(Ray): title input */}
      {/* TODO(Ray): Write / Preview tabs */}
      {/* TODO(Ray): preview ? <MarkdownView /> : <textarea /> */}
      {/* TODO(Ray): error + submit/cancel buttons */}
    </form>
  );
}
