export default function Card({
  children,
  hover = false,
  className = "",
  ...props
}) {
  return (
    <div className={`${hover ? "card-hover" : "card"} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`border-b border-slate-800 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-slate-800 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}
