import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import { useDebounce } from "../hooks/useDebounce";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { CardSkeleton } from "../components/Skeleton";

export default function CatalogPage() {
  // Фильтры, поиск и страница живут в URL — так можно скинуть ссылку
  // с теми же фильтрами или обновить страницу без потери состояния.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/courses/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // Как только debounce сработал — обновляем search в URL (и сбрасываем страницу)
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ search: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/courses", { params: { search, category, page, limit: 6 } })
      .then((res) => setData(res.data))
      .catch(() => setError("Не удалось загрузить курсы. Попробуйте позже."))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  function updateParams(next) {
    const params = { search, category, page, ...next };
    const cleaned = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
    setSearchParams(cleaned);
  }

  const pages = useMemo(() => Array.from({ length: data?.pages || 1 }, (_, i) => i + 1), [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Каталог курсов</h1>
        <p className="text-slate-500 text-sm">Выберите курс и начните учиться прямо сейчас</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
          className="border border-slate-300 rounded-md px-3 py-2"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && data?.items.length === 0 && (
        <p className="text-slate-500">По вашему запросу ничего не найдено.</p>
      )}

      {!loading && !error && data?.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-md transition">
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">{course.category}</span>
                  <h3 className="font-semibold mt-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  <p className="text-xs text-slate-400 mt-3">
                    {course.teacher.name} · {course._count.enrollments} студентов
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          {pages.length > 1 && (
            <div className="flex gap-2 justify-center pt-2">
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => updateParams({ page: p })}
                  className={`w-8 h-8 rounded-md text-sm ${
                    p === page ? "bg-brand-600 text-white" : "bg-white border border-slate-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
