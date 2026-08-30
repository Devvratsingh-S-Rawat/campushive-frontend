import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

// TODO: fest details and its events are already fetched below — still needs
// the real detail layout, the "I'm Interested" button
// (POST /fests/{id}/interest), and the register button
// (POST /events/{id}/register) — see API_CONTRACT.md for exact shapes.
export default function FestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [fest, setFest] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/fests/${id}`), api.get(`/fests/${id}/events`)])
      .then(([festRes, eventsRes]) => {
        setFest(festRes.data);
        setEvents(eventsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8">Loading…</p>;
  if (!fest) return <p className="p-8">Fest not found.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="text-xs text-gray-400 mb-2">
        Placeholder page — real design still needed here
      </p>
      <h1 className="text-2xl font-bold text-brand-purple">{fest.name}</h1>
      <p className="text-gray-500 mb-4">
        {fest.college_name} · {fest.location}
      </p>
      <p className="mb-6">{fest.description}</p>

      {!user && (
        <p className="text-sm text-gray-400 mb-4">
          Sign in to mark interest or register for an event.
        </p>
      )}

      <h2 className="font-semibold mb-2">Events</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="border border-gray-200 rounded-lg p-3">
            <p className="font-medium">{event.name}</p>
            <p className="text-sm text-gray-500">
              {event.entry_fee > 0 ? `₹${event.entry_fee}` : "Free"} ·{" "}
              {event.registered_count} registered
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
