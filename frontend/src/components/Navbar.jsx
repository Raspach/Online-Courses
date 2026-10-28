import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user, isAuthenticated, isTeacher, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = isTeacher
    ? [
        { to: "/courses", label: "Каталог" },
        { to: "/teacher/courses", label: "Мои курсы" },
        { to: "/dashboard", label: "Дашборд" },
      ]
    : [
        { to: "/courses", label: "Каталог" },
        { to: "/my-courses", label: "Мои курсы" },
      ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/courses" className="flex items-center gap-2 font-semibold text-brand-700">
          <GraduationCap size={22} />
          EduPlatform
        </Link>

        {/* Десктоп-меню */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated &&
            links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-slate-600 hover:text-brand-700">
                {l.label}
              </Link>
            ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-slate-600 hover:text-brand-700">Войти</Link>
              <Link to="/register" className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700">
                Регистрация
              </Link>
            </div>
          )}
        </div>

        {/* Бургер для мобилки */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 flex flex-col gap-3">
          {isAuthenticated &&
            links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm text-slate-600">
                {l.label}
              </Link>
            ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-sm text-red-600 text-left">
              Выйти ({user.name})
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-slate-600">Войти</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-sm text-brand-700">Регистрация</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
