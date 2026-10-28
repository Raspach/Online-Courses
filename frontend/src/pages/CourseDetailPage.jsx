import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, ClipboardCheck } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch(() => setError("Курс не найден"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success("Вы записались на курс!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось записаться");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">{course.category}</span>
        <h1 className="text-2xl font-semibold mt-2">{course.title}</h1>
        <p className="text-slate-500 mt-1">{course.description}</p>
        <p className="text-sm text-slate-400 mt-1">Преподаватель: {course.teacher.name}</p>

        {isAuthenticated && isStudent && (
          <Button className="mt-4" onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? "Записываем..." : "Записаться на курс"}
          </Button>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-slate-500 mt-4">
            <Link to="/login" className="text-brand-600 hover:underline">Войдите</Link>, чтобы записаться на курс
          </p>
        )}
      </div>

      <div>
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <BookOpen size={18} /> Уроки ({course.lessons.length})
        </h2>
        <div className="space-y-2">
          {course.lessons.map((lesson) => (
            <Card key={lesson.id}>
              <h3 className="font-medium">{lesson.order}. {lesson.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{lesson.content}</p>
            </Card>
          ))}
          {course.lessons.length === 0 && <p className="text-sm text-slate-400">Уроки ещё не добавлены</p>}
        </div>
      </div>

      <div>
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <ClipboardCheck size={18} /> Тесты ({course.tests.length})
        </h2>
        <div className="space-y-2">
          {course.tests.map((test) => (
            <Card key={test.id} className="flex items-center justify-between">
              <span>{test.title}</span>
            </Card>
          ))}
          {course.tests.length === 0 && <p className="text-sm text-slate-400">Тестов пока нет</p>}
        </div>
      </div>
    </div>
  );
}
