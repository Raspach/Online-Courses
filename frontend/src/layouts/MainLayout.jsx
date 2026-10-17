import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Навигационная панель */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            LMS Платформа
          </Link>
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Каталог</Link>
            {userRole === 'teacher' && (
              <Link to="/teacher" className="text-gray-600 hover:text-indigo-600">Панель преподавателя</Link>
            )}
            {token ? (
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-px px-3 py-1.5 rounded text-white text-sm hover:bg-red-600"
              >
                Выйти
              </button>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700">
                Войти
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Основной контент страниц */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}