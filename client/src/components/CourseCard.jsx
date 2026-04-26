/**
 * ============================================================================
 *  Feature A — Courses & Enrollment
 *  Owner: Danny
 *  File:  client/src/components/CourseCard.jsx
 *
 *  Props:
 *    - course: { id, code, name, faculty, enrolled? }
 *    - action: ReactNode (optional button rendered at the bottom by parent)
 *
 *  Tailwind styling cues:
 *    Outer:   rounded-xl border border-slate-200 dark:border-slate-800 p-4
 *    Hover:   hover:border-accent transition
 *    Layout:  flex flex-col gap-2
 *
 *  Structure:
 *    <div card>
 *      <div font-mono text-sm text-slate-500>{course.code}</div>            // e.g. "COMP 307"
 *      <h3 font-semibold>
 *        <Link to=`/courses/${course.id}`>{course.name}</Link>              // e.g. "Intro to Web Dev"
 *      </h3>
 *      <div text-xs text-slate-500>{course.faculty}</div>                   // e.g. "Computer Science"
 *      {action}                                                             // parent-supplied button
 *    </div>
 * ============================================================================
 */

import { Link } from 'react-router-dom';

export default function CourseCard({ course, action }) {
  // TODO(Danny): build the card per the structure above.
  // The course name MUST be wrapped in <Link to={`/courses/${course.id}`}> so that
  // clicking the title navigates to the course's discussion board.
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      {/* course code */}
      {/* course name (wrap in <Link>) */}
      {/* faculty */}
      {/* {action} */}
    </div>
  );
}
