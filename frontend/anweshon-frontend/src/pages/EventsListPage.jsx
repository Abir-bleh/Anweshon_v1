import { useEffect, useState } from "react";
import { eventsApi } from "../api/eventsApi";
import { Link } from "react-router-dom";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi
      .getUpcoming()
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">Loading events...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-4">
        Upcoming events
      </h1>
      <div className="space-y-3">
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/events/${e.id}`}
            className="block rounded border border-slate-700 p-4 hover:border-sky-500"
          >
            <div className="text-sm text-slate-700">{e.clubName}</div>
            <div className="font-semibold text-white">{e.title}</div>
            <div className="text-xs text-slate-700">
              {new Date(e.startDateTime).toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400">{e.status}</div>
          </Link>
        ))}
        {events.length === 0 && (
          <div className="text-sm text-slate-700">No upcoming events.</div>
        )}
      </div>
    </div>
  );
}
