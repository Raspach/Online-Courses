import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Название минимум 3 символа"),
  description: z.string().min(10, "Опишите курс подробнее (минимум 10 символов)"),
  category: z.string().min(1, "Выберите категорию"),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Название минимум 3 символа"),
  content: z.string().min(10, "Текст урока минимум 10 символов"),
  order: z.coerce.number().min(1, "Порядок должен быть не меньше 1"),
});

export const testSchema = z.object({
  title: z.string().min(3, "Название минимум 3 символа"),
});
