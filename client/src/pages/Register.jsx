import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { apiError } from '../lib/api.js';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!/@(mail\.)?mcgill\.ca$/i.test(email)) {
      return setErr('Email must be @mcgill.ca or @mail.mcgill.ca');
    }
    setBusy(true);
    try {
      await register(email, password, displayName);
      nav('/dashboard');
    } catch (e) {
      setErr(apiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800"
      >
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <input
          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent"
          placeholder="McGill email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <input
          className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent"
          type="password"
          placeholder="Password (min 8, letter + digit)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button
          disabled={busy}
          className="w-full px-3 py-2 rounded bg-accent hover:bg-accent-hover text-white font-medium disabled:opacity-60"
        >
          {busy ? 'Creating…' : 'Sign up'}
        </button>
        <p className="text-sm text-slate-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
