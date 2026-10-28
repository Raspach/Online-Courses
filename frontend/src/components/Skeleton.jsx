// Простой скелетон-плейсхолдер для состояния загрузки
export function Skeleton({ className = "h-4 w-full" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
