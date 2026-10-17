import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Запрос к бэкенду на авторизацию (проверь путь в бэкенде, обычно /auth/login)
      const response = await api.post('/auth/login', { email, password });
      
      // Сохраняем токены и роль (в зависимости от ответа бэкенда)
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // Если бэкенд возвращает пользователя с ролью, сохраним её тоже:
      localStorage.setItem('userRole', response.data.user?.role || (email.includes('teacher') ? 'teacher' : 'student'));

      navigate('/');
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Вход в систему</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="student@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Войти
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Тест-аккаунты:</p>
          <p>teacher@example.com / password123</p>
          <p>student@example.com / password123</p>
        </div>
      </form>
    </div>
  );
}