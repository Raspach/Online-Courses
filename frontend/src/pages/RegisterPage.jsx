import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import { registerSchema } from "../schemas/authSchemas";
import { useAuthStore } from "../store/authStore";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: "STUDENT" } });

  async function onSubmit(values) {
    try {
      const { data } = await api.post("/auth/register", values);
      setAuth(data);
      toast.success("Аккаунт создан!");
      navigate(data.user.role === "TEACHER" ? "/teacher/courses" : "/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось зарегистрироваться");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <Card>
        <h1 className="text-xl font-semibold mb-4">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Имя" placeholder="Как вас зовут" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Пароль" type="password" placeholder="Минимум 6 символов" error={errors.password?.message} {...register("password")} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Роль</label>
            <select {...register("role")} className="border border-slate-300 rounded-md px-3 py-2">
              <option value="STUDENT">Студент</option>
              <option value="TEACHER">Преподаватель</option>
            </select>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создаём..." : "Зарегистрироваться"}
          </Button>
        </form>
        <p className="text-sm text-slate-500 mt-4">
          Уже есть аккаунт? <Link to="/login" className="text-brand-600 hover:underline">Войти</Link>
        </p>
      </Card>
    </div>
  );
}
