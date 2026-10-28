import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api from "../api/axios";
import { lessonSchema, testSchema } from "../schemas/courseSchemas";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ConfirmDeleteModal } from "../components/Modal";
import { Skeleton } from "../components/Skeleton";

export default function TeacherCourseEditPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLesson, setDeleteLesson] = useState(null);

  // useCallback: эту функцию передаём в несколько форм (уроки и тесты),
  // которые вызывают её после успешного создания — без useCallback
  // она пересоздавалась бы при каждом ререндере страницы.
  const loadCourse = useCallback(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/courses/${id}`),
      api.get("/courses/teacher/mine"),
    ])
      .then(([courseRes, mineRes]) => {
        setCourse(courseRes.data);
        const mine = mineRes.data.find((c) => c.id === Number(id));
        setStudents(mine?.enrollments || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const lessonForm = useForm({ resolver: zodResolver(lessonSchema) });
  const testForm = useForm({ resolver: zodResolver(testSchema) });

  async function onAddLesson(values) {
    try {
      await api.post(`/courses/${id}/lessons`, values);
      toast.success("Урок добавлен");
      lessonForm.reset();
      loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось добавить урок");
    }
  }

  async function onAddTest(values) {
    try {
      await api.post(`/courses/${id}/tests`, values);
      toast.success("Тест добавлен");
      testForm.reset();
      loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось добавить тест");
    }
  }

  async function confirmDeleteLesson() {
    try {
      await api.delete(`/lessons/${deleteLesson.id}`);
      toast.success("Урок удалён");
      setDeleteLesson(null);
      loadCourse();
    } catch (err) {
      toast.error("Не удалось удалить урок");
    }
  }

  async function handleDeleteTest(testId) {
    try {
      await api.delete(`/tests/${testId}`);
      toast.success("Тест удалён");
      loadCourse();
    } catch (err) {
      toast.error("Не удалось удалить тест");
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!course) return <p className="text-red-600">Курс не найден</p>;

  return (
    <div className="space-y-8">
      <div>
        <Link to="/teacher/courses" className="text-sm text-brand-600 hover:underline">← Мои курсы</Link>
        <h1 className="text-2xl font-semibold mt-1">{course.title}</h1>
        <p className="text-slate-500 text-sm">{course.description}</p>
      </div>

      <section>
        <h2 className="font-medium mb-3">Уроки</h2>
        <div className="space-y-2 mb-4">
          {course.lessons.map((lesson) => (
            <Card key={lesson.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{lesson.order}. {lesson.title}</p>
                <p className="text-sm text-slate-500">{lesson.content}</p>
              </div>
              <button onClick={() => setDeleteLesson(lesson)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </Card>
          ))}
          {course.lessons.length === 0 && <p className="text-sm text-slate-400">Уроков пока нет</p>}
        </div>
        <form onSubmit={lessonForm.handleSubmit(onAddLesson)} className="grid sm:grid-cols-4 gap-2 items-start">
          <Input placeholder="Название урока" error={lessonForm.formState.errors.title?.message} {...lessonForm.register("title")} />
          <Input placeholder="Текст урока" error={lessonForm.formState.errors.content?.message} {...lessonForm.register("content")} />
          <Input type="number" placeholder="Порядок" error={lessonForm.formState.errors.order?.message} {...lessonForm.register("order")} />
          <Button type="submit" className="flex items-center gap-1 justify-center"><Plus size={16} /> Добавить</Button>
        </form>
      </section>

      <section>
        <h2 className="font-medium mb-3">Тесты</h2>
        <div className="space-y-2 mb-4">
          {course.tests.map((test) => (
            <Card key={test.id} className="flex items-center justify-between">
              <span>{test.title}</span>
              <button onClick={() => handleDeleteTest(test.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </Card>
          ))}
          {course.tests.length === 0 && <p className="text-sm text-slate-400">Тестов пока нет</p>}
        </div>
        <form onSubmit={testForm.handleSubmit(onAddTest)} className="flex gap-2">
          <div className="flex-1">
            <Input placeholder="Название теста" error={testForm.formState.errors.title?.message} {...testForm.register("title")} />
          </div>
          <Button type="submit" className="flex items-center gap-1"><Plus size={16} /> Добавить</Button>
        </form>
      </section>

      <section>
        <h2 className="font-medium mb-3">Студенты ({students.length})</h2>
        {students.length === 0 ? (
          <p className="text-sm text-slate-400">Пока никто не записался</p>
        ) : (
          <div className="space-y-2">
            {students.map((e) => (
              <Card key={e.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{e.student.name}</p>
                  <p className="text-xs text-slate-400">{e.student.email}</p>
                </div>
                <span className="text-sm text-slate-500">{e.progress}% пройдено</span>
              </Card>
            ))}
          </div>
        )}
      </section>

      <ConfirmDeleteModal
        open={!!deleteLesson}
        onClose={() => setDeleteLesson(null)}
        onConfirm={confirmDeleteLesson}
        itemName={deleteLesson?.title}
      />
    </div>
  );
}
