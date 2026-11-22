import { Link } from 'react-router-dom';
import { Icon, icons } from '../ui.jsx';

const features = [
  { t: 'Timed quizzes', d: 'Race the clock. Your quiz submits automatically when time runs out.', i: icons.clock },
  { t: 'Scores you can trust', d: 'Every answer is checked on the server, so results can’t be faked.', i: icons.shield },
  { t: 'Live leaderboards', d: 'See how you rank against other learners on every quiz.', i: icons.trophy },
];

export default function Landing() {
  return (
    <>
      <section className="bg-gradient-to-b from-indigo-50 via-white to-[#F6F7FB]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">Free to use</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Test what you know. Track how you grow.</h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">Take timed quizzes, get instant scores with full answer reviews, and climb the leaderboard.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn px-6 py-3 text-base">Create free account</Link>
              <Link to="/login" className="btn-ghost px-6 py-3 text-base">Log in</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-200 to-violet-200 opacity-60 blur-2xl" />
            <div className="card relative space-y-4 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">JavaScript Basics</span>
                <span className="rounded-lg bg-amber-100 px-3 py-1 font-mono text-sm font-bold text-amber-700">04:32</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200"><div className="h-2 w-2/3 rounded-full bg-indigo-600" /></div>
              <p className="font-semibold text-ink">Which keyword declares a block-scoped variable?</p>
              {['var', 'let', 'define'].map((o, k) => (
                <div key={o} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${k === 1 ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-800' : 'border-slate-200'}`}>
                  <span className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold ${k === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{'ABC'[k]}</span>{o}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-extrabold">Everything you need to practise with confidence</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><Icon d={f.i} /></span>
              <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
              <p className="mt-1 text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
