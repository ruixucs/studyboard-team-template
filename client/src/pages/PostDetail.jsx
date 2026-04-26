import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import MarkdownView from '../components/MarkdownView.jsx';
import PostEditor from '../components/PostEditor.jsx';
import LikeButton from '../components/LikeButton.jsx';
import ReplyList from '../components/ReplyList.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

export default function PostDetail() {
  const { postId, id: courseId } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  async function load() {
    try {
      const r = await api.get(`/posts/${postId}`);
      setPost(r.data);
    } catch (e) {
      setErr(apiError(e));
    }
  }
  useEffect(() => {
    load();
  }, [postId]);

  async function save({ title, body }) {
    await api.patch(`/posts/${postId}`, { title, body });
    setEditing(false);
    load();
  }

  async function del() {
    if (!confirm('Delete this post? This will also remove all replies and likes.')) return;
    try {
      await api.delete(`/posts/${postId}`);
      nav(`/courses/${courseId}`);
    } catch (e) {
      alert(apiError(e));
    }
  }

  if (err) return <main className="max-w-3xl mx-auto p-6 text-red-500">{err}</main>;
  if (!post) return <main className="max-w-3xl mx-auto p-6 text-slate-500">Loading…</main>;

  const isAuthor = user?.id === post.author?.id;

  return (
    <main className="max-w-3xl mx-auto p-6">
      {editing ? (
        <PostEditor
          initialTitle={post.title}
          initialBody={post.body}
          onSubmit={save}
          onCancel={() => setEditing(false)}
          submitLabel="Save"
        />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2 mb-4">
            <span>{post.author?.displayName || '[deleted]'}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
            {post.updatedAt !== post.createdAt && <span className="italic">(edited)</span>}
            {isAuthor && (
              <span className="ml-auto flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="text-accent hover:underline"
                >
                  Edit
                </button>
                <button onClick={del} className="text-red-500 hover:underline">
                  Delete
                </button>
              </span>
            )}
          </div>
          <MarkdownView source={post.body} />
          <div className="mt-5">
            <LikeButton
              postId={post.id}
              initialLiked={post.likedByMe}
              initialCount={post.likeCount}
            />
          </div>
        </>
      )}

      <ReplyList postId={post.id} replies={post.replies} onChange={load} />
    </main>
  );
}
