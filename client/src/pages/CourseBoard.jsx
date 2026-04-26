import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';
import PostEditor from '../components/PostEditor.jsx';

export default function CourseBoard() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [course, setCourse] = useState(null);
  const [sort, setSort] = useState('latest');
  const [showEditor, setShowEditor] = useState(false);
  const [err, setErr] = useState(null);

  async function loadCourse() {
    try {
      const r = await api.get('/courses', { params: { search: '' } });
      const found = r.data.find((c) => c.id === id);
      setCourse(found || null);
    } catch (e) {
      setErr(apiError(e));
    }
  }

  async function loadPosts(s = sort) {
    try {
      const r = await api.get(`/courses/${id}/posts`, { params: { sort: s } });
      setPosts(r.data);
    } catch (e) {
      setErr(apiError(e));
    }
  }

  useEffect(() => {
    loadCourse();
    loadPosts();
  }, [id]);

  async function createPost({ title, body }) {
    await api.post(`/courses/${id}/posts`, { title, body });
    setShowEditor(false);
    loadPosts();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <div className="font-mono text-sm text-slate-500">{course?.code}</div>
        <h1 className="text-2xl font-bold">{course?.name || 'Course'}</h1>
        <div className="text-xs text-slate-500">{course?.faculty}</div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => {
            setSort('latest');
            loadPosts('latest');
          }}
          className={`px-3 py-1.5 text-sm rounded ${
            sort === 'latest' ? 'bg-slate-200 dark:bg-slate-800 font-medium' : ''
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => {
            setSort('hot');
            loadPosts('hot');
          }}
          className={`px-3 py-1.5 text-sm rounded ${
            sort === 'hot' ? 'bg-slate-200 dark:bg-slate-800 font-medium' : ''
          }`}
        >
          Hot
        </button>
        <button
          onClick={() => setShowEditor((v) => !v)}
          className="ml-auto px-3 py-1.5 text-sm rounded bg-accent hover:bg-accent-hover text-white font-medium"
        >
          {showEditor ? 'Close' : 'New post'}
        </button>
      </div>

      {showEditor && (
        <div className="mb-6">
          <PostEditor onSubmit={createPost} onCancel={() => setShowEditor(false)} />
        </div>
      )}

      {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </main>
  );
}
