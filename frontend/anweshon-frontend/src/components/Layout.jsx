import { Link, useNavigate, useLocation } from "react-router-dom";
import { isClubAdmin } from "../utils/authHelpers";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import RuetLogo from "./RuetLogo";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const clubAdmin = isClubAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive(path) ? "text-brand-600" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <RuetLogo
              size="sm"
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Anweshon
            </span>
            {clubAdmin && (
              <span className="badge-brand ml-1 text-[10px]">Admin</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link
              to="/explore/clubs"
              className={navLinkClass("/explore/clubs")}
            >
              Explore Clubs
            </Link>
            <Link
              to="/explore/events"
              className={navLinkClass("/explore/events")}
            >
              Explore Events
            </Link>
            {token && (
              <>
                <Link to="/my-events" className={navLinkClass("/my-events")}>
                  My Events
                </Link>
                <Link to="/my-clubs" className={navLinkClass("/my-clubs")}>
                  My Clubs
                </Link>
              </>
            )}
            {clubAdmin && (
              <Link to="/clubs/new" className={navLinkClass("/clubs/new")}>
                <span className="flex items-center gap-1">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Club
                </span>
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            {token ? (
              <>
                <NotificationBell />
                <div className="mr-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-brand-600 animate-pulse-glow" />
                  <span>Online</span>
                </div>
                <Link
                  to="/profile"
                  className="btn-ghost text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden animate-slide-down">
            <nav className="flex flex-col px-4 py-4 space-y-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/explore/clubs"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Clubs
              </Link>
              <Link
                to="/explore/events"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Events
              </Link>
              {token && (
                <>
                  <Link
                    to="/my-events"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Events
                  </Link>
                  <Link
                    to="/my-clubs"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Clubs
                  </Link>
                </>
              )}
              {clubAdmin && (
                <Link
                  to="/clubs/new"
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Club
                </Link>
              )}
              <div className="border-t border-slate-200 my-2" />
              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 rounded-lg transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  Anweshon
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                Your centralized platform for managing club events, memberships,
                and campus activities at RUET.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-900">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link
                    to="/"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-clubs"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Clubs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-events"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-900">
                Support
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Anweshon. Built for RUET students.
          </div>
        </div>
      </footer>
    </div>
  );
}
