import { useEffect, useMemo, useState } from 'react';
import { api, apiError } from '../lib/api.js';
import CourseCard from '../components/CourseCard.jsx';

const PAGE_SIZE = 6;

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [newCode, setNewCode] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [sortBy, setSortBy] = useState('code');
  const [onlyEnrolled, setOnlyEnrolled] = useState(false);
  const [page, setPage] = useState(1);

  const load = async (search = q) => {
    setBusy(true);
    setErr('');
    try {
      const { data } = await api.get('/courses', { params: { search } });
      setCourses(data);
      setPage(1);
    } catch (e) {
      setErr(apiError(e));
    } finally {
      setBusy(false);
    }
  };

  const toggleEnroll = async (course) => {
    setErr('');
    try {
      if (course.enrolled) {
        await api.delete(`/courses/${course.id}/enroll`);
      } else {
        await api.post(`/courses/${course.id}/enroll`);
      }
      await load(q);
    } catch (e) {
      setErr(apiError(e));
    }
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setAdding(true);
    setErr('');
    try {
      await api.post('/courses', { code: newCode.trim() });
      setNewCode('');
      await load(q);
      setPage(1);
    } catch (error) {
      setErr(apiError(error));
    } finally {
      setAdding(false);
    }
  };

  const onDeleteCourse = async (course) => {
    const ok = window.confirm(`Delete ${course.code} - ${course.name}? This cannot be undone.`);
    if (!ok) return;

    setDeletingId(course.id);
    setErr('');
    try {
      await api.delete(`/courses/${course.id}`);
      await load(q);
    } catch (error) {
      setErr(apiError(error));
    } finally {
      setDeletingId('');
    }
  };

  useEffect(() => {
    load('');
  }, []);

  useEffect(() => {
    setPage(1);
  }, [sortBy, onlyEnrolled]);

  const visibleCourses = useMemo(() => {
    const source = onlyEnrolled ? courses.filter((course) => course.enrolled) : [...courses];
    return source.sort((a, b) => a[sortBy].localeCompare(b[sortBy], undefined, { sensitivity: 'base' }));
  }, [courses, onlyEnrolled, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleCourses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCourses = visibleCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <input
        value={q}
        onChange={(e) => {
          const value = e.target.value;
          setQ(value);
          load(value);
        }}
        placeholder="Search courses by code, name, or faculty"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 py-2 mb-4"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-sm text-slate-700 dark:text-slate-300">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
          >
            <option value="code">Code</option>
            <option value="name">Name</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={onlyEnrolled}
            onChange={(e) => setOnlyEnrolled(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          My enrolled courses only
        </label>
      </div>

      <details className="mb-4 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">Add a course</summary>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Type a McGill course code. Name and faculty are filled in automatically from the official catalog.
        </p>
        <form onSubmit={onAdd} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Course code (e.g. COMP 424)"
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 py-2"
          />
          <button
            type="submit"
            disabled={adding}
            className="rounded-lg bg-accent hover:bg-accent-hover text-white px-4 py-2 disabled:opacity-60"
          >
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
      </details>

      {err && <p className="text-red-500 mb-4">{err}</p>}

      {busy ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse space-y-3"
            >
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : pagedCourses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-600 dark:text-slate-300">
          {onlyEnrolled ? 'You have not enrolled in any course yet.' : 'No courses match your search.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                action={
                  <div className="mt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleEnroll(course)}
                      disabled={busy || deletingId === course.id}
                      className={
                        course.enrolled
                          ? 'rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm'
                          : 'rounded-lg bg-accent hover:bg-accent-hover text-white px-3 py-2 text-sm'
                      }
                    >
                      {course.enrolled ? 'Enrolled ✓ (click to leave)' : 'Enroll'}
                    </button>
                    {course.canDelete && (
                      <button
                        type="button"
                        onClick={() => onDeleteCourse(course)}
                        disabled={busy || deletingId === course.id}
                        className="rounded-lg border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 px-3 py-2 text-sm disabled:opacity-60"
                      >
                        {deletingId === course.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                }
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, visibleCourses.length)} of{' '}
              {visibleCourses.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-slate-600 dark:text-slate-300">
                {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
