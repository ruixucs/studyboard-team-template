import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Landing() {
  const { user } = useAuth();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">StudyBoard</h1>
      <p className="text-lg text-slate-500 mb-8 max-w-xl">
        A course-based collaboration space for McGill students. Ask questions, share notes, and find
        your classmates — one course at a time.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium"
          >
            Go to dashboard →
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
