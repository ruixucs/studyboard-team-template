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
 *
 *  Render skeleton:
 *    <main className="max-w-3xl mx-auto p-6">
 *      <h1>{user.displayName}</h1>
 *      <p>{user.email}</p>
 *
 *      <div className="grid grid-cols-2 gap-4 mb-8">
 *        <div className="rounded-xl border ... p-4">
 *          <div className="text-xs uppercase tracking-wide text-slate-500">Posts</div>
 *          <div className="text-3xl font-bold">{data.posts.length}</div>
 *        </div>
 *        <div className="rounded-xl border ... p-4">
 *          <div className="text-xs uppercase tracking-wide text-slate-500">Likes received</div>
 *          <div className="text-3xl font-bold">{data.totalLikesReceived}</div>
 *        </div>
 *      </div>
 *
 *      <h2>Your posts</h2>
 *      {data.posts.length === 0
 *        ? <p>You haven't posted yet.</p>
 *        : data.posts.map(p =>
 *            <Link to={`/courses/${p.courseId}/posts/${p.id}`}
 *                  className="block rounded-lg border p-3 hover:border-accent">
 *              <div className="font-medium">{p.title}</div>
 *              <div className="text-xs text-slate-500 mt-1">
 *                ♥ {p.likeCount} · 💬 {p.replyCount} · {new Date(p.createdAt).toLocaleDateString()}
 *              </div>
 *            </Link>
 *          )
 *      }
 *    </main>
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  // TODO(Donovan): state hooks (data, err)

  // TODO(Donovan): useEffect to call api.get('/me/activity') on mount

  // TODO(Donovan): early returns for err and !data

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* TODO(Donovan): header (name + email) */}
      {/* TODO(Donovan): stats grid (Posts, Likes received) */}
      {/* TODO(Donovan): "Your posts" list */}
    </main>
  );
}
