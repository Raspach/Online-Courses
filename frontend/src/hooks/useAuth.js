import { useAuthStore } from "../store/authStore";

// Небольшая обёртка над стором, чтобы в компонентах было читаемее:
// const { user, isTeacher } = useAuth();
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isAuthenticated: !!user,
    isTeacher: user?.role === "TEACHER",
    isStudent: user?.role === "STUDENT",
    logout,
  };
}
