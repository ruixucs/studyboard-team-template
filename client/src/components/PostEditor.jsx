import { useState } from 'react';
import MarkdownView from './MarkdownView.jsx';

export default function PostEditor({
  initialTitle = '',
  initialBody = '',
  onSubmit,
  onCancel,
  submitLabel = 'Post',
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (!title.trim() || !body.trim()) {
      return setErr('Title and body are required');
    }
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), body });
    } catch (e) {
      setErr(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <input
        className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent text-lg font-semibold"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
      />
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`px-2 py-1 rounded ${!preview ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`px-2 py-1 rounded ${preview ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          Preview
        </button>
        <span className="ml-auto text-xs text-slate-500">Markdown + code blocks supported</span>
      </div>
      {preview ? (
        <div className="min-h-[10rem] p-3 rounded border border-slate-300 dark:border-slate-700">
          <MarkdownView source={body} />
        </div>
      ) : (
        <textarea
          className="w-full min-h-[10rem] px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent font-mono text-sm"
          placeholder="Share your question, notes, or key points…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={10000}
          required
        />
      )}
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex gap-2">
        <button
          disabled={busy}
          className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white font-medium disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
