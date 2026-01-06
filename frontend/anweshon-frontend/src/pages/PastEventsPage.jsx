import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { clubsApi } from "../api/clubsApi";
import Card, { CardBody, CardHeader } from "../components/Card";
import EmptyState from "../components/EmptyState";
import { LoadingCard } from "../components/LoadingSpinner";
import Badge from "../components/Badge";

export default function PastEventsPage() {
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is ClubAdmin
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isClubAdmin = roles.includes("ClubAdmin");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  const loadData = async () => {
    try {
      const [clubRes, eventsRes] = await Promise.all([
        clubsApi.getById(clubId),
        eventsApi.getPastEvents(clubId),
      ]);

      setClub(clubRes.data);
      setPastEvents(eventsRes.data || []);
    } catch (err) {
      setError("Error loading past events");
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingCard message="Loading past events..." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <Link to={`/clubs/${clubId}`} className="hover:text-brand-600">
            {club?.name}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Past Events</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Past Events</h1>
            <p className="mt-2 text-slate-700">
              Events that have already taken place
            </p>
          </div>
          {isClubAdmin && (
            <button
              onClick={() =>
                navigate(`/clubs/${clubId}/events/new?isPast=true`)
              }
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Past Event
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {pastEvents.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="h-12 w-12 text-slate-400"
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
          title="No past events"
          description="This club hasn't organized any events yet"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              {event.bannerUrl && (
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                      {event.title}
                    </h3>
                    <Badge variant="secondary" className="mt-2">
                      {event.eventType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-start text-sm text-slate-600">
                    <svg
                      className="h-5 w-5 mr-2 text-slate-400 flex-shrink-0"
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
                    <div>
                      <p className="font-medium text-slate-900">Started</p>
                      <p>{formatDate(event.startDateTime)}</p>
                    </div>
                  </div>

                  {event.endDateTime && (
                    <div className="flex items-start text-sm text-slate-600">
                      <svg
                        className="h-5 w-5 mr-2 text-slate-400 flex-shrink-0"
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
                      <div>
                        <p className="font-medium text-slate-900">Ended</p>
                        <p>{formatDate(event.endDateTime)}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start text-sm text-slate-600">
                      <svg
                        className="h-5 w-5 mr-2 text-slate-400 flex-shrink-0"
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
                      <p className="line-clamp-2">{event.location}</p>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-slate-600 line-clamp-3 pt-2 border-t border-slate-200">
                      {event.description}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {event.registeredCount || 0} attended
                    </span>
                    {event.fee > 0 && (
                      <span className="font-semibold text-brand-600">
                        {event.fee} BDT
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="mt-4 block text-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  View Details →
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
