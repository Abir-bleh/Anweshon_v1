export default function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <input
        className={`input ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-600">{helperText}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <textarea
        className={`input min-h-[100px] ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
