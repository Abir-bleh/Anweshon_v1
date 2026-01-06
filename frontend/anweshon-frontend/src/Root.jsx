import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ClubPage from "./pages/ClubPage";
import CreateEventPage from "./pages/CreateEventPage";
import CreateClubPage from "./pages/CreateClubPage";
import MyEventsPage from "./pages/MyEventsPage";
import MyClubsPage from "./pages/MyClubsPage";
import ClubMembersPage from "./pages/ClubMembersPage";
import EditClubProfilePage from "./pages/EditClubProfilePage";
import EditExecutivesPage from "./pages/EditExecutivesPage";
import ExploreClubsPage from "./pages/ExploreClubsPage";
import ExploreEventsPage from "./pages/ExploreEventsPage";
import ClubAchievementsPage from "./pages/ClubAchievementsPage";
import ClubPhotoGalleryPage from "./pages/ClubPhotoGalleryPage";
import PastEventsPage from "./pages/PastEventsPage";
import { Toaster, toast } from "react-hot-toast";
import { startNotificationConnection } from "./signalr/notificationClient";

export default function Root() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let conn;

    async function connect() {
      conn = await startNotificationConnection(token);
      if (!conn) return;

      conn.on("ReceiveNotification", (payload) => {
        const message =
          payload?.message ||
          (payload?.type === "NewEvent"
            ? `New event: ${payload.title}`
            : "New notification");
        toast(message);
      });
    }

    connect();

    return () => {
      if (conn) {
        conn.off("ReceiveNotification");
        conn.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/explore/clubs" element={<ExploreClubsPage />} />
            <Route path="/explore/events" element={<ExploreEventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/clubs/:id" element={<ClubPage />} />
            <Route
              path="/clubs/:clubId/events/new"
              element={<CreateEventPage />}
            />
            <Route path="/clubs/new" element={<CreateClubPage />} />
            <Route path="/clubs/:id/members" element={<ClubMembersPage />} />
            <Route
              path="/clubs/:id/achievements"
              element={<ClubAchievementsPage />}
            />
            <Route
              path="/clubs/:id/gallery"
              element={<ClubPhotoGalleryPage />}
            />
            <Route path="/clubs/:id/past-events" element={<PastEventsPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/my-clubs" element={<MyClubsPage />} />
            <Route
              path="/clubs/:id/profile/edit"
              element={<EditClubProfilePage />}
            />
            <Route
              path="/clubs/:id/executives/edit"
              element={<EditExecutivesPage />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #1f2937",
            fontSize: "0.85rem",
          },
        }}
      />
    </div>
  );
}
