import React from "react";

// Поле ввода с лейблом и текстом ошибки под ним (для react-hook-form)
export const Input = React.forwardRef(function Input(
  { label, error, as = "input", ...props },
  ref
) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <Tag
        ref={ref}
        className={`border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});