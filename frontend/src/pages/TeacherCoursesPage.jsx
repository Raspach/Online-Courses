import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import api from "../api/axios";
import { courseSchema } from "../schemas/courseSchemas";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Modal, ConfirmDeleteModal } from "../components/Modal";
import { CardSkeleton } from "../components/Skeleton";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/courses/teacher/mine")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Не удалось загрузить курсы"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(courseSchema) });

  async function onCreate(values) {
    try {
      await api.post("/courses", values);
      toast.success("Курс создан");
      reset();
      setCreateOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось создать курс");
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/courses/${deleteTarget.id}`);
      toast.success("Курс удалён");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось удалить курс");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Мои курсы</h1>
        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-1">
          <Plus size={16} /> Новый курс
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-slate-500">У вас пока нет курсов. Создайте первый!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">{course.category}</span>
                <h3 className="font-semibold mt-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {course._count.lessons} уроков · {course._count.tests} тестов · {course.enrollments.length} студентов
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link to={`/teacher/courses/${course.id}`}>
                <Button variant="secondary">Управлять</Button>
              </Link>
              <Button variant="danger" onClick={() => setDeleteTarget(course)}>Удалить</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новый курс">
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input label="Название" error={errors.title?.message} {...register("title")} />
          <Input label="Описание" as="textarea" rows={3} error={errors.description?.message} {...register("description")} />
          <Input label="Категория" placeholder="Например: Программирование" error={errors.category?.message} {...register("category")} />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Создаём..." : "Создать курс"}</Button>
        </form>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
