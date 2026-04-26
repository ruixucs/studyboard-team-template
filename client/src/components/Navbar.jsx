import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const linkCls = ({ isActive }) =>
    `px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
      isActive ? 'text-accent font-medium' : 'text-slate-700 dark:text-slate-300'
    }`;
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-3">
      <Link to="/" className="font-bold text-lg">
        StudyBoard
      </Link>
      {user && (
        <div className="flex items-center gap-1">
          <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
          <NavLink to="/courses" className={linkCls}>Courses</NavLink>
          <NavLink to="/me" className={linkCls}>Me</NavLink>
        </div>
      )}
      <div className="ml-auto flex items-center gap-2 text-sm">
        <ThemeToggle />
        {user ? (
          <>
            <span className="text-slate-500 hidden sm:inline">{user.displayName}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700">
              Log in
            </Link>
            <Link to="/register" className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
