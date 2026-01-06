import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { fileUploadApi } from "../api/fileUploadApi";

export default function CreateEventPage() {
  const { clubId } = useParams(); // /clubs/:clubId/events/new
  const navigate = useNavigate();
  const routeLocation = useLocation();

  // Check if creating a past event
  const searchParams = new URLSearchParams(routeLocation.search);
  const isPastEvent = searchParams.get("isPast") === "true";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [fee, setFee] = useState(0);
  const [bannerImage, setBannerImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setBannerImage(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let bannerUrl = "";

      // Upload banner image if selected
      if (bannerImage) {
        const uploadedUrl = await fileUploadApi.uploadSingle(bannerImage);
        bannerUrl = `http://localhost:5079${uploadedUrl}`;
      }

      await eventsApi.create({
        clubId: Number(clubId),
        title,
        description,
        eventType,
        startDateTime,
        endDateTime,
        location,
        capacity: Number(capacity),
        fee: Number(fee),
        bannerUrl,
        // Past events are determined by StartDateTime < now, not by isArchived flag
      });

      // Navigate back to past events if creating past event, otherwise club page
      if (isPastEvent) {
        navigate(`/clubs/${clubId}/past-events`);
      } else {
        navigate(`/clubs/${clubId}`);
      }
    } catch (err) {
      console.error("Create event error", err);
      if (err.response?.status === 403) {
        setError("You are not allowed to create events (ClubAdmin only).");
      } else if (err.response?.status === 401) {
        setError("Please login as ClubAdmin.");
      } else {
        setError("Failed to create event.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-slate-900">
        {isPastEvent ? "Add Past Event" : "Create Event"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white rounded-lg border border-slate-200 p-6"
      >
        <div>
          <label className="block text-sm mb-1 text-slate-900">Title</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900">
            Description
          </label>
          <textarea
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900">
            Event type
          </label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900">
            Banner Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          {bannerImage && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: {bannerImage.name} (
              {(bannerImage.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1 text-slate-900">Start</label>
            <input
              type="datetime-local"
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-900">End</label>
            <input
              type="datetime-local"
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-900">Location</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1 text-slate-900">
              Capacity
            </label>
            <input
              type="number"
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-900">Fee</label>
            <input
              type="number"
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
