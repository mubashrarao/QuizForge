export function Icon({ d, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
export const icons = {
  clock: 'M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z',
  shield: 'M9 12l2 2 4-4M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  check: 'M20 6L9 17l-5-5',
  cross: 'M18 6L6 18M6 6l12 12',
  chart: 'M3 3v18h18M7 14l4-4 3 3 5-6',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  plus: 'M12 5v14M5 12h14',
};

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-lg font-extrabold text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
        <Icon d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" className="h-4 w-4" />
      </span>
      QuizForge
    </span>
  );
}

const badges = ['bg-indigo-50 text-indigo-700', 'bg-emerald-50 text-emerald-700', 'bg-amber-50 text-amber-700', 'bg-rose-50 text-rose-700', 'bg-sky-50 text-sky-700', 'bg-violet-50 text-violet-700'];
export const badgeClass = (s = '') => badges[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % badges.length];

export const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function ScoreRing({ pct }) {
  const r = 54, c = 2 * Math.PI * r;
  const color = pct >= 80 ? '#059669' : pct >= 50 ? '#4F46E5' : '#E11D48';
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="text-4xl font-extrabold text-ink">{pct}%</p><p className="text-xs font-medium text-slate-500">score</p></div>
      </div>
    </div>
  );
}
