import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-slate-300">404</h1>
      <p className="text-slate-500 mt-2">Такой страницы не существует</p>
      <Link to="/courses" className="text-brand-600 hover:underline mt-4 inline-block">
        Вернуться в каталог
      </Link>
    </div>
  );
}
