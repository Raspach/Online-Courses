import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Card } from "../components/Card";
import { CardSkeleton } from "../components/Skeleton";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/my-courses")
      .then((res) => setEnrollments(res.data))
      .catch(() => setError("Не удалось загрузить ваши курсы"))
      .finally(() => setLoading(false));
  }, []);

  // useMemo: средний прогресс пересчитывается только когда меняется список
  // записей, а не при каждом ререндере страницы.
  const averageProgress = useMemo(() => {
    if (enrollments.length === 0) return 0;
    const sum = enrollments.reduce((acc, e) => acc + e.progress, 0);
    return Math.round(sum / enrollments.length);
  }, [enrollments]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Мои курсы</h1>
        <p className="text-slate-500 text-sm">Средний прогресс по всем курсам: {averageProgress}%</p>
      </div>

      {enrollments.length === 0 ? (
        <p className="text-slate-500">
          Вы пока не записаны ни на один курс. <Link to="/courses" className="text-brand-600 hover:underline">Перейти в каталог</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enrollments.map((e) => (
            <Link key={e.id} to={`/courses/${e.course.id}`}>
              <Card className="hover:shadow-md transition">
                <h3 className="font-semibold">{e.course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Преподаватель: {e.course.teacher.name}</p>
                <div className="mt-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600" style={{ width: `${e.progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{e.progress}% пройдено</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
