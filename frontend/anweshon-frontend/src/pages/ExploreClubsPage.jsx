import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { LoadingCard } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";

export default function ExploreClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await clubsApi.getAll();
        setClubs(res.data || []);
      } catch (err) {
        console.error("Error loading clubs", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingCard message="Loading clubs..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Explore Clubs
        </h1>
        <p className="text-slate-700 text-lg font-medium">
          Discover and join student clubs at RUET
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg bg-white border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
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
          title="No clubs found"
          description={
            searchTerm
              ? "Try a different search term"
              : "No clubs available yet"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Link key={club.id} to={`/clubs/${club.id}`} className="group">
              <div className="card-hover h-full">
                {/* Club Banner */}
                {club.bannerUrl && (
                  <div className="h-40 overflow-hidden rounded-t-xl">
                    <img
                      src={club.bannerUrl}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {club.logoUrl ? (
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-slate-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold text-xl">
                        {club.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-brand-600 transition-colors">
                        {club.name}
                      </h3>
                      {club.foundedYear && (
                        <Badge variant="gray" size="sm">
                          Since {club.foundedYear}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {club.tagline && (
                    <p className="text-sm text-brand-300 mb-2">
                      {club.tagline}
                    </p>
                  )}

                  {club.description && (
                    <p className="text-base text-slate-700 line-clamp-2 font-medium">
                      {club.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
