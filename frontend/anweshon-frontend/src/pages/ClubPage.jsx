import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { eventsApi } from "../api/eventsApi";
import { isClubAdmin } from "../utils/authHelpers";
import { LoadingCard } from "../components/LoadingSpinner";
import Button from "../components/Button";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";

export default function ClubPage() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const token = localStorage.getItem("token");
  const clubAdmin = isClubAdmin();
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [clubRes, eventsRes, execRes] = await Promise.all([
          clubsApi.getById(id),
          eventsApi.getByClub(id),
          clubsApi.getExecutives(id),
        ]);

        if (!isMounted) return;
        setClub(clubRes.data);
        setEvents(eventsRes.data);
        setExecutives(execRes.data || []);
      } catch (err) {
        console.error("Error loading club page", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadMembership() {
      if (!token) {
        setMembership(null);
        setMembershipLoading(false);
        return;
      }
      try {
        const res = await clubsApi.getMyMembership(id);
        if (!isMounted) return;
        setMembership(res.data);
      } catch (err) {
        console.error("Error loading membership", err);
      } finally {
        if (isMounted) setMembershipLoading(false);
      }
    }

    loadMembership();
    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const handleJoin = async () => {
    try {
      await clubsApi.join(id);
      const res = await clubsApi.getMyMembership(id);
      setMembership(res.data);
    } catch (err) {
      console.error("Join club error", err);
      alert("Failed to join club.");
    }
  };

  const handleLeave = async () => {
    try {
      await clubsApi.leave(id);
      setMembership(null);
    } catch (err) {
      console.error("Leave club error", err);
      alert("Failed to leave club.");
    }
  };

  if (loading) return <LoadingCard message="Loading club details..." />;
  if (!club) {
    return (
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
        title="Club not found"
        description="The club you're looking for doesn't exist."
        actionLabel="Go Home"
        actionLink="/"
      />
    );
  }

  const isMember = !!membership;

  return (
    <div className="animate-fade-in">
      {/* Club Banner */}
      {club.bannerUrl && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={club.bannerUrl}
            alt={`${club.name} banner`}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Club Header */}
      <div
        className="mb-8 card p-8"
        style={{
          borderColor: club.primaryColor || undefined,
          borderWidth: club.primaryColor ? "2px" : undefined,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Logo and Info */}
          <div className="flex gap-6 flex-1">
            {club.logoUrl && (
              <div className="flex-shrink-0">
                <img
                  src={club.logoUrl}
                  alt={`${club.name} logo`}
                  className="w-24 h-24 object-cover rounded-xl border-2 border-slate-700"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1
                  className="text-3xl font-bold text-white"
                  style={{ color: club.primaryColor || undefined }}
                >
                  {club.name}
                </h1>
                {club.foundedYear && (
                  <Badge
                    variant="gray"
                    style={{
                      backgroundColor: club.secondaryColor
                        ? `${club.secondaryColor}20`
                        : undefined,
                      borderColor: club.secondaryColor || undefined,
                      color: club.secondaryColor || undefined,
                    }}
                  >
                    Since {club.foundedYear}
                  </Badge>
                )}
              </div>

              {club.tagline && (
                <p className="text-lg text-brand-300 mb-4">{club.tagline}</p>
              )}

              {club.description && (
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {club.description}
                </p>
              )}

              {/* Club Info */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-700 mb-6">
                {club.meetingLocation && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5"
                      style={{ color: club.primaryColor || undefined }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{club.meetingLocation}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {club.contactEmail && (
                  <a
                    href={`mailto:${club.contactEmail}`}
                    className="btn-ghost text-xs"
                  >
                    <svg
                      className="h-4 w-4 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email
                  </a>
                )}
                {club.websiteUrl && (
                  <a
                    href={club.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs"
                  >
                    <svg
                      className="h-4 w-4 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Website
                  </a>
                )}
                {club.facebookUrl && (
                  <a
                    href={club.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs"
                  >
                    Facebook
                  </a>
                )}
                {club.instagramUrl && (
                  <a
                    href={club.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:items-end">
            {!membershipLoading &&
              token &&
              (isMember ? (
                <Button onClick={handleLeave} variant="danger" size="md">
                  Leave Club
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  variant="primary"
                  size="md"
                  style={{
                    backgroundColor: club.primaryColor || undefined,
                    borderColor: club.primaryColor || undefined,
                  }}
                >
                  Join Club
                </Button>
              ))}

            {/* Public navigation buttons */}
            <div className="flex flex-col gap-2 w-full">
              <Link to={`/clubs/${id}/achievements`}>
                <Button variant="secondary" size="sm" className="w-full">
                  🏆 Achievements
                </Button>
              </Link>
              <Link to={`/clubs/${id}/gallery`}>
                <Button variant="secondary" size="sm" className="w-full">
                  📸 Photo Gallery
                </Button>
              </Link>
              <Link to={`/clubs/${id}/past-events`}>
                <Button variant="secondary" size="sm" className="w-full">
                  📅 Past Events
                </Button>
              </Link>
            </div>

            {clubAdmin && (
              <>
                <Link to={`/clubs/${id}/events/new`}>
                  <Button variant="secondary" size="md" className="w-full">
                    Create Event
                  </Button>
                </Link>
                <Link to={`/clubs/${id}/members`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Manage Members
                  </Button>
                </Link>
                <Link to={`/clubs/${id}/executives/edit`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Edit Executives
                  </Button>
                </Link>
                <Link to={`/clubs/${id}/profile/edit`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Executives Section */}
      {executives.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Executive Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {executives.map((ex) => (
              <div key={ex.id} className="card p-5">
                <div className="flex items-start gap-4 mb-3">
                  {ex.photoUrl ? (
                    <img
                      src={ex.photoUrl}
                      alt={ex.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-brand-500/30"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 font-bold text-xl">
                      {ex.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">{ex.name}</h3>
                    <Badge variant="brand" size="sm">
                      {ex.position}
                    </Badge>
                  </div>
                </div>
                {ex.email && (
                  <p className="text-xs text-slate-700 mb-1">{ex.email}</p>
                )}
                {ex.phone && (
                  <p className="text-xs text-slate-700">{ex.phone}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Section */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6">Upcoming Events</h2>
        {events.length === 0 ? (
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
            description="This club hasn't scheduled any events yet. Check back later!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
              <Link
                key={e.id}
                to={`/events/${e.id}`}
                className="card-hover p-5 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-black group-hover:text-brand-400 transition-colors flex-1">
                    {e.title}
                  </h3>
                  <Badge variant="success" size="sm">
                    {e.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 mb-2">
                  {new Date(e.startDateTime).toLocaleString()}
                </p>
                {e.description && (
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {e.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
