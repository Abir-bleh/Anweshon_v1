import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div className="card p-12 text-center">
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-600">
            {icon}
          </div>
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-6 text-sm text-slate-700 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel &&
        (actionLink || onAction) &&
        (actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
