import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import { Icon, icons, badgeClass } from '../ui.jsx';

export default function Quizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    api('/quizzes').then(setQuizzes).catch(() => {});
    api('/quizzes/me/attempts').then(setHistory).catch(() => {});
  }, []);

  const pcts = history.map((h) => Math.round((h.score / h.total) * 100));
  const stats = [
    ['Quizzes taken', history.length, icons.list],
    ['Average score', `${pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0}%`, icons.chart],
    ['Best score', `${pcts.length ? Math.max(...pcts) : 0}%`, icons.trophy],
  ];
  const cats = ['All', ...new Set(quizzes.map((x) => x.category))];
  const shown = quizzes.filter((x) => (cat === 'All' || x.category === cat) && x.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-5 py-8">
      <div>
        <h1 className="text-3xl font-extrabold">Hi, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-slate-500">Pick a quiz and beat your best score.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([l, v, i]) => (
          <div key={l} className="card flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><Icon d={i} /></span>
            <div><p className="text-2xl font-extrabold text-ink">{v}</p><p className="text-sm text-slate-500">{l}</p></div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Available quizzes</h2>
          <input className="input max-w-xs" placeholder="Search quizzes" aria-label="Search quizzes" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cat === c ? 'bg-ink text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>{c}</button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((x) => (
            <article key={x.id} className="card flex flex-col transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`w-fit rounded-md px-2.5 py-1 text-xs font-bold ${badgeClass(x.category)}`}>{x.category}</span>
              <h3 className="mt-3 text-lg font-bold">{x.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{x.description || 'Test your knowledge.'}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Icon d={icons.list} className="h-4 w-4" />{x.questionCount}</span>
                  <span className="flex items-center gap-1"><Icon d={icons.clock} className="h-4 w-4" />{x.durationMinutes} min</span>
                </span>
                <Link className="btn py-2" to={`/quiz/${x.id}`}>Start</Link>
              </div>
            </article>
          ))}
        </div>
        {!shown.length && <div className="card text-center text-slate-500">No quizzes found. Try a different search, or ask an admin to add some.</div>}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Recent results</h2>
        <div className="card divide-y divide-slate-100 p-0">
          {history.map((h) => {
            const p = Math.round((h.score / h.total) * 100);
            return (
              <div key={h.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{h.quiz}</p>
                  <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString()}</p>
                </div>
                <div className="hidden h-2 w-32 rounded-full bg-slate-100 sm:block"><div className={`h-2 rounded-full ${p >= 50 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${p}%` }} /></div>
                <span className="w-16 text-right text-sm font-bold text-ink">{h.score}/{h.total}</span>
              </div>
            );
          })}
          {!history.length && <p className="px-6 py-8 text-center text-slate-500">Your results will appear here after your first quiz.</p>}
        </div>
      </section>
    </div>
  );
}
