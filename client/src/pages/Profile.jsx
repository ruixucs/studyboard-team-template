/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  client/src/pages/Profile.jsx
 *
 *  My account page. URL: /me
 *
 *  Shows:
 *    - User name + email (header)
 *    - Stats grid (2 cells): "Posts" count, "Likes received" total
 *    - List of the user's posts as small links to each post
 *
 *  APIs:
 *    api.get('/me/activity')
 *      -> { posts: [{ id, courseId, title, likeCount, replyCount, createdAt }],
 *           totalLikesReceived }
 *
 *  Local state: data, err
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get('/me/activity')
      .then(r => setData(r.data))
      .catch(e => setErr(apiError(e)));
  }, []);

  if (err) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">{err}</p>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
      <p className="text-slate-500 mb-6">{user.email}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-slate-300 dark:border-slate-700 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Posts</div>
          <div className="text-3xl font-bold">{data.posts.length}</div>
        </div>
        <div className="rounded-xl border border-slate-300 dark:border-slate-700 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Likes received</div>
          <div className="text-3xl font-bold">{data.totalLikesReceived}</div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your posts</h2>
      {data.posts.length === 0
        ? <p>You haven't posted yet.</p>
        : data.posts.map(p => //list of posts made
          <Link key={p.id} to={`/courses/${p.courseId}/posts/${p.id}`}
            className="block rounded-lg border border-slate-300 dark:border-slate-700 p-3 mb-3 hover:border-accent transition">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-slate-500 mt-1">
              ♥ {p.likeCount} · 💬 {p.replyCount} · {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </Link>
        )
      }
    </main>
  );
}
