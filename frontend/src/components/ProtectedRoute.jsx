import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Закрывает маршрут для неавторизованных и, если указана role,
// пускает только пользователей с нужной ролью.
export function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/courses" replace />;
  }
  return children;
}
