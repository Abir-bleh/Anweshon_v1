export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-brand-500 border-t-transparent`}
      />
    </div>
  );
}

export function LoadingCard({ message = "Loading..." }) {
  return (
    <div className="card p-8 text-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-sm text-slate-700">{message}</p>
    </div>
  );
}

export function LoadingSkeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      {...props}
    />
  );
}
