import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventRegistrationsApi } from "../api/eventRegistrationsApi";
import { LoadingCard } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";

export default function MyEventsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const res = await eventRegistrationsApi.getMyAll();
        if (!isMounted) return;
        setItems(res.data);
      } catch (err) {
        console.error("Error loading my events", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  if (!token) return null;

  if (loading) return <LoadingCard message="Loading your events..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
        <p className="text-slate-700">Events you've registered for</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="No events yet"
          description="You haven't registered for any events yet. Browse upcoming events and register for the ones you're interested in!"
          actionLabel="Browse Events"
          actionLink="/"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((r) => (
            <Link
              key={r.id}
              to={`/events/${r.eventId}`}
              className="card-hover p-6 group animate-slide-up"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="flex-1 text-lg font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                  {r.eventTitle}
                </h3>
                <Badge variant="success" size="sm">
                  {r.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-brand-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(r.startDateTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-brand-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {new Date(r.startDateTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Registered
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
