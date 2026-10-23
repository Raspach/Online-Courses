import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCourseStore } from '../store/useCourseStore';

// Схема валидации с помощью Zod
const courseSchema = z.object({
  title: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов'),
  category: z.string().min(1, 'Выберите категорию'),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Цена не может быть отрицательной')),
});

export default function TeacherDashboard() {
  const { addCourse, courses, deleteCourse } = useCourseStore();

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(courseSchema)
  });

  const onSubmit = async (data) => {
    await addCourse(data);
    reset();
    alert('Курс успешно создан!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Панель преподавателя</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Форма создания курса */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Создать новый курс</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Название курса</label>
              <input 
                type="text" 
                {...register('title')} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Например, React для начинающих"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Категория</label>
              <select 
                {...register('category')} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Выберите категорию</option>
                <option value="Программирование">Программирование</option>
                <option value="Дизайн">Дизайн</option>
                <option value="Маркетинг">Маркетинг</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Описание</label>
              <textarea 
                {...register('description')} 
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="О чем этот курс..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Цена (в рублях)</label>
              <input 
                type="number" 
                {...register('price')} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {isSubmitting ? 'Создание...' : 'Добавить курс'}
            </button>
          </form>
        </div>

        {/* Управление существующими курсами (Удаление) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Управление курсами</h2>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{course.title}</h4>
                    <span className="text-xs text-indigo-600">{course.category}</span>
                  </div>
                  <button 
                    onClick={() => deleteCourse(course.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                  >
                    Удалить
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Нет доступных курсов</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}