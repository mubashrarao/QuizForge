import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import { Icon, icons, Logo } from '../ui.jsx';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { save } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { save(await api(`/auth/${mode}`, { method: 'POST', body: form })); nav('/'); }
    catch (err) { setError(err.message); }
    setBusy(false);
  }

  return (
    <div className="grid min-h-[calc(100vh-130px)] lg:grid-cols-2">
      <aside className="hidden flex-col justify-center bg-gradient-to-br from-ink via-indigo-900 to-violet-800 p-14 text-white lg:flex">
        <h2 className="max-w-md text-4xl font-extrabold leading-tight !text-white">Practise smarter with every attempt.</h2>
        <ul className="mt-8 space-y-4 text-indigo-100">
          {[['Timed quizzes with auto-submit', icons.clock], ['Instant, server-verified scores', icons.shield], ['Leaderboards for every quiz', icons.trophy]].map(([t, i]) => (
            <li key={t} className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon d={i} /></span>{t}</li>
          ))}
        </ul>
      </aside>
      <div className="grid place-items-center px-5 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <Logo />
          <div>
            <h1 className="text-3xl font-extrabold">{isReg ? 'Create your account' : 'Welcome back'}</h1>
            <p className="mt-1 text-slate-500">{isReg ? 'Start taking quizzes in under a minute.' : 'Log in to continue your quizzes.'}</p>
          </div>
          {isReg && <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" value={form.name} onChange={set('name')} required /></div>}
          <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" value={form.email} onChange={set('email')} required /></div>
          <div><label className="label" htmlFor="pw">Password</label><input id="pw" className="input" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required /></div>
          {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
          <button className="btn w-full py-3" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Log in'}</button>
          <p className="text-center text-sm text-slate-500">
            {isReg ? 'Already have an account? ' : 'New to QuizForge? '}
            <Link className="font-semibold text-indigo-600 hover:underline" to={isReg ? '/login' : '/register'}>{isReg ? 'Log in' : 'Create an account'}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
