export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
