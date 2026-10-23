import { useEffect, useState } from 'react';
import { useCourseStore } from '../store/useCourseStore';

export default function CoursesCatalog() {
  const { courses, fetchCourses, loading } = useCourseStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Фильтрация и поиск курсов
  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredCourses = safeCourses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Каталог курсов</h1>

      {/* Панель поиска и фильтров */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          type="text"
          placeholder="Поиск курса по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="All">Все категории</option>
          <option value="Программирование">Программирование</option>
          <option value="Дизайн">Дизайн</option>
          <option value="Маркетинг">Маркетинг</option>
        </select>
      </div>

      {/* Список курсов */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Загрузка курсов...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="font-bold text-gray-900">{course.price ? `${course.price} ₽` : 'Бесплатно'}</span>
                  <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Подробнее
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">Курсы не найдены</p>
          )}
        </div>
      )}
    </div>
  );
}