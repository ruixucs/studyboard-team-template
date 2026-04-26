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
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, apiError } from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx'; // Danny's component

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get('/me/courses')
      .then(r => setCourses(r.data))
      .catch(e => setErr(apiError(e)));
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.displayName}</h1>
      <p className="text-slate-500 mb-6">Pick a course to jump into its discussion board.</p>
      {err && <p className="text-red-500 text-sm mb-4">{err}</p>}
      {courses.length === 0
        ? (
          <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-slate-500">
            <p className="mb-3">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="text-accent hover:underline font-medium">
              Browse courses →
            </Link>
          </div>
        )
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        )
      }
    </main>
  );
}
