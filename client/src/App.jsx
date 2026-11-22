import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { Logo } from './ui.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Quizzes from './pages/Quizzes.jsx';
import Play from './pages/Play.jsx';
import Admin from './pages/Admin.jsx';

function Private({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-slate-500">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-slate-500">Loading…</p>;
  return user ? <Quizzes /> : <Landing />;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && <Link to="/admin" className="text-sm font-semibold text-slate-600 hover:text-indigo-600">Admin</Link>}
            {user ? (
              <>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700" title={user.name}>{user.name[0]?.toUpperCase()}</span>
                <button className="btn-ghost" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600">Log in</Link>
                <Link to="/register" className="btn">Get started</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/quiz/:id" element={<Private><Play /></Private>} />
          <Route path="/admin" element={<Private admin><Admin /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-500">
        © 2026 QuizForge. Built with the MERN stack by Mubashra Tahir.
      </footer>
    </div>
  );
}
