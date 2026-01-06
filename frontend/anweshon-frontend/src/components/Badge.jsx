export default function Badge({
  children,
  variant = "brand",
  size = "md",
  className = "",
}) {
  const variants = {
    brand: "badge-brand",
    gray: "badge-gray",
    success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    warning: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",
    danger: "bg-red-500/10 text-red-300 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
