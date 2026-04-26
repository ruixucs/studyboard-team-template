/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  client/src/pages/Dashboard.jsx
 *
 *  Post-login home. URL: /dashboard
 *
 *  Greets the user, then shows the courses they're enrolled in as a grid.
 *  If they have no enrollments yet, show an empty-state with a link to /courses.
 *
 *  APIs:
 *    api.get('/me/courses')  -> [{ id, code, name, faculty, enrolledAt }, ...]
 *
 *  Local state: courses, err
 *
 *  Render skeleton:
 *    <main className="max-w-5xl mx-auto p-6">
 *      <h1>Welcome back, {user?.displayName}</h1>
 *      <p>Pick a course to jump into its discussion board.</p>
 *      {err && <p className="text-red-500">{err}</p>}
 *      {courses.length === 0
 *        ? <empty state with <Link to="/courses">Browse courses →</Link>>
 *        : <grid>{courses.map(c => <CourseCard course={c} />)}</grid>
 *      }
 *    </main>
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx'; // Danny's component

export default function Dashboard() {
  const { user } = useAuth();
  // TODO(Donovan): state hooks (courses, err)

  // TODO(Donovan): useEffect to call api.get('/me/courses') on mount

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.displayName}</h1>
      <p className="text-slate-500 mb-6">Pick a course to jump into its discussion board.</p>
      {/* TODO(Donovan): err display */}
      {/* TODO(Donovan): empty state OR grid of <CourseCard /> */}
    </main>
  );
}
