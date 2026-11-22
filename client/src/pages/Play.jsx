import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import { Icon, icons, ScoreRing, fmtTime } from '../ui.jsx';

export default function Play() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [board, setBoard] = useState([]);
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());
  const submitted = useRef(false);

  useEffect(() => {
    api(`/quizzes/${id}`).then((data) => {
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
      setLeft(data.durationMinutes * 60);
      startedAt.current = Date.now();
    }).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!quiz || result) return;
    const t = setInterval(() => setLeft((l) => Math.max(l - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [quiz, result]);

  async function submit() {
    if (submitted.current) return;
    submitted.current = true;
    try {
      const timeTakenSec = Math.round((Date.now() - startedAt.current) / 1000);
      setResult(await api(`/quizzes/${id}/attempt`, { method: 'POST', body: { answers, timeTakenSec } }));
      setBoard(await api(`/quizzes/${id}/leaderboard`));
      window.scrollTo({ top: 0 });
    } catch (e) { setError(e.message); submitted.current = false; }
  }
  useEffect(() => { if (quiz && left === 0 && !result) submit(); }, [left]); // auto-submit

  function confirmSubmit() {
    const open = answers.filter((a) => a === -1).length;
    if (open && !confirm(`You have ${open} unanswered question${open > 1 ? 's' : ''}. Submit anyway?`)) return;
    submit();
  }

  if (error) return <div className="mx-auto max-w-3xl px-5 py-10"><p className="rounded-xl bg-rose-50 p-4 font-medium text-rose-700">{error}</p><Link to="/" className="btn mt-4">Back to quizzes</Link></div>;
  if (!quiz) return <p className="p-8 text-slate-500">Loading quiz…</p>;

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const msg = pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort. Keep practising.' : 'Keep going. Review the answers below.';
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <div className="card py-8 text-center">
          <p className="text-sm font-medium text-slate-500">{quiz.title}</p>
          <div className="my-4"><ScoreRing pct={pct} /></div>
          <h1 className="text-2xl font-extrabold">{msg}</h1>
          <p className="mt-1 text-slate-500">You answered {result.score} of {result.total} correctly.</p>
          <div className="mt-6 flex justify-center gap-3"><Link to="/" className="btn">Back to quizzes</Link><button className="btn-ghost" onClick={() => window.location.reload()}>Try again</button></div>
        </div>

        <div className="card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Icon d={icons.trophy} className="h-5 w-5 text-amber-500" />Leaderboard</h2>
          <ol className="divide-y divide-slate-100">
            {board.map((b, n) => (
              <li key={n} className={`flex items-center gap-3 py-2.5 text-sm ${b.name === user.name ? 'font-bold text-indigo-700' : ''}`}>
                <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${n === 0 ? 'bg-amber-100 text-amber-700' : n === 1 ? 'bg-slate-200 text-slate-700' : n === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>{n + 1}</span>
                <span className="flex-1 truncate">{b.name}</span>
                <span>{b.score}/{b.total}</span>
                <span className="w-14 text-right font-mono text-slate-500">{fmtTime(b.timeTakenSec)}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="pt-2 text-lg font-bold">Review your answers</h2>
        {result.review.map((r, n) => {
          const ok = r.yourIndex === r.correctIndex;
          return (
            <div key={n} className="card">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`}><Icon d={ok ? icons.check : icons.cross} className="h-3.5 w-3.5" /></span>
                <p className="font-semibold text-ink">{n + 1}. {r.text}</p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {r.options.map((o, k) => (
                  <li key={k} className={`rounded-lg px-3 py-2 ${k === r.correctIndex ? 'bg-emerald-50 font-semibold text-emerald-800' : k === r.yourIndex ? 'bg-rose-50 text-rose-700' : 'text-slate-600'}`}>
                    {o}{k === r.correctIndex && ' (correct answer)'}{k === r.yourIndex && k !== r.correctIndex && ' (your answer)'}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }

  const q = quiz.questions[i];
  const answered = answers.filter((a) => a !== -1).length;
  const last = i === quiz.questions.length - 1;
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-5 py-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-sm text-slate-500">Now taking</p><h1 className="truncate text-xl font-extrabold">{quiz.title}</h1></div>
        <span className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-bold ${left < 30 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}><Icon d={icons.clock} className="h-5 w-5" />{fmtTime(left)}</span>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500"><span>Question {i + 1} of {quiz.questions.length}</span><span>{answered} answered</span></div>
        <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${(answered / quiz.questions.length) * 100}%` }} /></div>
      </div>

      <div className="card p-7">
        <p className="mb-6 text-xl font-bold text-ink">{q.text}</p>
        <div className="space-y-3">
          {q.options.map((o, k) => {
            const on = answers[i] === k;
            return (
              <button key={k} onClick={() => setAnswers(answers.map((a, n) => (n === i ? k : a)))}
                className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition ${on ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${on ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{String.fromCharCode(65 + k)}</span>
                <span className={on ? 'font-semibold text-indigo-900' : ''}>{o}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
        {last ? <button className="btn" onClick={confirmSubmit}>Submit quiz</button> : <button className="btn" onClick={() => setI(i + 1)}>Next</button>}
      </div>

      <div className="card">
        <p className="mb-3 text-sm font-semibold text-slate-600">Jump to question</p>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Question ${n + 1}`}
              className={`h-9 w-9 rounded-lg text-sm font-bold ${n === i ? 'bg-ink text-white' : answers[n] !== -1 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{n + 1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
