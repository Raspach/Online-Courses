import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CoursesCatalog from './pages/CoursesCatalog';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          {/* Открытая или общая страница каталога */}
          <Route index element={<CoursesCatalog />} />
          
          {/* Защищенная страница преподавателя */}
          <Route 
            path="teacher" 
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Страница 404 */}
          <Route path="*" element={<div className="text-center py-20 text-xl text-gray-600">Страница не найдена (404)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;