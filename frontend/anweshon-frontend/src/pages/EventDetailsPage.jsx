import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { eventRegistrationsApi } from "../api/eventRegistrationsApi";
import { LoadingCard } from "../components/LoadingSpinner";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card, { CardBody, CardHeader } from "../components/Card";
import EmptyState from "../components/EmptyState";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [registration, setRegistration] = useState(null);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        const res = await eventsApi.getById(id);
        if (!isMounted) return;
        setEvent(res.data);
      } catch (err) {
        console.error("Error loading event", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadRegistration() {
      if (!token) {
        setRegistration(null);
        setRegLoading(false);
        return;
      }
      try {
        const res = await eventRegistrationsApi.getMyForEvent(id);
        if (!isMounted) return;
        setRegistration(res.data);
      } catch (err) {
        console.error("Error loading registration", err);
      } finally {
        if (isMounted) setRegLoading(false);
      }
    }

    loadRegistration();
    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const handleRegister = async () => {
    setRegError("");
    try {
      await eventRegistrationsApi.register(id);
      const res = await eventRegistrationsApi.getMyForEvent(id);
      setRegistration(res.data);
    } catch (err) {
      console.error("Register error", err);
      if (err.response?.status === 401) {
        setRegError("Please login to register.");
      } else if (err.response?.status === 400) {
        setRegError(
          typeof err.response.data === "string"
            ? err.response.data
            : "You are already registered."
        );
      } else {
        setRegError("Failed to register for this event.");
      }
    }
  };

  const handleCancel = async () => {
    setRegError("");
    try {
      await eventRegistrationsApi.cancelMyForEvent(id);
      setRegistration(null);
    } catch (err) {
      console.error("Cancel registration error", err);
      setRegError("Failed to cancel registration.");
    }
  };

  if (loading) return <LoadingCard message="Loading event details..." />;
  if (!event) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
        title="Event not found"
        description="The event you're looking for doesn't exist."
        actionLabel="Go Home"
        actionLink="/"
      />
    );
  }

  const isRegistered = !!registration;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link
          to="/"
          className="text-brand-400 hover:text-brand-300 text-sm font-medium inline-flex items-center gap-1"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-black mb-2">
                    {event.title}
                  </h1>
                  <p className="text-slate-700 flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-brand-400"
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
                    {event.clubName}
                  </p>
                </div>
                <Badge variant="success" size="lg">
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {event.description && (
                <p className="text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              )}
            </CardBody>
          </Card>

          {/* Registration Action */}
          {token && !regLoading && (
            <Card>
              <CardBody>
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/50 p-4">
                      <div className="flex items-center gap-2 text-black mb-1">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold">
                          You're registered!
                        </span>
                      </div>
                      <p className="text-sm text-black">
                        You're all set for this event. See you there!
                      </p>
                    </div>
                    <Button
                      onClick={handleCancel}
                      variant="danger"
                      className="w-full"
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleRegister}
                      variant="primary"
                      className="w-full"
                      size="lg"
                    >
                      Register for Event
                    </Button>
                    <p className="text-xs text-slate-600 text-center">
                      Secure your spot for this event
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {!token && (
            <Card>
              <CardBody>
                <div className="text-center py-4">
                  <svg
                    className="h-12 w-12 mx-auto mb-3 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-slate-400 mb-4">
                    Login to register for this event
                  </p>
                  <Link to="/login">
                    <Button variant="primary">Sign In</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}

          {regError && (
            <div className="rounded-lg bg-red-950/30 border border-red-500/50 p-4 text-sm text-red-400">
              {regError}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">
                Event Details
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-brand-400 mt-0.5"
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
                    <p className="text-xs text-slate-600 mb-1">Date & Time</p>
                    <p className="text-sm text-black font-medium">
                      {new Date(event.startDateTime).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-brand-400 mt-0.5"
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
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Location</p>
                    <p className="text-sm text-black font-medium">
                      {event.location || "To be announced"}
                    </p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-brand-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Capacity</p>
                      <p className="text-sm text-black font-medium">
                        {event.capacity} attendees
                      </p>
                    </div>
                  </div>
                )}

                {event.fee !== null && event.fee !== undefined && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-brand-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Fee</p>
                      <p className="text-sm text-black font-medium">
                        {event.fee === 0 ? "Free" : `৳${event.fee}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
