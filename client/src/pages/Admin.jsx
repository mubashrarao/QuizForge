import { useEffect, useState } from 'react';
import { api } from '../api';
import { Icon, icons, badgeClass } from '../ui.jsx';

const blankQ = () => ({ text: '', options: ['', '', '', ''], correctIndex: 0 });

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', durationMinutes: 10 });
  const [questions, setQuestions] = useState([blankQ()]);
  const [msg, setMsg] = useState({ text: '', ok: true });

  const load = () => {
    api('/quizzes/admin/stats').then(setStats).catch(() => {});
    api('/quizzes').then(setQuizzes).catch(() => {});
  };
  useEffect(load, []);

  const setQ = (n, patch) => setQuestions(questions.map((q, k) => (k === n ? { ...q, ...patch } : q)));
  const setOpt = (n, o, v) => setQ(n, { options: questions[n].options.map((x, k) => (k === o ? v : x)) });
  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function create(e) {
    e.preventDefault();
    try {
      await api('/quizzes', { method: 'POST', body: { ...form, durationMinutes: Number(form.durationMinutes), questions } });
      setMsg({ text: 'Quiz created', ok: true });
      setQuestions([blankQ()]); setForm({ ...form, title: '', description: '' }); load();
    } catch (err) { setMsg({ text: err.message, ok: false }); }
  }
  async function remove(id) {
    if (!confirm('Delete this quiz and all its results?')) return;
    await api(`/quizzes/${id}`, { method: 'DELETE' }); load();
  }

  const tiles = stats && [['Users', stats.users, icons.users], ['Quizzes', stats.quizzes, icons.list], ['Attempts', stats.attempts, icons.chart], ['Average score', `${stats.averagePercent}%`, icons.trophy]];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">
      <div><h1 className="text-3xl font-extrabold">Admin dashboard</h1><p className="mt-1 text-slate-500">Create quizzes and see how learners are doing.</p></div>

      {tiles && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map(([l, v, i]) => (
            <div key={l} className="card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><Icon d={i} /></span>
              <div><p className="text-2xl font-extrabold text-ink">{v}</p><p className="text-sm text-slate-500">{l}</p></div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={create} className="card space-y-5 lg:col-span-3">
          <h2 className="text-lg font-bold">Create a quiz</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Title</label><input className="input" value={form.title} onChange={setF('title')} required /></div>
            <div><label className="label">Category</label><input className="input" value={form.category} onChange={setF('category')} /></div>
            <div><label className="label">Description</label><input className="input" value={form.description} onChange={setF('description')} /></div>
            <div><label className="label">Time limit (minutes)</label><input className="input" type="number" min="1" value={form.durationMinutes} onChange={setF('durationMinutes')} /></div>
          </div>
          {questions.map((q, n) => (
            <div key={n} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink">Question {n + 1}</p>
                {questions.length > 1 && <button type="button" className="text-sm font-semibold text-rose-600 hover:underline" onClick={() => setQuestions(questions.filter((_, k) => k !== n))}>Remove</button>}
              </div>
              <input className="input" placeholder="Type the question" value={q.text} onChange={(e) => setQ(n, { text: e.target.value })} />
              {q.options.map((o, k) => (
                <label key={k} className="flex items-center gap-3">
                  <input type="radio" className="h-4 w-4 accent-indigo-600" name={`c${n}`} checked={q.correctIndex === k} onChange={() => setQ(n, { correctIndex: k })} aria-label={`Mark option ${k + 1} correct`} />
                  <input className="input" placeholder={`Option ${k + 1}`} value={o} onChange={(e) => setOpt(n, k, e.target.value)} />
                </label>
              ))}
              <p className="text-xs text-slate-500">Select the circle next to the correct answer.</p>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-ghost" onClick={() => setQuestions([...questions, blankQ()])}><Icon d={icons.plus} className="h-4 w-4" />Add question</button>
            <button className="btn">Save quiz</button>
            {msg.text && <span className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{msg.text}</span>}
          </div>
        </form>

        <div className="card h-fit lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold">All quizzes</h2>
          <ul className="divide-y divide-slate-100">
            {quizzes.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{x.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><span className={`rounded px-2 py-0.5 font-bold ${badgeClass(x.category)}`}>{x.category}</span>{x.questionCount} questions</p>
                </div>
                <button className="text-sm font-semibold text-rose-600 hover:underline" onClick={() => remove(x.id)}>Delete</button>
              </li>
            ))}
          </ul>
          {!quizzes.length && <p className="text-sm text-slate-500">No quizzes yet.</p>}
        </div>
      </div>
    </div>
  );
}
