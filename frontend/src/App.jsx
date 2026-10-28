import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import DashboardPage from "./pages/DashboardPage";
import TeacherCoursesPage from "./pages/TeacherCoursesPage";
import TeacherCourseEditPage from "./pages/TeacherCourseEditPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CatalogPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute role="STUDENT">
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="TEACHER">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses"
            element={
              <ProtectedRoute role="TEACHER">
                <TeacherCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/:id"
            element={
              <ProtectedRoute role="TEACHER">
                <TeacherCourseEditPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
