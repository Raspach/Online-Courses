import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть минимум 6 символов"),
  role: z.enum(["STUDENT", "TEACHER"], { message: "Выберите роль" }),
});
