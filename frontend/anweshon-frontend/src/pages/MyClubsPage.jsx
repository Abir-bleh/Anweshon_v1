import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { LoadingCard } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";

export default function MyClubsPage() {
  const [clubs, setClubs] = useState([]);
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
        const res = await clubsApi.getMy();
        if (!isMounted) return;
        setClubs(res.data);
      } catch (err) {
        console.error("Error loading my clubs", err);
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

  if (loading) return <LoadingCard message="Loading your clubs..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Clubs</h1>
        <p className="text-slate-700">Clubs you're currently a member of</p>
      </div>

      {clubs.length === 0 ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          title="No clubs yet"
          description="You haven't joined any clubs yet. Browse available clubs and join the ones that interest you!"
          actionLabel="Explore Clubs"
          actionLink="/"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Link
              key={club.id}
              to={`/clubs/${club.id}`}
              className="card-hover p-6 group animate-slide-up"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold mb-1 transition-colors"
                    style={{
                      color: club.primaryColor || "#1e293b",
                    }}
                  >
                    {club.name}
                  </h3>
                  {club.tagline && (
                    <p className="text-sm text-slate-600 line-clamp-1">
                      {club.tagline}
                    </p>
                  )}
                </div>
                {club.foundedYear && (
                  <Badge variant="gray" size="sm">
                    {club.foundedYear}
                  </Badge>
                )}
              </div>

              {club.description && (
                <p className="text-sm text-slate-700 line-clamp-3 mb-4">
                  {club.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-600">
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
                Member
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
