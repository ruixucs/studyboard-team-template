/**
 * ============================================================================
 *  Feature A — Courses & Enrollment
 *  Owner: Danny
 *  File:  client/src/pages/CourseList.jsx
 *
 *  This page does three things:
 *    1. Search bar at the top (live filter, calls GET /api/courses?search=...)
 *    2. Collapsible "add a course" form (POST /api/courses)
 *    3. Grid of CourseCard, each with an Enroll / Un-enroll button
 *
 *  APIs you will call (which YOU also implement on the server):
 *    api.get('/courses', { params: { search } })
 *    api.post('/courses', { code, name, faculty })
 *    api.post(`/courses/${id}/enroll`)
 *    api.delete(`/courses/${id}/enroll`)
 *
 *  Suggested local state:
 *    courses, q (search text), busy, err
 *    newCode, newName, newFac, adding
 *
 *  Suggested handlers:
 *    load(search): GET /courses, setCourses
 *    toggleEnroll(c): if c.enrolled => DELETE; else => POST; then await load(q)
 *    onAdd(e):     e.preventDefault(); POST /courses; clear inputs; await load(q)
 *
 *  Render:
 *    <main className="max-w-5xl mx-auto p-6">
 *      <h1>Courses</h1>
 *      <input ... />                  // onChange: setQ + load(value)
 *      <details>...add form...</details>
 *      {err && <p className="text-red-500">…</p>}
 *      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 *        {courses.map(c => <CourseCard course={c} action={enrollBtn} />)}
 *      </div>
 *    </main>
 *
 *  Button label rules:
 *    not enrolled: "Enroll"   (bg-accent hover:bg-accent-hover text-white)
 *    enrolled:     "Enrolled ✓ (click to leave)"  (border)
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { api, apiError } from '../lib/api.js';
import CourseCard from '../components/CourseCard.jsx';

export default function CourseList() {
  // TODO(Danny): declare your useState hooks here

  // TODO(Danny): write load(search), toggleEnroll(c), onAdd(e)

  // TODO(Danny): useEffect to load('') on mount

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      {/* TODO(Danny): search input */}
      {/* TODO(Danny): collapsible <details> add-course form */}
      {/* TODO(Danny): error message */}
      {/* TODO(Danny): grid of <CourseCard /> */}
    </main>
  );
}
