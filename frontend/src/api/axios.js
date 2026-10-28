import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// К каждому запросу добавляем access-токен
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function resolveQueue(token) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// При 401 пробуем один раз обновить access-токен через refresh-токен.
// Если не вышло — выходим из аккаунта и кидаем на /login.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/refresh`,
        { refreshToken }
      );
      setAccessToken(data.accessToken);
      resolveQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
