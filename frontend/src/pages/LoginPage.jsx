import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import { loginSchema } from "../schemas/authSchemas";
import { useAuthStore } from "../store/authStore";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    try {
      const { data } = await api.post("/auth/login", values);
      setAuth(data);
      toast.success(`С возвращением, ${data.user.name}!`);
      navigate(data.user.role === "TEACHER" ? "/teacher/courses" : "/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Не удалось войти");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <Card>
        <h1 className="text-xl font-semibold mb-4">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Пароль" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Входим..." : "Войти"}
          </Button>
        </form>
        <p className="text-sm text-slate-500 mt-4">
          Нет аккаунта? <Link to="/register" className="text-brand-600 hover:underline">Зарегистрироваться</Link>
        </p>
        <p className="text-xs text-slate-400 mt-3">
          Тест: teacher1@lms.kz / student1@lms.kz, пароль password123
        </p>
      </Card>
    </div>
  );
}
