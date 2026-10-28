import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import api from "../api/axios";
import { Card } from "../components/Card";
import { Skeleton } from "../components/Skeleton";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Не удалось загрузить данные дашборда"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Дашборд</h1>
        <p className="text-slate-500 text-sm">
          Всего курсов: {data.totalCourses} · студентов: {data.totalStudents}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="font-medium mb-3">Записи на курсы по неделям</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.enrollmentsByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Записи" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="font-medium mb-3">Средний балл по курсам</h2>
          {data.avgScoreByCourse.length === 0 ? (
            <p className="text-sm text-slate-400">Пока нет результатов тестов</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.avgScoreByCourse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3b82f6" name="Средний балл" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="font-medium mb-3">Прогресс студентов</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.progressDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                {data.progressDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
