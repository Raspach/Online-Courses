import { useEffect, useState } from "react";

// Возвращает значение с задержкой — используем для поиска по каталогу,
// чтобы не слать запрос на каждое нажатие клавиши.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // очистка — отменяем старый таймер при новом вводе
  }, [value, delay]);

  return debounced;
}
