/*
  Jiahao Liang (261073874)
  COMP 307 Team Project

  Primary contributions in this file:
  - Course card component layout
  - Course navigation link rendering
  - Card action integration for enrollment controls
*/
import { Link } from 'react-router-dom';
// The parent page passes the action area so this card can stay reusable
export default function CourseCard({ course, action }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-accent transition flex flex-col gap-2">
      <div className="font-mono text-sm text-slate-500">{course.code}</div>
      {/*Clicking the name opens the course-specific page*/}
      <h3 className="font-semibold">
        <Link to={`/courses/${course.id}`} className="hover:text-accent transition">
          {course.name}
        </Link>
      </h3>
      <div className="text-xs text-slate-500">{course.faculty}</div>
      {/*Enrollment/delete buttons are rendered here when provided by the list page*/}
      {action}
    </div>
  );
}
