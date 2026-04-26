import { useState } from 'react';
import { api, apiError } from '../lib/api.js';
import MarkdownView from './MarkdownView.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

function fmt(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function ReplyList({ postId, replies, onChange }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const { user } = useAuth();

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      await api.post(`/posts/${postId}/replies`, { body: text });
      setText('');
      onChange?.();
    } catch (e) {
      setErr(apiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this reply?')) return;
    try {
      await api.delete(`/replies/${id}`);
      onChange?.();
    } catch (e) {
      alert(apiError(e));
    }
  }

  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-3">Replies ({replies.length})</h3>

      <form onSubmit={submit} className="space-y-2 mb-4">
        <textarea
          className="w-full min-h-[4rem] px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
          placeholder="Write a reply…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
        />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button
          disabled={busy || !text.trim()}
          className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-sm font-medium disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Reply'}
        </button>
      </form>

      <div className="space-y-3">
        {replies.map((r) => (
          <div key={r.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
              <span>{r.author?.displayName || '[deleted]'}</span>
              <span>·</span>
              <span>{fmt(r.createdAt)}</span>
              {user?.id === r.author?.id && (
                <button onClick={() => del(r.id)} className="ml-auto text-red-500 hover:underline">
                  Delete
                </button>
              )}
            </div>
            <MarkdownView source={r.body} />
          </div>
        ))}
      </div>
    </section>
  );
}
