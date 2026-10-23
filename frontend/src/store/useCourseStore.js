import { create } from 'zustand';
import api from '../api/axios';

export const useCourseStore = create((set) => ({
  courses: [],
  loading: false,
  error: null,

  // Получение всех курсов с бэкенда
  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/courses'); // Эндпоинт получения курсов
      set({ courses: response.data, loading: false });
    } catch (err) {
      // Если бэкенд еще не отдает курсы, можно временно закинуть моковые данные для теста
      set({ 
        courses: [
          { id: 1, title: 'React с нуля', description: 'Изучаем компоненты, хуки и роутинг', category: 'Программирование', price: 0 },
          { id: 2, title: 'Продвинутый Node.js', description: 'Строим REST API и бэкенд на Express', category: 'Программирование', price: 1500 },
          { id: 3, title: 'UX/UI Дизайн', description: 'Основы проектирования интерфейсов в Figma', category: 'Дизайн', price: 1200 },
        ], 
        loading: false 
      });
    }
  },

  // Добавление курса (для преподавателя)
  addCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      set((state) => ({ courses: [...state.courses, response.data] }));
    } catch (err) {
      console.error('Ошибка при создании курса', err);
    }
  },

  // Удаление курса
  deleteCourse: async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      set((state) => ({ courses: state.courses.filter(c => c.id !== id) }));
    } catch (err) {
      console.error('Ошибка при удалении курса', err);
    }
  }
}));