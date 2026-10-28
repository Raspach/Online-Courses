import { create } from "zustand";

// Простое глобальное состояние авторизации.
// Лежит в сторе, а не в useState, потому что токен и юзер
// нужны одновременно в Navbar, ProtectedRoute и axios-интерцепторе —
// протащить это через пропсы было бы неудобно.
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,

  setAuth: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, refreshToken });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
