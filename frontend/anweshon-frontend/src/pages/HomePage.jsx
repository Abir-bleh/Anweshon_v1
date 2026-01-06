import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { eventsApi } from "../api/eventsApi";
import { LoadingCard } from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import Button from "../components/Button";
import RuetLogo from "../components/RuetLogo";

export default function HomePage() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [clubsRes, eventsRes] = await Promise.all([
          clubsApi.getAll(),
          eventsApi.getUpcoming(),
        ]);

        if (!isMounted) return;
        setClubs(clubsRes?.data || []);
        setEvents(eventsRes?.data || []);
      } catch (err) {
        console.error("Error loading home data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-12 md:pt-20 animate-fade-in">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-transparent to-transparent" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[500px] w-[500px] translate-y-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center animate-slide-up">
            {/* RUET Logo */}
            <div className="flex justify-center mb-4">
              <RuetLogo size="lg" />
            </div>

            <Badge
              variant="brand"
              size="md"
              className="mb-4 shadow-lg shadow-brand-500/20"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-glow" />
                Anweshon • RUET Clubs
              </span>
            </Badge>

            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-balance text-slate-900">
              All your <span className="gradient-text">club events</span> in one
              place
            </h1>

            <p className="mb-8 text-lg text-slate-700 sm:text-xl max-w-2xl mx-auto font-medium">
              Discover, register, and manage your involvement in RUET clubs. No
              more chasing Facebook posts or random forms.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {token ? (
                <>
                  <Link to="/my-clubs">
                    <Button variant="primary" size="lg">
                      Explore My Clubs
                    </Button>
                  </Link>
                  <Link to="/my-events">
                    <Button variant="secondary" size="lg">
                      View My Events
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Explore Clubs by Category
            </h2>
            <p className="text-lg text-slate-600">
              Find clubs that match your interests and passions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Academic Clubs */}
            <Link
              to="/explore/clubs?category=Academic"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Academic</h3>
                <p className="text-white/90 text-sm mb-4">
                  Learn, research, and compete academically
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Explore clubs</span>
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Cultural Clubs */}
            <Link
              to="/explore/clubs?category=Cultural"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Cultural</h3>
                <p className="text-white/90 text-sm mb-4">
                  Celebrate art, music, and traditions
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Explore clubs</span>
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Sports & Fitness */}
            <Link
              to="/explore/clubs?category=Sports"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Sports</h3>
                <p className="text-white/90 text-sm mb-4">
                  Stay active and compete in sports
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Explore clubs</span>
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Technical Clubs */}
            <Link
              to="/explore/clubs?category=Technical"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Technical</h3>
                <p className="text-white/90 text-sm mb-4">
                  Build, code, and innovate together
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Explore clubs</span>
                  <svg
                    className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
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
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {clubs.length}+
              </div>
              <p className="text-slate-600 font-medium">Active Clubs</p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
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
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {events.length}+
              </div>
              <p className="text-slate-600 font-medium">Upcoming Events</p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                1000+
              </div>
              <p className="text-slate-600 font-medium">Active Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything you need
            </h2>
            <p className="text-slate-700 max-w-2xl mx-auto text-lg font-medium">
              A comprehensive platform designed for seamless club management and
              event participation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-brand-500/50 hover:shadow-lg transition-all">
              <div className="mb-4 flex justify-center">
                <div className="rounded-xl bg-brand-100 p-3">
                  <svg
                    className="h-8 w-8 text-brand-600"
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
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Event Management
              </h3>
              <p className="text-base text-slate-700 font-medium">
                Browse, register, and track all club events in one centralized
                dashboard
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-brand-500/50 hover:shadow-lg transition-all">
              <div className="mb-4 flex justify-center">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <svg
                    className="h-8 w-8 text-emerald-600"
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
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Club Membership
              </h3>
              <p className="text-base text-slate-700 font-medium">
                Join clubs, manage memberships, and stay connected with your
                community
              </p>
            </div>

            <div className="card p-6 text-center hover:border-brand-500/50 transition-all">
              <div className="mb-4 flex justify-center">
                <div className="rounded-xl bg-blue-100 p-3">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Real-time Notifications
              </h3>
              <p className="text-base text-slate-700 font-medium">
                Get instant updates about new events, registrations, and club
                activities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        {loading ? (
          <LoadingCard message="Loading your clubs and events..." />
        ) : (
          <div className="space-y-16">
            {/* Clubs section */}
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-2">
                    My Clubs
                  </h2>
                  <p className="text-base text-slate-700 font-medium">
                    Quick access to the clubs you're already part of
                  </p>
                </div>
                <Link to="/my-clubs">
                  <Button variant="ghost" size="sm">
                    <span className="flex items-center gap-1">
                      See all
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
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
                  description="You haven't joined any clubs yet. Explore club pages and join to see them here."
                  actionLabel="Explore Clubs"
                  actionLink="/my-clubs"
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.slice(0, 6).map((club) => (
                    <Link
                      key={club.id}
                      to={`/clubs/${club.id}`}
                      className="card-hover group p-6 animate-slide-up"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
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
                      <p className="text-base text-slate-700 line-clamp-3 font-medium">
                        {club.description || "No description added yet."}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Events section */}
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-2">
                    Upcoming Events
                  </h2>
                  <p className="text-base text-slate-700 font-medium">
                    Events from your clubs, all in one place
                  </p>
                </div>
                <Link to="/my-events">
                  <Button variant="ghost" size="sm">
                    <span className="flex items-center gap-1">
                      See all
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>

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
                  title="No upcoming events"
                  description="No events scheduled yet. Check back later as your clubs publish new workshops, seminars, and competitions."
                  actionLabel="View All Events"
                  actionLink="/my-events"
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.slice(0, 6).map((ev) => (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.id}`}
                      className="card-hover group p-6 animate-slide-up"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="flex-1 text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {ev.title}
                        </h3>
                        <Badge variant="brand" size="sm">
                          {new Date(ev.startTime).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                        {ev.description || "No description added yet."}
                      </p>
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {ev.venue || "Venue TBA"}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
