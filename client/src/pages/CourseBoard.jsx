/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  client/src/pages/CourseBoard.jsx
 *
 *  Per-course discussion board. URL: /courses/:id
 *
 *  This page shows:
 *    - Course header (code, name, faculty)
 *    - "Latest" / "Hot" sort tabs                 -> calls GET /api/courses/:id/posts?sort=...
 *    - "New post" toggle button + collapsible <PostEditor />
 *    - List of <PostCard /> below
 *
 *  APIs:
 *    api.get(`/courses`)                        // to find the current course meta
 *    api.get(`/courses/${id}/posts`, { params: { sort } })
 *    api.post(`/courses/${id}/posts`, { title, body })
 *
 *  Local state:
 *    posts, course, sort ('latest' | 'hot'), showEditor, err
 *
 *  Functions:
 *    loadCourse(): fetch /courses, find the one matching :id, setCourse
 *    loadPosts(s): fetch /courses/:id/posts?sort=s, setPosts
 *    createPost({title, body}): POST /courses/:id/posts; close editor; loadPosts()
 *
 *  useEffect on [id]: loadCourse() and loadPosts()
 *
 *  Render skeleton:
 *    <main className="max-w-3xl mx-auto p-6">
 *      <header>{course.code} {course.name} {course.faculty}</header>
 *      <div sort tabs and "New post" button>
 *      {showEditor && <PostEditor onSubmit={createPost} onCancel={...} />}
 *      {err && <p>...</p>}
 *      {posts.length === 0
 *        ? <p>No posts yet. Be the first!</p>
 *        : posts.map(p => <PostCard key={p.id} post={p} />)
 *      }
 *    </main>
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';
import PostEditor from '../components/PostEditor.jsx';

export default function CourseBoard() {
  const { id } = useParams();
  // TODO(Ray): state hooks (posts, course, sort, showEditor, err)

  // TODO(Ray): loadCourse() / loadPosts(s) / createPost({title, body})

  // TODO(Ray): useEffect to call loadCourse + loadPosts on [id]

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* TODO(Ray): header (code, name, faculty) */}
      {/* TODO(Ray): sort tabs (Latest / Hot) + "New post" toggle */}
      {/* TODO(Ray): {showEditor && <PostEditor ... />} */}
      {/* TODO(Ray): err + post list (or empty state) */}
    </main>
  );
}
