import { Link } from 'react-router-dom';

export default function CourseCard({ course, action }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-accent transition flex flex-col gap-2">
      <div className="font-mono text-sm text-slate-500">{course.code}</div>
      <h3 className="font-semibold">
        <Link to={`/courses/${course.id}`} className="hover:text-accent transition">
          {course.name}
        </Link>
      </h3>
      <div className="text-xs text-slate-500">{course.faculty}</div>
      {action}
    </div>
  );
}
